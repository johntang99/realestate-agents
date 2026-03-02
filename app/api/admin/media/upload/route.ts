import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { upsertMediaDb } from '@/lib/admin/mediaDb';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';
import { getSupabaseServerClient } from '@/lib/supabase/server';

function sanitizeFolder(value: string) {
  const cleaned = value.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '');
  if (!cleaned) return '';
  const normalized = path.posix.normalize(cleaned);
  if (normalized.startsWith('..') || normalized.includes('../')) {
    return '';
  }
  return normalized;
}

function sanitizeFilename(value: string) {
  const lower = value.toLowerCase();
  const cleaned = lower.replace(/[^a-z0-9.-]/g, '-').replace(/-+/g, '-');
  return cleaned || `upload-${Date.now()}`;
}

function getStorageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    ''
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const siteId = formData.get('siteId');
    const folderInput = formData.get('folder');
    const file = formData.get('file');

    if (typeof siteId !== 'string' || !siteId) {
      return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
    }
    try {
      requireSiteAccess(session.user, siteId);
    } catch {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (!canManageMedia(session.user)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'file is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image uploads are supported' },
        { status: 400 }
      );
    }

    const folder =
      typeof folderInput === 'string' ? sanitizeFolder(folderInput) : 'general';
    const safeName = sanitizeFilename(file.name);
    const filename = `${Date.now()}-${safeName}`;
    const relativePath = folder ? `${folder}/${filename}` : filename;
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageBucket = getStorageBucket();

    if (storageBucket) {
      const supabase = getSupabaseServerClient();
      if (!supabase) {
        return NextResponse.json(
          { message: 'Supabase server client is not configured' },
          { status: 500 }
        );
      }

      const objectPath = `${siteId}/${relativePath}`;
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(objectPath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true,
        });
      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
      }

      const { data } = supabase.storage.from(storageBucket).getPublicUrl(objectPath);
      const url = data.publicUrl;
      await upsertMediaDb({ siteId, path: relativePath, url });

      return NextResponse.json({ url, path: relativePath, filename });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          message:
            'Upload requires SUPABASE_STORAGE_BUCKET in production. Vercel filesystem is read-only.',
        },
        { status: 501 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', siteId, folder);
    await fs.mkdir(uploadDir, { recursive: true });
    const targetPath = path.join(uploadDir, filename);
    await fs.writeFile(targetPath, buffer);

    const url = `/uploads/${siteId}/${relativePath}`;
    await upsertMediaDb({ siteId, path: relativePath, url });
    return NextResponse.json({ url, path: relativePath, filename });
  } catch (error) {
    console.error('Admin media upload error:', error);
    return NextResponse.json(
      { message: 'Upload failed due to a server error.' },
      { status: 500 }
    );
  }
}

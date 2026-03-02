import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';
import { upsertMediaDb } from '@/lib/admin/mediaDb';
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
  return cleaned || `import-${Date.now()}`;
}

function getStorageBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    ''
  );
}

function extFromContentType(contentType: string) {
  const normalized = contentType.toLowerCase();
  if (normalized.includes('jpeg')) return '.jpg';
  if (normalized.includes('png')) return '.png';
  if (normalized.includes('webp')) return '.webp';
  if (normalized.includes('gif')) return '.gif';
  if (normalized.includes('svg')) return '.svg';
  if (normalized.includes('avif')) return '.avif';
  return '';
}

function isAllowedSource(provider: string, host: string) {
  const normalizedHost = host.toLowerCase();
  if (provider === 'unsplash') {
    return normalizedHost.endsWith('images.unsplash.com');
  }
  if (provider === 'pexels') {
    return normalizedHost.endsWith('images.pexels.com');
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const payload = await request.json();
    const siteId = String(payload?.siteId || '');
    const provider = String(payload?.provider || '').toLowerCase();
    const sourceUrl = String(payload?.sourceUrl || '');
    const folderInput = String(payload?.folder || 'general');

    if (!siteId || !sourceUrl || !provider) {
      return NextResponse.json(
        { message: 'siteId, provider, and sourceUrl are required' },
        { status: 400 }
      );
    }
    if (!['unsplash', 'pexels'].includes(provider)) {
      return NextResponse.json({ message: 'Invalid provider' }, { status: 400 });
    }

    try {
      requireSiteAccess(session.user, siteId);
    } catch {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (!canManageMedia(session.user)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const parsedUrl = new URL(sourceUrl);
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ message: 'Only https URLs are allowed' }, { status: 400 });
    }
    if (!isAllowedSource(provider, parsedUrl.hostname)) {
      return NextResponse.json(
        { message: 'Source URL host is not allowed for this provider' },
        { status: 400 }
      );
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch source image (${response.status})` },
        { status: 502 }
      );
    }
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Source file is not an image' },
        { status: 400 }
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folder = sanitizeFolder(folderInput) || 'general';
    const sourcePathname = parsedUrl.pathname.split('/').pop() || '';
    const sourceExt = path.extname(sourcePathname).toLowerCase();
    const ext = sourceExt || extFromContentType(contentType) || '.jpg';
    const sourceBase = sourcePathname
      ? path.basename(sourcePathname, sourceExt || undefined)
      : `${provider}-image`;
    const filename = `${Date.now()}-${sanitizeFilename(sourceBase)}${ext}`;
    const relativePath = `${folder}/${filename}`;

    const storageBucket = getStorageBucket();
    if (!storageBucket) {
      return NextResponse.json(
        { message: 'SUPABASE_STORAGE_BUCKET is not configured' },
        { status: 500 }
      );
    }
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
        contentType,
        cacheControl: '3600',
        upsert: false,
      });
    if (uploadError) {
      console.error('Provider import upload error:', uploadError);
      return NextResponse.json({ message: 'Import upload failed' }, { status: 500 });
    }

    const { data } = supabase.storage.from(storageBucket).getPublicUrl(objectPath);
    const url = data.publicUrl;
    await upsertMediaDb({ siteId, path: relativePath, url });

    return NextResponse.json({
      url,
      path: relativePath,
      filename,
      provider,
    });
  } catch (error) {
    console.error('Provider import error:', error);
    return NextResponse.json(
      { message: 'Provider import failed due to a server error.' },
      { status: 500 }
    );
  }
}

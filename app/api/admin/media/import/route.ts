import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';
import { listMedia } from '@/lib/admin/media';
import { listContentEntriesForSite } from '@/lib/contentDb';
import { upsertMediaDb } from '@/lib/admin/mediaDb';
import { createHash } from 'crypto';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

function isLikelyImageUrl(value: string): boolean {
  const lower = value.toLowerCase();
  if (lower.startsWith('/uploads/')) return true;
  if (lower.includes('images.unsplash.com') || lower.includes('images.pexels.com')) return true;
  if (
    lower.includes('/storage/v1/object/public/') &&
    IMAGE_EXTENSIONS.some((ext) => lower.includes(ext))
  ) {
    return true;
  }
  return IMAGE_EXTENSIONS.some((ext) => lower.includes(ext));
}

function toMediaPathFromUrl(siteId: string, raw: string): string {
  const value = raw.trim();

  if (value.startsWith(`/uploads/${siteId}/`)) {
    return value.replace(`/uploads/${siteId}/`, '');
  }
  if (value.startsWith('/uploads/')) {
    return value.replace('/uploads/', '');
  }

  try {
    const url = new URL(value);
    const marker = `/${siteId}/`;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex >= 0) {
      return url.pathname.slice(markerIndex + marker.length);
    }

    const extMatch = IMAGE_EXTENSIONS.find((ext) => url.pathname.toLowerCase().includes(ext));
    const ext = extMatch || '.jpg';
    const hash = createHash('sha1').update(value).digest('hex').slice(0, 16);
    return `external/${url.hostname}/${hash}${ext}`;
  } catch {
    const hash = createHash('sha1').update(value).digest('hex').slice(0, 16);
    return `external/unknown/${hash}.jpg`;
  }
}

function collectImageUrls(node: unknown, out: Set<string>) {
  if (typeof node === 'string') {
    const value = node.trim();
    if (
      (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/uploads/')) &&
      isLikelyImageUrl(value)
    ) {
      out.add(value);
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item) => collectImageUrls(item, out));
    return;
  }
  if (node && typeof node === 'object') {
    Object.values(node as Record<string, unknown>).forEach((item) => collectImageUrls(item, out));
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = String(payload?.siteId || '');
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
    if (!canManageMedia(session.user)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const entries = await listContentEntriesForSite(siteId);
  const urls = new Set<string>();
  entries.forEach((entry) => {
    const payload = entry.content ?? entry.data;
    collectImageUrls(payload, urls);
  });

  await Promise.all(
    Array.from(urls).map(async (url) => {
      const mediaPath = toMediaPathFromUrl(siteId, url);
      await upsertMediaDb({
        siteId,
        path: mediaPath,
        url,
      });
    })
  );

  const items = await listMedia(siteId);
  return NextResponse.json({
    success: true,
    discovered: urls.size,
    imported: items.length,
    message: `Synced ${urls.size} image reference(s) from content and storage.`,
  });
}

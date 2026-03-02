import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import { resolveContentPath } from '@/lib/admin/content';
import { canUseContentDb, fetchContentEntry } from '@/lib/contentDb';
import { getRequestSiteId } from '@/lib/content';
import { defaultLocale } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteIdParam = searchParams.get('siteId');
  const locale = searchParams.get('locale');
  const filePath = searchParams.get('path');

  if (!locale || !filePath) {
    return NextResponse.json(
      { message: 'locale and path are required' },
      { status: 400 }
    );
  }

  const siteId = siteIdParam || (await getRequestSiteId());
  const resolved = resolveContentPath(siteId, locale, filePath);
  if (!resolved) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  try {
    if (canUseContentDb()) {
      let entry = await fetchContentEntry(siteId, locale, filePath);
      if (!entry && locale !== defaultLocale) {
        entry = await fetchContentEntry(siteId, defaultLocale, filePath);
      }
      const entryContent = entry?.content ?? entry?.data;
      if (entryContent) {
        return NextResponse.json({ content: JSON.stringify(entryContent, null, 2) });
      }
    }

    let content: string | null = null;
    try {
      content = await fs.readFile(resolved, 'utf-8');
    } catch {
      if (locale !== defaultLocale) {
        const fallbackResolved = resolveContentPath(siteId, defaultLocale, filePath);
        if (fallbackResolved) {
          content = await fs.readFile(fallbackResolved, 'utf-8');
        }
      }
    }
    if (content == null) {
      throw new Error('not-found');
    }
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }
}

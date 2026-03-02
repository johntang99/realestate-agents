import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { resolveContentPath } from '@/lib/admin/content';
import { CONTENT_TEMPLATES } from '@/lib/admin/templates';
import {
  canUseContentDb,
  deleteContentEntry,
  fetchContentEntry,
  insertContentRevision,
  upsertContentEntry,
} from '@/lib/contentDb';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { defaultLocale, locales } from '@/lib/i18n';
import { normalizeMediaUrlsInData } from '@/lib/media-url';

const ALLOWED_TARGET_DIRS = [
  'pages',
  'blog',
  'portfolio',
  'shop-products',
  'journal',
  'collections',
  'testimonials',
  'properties',
  'neighborhoods',
  'market-reports',
  'agents',
  'knowledge-center',
  'new-construction',
  'events',
  'guides',
  'case-studies',
  'resources',
] as const;

type TargetDir = (typeof ALLOWED_TARGET_DIRS)[number];

const DEDICATED_TABLE_BY_DIR: Record<string, string | null> = {
  agents: 'agents',
  'new-construction': 'new_construction',
  events: 'events',
  'case-studies': null,
  resources: null,
};

function getDedicatedTableForPath(filePath: string) {
  const dir = filePath.includes('/') ? filePath.split('/')[0] : '';
  if (!dir) return null;
  return DEDICATED_TABLE_BY_DIR[dir] || null;
}

function getSlugFromFilePath(filePath: string) {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.json$/i, '').trim().toLowerCase();
}

function getEventDateFromPayload(data: any): string | null {
  const candidates = [data?.eventDate, data?.startDate, data?.date];
  for (const value of candidates) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
  }
  return null;
}

async function upsertDedicatedCollectionRow(siteId: string, filePath: string, data: any) {
  const table = getDedicatedTableForPath(filePath);
  if (!table) return;
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const payload: Record<string, unknown> = {
    site_id: siteId,
    slug: typeof data?.slug === 'string' && data.slug.trim()
      ? data.slug.trim().toLowerCase()
      : getSlugFromFilePath(filePath),
    data,
    updated_at: new Date().toISOString(),
  };
  if (table === 'events') {
    payload.event_date = getEventDateFromPayload(data);
  }

  const { error } = await supabase.from(table).upsert(payload, { onConflict: 'site_id,slug' });
  if (error) {
    console.error(`Dedicated table upsert failed for ${table}:`, error);
  }
}

async function deleteDedicatedCollectionRow(siteId: string, filePath: string) {
  const table = getDedicatedTableForPath(filePath);
  if (!table) return;
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const slug = getSlugFromFilePath(filePath);
  const { error } = await supabase.from(table).delete().eq('site_id', siteId).eq('slug', slug);
  if (error) {
    console.error(`Dedicated table delete failed for ${table}:`, error);
  }
}

function syncSlugWithPath(filePath: string, data: any): any {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const [dir, fileName] = filePath.split('/');
  if (!dir || !fileName) return data;
  if (!['blog', 'portfolio', 'shop-products', 'journal', 'collections', 'properties', 'neighborhoods', 'market-reports', 'agents', 'knowledge-center', 'new-construction', 'events', 'guides', 'case-studies', 'resources'].includes(dir)) {
    return data;
  }
  const slug = fileName.replace(/\.json$/i, '').trim().toLowerCase();
  return { ...data, slug };
}

function isEmptyHeaderPayload(filePath: string, data: any): boolean {
  if (filePath !== 'header.json' || !data || typeof data !== 'object') return false;
  const topbar = data.topbar || {};
  const menu = data.menu || {};
  const logo = menu.logo || {};
  const cta = data.cta || {};
  const items = Array.isArray(menu.items) ? menu.items : [];

  const isBlank = (value: unknown) => typeof value !== 'string' || value.trim() === '';
  return (
    isBlank(topbar.phone) &&
    isBlank(topbar.address) &&
    isBlank(topbar.badge) &&
    isBlank(logo.text) &&
    items.length === 0 &&
    isBlank(cta.text) &&
    isBlank(cta.link)
  );
}

function parseBooleanEnv(value: string | undefined): boolean | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function shouldWriteThroughFile(): boolean {
  const override = parseBooleanEnv(process.env.CONTENT_WRITE_THROUGH_FILE);
  if (override !== null) {
    return override;
  }
  return process.env.NODE_ENV !== 'production';
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const locale = searchParams.get('locale');
  const filePath = searchParams.get('path');

  if (!siteId || !locale || !filePath) {
    return NextResponse.json(
      { message: 'siteId, locale, and path are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

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
      if (entryContent && !isEmptyHeaderPayload(filePath, entryContent)) {
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
      throw new Error('file-not-found');
    }
    if (canUseContentDb()) {
      try {
        const parsed = JSON.parse(content);
        await upsertContentEntry({
          siteId,
          locale,
          path: filePath,
          data: parsed,
          updatedBy: session.user.email,
        });
      } catch (error) {
        // ignore invalid JSON during fallback
      }
    }

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = payload.siteId as string | undefined;
  const locale = payload.locale as string | undefined;
  const filePath = payload.path as string | undefined;
  const content = payload.content as string | undefined;

  if (!siteId || !locale || !filePath || typeof content !== 'string') {
    return NextResponse.json(
      { message: 'siteId, locale, path, and content are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const resolved = resolveContentPath(siteId, locale, filePath);
  if (!resolved) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }
  const slugSyncedParsed = syncSlugWithPath(filePath, parsed);
  const normalizedParsed = normalizeMediaUrlsInData(slugSyncedParsed, siteId);
  const normalizedContent = JSON.stringify(normalizedParsed, null, 2);

  if (canUseContentDb()) {
    const existing = await fetchContentEntry(siteId, locale, filePath);
    const existingContent = existing?.content ?? existing?.data;
    if (existing && existingContent) {
      await insertContentRevision({
        entryId: existing.id,
        data: existingContent,
        createdBy: session.user.email,
        note: 'Admin update',
      });
    }
    if (filePath === 'theme.json') {
      await Promise.all(
        locales.map((entryLocale) =>
          upsertContentEntry({
            siteId,
            locale: entryLocale,
            path: filePath,
            data: normalizedParsed,
            updatedBy: session.user.email,
          })
        )
      );
    } else {
      await upsertContentEntry({
        siteId,
        locale,
        path: filePath,
        data: normalizedParsed,
        updatedBy: session.user.email,
      });
    }
    await upsertDedicatedCollectionRow(siteId, filePath, normalizedParsed);

    if (!shouldWriteThroughFile()) {
      return NextResponse.json({
        success: true,
        fileSync: 'skipped',
        message: 'Saved to DB (JSON sync disabled in production).',
      });
    }

    try {
      await fs.mkdir(path.dirname(resolved), { recursive: true });
      await fs.writeFile(resolved, normalizedContent);
      return NextResponse.json({
        success: true,
        fileSync: 'synced',
        message: 'Saved to DB + JSON.',
      });
    } catch (error: any) {
      return NextResponse.json({
        success: true,
        fileSync: 'failed',
        message: `Saved to DB (JSON sync failed: ${error?.message || 'unknown error'}).`,
      });
    }
  }

  await fs.mkdir(path.dirname(resolved), { recursive: true });
  try {
    const existing = await fs.readFile(resolved, 'utf-8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const historyPath = path.join(
      process.cwd(),
      'content',
      '_history',
      siteId,
      locale,
      `${filePath}.${timestamp}.json`
    );
    await fs.mkdir(path.dirname(historyPath), { recursive: true });
    await fs.writeFile(historyPath, existing);
  } catch (error) {
    // ignore missing existing file
  }

  await fs.writeFile(resolved, normalizedContent);
  return NextResponse.json({ success: true, fileSync: 'synced', message: 'Saved to JSON.' });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = payload.siteId as string | undefined;
  const locale = payload.locale as string | undefined;
  const action = payload.action as string | undefined;

  if (!siteId || !locale || !action) {
    return NextResponse.json(
      { message: 'siteId, locale, and action are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (action === 'create') {
    const slug = payload.slug as string | undefined;
    const templateId = (payload.templateId as string | undefined) || 'basic';
    const targetDir = ((payload.targetDir as string | undefined) || 'pages') as TargetDir;
    if (!slug) {
      return NextResponse.json({ message: 'slug is required' }, { status: 400 });
    }
    if (!ALLOWED_TARGET_DIRS.includes(targetDir)) {
      return NextResponse.json({ message: 'Invalid target directory' }, { status: 400 });
    }
    const normalized = slug.trim().toLowerCase();
    const filePath = `${targetDir}/${normalized}.json`;
    const resolved = resolveContentPath(siteId, locale, filePath);
    if (!resolved) {
      return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
    }
    try {
      await fs.access(resolved);
      return NextResponse.json({ message: 'File already exists' }, { status: 409 });
    } catch (error) {
      // ok
    }
    const template =
      CONTENT_TEMPLATES.find((item) => item.id === templateId) ||
      CONTENT_TEMPLATES[0];
    const initialContent = payload.initialContent && typeof payload.initialContent === 'object'
      ? payload.initialContent
      : null;
    const contentToCreate = syncSlugWithPath(filePath, initialContent || template.content);
    if (canUseContentDb()) {
      const existing = await fetchContentEntry(siteId, locale, filePath);
      if (existing) {
        return NextResponse.json({ message: 'File already exists' }, { status: 409 });
      }
      await upsertContentEntry({
        siteId,
        locale,
        path: filePath,
        data: contentToCreate,
        updatedBy: session.user.email,
      });
      await upsertDedicatedCollectionRow(siteId, filePath, contentToCreate);
      if (shouldWriteThroughFile()) {
        try {
          await fs.mkdir(path.dirname(resolved), { recursive: true });
          await fs.writeFile(resolved, JSON.stringify(contentToCreate, null, 2));
        } catch (error) {
          // DB write already succeeded; JSON sync can fail independently.
        }
      }
      return NextResponse.json({ path: filePath, fileSync: shouldWriteThroughFile() ? 'attempted' : 'skipped' });
    }

    await fs.mkdir(path.dirname(resolved), { recursive: true });
    await fs.writeFile(resolved, JSON.stringify(contentToCreate, null, 2));
    return NextResponse.json({ path: filePath });
  }

  if (action === 'duplicate') {
    const sourcePath = payload.path as string | undefined;
    const slug = payload.slug as string | undefined;
    const targetDir = payload.targetDir as TargetDir | undefined;
    if (!sourcePath || !slug) {
      return NextResponse.json(
        { message: 'path and slug are required' },
        { status: 400 }
      );
    }
    const normalized = slug.trim().toLowerCase();
    const sourceDir = sourcePath.includes('/') ? sourcePath.split('/')[0] : '';
    if (!sourceDir || !ALLOWED_TARGET_DIRS.includes(sourceDir as TargetDir)) {
      return NextResponse.json(
        { message: 'Only page/blog/collection files can be duplicated' },
        { status: 400 }
      );
    }
    const resolvedSourceDir = sourceDir as TargetDir;
    const resolvedTargetDir = targetDir && ALLOWED_TARGET_DIRS.includes(targetDir)
      ? targetDir
      : resolvedSourceDir;
    if (resolvedSourceDir === 'blog' && resolvedTargetDir !== 'blog') {
      return NextResponse.json(
        { message: 'Blog posts must be duplicated into blog/' },
        { status: 400 }
      );
    }
    if (resolvedSourceDir !== 'blog' && resolvedTargetDir !== resolvedSourceDir) {
      return NextResponse.json(
        { message: 'Collection/page files must be duplicated within the same directory' },
        { status: 400 }
      );
    }
    const targetPath = `${resolvedTargetDir}/${normalized}.json`;
    const sourceResolved = resolveContentPath(siteId, locale, sourcePath);
    const targetResolved = resolveContentPath(siteId, locale, targetPath);
    if (!sourceResolved || !targetResolved) {
      return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
    }
    let content = '';
    if (canUseContentDb()) {
      const sourceEntry = await fetchContentEntry(siteId, locale, sourcePath);
      const sourceContent = sourceEntry?.content ?? sourceEntry?.data;
      if (sourceContent) {
        content = JSON.stringify(sourceContent, null, 2);
      }
    }
    if (!content) {
      content = await fs.readFile(sourceResolved, 'utf-8');
    }

    let nextContent = content;
    const shouldSyncSlug = [
      'blog',
      'portfolio',
      'shop-products',
      'journal',
      'collections',
      'properties',
      'neighborhoods',
      'market-reports',
      'agents',
      'knowledge-center',
      'new-construction',
      'events',
      'guides',
      'case-studies',
      'resources',
    ].includes(resolvedSourceDir);
    if (shouldSyncSlug) {
      try {
        const parsed = JSON.parse(content);
        parsed.slug = normalized;
        nextContent = JSON.stringify(parsed, null, 2);
      } catch (error) {
        // fallback to raw content if JSON is invalid
      }
    }
    if (canUseContentDb()) {
      const existingTarget = await fetchContentEntry(siteId, locale, targetPath);
      if (existingTarget) {
        return NextResponse.json({ message: 'Target file already exists' }, { status: 409 });
      }
      const parsed = JSON.parse(nextContent);
      await upsertContentEntry({
        siteId,
        locale,
        path: targetPath,
        data: parsed,
        updatedBy: session.user.email,
      });
      await upsertDedicatedCollectionRow(siteId, targetPath, parsed);
      if (shouldWriteThroughFile()) {
        try {
          await fs.mkdir(path.dirname(targetResolved), { recursive: true });
          await fs.writeFile(targetResolved, nextContent);
        } catch (error) {
          // DB write already succeeded; JSON sync can fail independently.
        }
      }
      return NextResponse.json({ path: targetPath, fileSync: shouldWriteThroughFile() ? 'attempted' : 'skipped' });
    }

    await fs.mkdir(path.dirname(targetResolved), { recursive: true });
    await fs.writeFile(targetResolved, nextContent);
    return NextResponse.json({ path: targetPath });
  }

  return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const locale = searchParams.get('locale');
  const filePath = searchParams.get('path');

  if (!siteId || !locale || !filePath) {
    return NextResponse.json(
      { message: 'siteId, locale, and path are required' },
      { status: 400 }
    );
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (['theme.json', 'site.json', 'navigation.json'].includes(filePath)) {
    return NextResponse.json(
      { message: 'Protected file cannot be deleted' },
      { status: 400 }
    );
  }

  const resolved = resolveContentPath(siteId, locale, filePath);
  if (!resolved) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  if (canUseContentDb()) {
    await deleteContentEntry({ siteId, locale, path: filePath });
    await deleteDedicatedCollectionRow(siteId, filePath);
    try {
      await fs.unlink(resolved);
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
    return NextResponse.json({ success: true });
  }

  await fs.unlink(resolved);
  return NextResponse.json({ success: true });
}

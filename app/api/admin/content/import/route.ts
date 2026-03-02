import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canUseContentDb, fetchContentEntry, upsertContentEntry } from '@/lib/contentDb';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { locales } from '@/lib/i18n';
import { writeAuditLog } from '@/lib/admin/audit';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readJson(filePath: string) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

interface ImportCandidate {
  locale: string;
  path: string;
  data: unknown;
  sourceFilePath: string;
  sourceMtimeMs: number;
}

const DEDICATED_TABLE_BY_DIR: Record<string, string> = {
  agents: 'agents',
  'new-construction': 'new_construction',
  events: 'events',
};

function getDedicatedTableForPath(contentPath: string): string | null {
  const dir = contentPath.includes('/') ? contentPath.split('/')[0] : '';
  if (!dir) return null;
  return DEDICATED_TABLE_BY_DIR[dir] || null;
}

function getSlugFromPath(contentPath: string): string {
  const fileName = contentPath.split('/').pop() || '';
  return fileName.replace(/\.json$/i, '').trim().toLowerCase();
}

function getEventDateFromCandidate(data: any): string | null {
  const candidates = [data?.eventDate, data?.startDate, data?.date];
  for (const value of candidates) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
  }
  return null;
}

async function fetchDedicatedRow(siteId: string, table: string, slug: string): Promise<any | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(table)
    .select('id,data,updated_at')
    .eq('site_id', siteId)
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error(`fetchDedicatedRow error for ${table}:`, error);
    return null;
  }
  return data || null;
}

async function upsertDedicatedRow(siteId: string, table: string, slug: string, data: any): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;
  const payload: Record<string, unknown> = {
    site_id: siteId,
    slug,
    data,
    updated_at: new Date().toISOString(),
  };
  if (table === 'events') {
    payload.event_date = getEventDateFromCandidate(data);
  }
  const { error } = await supabase.from(table).upsert(payload, { onConflict: 'site_id,slug' });
  if (error) {
    console.error(`upsertDedicatedRow error for ${table}:`, error);
    return false;
  }
  return true;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

async function collectImportCandidates(siteId: string, locale: string): Promise<ImportCandidate[]> {
  const candidates: ImportCandidate[] = [];
  const localeRoot = path.join(CONTENT_DIR, siteId, locale);

  const addCandidate = async (targetLocale: string, contentPath: string, filePath: string) => {
    const [data, stat] = await Promise.all([readJson(filePath), fs.stat(filePath)]);
    candidates.push({
      locale: targetLocale,
      path: contentPath,
      data,
      sourceFilePath: filePath,
      sourceMtimeMs: stat.mtimeMs,
    });
  };

  // Root locale JSON files
  try {
    const rootFiles = await fs.readdir(localeRoot);
    for (const file of rootFiles.filter((item) => item.endsWith('.json'))) {
      await addCandidate(locale, file, path.join(localeRoot, file));
    }
  } catch {
    // ignore missing locale root
  }

  // Pages
  const pagesDir = path.join(localeRoot, 'pages');
  try {
    const pageFiles = await fs.readdir(pagesDir);
    for (const file of pageFiles.filter((item) => item.endsWith('.json'))) {
      await addCandidate(locale, `pages/${file}`, path.join(pagesDir, file));
    }
  } catch {
    // ignore missing pages dir
  }

  // Collection directories
  const collectionDirs = [
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
  ];
  for (const dir of collectionDirs) {
    const fullDir = path.join(localeRoot, dir);
    try {
      const files = await fs.readdir(fullDir);
      for (const file of files.filter((item) => item.endsWith('.json'))) {
        await addCandidate(locale, `${dir}/${file}`, path.join(fullDir, file));
      }
    } catch {
      // ignore missing collection dir
    }
  }

  // Theme (site scope) - mirrored to all locales
  const themePath = path.join(CONTENT_DIR, siteId, 'theme.json');
  try {
    const [themeData, themeStat] = await Promise.all([readJson(themePath), fs.stat(themePath)]);
    for (const entryLocale of locales) {
      candidates.push({
        locale: entryLocale,
        path: 'theme.json',
        data: themeData,
        sourceFilePath: themePath,
        sourceMtimeMs: themeStat.mtimeMs,
      });
    }
  } catch {
    // ignore missing theme
  }

  return candidates;
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canUseContentDb()) {
    return NextResponse.json(
      { message: 'DB mode is not enabled (missing SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 400 }
    );
  }

  const payload = await request.json();
  const siteId = payload.siteId as string | undefined;
  const locale = payload.locale as string | undefined;
  const mode = payload.mode === 'overwrite' ? 'overwrite' : 'missing';
  const dryRun = Boolean(payload.dryRun);
  const force = Boolean(payload.force);

  if (!siteId || !locale) {
    return NextResponse.json(
      { message: 'siteId and locale are required' },
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

  const candidates = await collectImportCandidates(siteId, locale);
  const conflicts: Array<{
    locale: string;
    path: string;
    dbUpdatedAt: string;
    localFile: string;
    localMtime: string;
  }> = [];

  let toCreate = 0;
  let toUpdate = 0;
  let unchanged = 0;
  let skipped = 0;
  let wouldImport = 0;
  const toCreatePaths: string[] = [];
  const toUpdatePaths: string[] = [];

  const existingByKey = new Map<string, Awaited<ReturnType<typeof fetchContentEntry>>>();
  const dedicatedByKey = new Map<string, any | null>();
  const analysisBatchSize = 30;
  for (let i = 0; i < candidates.length; i += analysisBatchSize) {
    const batch = candidates.slice(i, i + analysisBatchSize);
    const batchExisting = await Promise.all(
      batch.map((candidate) => fetchContentEntry(siteId, candidate.locale, candidate.path))
    );
    batch.forEach((candidate, index) => {
      const key = `${candidate.locale}::${candidate.path}`;
      existingByKey.set(key, batchExisting[index]);
    });

    const batchDedicated = await Promise.all(
      batch.map(async (candidate) => {
        const table = getDedicatedTableForPath(candidate.path);
        if (!table) return null;
        const slug = getSlugFromPath(candidate.path);
        return fetchDedicatedRow(siteId, table, slug);
      })
    );
    batch.forEach((candidate, index) => {
      const key = `${candidate.locale}::${candidate.path}`;
      dedicatedByKey.set(key, batchDedicated[index]);
    });
  }

  for (const candidate of candidates) {
    const key = `${candidate.locale}::${candidate.path}`;
    const existing = existingByKey.get(key);
    const dedicated = dedicatedByKey.get(key);
    const dedicatedTable = getDedicatedTableForPath(candidate.path);
    const dedicatedNeedsSync = Boolean(
      dedicatedTable &&
      (!dedicated?.data || !deepEqual(dedicated.data, candidate.data))
    );

    const existingData = existing?.content ?? existing?.data;
    if (!existingData) {
      toCreate += 1;
      wouldImport += 1;
      toCreatePaths.push(`${candidate.locale}:${candidate.path}`);
      continue;
    }

    if (deepEqual(existingData, candidate.data)) {
      if (dedicatedNeedsSync) {
        toUpdate += 1;
        wouldImport += 1;
        toUpdatePaths.push(`${candidate.locale}:${candidate.path}`);
        continue;
      }
      unchanged += 1;
      if (mode === 'missing') {
        skipped += 1;
      }
      continue;
    }

    const dbUpdatedAtMs = existing?.updated_at ? new Date(existing.updated_at).getTime() : 0;
    if (
      mode === 'overwrite' &&
      Number.isFinite(dbUpdatedAtMs) &&
      dbUpdatedAtMs > candidate.sourceMtimeMs
    ) {
      conflicts.push({
        locale: candidate.locale,
        path: candidate.path,
        dbUpdatedAt: existing?.updated_at ?? '',
        localFile: candidate.sourceFilePath,
        localMtime: new Date(candidate.sourceMtimeMs).toISOString(),
      });
      continue;
    }

    toUpdate += 1;
    wouldImport += 1;
    toUpdatePaths.push(`${candidate.locale}:${candidate.path}`);
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      mode,
      totalCandidates: candidates.length,
      toCreate,
      toUpdate,
      unchanged,
      skipped,
      wouldImport,
      toCreatePaths,
      toUpdatePaths,
      conflicts,
      message:
        mode === 'overwrite'
          ? `Dry-run: ${toCreate} create, ${toUpdate} update, ${unchanged} unchanged, ${conflicts.length} conflicts.`
          : `Dry-run: ${toCreate} create, ${unchanged} existing.`,
    });
  }

  if (mode === 'overwrite' && conflicts.length > 0 && !force) {
    await writeAuditLog({
      actor: session.user,
      action: 'content_import_overwrite_blocked',
      siteId,
      metadata: {
        locale,
        conflicts: conflicts.length,
      },
    });
    return NextResponse.json(
      {
        message:
          `Abort overwrite: ${conflicts.length} DB entries are newer than local files. ` +
          `Run dry-run and review conflicts, or pass force=true to proceed.`,
        conflicts,
      },
      { status: 409 }
    );
  }

  let imported = 0;
  let failed = 0;
  const importQueue: typeof candidates = [];
  for (const candidate of candidates) {
    const key = `${candidate.locale}::${candidate.path}`;
    const existing = existingByKey.get(key);
    const dedicated = dedicatedByKey.get(key);
    const dedicatedTable = getDedicatedTableForPath(candidate.path);
    const dedicatedNeedsSync = Boolean(
      dedicatedTable &&
      (!dedicated?.data || !deepEqual(dedicated.data, candidate.data))
    );

    const existingDataWrite = existing?.content ?? existing?.data;
    if (mode === 'missing' && existingDataWrite) {
      if (dedicatedNeedsSync) {
        importQueue.push(candidate);
        continue;
      }
      skipped += 1;
      continue;
    }

    if (
      mode === 'overwrite' &&
      existingDataWrite &&
      deepEqual(existingDataWrite, candidate.data) &&
      !dedicatedNeedsSync
    ) {
      continue;
    }

    const dbUpdatedAtMs = existing?.updated_at ? new Date(existing.updated_at).getTime() : 0;
    if (
      mode === 'overwrite' &&
      !force &&
      existingDataWrite &&
      Number.isFinite(dbUpdatedAtMs) &&
      dbUpdatedAtMs > candidate.sourceMtimeMs
    ) {
      continue;
    }
    importQueue.push(candidate);
  }

  const writeBatchSize = 30;
  for (let i = 0; i < importQueue.length; i += writeBatchSize) {
    const batch = importQueue.slice(i, i + writeBatchSize);
    const results = await Promise.all(
      batch.map(async (candidate) => {
        const contentResult = await upsertContentEntry({
          siteId,
          locale: candidate.locale,
          path: candidate.path,
          data: candidate.data,
          updatedBy: session.user.email,
        });

        const table = getDedicatedTableForPath(candidate.path);
        if (!table) return Boolean(contentResult);
        const slug = getSlugFromPath(candidate.path);
        const dedicatedResult = await upsertDedicatedRow(siteId, table, slug, candidate.data);
        return Boolean(contentResult) && dedicatedResult;
      })
    );
    imported += results.filter(Boolean).length;
    failed += results.filter((entry) => !entry).length;
  }

  await writeAuditLog({
    actor: session.user,
    action: 'content_import_completed',
    siteId,
    metadata: {
      locale,
      mode,
      imported,
      failed,
      skipped,
      conflicts: mode === 'overwrite' ? conflicts.length : 0,
      durationMs: Date.now() - startedAt,
    },
  });

  return NextResponse.json({
    success: true,
    dryRun: false,
    imported,
    failed,
    skipped,
    conflicts: mode === 'overwrite' ? conflicts.length : 0,
    message:
      mode === 'overwrite'
        ? `Imported ${imported} items from JSON (overwrite mode).${failed ? ` ${failed} failed writes.` : ''}`
        : skipped
          ? `Imported ${imported} items. Skipped ${skipped} existing DB entries.${failed ? ` ${failed} failed writes.` : ''}`
          : `Imported ${imported} items from JSON.${failed ? ` ${failed} failed writes.` : ''}`,
  });
}

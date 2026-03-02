import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { listContentEntries, upsertContentEntry } from '@/lib/contentDb';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import { getSupabaseServerClient } from '@/lib/supabase/server';

async function collectJsonPathsRecursive(
  rootDir: string,
  currentDir = rootDir
): Promise<string[]> {
  let entries: Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }>;
  try {
    entries = (await fs.readdir(currentDir, {
      withFileTypes: true,
    })) as Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }>;
  } catch {
    return [];
  }

  const paths: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectJsonPathsRecursive(rootDir, fullPath);
      paths.push(...nested);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const relativePath = path.relative(rootDir, fullPath).split(path.sep).join('/');
      paths.push(relativePath);
    }
  }
  return paths;
}

async function listDedicatedRows(siteId: string, table: string): Promise<Array<{ slug: string; data: any }>> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(table)
    .select('slug,data')
    .eq('site_id', siteId)
    .order('slug', { ascending: true });
  if (error) {
    console.error(`listDedicatedRows error for ${table}:`, error);
    return [];
  }
  return (data || []) as Array<{ slug: string; data: any }>;
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = payload.siteId as string | undefined;
  const locale = payload.locale as string | undefined;

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

  const contentRoot = path.join(process.cwd(), 'content', siteId, locale);
  const entries = await listContentEntries(siteId, locale);
  const localeEntryMap = new Map(entries.filter((e) => e.path !== 'theme.json').map((e) => [e.path, e]));
  let themeEntry = entries.find((e) => e.path === 'theme.json');

  // Ensure dedicated-table content is also exportable even if content_entries drifted.
  const dedicatedMappings: Array<{ dir: string; table: string }> = [
    { dir: 'agents', table: 'agents' },
    { dir: 'new-construction', table: 'new_construction' },
    { dir: 'events', table: 'events' },
  ];
  for (const mapping of dedicatedMappings) {
    const rows = await listDedicatedRows(siteId, mapping.table);
    rows.forEach((row) => {
      const slug = typeof row.slug === 'string' ? row.slug.trim().toLowerCase() : '';
      if (!slug || !row.data) return;
      const entryPath = `${mapping.dir}/${slug}.json`;
      if (!localeEntryMap.has(entryPath)) {
        localeEntryMap.set(entryPath, {
          id: `dedicated-${mapping.table}-${slug}`,
          site_id: siteId,
          locale,
          path: entryPath,
          content: row.data,
          data: row.data,
          updated_at: new Date().toISOString(),
          updated_by: 'dedicated_table_backfill',
        });
      }
    });
  }

  // Backfill missing DB paths from local locale files (pages/*.json, *.layout.json, footer/header, etc.)
  const localJsonPaths = await collectJsonPathsRecursive(contentRoot);
  let backfilled = 0;
  let backfillErrors = 0;
  const backfilledPaths: string[] = [];
  const backfillErrorPaths: string[] = [];
  const missingLocalPaths = localJsonPaths.filter((relativePath) => !localeEntryMap.has(relativePath));
  const backfillBatchSize = 20;
  for (let i = 0; i < missingLocalPaths.length; i += backfillBatchSize) {
    const batch = missingLocalPaths.slice(i, i + backfillBatchSize);
    const results = await Promise.all(
      batch.map(async (relativePath) => {
        const absolutePath = path.join(contentRoot, relativePath);
        try {
          const raw = await fs.readFile(absolutePath, 'utf-8');
          const data = JSON.parse(raw);
          const upserted = await upsertContentEntry({
            siteId,
            locale,
            path: relativePath,
            data,
            updatedBy: session.user.email,
          });
          return { relativePath, upserted };
        } catch {
          return { relativePath, upserted: null };
        }
      })
    );
    for (const result of results) {
      if (result.upserted) {
        localeEntryMap.set(result.relativePath, result.upserted);
        backfilled += 1;
        backfilledPaths.push(result.relativePath);
      } else {
        backfillErrors += 1;
        backfillErrorPaths.push(result.relativePath);
      }
    }
  }

  // Backfill theme if missing for this locale
  if (!themeEntry) {
    const themePath = path.join(process.cwd(), 'content', siteId, 'theme.json');
    try {
      const raw = await fs.readFile(themePath, 'utf-8');
      const data = JSON.parse(raw);
      const upsertedTheme = await upsertContentEntry({
        siteId,
        locale,
        path: 'theme.json',
        data,
        updatedBy: session.user.email,
      });
      if (upsertedTheme) {
        themeEntry = upsertedTheme;
        backfilled += 1;
        backfilledPaths.push('theme.json');
      }
    } catch {
      // ignore missing/invalid local theme during backfill
    }
  }

  const localeEntries = Array.from(localeEntryMap.values());
  if (localeEntries.length === 0 && !themeEntry) {
    return NextResponse.json({ message: 'No DB entries to export' }, { status: 400 });
  }

  await Promise.all(
    localeEntries.map(async (entry) => {
      const targetPath = path.join(contentRoot, entry.path);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.writeFile(targetPath, JSON.stringify(entry.content ?? entry.data, null, 2));
    })
  );

  // Export theme to site-level (not locale)
  if (themeEntry) {
    const themePath = path.join(process.cwd(), 'content', siteId, 'theme.json');
    await fs.writeFile(themePath, JSON.stringify(themeEntry.content ?? themeEntry.data, null, 2));
  }

  await writeAuditLog({
    actor: session.user,
    action: 'content_export_completed',
    siteId,
    metadata: {
      locale,
      exported: localeEntries.length + (themeEntry ? 1 : 0),
      backfilled,
      backfillErrors,
      durationMs: Date.now() - startedAt,
    },
  });

  return NextResponse.json({
    success: true,
    exported: localeEntries.length + (themeEntry ? 1 : 0),
    backfilled,
    backfillErrors,
    backfilledPaths,
    backfillErrorPaths,
    message: `Exported ${localeEntries.length} content files to content/${siteId}/${locale}/` +
      (backfilled > 0 ? ` Backfilled ${backfilled} missing DB entries from local files.` : '') +
      (backfillErrors > 0 ? ` (${backfillErrors} files could not be backfilled.)` : ''),
  });
}

#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

function readArg(flag, fallback = '') {
  const idx = process.argv.findIndex((arg) => arg === flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] || fallback;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

async function loadEnvLocal(projectRoot) {
  const envPath = path.join(projectRoot, '.env.local');
  let raw = '';
  try {
    raw = await fs.readFile(envPath, 'utf-8');
  } catch {
    return;
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseStoragePublicUrl(urlString) {
  try {
    const u = new URL(urlString);
    const marker = '/storage/v1/object/public/';
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const rest = u.pathname.slice(idx + marker.length);
    const slash = rest.indexOf('/');
    if (slash === -1) return null;
    const bucket = decodeURIComponent(rest.slice(0, slash));
    const objectPath = decodeURIComponent(rest.slice(slash + 1));
    if (!bucket || !objectPath) return null;
    return {
      host: u.host,
      bucket,
      objectPath,
      origin: u.origin,
      pathname: u.pathname,
    };
  } catch {
    return null;
  }
}

function walkUrls(value, fn) {
  if (typeof value === 'string') {
    fn(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkUrls(item, fn);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) walkUrls(v, fn);
  }
}

function replaceLegacyUrls(value, legacyHost, newOrigin, bucket, stats) {
  if (typeof value === 'string') {
    const parsed = parseStoragePublicUrl(value);
    if (parsed && parsed.host === legacyHost && parsed.bucket === bucket) {
      stats.replaced += 1;
      return `${newOrigin}/storage/v1/object/public/${bucket}/${encodeURI(parsed.objectPath)}`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => replaceLegacyUrls(v, legacyHost, newOrigin, bucket, stats));
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = replaceLegacyUrls(v, legacyHost, newOrigin, bucket, stats);
    }
    return out;
  }
  return value;
}

async function listContentEntriesForSite(supabase, siteId) {
  const all = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('content_entries')
      .select('*')
      .eq('site_id', siteId)
      .order('locale', { ascending: true })
      .order('path', { ascending: true })
      .range(from, to);
    if (error) throw new Error(`list content_entries failed: ${error.message}`);
    const rows = data || [];
    all.push(...rows);
    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

async function fileExistsViaPublicUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const projectRoot = process.cwd();
  await loadEnvLocal(projectRoot);

  const siteId = readArg('--site', process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes');
  const legacyHost = readArg('--legacy-host', 'rpwwafkpsdotglwzgbdf.supabase.co');
  const execute = hasFlag('--execute');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media';

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const newOrigin = new URL(supabaseUrl).origin;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('--- Legacy media migration ---');
  console.log(`site: ${siteId}`);
  console.log(`legacy host: ${legacyHost}`);
  console.log(`new origin: ${newOrigin}`);
  console.log(`bucket: ${bucket}`);
  console.log(`mode: ${execute ? 'EXECUTE' : 'DRY RUN'}`);
  console.log('------------------------------');

  // 1) Export object path list used by site
  const rows = await listContentEntriesForSite(supabase, siteId);
  const objectMap = new Map();

  for (const row of rows) {
    const content = row.content ?? row.data;
    walkUrls(content, (rawUrl) => {
      const parsed = parseStoragePublicUrl(rawUrl);
      if (!parsed) return;
      if (parsed.host !== legacyHost) return;
      if (parsed.bucket !== bucket) return;
      objectMap.set(parsed.objectPath, {
        objectPath: parsed.objectPath,
        sourceUrl: `${parsed.origin}/storage/v1/object/public/${bucket}/${encodeURI(parsed.objectPath)}`,
        targetUrl: `${newOrigin}/storage/v1/object/public/${bucket}/${encodeURI(parsed.objectPath)}`,
      });
    });
  }

  const exportDir = path.join(projectRoot, 'reports');
  await fs.mkdir(exportDir, { recursive: true });
  const exportPath = path.join(exportDir, `${siteId}-legacy-media-paths.json`);
  const objectList = Array.from(objectMap.values()).sort((a, b) =>
    a.objectPath.localeCompare(b.objectPath)
  );
  await fs.writeFile(
    exportPath,
    JSON.stringify(
      {
        siteId,
        legacyHost,
        newOrigin,
        bucket,
        totalPaths: objectList.length,
        generatedAt: new Date().toISOString(),
        paths: objectList,
      },
      null,
      2
    )
  );
  console.log(`Exported object path list: ${exportPath}`);
  console.log(`Legacy paths found: ${objectList.length}`);

  // 2) Copy files to new bucket
  let copied = 0;
  let alreadyExists = 0;
  let copyFailed = 0;

  for (const item of objectList) {
    const exists = await fileExistsViaPublicUrl(item.targetUrl);
    if (exists) {
      alreadyExists += 1;
      continue;
    }

    if (!execute) continue;

    try {
      const src = await fetch(item.sourceUrl);
      if (!src.ok) {
        throw new Error(`source fetch failed ${src.status}`);
      }
      const contentType = src.headers.get('content-type') || 'application/octet-stream';
      const bytes = new Uint8Array(await src.arrayBuffer());
      const { error } = await supabase.storage.from(bucket).upload(item.objectPath, bytes, {
        contentType,
        upsert: true,
      });
      if (error) throw new Error(error.message);
      copied += 1;
    } catch (error) {
      copyFailed += 1;
      console.error(`Copy failed: ${item.objectPath} -> ${String(error)}`);
    }
  }

  console.log(`Copy summary: copied=${copied}, alreadyExists=${alreadyExists}, failed=${copyFailed}`);

  // 3) Rewrite DB URLs for this site
  let changedRows = 0;
  let rewrittenUrls = 0;
  let rowUpdateFailed = 0;

  for (const row of rows) {
    const currentContent = row.content ?? row.data;
    const stats = { replaced: 0 };
    const nextContent = replaceLegacyUrls(currentContent, legacyHost, newOrigin, bucket, stats);
    if (stats.replaced === 0) continue;

    changedRows += 1;
    rewrittenUrls += stats.replaced;
    if (!execute) continue;

    try {
      let updated = false;

      // Attempt content+updated_by first (modern schema)
      const { error: firstError } = await supabase
        .from('content_entries')
        .update({
          content: nextContent,
          updated_by: 'script:migrate-legacy-supabase-media',
        })
        .eq('id', row.id);
      if (!firstError) {
        updated = true;
      } else {
        // Fallback: legacy schema without updated_by or content
        const { error: fallbackError } = await supabase
          .from('content_entries')
          .update({ content: nextContent })
          .eq('id', row.id);
        if (!fallbackError) {
          updated = true;
        } else {
          const { error: dataFallbackError } = await supabase
            .from('content_entries')
            .update({ data: nextContent })
            .eq('id', row.id);
          if (!dataFallbackError) {
            updated = true;
          } else {
            throw new Error(
              `update failed: ${firstError.message}; ${fallbackError.message}; ${dataFallbackError.message}`
            );
          }
        }
      }

      if (!updated) {
        throw new Error('update returned no schema-compatible path');
      }
    } catch (error) {
      rowUpdateFailed += 1;
      console.error(`Row update failed: ${row.locale}/${row.path} -> ${String(error)}`);
    }
  }

  console.log(
    `Rewrite summary: changedRows=${changedRows}, rewrittenUrls=${rewrittenUrls}, updateFailed=${rowUpdateFailed}`
  );

  console.log('\nDone.');
  if (!execute) {
    console.log('Dry-run only. Re-run with --execute to apply copy + DB rewrite.');
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});


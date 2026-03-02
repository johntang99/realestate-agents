#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_ROOT = join(ROOT, 'content');

function loadEnv() {
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return {};
  const rows = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const row of rows) {
    const line = row.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

function parseArgs() {
  const args = process.argv.slice(2);
  const map = new Map();
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) continue;
    const [k, v] = arg.includes('=') ? arg.split('=') : [arg, args[i + 1]];
    map.set(k.replace(/^--/, ''), v ?? '');
  }
  return {
    mode: map.get('mode') || 'import',
    siteId: map.get('site') || env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes',
    locales: String(map.get('locales') || 'en,zh')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function walkJsonFiles(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const out = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...walkJsonFiles(abs, rel));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      out.push({ abs, rel, mtimeMs: statSync(abs).mtimeMs });
    }
  }
  return out;
}

async function upsertEntry(siteId, locale, contentPath, content) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/content_entries?on_conflict=site_id,locale,path`,
    {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        site_id: siteId,
        locale,
        path: contentPath,
        content,
        data: content,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(`Upsert failed for ${locale}:${contentPath} -> ${await response.text()}`);
  }
}

async function importToDb(siteId, locales) {
  let count = 0;
  for (const locale of locales) {
    const localeDir = join(CONTENT_ROOT, siteId, locale);
    const files = walkJsonFiles(localeDir);
    for (const file of files) {
      const content = JSON.parse(readFileSync(file.abs, 'utf-8'));
      await upsertEntry(siteId, locale, file.rel, content);
      count += 1;
    }
  }

  const themePath = join(CONTENT_ROOT, siteId, 'theme.json');
  if (existsSync(themePath)) {
    const theme = JSON.parse(readFileSync(themePath, 'utf-8'));
    for (const locale of locales) {
      await upsertEntry(siteId, locale, 'theme.json', theme);
      count += 1;
    }
  }

  return count;
}

async function exportFromDb(siteId, locales) {
  let count = 0;
  for (const locale of locales) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/content_entries?site_id=eq.${encodeURIComponent(siteId)}&locale=eq.${encodeURIComponent(locale)}&select=path,content,data`,
      {
        headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
      }
    );
    if (!response.ok) {
      throw new Error(`Export failed for ${locale}: ${await response.text()}`);
    }
    const rows = await response.json();
    for (const row of rows) {
      const filePath =
        row.path === 'theme.json'
          ? join(CONTENT_ROOT, siteId, 'theme.json')
          : join(CONTENT_ROOT, siteId, locale, row.path);
      mkdirSync(dirname(filePath), { recursive: true });
      const payload = row.content ?? row.data ?? {};
      writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
      count += 1;
    }
  }
  return count;
}

async function main() {
  const { mode, siteId, locales } = parseArgs();
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }
  if (!siteId) throw new Error('Missing site id');
  if (!Array.isArray(locales) || locales.length === 0) throw new Error('Missing locales');

  if (mode === 'import') {
    const count = await importToDb(siteId, locales);
    console.log(`Imported ${count} entries for ${siteId} (${locales.join(',')})`);
    return;
  }
  if (mode === 'export') {
    const count = await exportFromDb(siteId, locales);
    console.log(`Exported ${count} entries for ${siteId} (${locales.join(',')})`);
    return;
  }
  throw new Error(`Unsupported mode: ${mode}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

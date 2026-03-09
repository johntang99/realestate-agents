#!/usr/bin/env node
/**
 * Re-onboard helper (O1 clone only)
 *
 * Usage:
 *   node scripts/reonboard-site.mjs <site-id> "<site-name>" <prod-domain> <dev-domain> [template-id]
 *
 * Example:
 *   node scripts/reonboard-site.mjs bayview-realty "Bayview Realty" bayviewrealty.com bayview.local jinpanghomes
 */

import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const args = process.argv.slice(2);
const SITE_ID = args[0];
const SITE_NAME = args[1];
const PROD_DOMAIN = args[2];
const DEV_DOMAIN = args[3];
const TEMPLATE_ID = args[4] || 'jinpanghomes';

if (!SITE_ID || !SITE_NAME || !PROD_DOMAIN || !DEV_DOMAIN) {
  console.error('Usage: node scripts/reonboard-site.mjs <site-id> "<site-name>" <prod-domain> <dev-domain> [template-id]');
  process.exit(1);
}

const LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';

const envPath = path.join(ROOT, '.env.local');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

function getEnv(key) {
  const match = envContent.match(new RegExp(`${key}\\s*=\\s*"?([^"\\n]+)"?`));
  return match ? match[1] : process.env[key];
}

const SUPABASE_URL = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const STORAGE_BUCKET =
  getEnv('SUPABASE_STORAGE_BUCKET') || getEnv('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET') || 'media';

if (!SUPABASE_URL || !KEY) {
  console.error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supaHeaders = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=representation',
};

async function upsert(table, rows, onConflict) {
  const url = onConflict
    ? `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`
    : `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, { method: 'POST', headers: supaHeaders, body: JSON.stringify(rows) });
  if (!res.ok) throw new Error(`Upsert ${table} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function fetchRows(table, filters) {
  const params = Object.entries(filters).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`Fetch ${table} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function listStorageFiles(prefix) {
  const files = [];
  const queue = [prefix];
  while (queue.length > 0) {
    const currentPrefix = queue.shift();
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${STORAGE_BUCKET}`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: currentPrefix, limit: 1000, offset: 0 }),
    });
    if (!res.ok) throw new Error(`Storage list failed (${res.status}): ${await res.text()}`);
    const items = await res.json();
    for (const item of items) {
      const fullPath = currentPrefix ? `${currentPrefix}/${item.name}` : item.name;
      if (item.id) files.push(fullPath);
      else queue.push(fullPath);
    }
  }
  return files;
}

async function copyStorageFile(fromPath, toPath) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/copy`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bucketId: STORAGE_BUCKET,
      sourceKey: fromPath,
      destinationKey: toPath,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (body.includes('already exists')) return true;
    throw new Error(`Storage copy failed (${res.status}): ${body}`);
  }
  return true;
}

async function copyDirIfExists(src, dest) {
  try {
    await fsPromises.access(src);
  } catch {
    return false;
  }
  await fsPromises.mkdir(path.dirname(dest), { recursive: true });
  await fsPromises.cp(src, dest, { recursive: true, errorOnExist: false });
  return true;
}

async function main() {
  console.log(`\n${'='.repeat(64)}`);
  console.log(`  RE-ONBOARD O1: ${TEMPLATE_ID} -> ${SITE_ID}`);
  console.log(`${'='.repeat(64)}\n`);

  const existing = await fetchRows('sites', { id: SITE_ID });
  if (existing.length === 0) {
    await upsert('sites', [{
      id: SITE_ID,
      name: SITE_NAME,
      domain: PROD_DOMAIN,
      enabled: true,
      default_locale: DEFAULT_LOCALE,
      supported_locales: LOCALES,
    }], 'id');
    console.log(`Created site row: ${SITE_ID}`);
  } else {
    console.log(`Site row exists: ${SITE_ID} (continuing re-clone)`);
  }

  const templateEntries = await fetchRows('content_entries', { site_id: TEMPLATE_ID });
  const clonedEntries = templateEntries.map((entry) => ({
    site_id: SITE_ID,
    locale: entry.locale,
    path: entry.path,
    content: entry.content,
    updated_by: 'reonboard-script',
  }));
  for (let i = 0; i < clonedEntries.length; i += 50) {
    await upsert('content_entries', clonedEntries.slice(i, i + 50), 'site_id,locale,path');
  }
  console.log(`Cloned content_entries: ${clonedEntries.length}`);

  const domainRows = [
    { site_id: SITE_ID, domain: PROD_DOMAIN, environment: 'prod', enabled: true },
    { site_id: SITE_ID, domain: DEV_DOMAIN, environment: 'dev', enabled: true },
  ];
  await upsert('site_domains', domainRows, 'site_id,domain,environment');
  console.log(`Upserted site_domains: ${domainRows.length}`);

  const templateMedia = await fetchRows('media_assets', { site_id: TEMPLATE_ID });
  for (let i = 0; i < templateMedia.length; i += 100) {
    const batch = templateMedia.slice(i, i + 100).map((item) => ({
      site_id: SITE_ID,
      path: item.path,
      url: (item.url || '')
        .replace(`/uploads/${TEMPLATE_ID}/`, `/uploads/${SITE_ID}/`)
        .replace(`/${TEMPLATE_ID}/`, `/${SITE_ID}/`),
      updated_at: new Date().toISOString(),
    }));
    await upsert('media_assets', batch, 'site_id,path');
  }
  console.log(`Cloned media_assets: ${templateMedia.length}`);

  const storageFiles = await listStorageFiles(TEMPLATE_ID);
  let copiedStorage = 0;
  for (let i = 0; i < storageFiles.length; i += 5) {
    const batch = storageFiles.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((filePath) => copyStorageFile(filePath, filePath.replace(`${TEMPLATE_ID}/`, `${SITE_ID}/`)))
    );
    copiedStorage += results.filter((r) => r.status === 'fulfilled').length;
  }
  console.log(`Copied storage files: ${copiedStorage}/${storageFiles.length}`);

  const uploadsRoot = path.join(ROOT, 'public', 'uploads');
  const copiedUploads = await copyDirIfExists(path.join(uploadsRoot, TEMPLATE_ID), path.join(uploadsRoot, SITE_ID));
  console.log(`Local uploads copy: ${copiedUploads ? 'done' : 'template uploads missing'}`);

  const copiedContent = await copyDirIfExists(path.join(CONTENT_DIR, TEMPLATE_ID), path.join(CONTENT_DIR, SITE_ID));
  console.log(`Local content copy: ${copiedContent ? 'done' : 'template content missing'}`);

  const sitesFile = path.join(CONTENT_DIR, '_sites.json');
  const sitesData = JSON.parse(fs.readFileSync(sitesFile, 'utf-8'));
  if (!sitesData.sites.find((site) => site.id === SITE_ID)) {
    sitesData.sites.push({
      id: SITE_ID,
      name: SITE_NAME,
      domain: PROD_DOMAIN,
      enabled: true,
      defaultLocale: DEFAULT_LOCALE,
      supportedLocales: LOCALES,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    fs.writeFileSync(sitesFile, JSON.stringify(sitesData, null, 2) + '\n');
    console.log('Updated content/_sites.json');
  }

  const domainsFile = path.join(CONTENT_DIR, '_site-domains.json');
  const domainsData = JSON.parse(fs.readFileSync(domainsFile, 'utf-8'));
  for (const row of domainRows) {
    if (!domainsData.domains.find((item) => item.siteId === row.site_id && item.domain === row.domain && item.environment === row.environment)) {
      domainsData.domains.push({ siteId: row.site_id, domain: row.domain, environment: row.environment, enabled: true });
    }
  }
  fs.writeFileSync(domainsFile, JSON.stringify(domainsData, null, 2) + '\n');
  console.log('Updated content/_site-domains.json');

  console.log('\nRe-onboard O1 completed.\n');
}

main().catch((error) => {
  console.error('\nFATAL:', error.message);
  process.exit(1);
});

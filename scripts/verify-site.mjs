#!/usr/bin/env node
/**
 * Verify a site onboarding is complete.
 * Usage: node scripts/verify-site.mjs <site-id> [template-id]
 */
import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SITE = process.argv[2];
const TEMPLATE = process.argv[3] || 'jinpanghomes';
if (!SITE) { console.error('Usage: node scripts/verify-site.mjs <site-id> [template-id]'); process.exit(1); }

const envContent = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
function getEnv(key) {
  const m = envContent.match(new RegExp(`${key}\\s*=\\s*"?([^"\\n]+)"?`));
  return m ? m[1].trim() : '';
}

const SURL = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const BUCKET = getEnv('SUPABASE_STORAGE_BUCKET') || getEnv('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET') || '';
const h = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function countRows(table, col, val) {
  const res = await fetch(`${SURL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}`, {
    method: 'HEAD', headers: { ...h, Prefer: 'count=exact' },
  });
  const range = res.headers.get('content-range') || '';
  const m = range.match(/\/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: h });
  return res.json();
}

async function listStorageFiles(prefix) {
  if (!BUCKET) return [];
  const files = [];
  const queue = [prefix];
  while (queue.length > 0) {
    const cur = queue.shift();
    const res = await fetch(`${SURL}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: cur, limit: 1000, offset: 0 }),
    });
    if (!res.ok) break;
    const items = await res.json();
    for (const item of items) {
      const fp = cur ? `${cur}/${item.name}` : item.name;
      if (item.id) files.push(fp); else queue.push(fp);
    }
  }
  return files;
}

async function dirFileCount(dirPath) {
  try {
    const files = await fsP.readdir(dirPath, { recursive: true });
    return files.filter(f => !f.startsWith('.')).length;
  } catch { return -1; }
}

async function main() {
  console.log(`\n=== ONBOARDING VERIFICATION: ${SITE} (template: ${TEMPLATE}) ===\n`);

  const sites = await fetchJson(`${SURL}/rest/v1/sites?id=eq.${SITE}`);
  const domains = await fetchJson(`${SURL}/rest/v1/site_domains?site_id=eq.${SITE}&select=domain,environment`);
  const contentCount = await countRows('content_entries', 'site_id', SITE);
  const mediaCount = await countRows('media_assets', 'site_id', SITE);
  const tplContent = await countRows('content_entries', 'site_id', TEMPLATE);
  const tplMedia = await countRows('media_assets', 'site_id', TEMPLATE);
  const contaminated = await fetchJson(`${SURL}/rest/v1/media_assets?site_id=eq.${SITE}&url=like.*${TEMPLATE}*&select=url&limit=5`);

  const storageFiles = await listStorageFiles(SITE);
  const tplStorageFiles = await listStorageFiles(TEMPLATE);

  const localUploads = await dirFileCount(path.join(ROOT, 'public', 'uploads', SITE));
  const localContent = await dirFileCount(path.join(ROOT, 'content', SITE));

  const sitesJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', '_sites.json'), 'utf-8'));
  const domainsJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', '_site-domains.json'), 'utf-8'));
  const inSites = sitesJson.sites.find(s => s.id === SITE);
  const inDomains = domainsJson.domains.filter(d => d.siteId === SITE);

  const ok = (pass) => pass ? '✓' : '✗';

  console.log('── DB ──');
  console.log(`  sites:            ${ok(sites.length > 0)} ${sites.length > 0 ? sites[0].name + ' (' + (sites[0].domain || 'no domain') + ')' : 'MISSING'}`);
  console.log(`  content_entries:  ${ok(contentCount === tplContent)} ${contentCount} rows (template: ${tplContent})`);
  console.log(`  media_assets:     ${ok(mediaCount === tplMedia)} ${mediaCount} rows (template: ${tplMedia})`);
  console.log(`  site_domains:     ${ok(domains.length >= 2)} ${domains.length} rows`);
  domains.forEach(d => console.log(`    - ${d.domain} (${d.environment})`));
  console.log(`  URL contamination: ${ok(contaminated.length === 0)} ${contaminated.length === 0 ? 'none' : contaminated.length + ' URLs still reference template'}`);
  if (contaminated.length > 0) contaminated.forEach(c => console.log(`    - ${c.url}`));

  console.log('');
  console.log('── Storage Bucket ──');
  console.log(`  ${BUCKET}/${SITE}/: ${ok(storageFiles.length === tplStorageFiles.length)} ${storageFiles.length} files (template: ${tplStorageFiles.length})`);

  console.log('');
  console.log('── Local Files ──');
  console.log(`  public/uploads/${SITE}/: ${ok(localUploads > 0)} ${localUploads >= 0 ? localUploads + ' files' : 'MISSING'}`);
  console.log(`  content/${SITE}/:         ${ok(localContent > 0)} ${localContent >= 0 ? localContent + ' files' : 'MISSING'}`);

  console.log('');
  console.log('── JSON Registry ──');
  console.log(`  _sites.json:         ${ok(!!inSites)} ${inSites ? inSites.name : 'MISSING'}`);
  console.log(`  _site-domains.json:  ${ok(inDomains.length > 0)} ${inDomains.length} entries`);

  const allOk = sites.length > 0 && contentCount === tplContent && mediaCount === tplMedia
    && domains.length >= 2 && contaminated.length === 0 && storageFiles.length === tplStorageFiles.length
    && localUploads > 0 && localContent > 0 && inSites && inDomains.length > 0;

  console.log('');
  console.log(allOk ? '✓ ONBOARDING COMPLETE — all checks passed.' : '⚠️  SOME CHECKS NEED ATTENTION — see above.');
  console.log('');
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });

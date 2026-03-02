#!/usr/bin/env node
/**
 * Seed all Jin Pang Homes content into Supabase content_entries.
 * Run: node scripts/seed-julia-content.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Load env from .env.local
const envPath = join(ROOT, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_ID = 'julia-studio';
const LOCALE = 'en';
const CONTENT_DIR = join(ROOT, 'content', SITE_ID, LOCALE);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

async function upsert(path, data) {
  const url = `${SUPABASE_URL}/rest/v1/content_entries`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ site_id: SITE_ID, locale: LOCALE, path, data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upsert ${path}: ${err}`);
  }
  return res;
}

async function seedFile(filePath, contentPath) {
  if (!existsSync(filePath)) return;
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  await upsert(contentPath, data);
  console.log(`  ✓ ${contentPath}`);
}

async function seedDir(dir, prefix) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
    await upsert(`${prefix}/${file}`, data);
    console.log(`  ✓ ${prefix}/${file}`);
  }
}

// Seed theme (site-wide, no locale)
async function seedTheme() {
  const themePath = join(ROOT, 'content', SITE_ID, 'theme.json');
  if (!existsSync(themePath)) return;
  const data = JSON.parse(readFileSync(themePath, 'utf-8'));
  // Theme is stored under a special path
  const url = `${SUPABASE_URL}/rest/v1/content_entries`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ site_id: SITE_ID, locale: 'en', path: 'theme.json', data }),
  });
  if (!res.ok) throw new Error(`Failed theme: ${await res.text()}`);
  console.log('  ✓ theme.json');
}

async function main() {
  console.log(`\nSeeding Jin Pang Homes content → ${SUPABASE_URL}\n`);

  console.log('── Global settings ──────────────────────');
  await seedTheme();
  for (const file of ['site.json', 'seo.json', 'header.json', 'footer.json', 'navigation.json']) {
    await seedFile(join(CONTENT_DIR, file), file);
  }

  console.log('\n── Pages ────────────────────────────────');
  await seedDir(join(CONTENT_DIR, 'pages'), 'pages');

  console.log('\n── Portfolio projects ───────────────────');
  await seedDir(join(CONTENT_DIR, 'portfolio'), 'portfolio');

  console.log('\n── Shop products ────────────────────────');
  await seedDir(join(CONTENT_DIR, 'shop-products'), 'shop-products');

  console.log('\n── Journal posts ────────────────────────');
  await seedDir(join(CONTENT_DIR, 'journal'), 'journal');

  console.log('\n── Collections ──────────────────────────');
  await seedDir(join(CONTENT_DIR, 'collections'), 'collections');

  console.log('\n── Testimonials ─────────────────────────');
  await seedFile(join(CONTENT_DIR, 'testimonials.json'), 'testimonials.json');

  console.log('\n✅ All content seeded successfully!\n');
}

main().catch((err) => { console.error('\n❌', err.message); process.exit(1); });

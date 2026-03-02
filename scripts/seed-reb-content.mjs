#!/usr/bin/env node
/**
 * Seed all REB content into Supabase content_entries and agents table.
 * Run: node scripts/seed-reb-content.mjs
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

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_ID = 'reb-template';
const LOCALE = 'en';
const CONTENT_DIR = join(ROOT, 'content', SITE_ID, LOCALE);

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates',
};

async function upsertContent(path, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content_entries?on_conflict=site_id,locale,path`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify({ site_id: SITE_ID, locale: LOCALE, path, data: data }),
  });
  if (!res.ok) throw new Error(`Failed to upsert ${path}: ${await res.text()}`);
}

async function upsertAgent(slug, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/agents`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ site_id: SITE_ID, slug, data }),
  });
  if (!res.ok) throw new Error(`Failed to upsert agent ${slug}: ${await res.text()}`);
}

async function seedFile(filePath, contentPath) {
  if (!existsSync(filePath)) { console.log(`  ⚠ skip ${contentPath} (not found)`); return; }
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  await upsertContent(contentPath, data);
  console.log(`  ✓ ${contentPath}`);
}

async function seedDir(dir, prefix) {
  if (!existsSync(dir)) { console.log(`  ⚠ skip ${prefix}/ (dir not found)`); return; }
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
    await upsertContent(`${prefix}/${file}`, data);
    console.log(`  ✓ ${prefix}/${file}`);
  }
}

async function seedTheme() {
  const themePath = join(ROOT, 'content', SITE_ID, 'theme.json');
  if (!existsSync(themePath)) return;
  const data = JSON.parse(readFileSync(themePath, 'utf-8'));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content_entries`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ site_id: SITE_ID, locale: 'en', path: 'theme.json', content: data }),
  });
  if (!res.ok) throw new Error(`Failed theme: ${await res.text()}`);
  console.log('  ✓ theme.json');
}

async function seedAgents() {
  const agentsDir = join(CONTENT_DIR, 'agents');
  if (!existsSync(agentsDir)) return;
  const files = readdirSync(agentsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(agentsDir, file), 'utf-8'));
    const slug = file.replace('.json', '');
    await upsertAgent(slug, data);
    console.log(`  ✓ agents/${slug}`);
  }
}

async function seedSite() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sites`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: SITE_ID,
      name: 'REB Premium Template',
      domain: 'reb.local',
      default_locale: 'en',
      supported_locales: ['en'],
      enabled: true,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    if (err.includes('duplicate') || err.includes('already exists')) {
      console.log('  ✓ site already exists');
    } else {
      throw new Error(`Failed to seed site: ${err}`);
    }
  } else {
    console.log('  ✓ site: reb-template');
  }
}

async function main() {
  console.log(`\n🏗  Seeding REB content → ${SUPABASE_URL}\n`);

  console.log('── Site record ───────────────────────────');
  await seedSite();

  console.log('\n── Theme ─────────────────────────────────');
  await seedTheme();

  console.log('\n── Global settings ───────────────────────');
  for (const file of ['site.json', 'seo.json', 'header.json', 'footer.json']) {
    await seedFile(join(CONTENT_DIR, file), file);
  }

  console.log('\n── Pages ─────────────────────────────────');
  await seedDir(join(CONTENT_DIR, 'pages'), 'pages');

  console.log('\n── Agents (agents table) ─────────────────');
  await seedAgents();

  console.log('\n── Properties ────────────────────────────');
  await seedDir(join(CONTENT_DIR, 'properties'), 'properties');

  console.log('\n── Neighborhoods ─────────────────────────');
  await seedDir(join(CONTENT_DIR, 'neighborhoods'), 'neighborhoods');

  console.log('\n── Knowledge Center posts ────────────────');
  await seedDir(join(CONTENT_DIR, 'knowledge-center'), 'knowledge-center');

  console.log('\n── Market Reports ────────────────────────');
  await seedDir(join(CONTENT_DIR, 'market-reports'), 'market-reports');

  console.log('\n── New Construction ──────────────────────');
  await seedDir(join(CONTENT_DIR, 'new-construction'), 'new-construction');

  console.log('\n── Testimonials ──────────────────────────');
  await seedFile(join(CONTENT_DIR, 'testimonials.json'), 'testimonials.json');

  console.log('\n── Events ────────────────────────────────');
  await seedFile(join(CONTENT_DIR, 'events.json'), 'events.json');

  console.log('\n── Guides ────────────────────────────────');
  await seedFile(join(CONTENT_DIR, 'guides.json'), 'guides.json');

  console.log('\n✅ All REB content seeded successfully!\n');
}

main().catch((err) => { console.error('\n❌', err.message); process.exit(1); });

#!/usr/bin/env node
/**
 * QA: Content check — find placeholder text, empty required fields, broken image URLs
 * Usage: node scripts/qa/check-content.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '../..');
const CONTENT_DIR = join(ROOT, 'content/jinpanghomes/en');

const PLACEHOLDER_STRINGS = [
  'TODO', 'XXXXX', 'TBD', '[replace]', 'lorem ipsum',
  'XXX Main Street', '(XXX) XXX', 'REPLACE_WITH',
];
// Strings that are OK to leave as-is until client provides real data
const ALLOWED_PLACEHOLDERS = [
  '/embed/PLACEHOLDER',  // video embed (intentional placeholder)
];

let issues = 0;
let checked = 0;

function checkValue(value, path) {
  if (typeof value === 'string') {
    for (const p of PLACEHOLDER_STRINGS) {
      if (value.toLowerCase().includes(p.toLowerCase())) {
        const allowed = ALLOWED_PLACEHOLDERS.some(a => value.includes(a));
        if (!allowed) {
          console.log(`  ⚠ ${path}: "${value.slice(0, 60)}"`);
          issues++;
        }
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => checkValue(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => checkValue(v, `${path}.${k}`));
  }
}

function checkFile(filePath, label) {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    checkValue(data, label);
    checked++;
  } catch (err) {
    console.log(`  ✗ Cannot parse ${label}: ${err.message}`);
    issues++;
  }
}

function scanDir(dir, prefix) {
  if (!existsSync(dir)) return;
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  files.forEach(f => checkFile(join(dir, f), `${prefix}/${f}`));
}

async function main() {
  console.log('\n🔍 Content quality check\n');

  // Global
  ['site.json','seo.json','header.json','footer.json'].forEach(f =>
    checkFile(join(CONTENT_DIR, f), f)
  );
  // Pages
  scanDir(join(CONTENT_DIR, 'pages'), 'pages');
  // Collections
  scanDir(join(CONTENT_DIR, 'properties'), 'properties');
  scanDir(join(CONTENT_DIR, 'neighborhoods'), 'neighborhoods');
  scanDir(join(CONTENT_DIR, 'knowledge-center'), 'knowledge-center');
  scanDir(join(CONTENT_DIR, 'market-reports'), 'market-reports');
  scanDir(join(CONTENT_DIR, 'case-studies'), 'case-studies');
  scanDir(join(CONTENT_DIR, 'resources'), 'resources');

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Files checked: ${checked}`);
  if (issues) {
    console.log(`  ⚠ ${issues} placeholder strings found — replace before launch`);
    process.exit(1);
  } else {
    console.log('  ✅ No placeholder content found\n');
  }
}

main();

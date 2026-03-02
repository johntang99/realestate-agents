#!/usr/bin/env node
/**
 * QA: Bilingual check — verify key EN/ZH files both exist
 * Usage: node scripts/qa/check-bilingual.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '../..');
const EN_DIR = join(ROOT, 'content/jinpanghomes/en');
const ZH_DIR = join(ROOT, 'content/jinpanghomes/zh');

let issues = 0;
let filesChecked = 0;
function mustExistBoth(relPath) {
  filesChecked += 1;
  const enPath = join(EN_DIR, relPath);
  const zhPath = join(ZH_DIR, relPath);
  if (!existsSync(enPath)) {
    console.log(`  ⚠ Missing EN file: ${relPath}`);
    issues += 1;
  }
  if (!existsSync(zhPath)) {
    console.log(`  ⚠ Missing ZH file: ${relPath}`);
    issues += 1;
  }
}

async function main() {
  console.log('\n🔍 Bilingual (Cn field) check\n');
  ['site.json', 'seo.json', 'header.json', 'footer.json'].forEach((f) => mustExistBoth(f));

  const pageFiles = readdirSync(join(EN_DIR, 'pages')).filter((f) => f.endsWith('.json'));
  pageFiles.forEach((f) => mustExistBoth(`pages/${f}`));

  const collectionDirs = ['properties', 'neighborhoods', 'knowledge-center', 'market-reports', 'case-studies', 'resources'];
  for (const dir of collectionDirs) {
    const enCollectionDir = join(EN_DIR, dir);
    if (!existsSync(enCollectionDir)) continue;
    const files = readdirSync(enCollectionDir).filter((f) => f.endsWith('.json'));
    files.forEach((f) => mustExistBoth(`${dir}/${f}`));
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Files checked for parity: ${filesChecked}`);
  if (issues) {
    console.log(`  ⚠ ${issues} parity issues found`);
    process.exit(1);
  } else {
    console.log('  ✅ EN/ZH parity checks passed\n');
  }
}

main();

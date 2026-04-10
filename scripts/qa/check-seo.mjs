#!/usr/bin/env node
/**
 * QA: SEO check — title, description, canonical, hreflang on key pages.
 * Usage:
 *   node scripts/qa/check-seo.mjs [base_url] [--path=/en/some-page] [--path=/en/another]
 */

const DEFAULT_BASE = 'http://localhost:3070';
const args = process.argv.slice(2);
const baseArg = args.find((arg) => !arg.startsWith('--'));
const BASE = baseArg || DEFAULT_BASE;
const customPaths = args
  .filter((arg) => arg.startsWith('--path='))
  .map((arg) => arg.split('=')[1])
  .filter(Boolean);

const DEFAULT_PAGES = [
  '/en',
  '/en/properties',
  '/en/buying',
  '/en/selling',
  '/en/contact',
  '/zh',
  '/zh/properties',
  '/zh/contact',
];
const PAGES = customPaths.length > 0 ? customPaths : DEFAULT_PAGES;

let passed = 0;
let failed = 0;
const issues = [];

async function checkPage(path) {
  let html = '';
  let res = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    res = await fetch(`${BASE}${path}`);
    html = await res.text();
    const hasHead = /<head>/i.test(html);
    const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
    if (res.ok && hasHead && hasTitle) break;
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  const checks = [];
  if (!res?.ok) {
    checks.push(`  ⚠ HTTP status ${res?.status || 'unknown'}`);
  }

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1]?.replace(/\s+/g, ' ').trim();
  if (!title || title.length < 5) {
    checks.push('  ⚠ title missing or default');
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"]/i) ||
                    html.match(/<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]description['"]/i);
  if (!descMatch?.[1]) checks.push('  ⚠ meta description missing');

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=['"]canonical['"][^>]*href=['"]([^'"]+)['"]/i);
  if (!canonicalMatch?.[1]) checks.push('  ⚠ canonical missing');

  // hreflang
  const hreflangCount = (html.match(/<link[^>]*rel=['"]alternate['"][^>]*hreflang=['"][^'"]+['"]/gi) || []).length;
  if (hreflangCount < 2) checks.push('  ⚠ hreflang missing');

  const status = checks.length ? '⚠' : '✓';
  console.log(`  ${status} ${path} (${res?.status || '??'}) — title: "${title?.slice(0, 50) || '??'}"`);
  if (checks.length) {
    checks.forEach(c => console.log(c));
    failed++;
    issues.push({ path, checks });
  } else {
    passed++;
  }
}

async function main() {
  console.log(`\n🔍 SEO check — ${BASE}\n`);
  for (const page of PAGES) {
    try { await checkPage(page); }
    catch (err) { console.log(`  ✗ ${page} ERROR: ${err.message}`); failed++; }
  }
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total: ${PAGES.length} | ✓ ${passed} | ⚠ ${failed}`);
  if (!issues.length) console.log('  ✅ All SEO checks passed\n');
  else console.log(`  ${failed} pages need attention\n`);
}

main();

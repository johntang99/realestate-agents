#!/usr/bin/env node
/**
 * QA: SEO check — title, description, canonical, hreflang on key pages
 * Usage: node scripts/qa/check-seo.mjs [base_url]
 */

const BASE = process.argv[2] || 'http://localhost:3070';

const PAGES = [
  '/en',
  '/en/properties',
  '/en/buying',
  '/en/selling',
  '/en/contact',
  '/zh',
  '/zh/properties',
  '/zh/contact',
];

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
    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
    if (res.ok && hasHead && hasTitle) break;
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  const checks = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim();
  if (!title || title.length < 5) {
    checks.push('  ⚠ title missing or default');
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) ||
                    html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
  if (!descMatch?.[1]) checks.push('  ⚠ meta description missing');

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  if (!canonicalMatch?.[1]) checks.push('  ⚠ canonical missing');

  // hreflang
  const hreflangCount = (html.match(/hreflang|hrefLang/gi) || []).length;
  if (hreflangCount < 2) checks.push('  ⚠ hreflang missing');

  const status = checks.length ? '⚠' : '✓';
  console.log(`  ${status} ${path} — title: "${title?.slice(0, 50) || '??'}"`);
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

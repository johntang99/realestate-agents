#!/usr/bin/env node
/**
 * QA: Route smoke test — verify every public route returns 200
 * Usage: node scripts/qa/check-routes.mjs [base_url]
 */

const BASE = process.argv[2] || 'http://localhost:3070';

const ROUTES = [
  // Core EN
  '/en',
  '/en/about',
  '/en/contact',
  '/en/home-valuation',
  '/en/properties',
  '/en/neighborhoods',
  '/en/buying',
  '/en/selling',
  '/en/investing',
  '/en/relocating',
  '/en/knowledge-center',
  '/en/market-reports',
  '/en/case-studies',
  '/en/testimonials',
  '/en/resources',
  // Core ZH
  '/zh',
  '/zh/about',
  '/zh/contact',
  '/zh/home-valuation',
  '/zh/properties',
  '/zh/neighborhoods',
  '/zh/buying',
  '/zh/selling',
  '/zh/investing',
  '/zh/relocating',
  '/zh/knowledge-center',
  '/zh/market-reports',
  '/zh/case-studies',
  '/zh/testimonials',
  '/zh/resources',
  // Dynamic detail pages (seeded sample data)
  '/en/properties/77-highland-terrace',
  '/en/neighborhoods/scarsdale',
  '/en/knowledge-center/first-time-buyer-guide-orange-county',
  '/en/market-reports/february-2026',
  // Tech endpoints
  '/sitemap.xml',
  '/robots.txt',
];

let passed = 0;
let failed = 0;
const failures = [];

async function checkRoute(route) {
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: 'follow' });
    if (res.ok) {
      console.log(`  ✓ ${route} → ${res.status}`);
      passed++;
    } else {
      console.log(`  ✗ ${route} → ${res.status}`);
      failed++;
      failures.push({ route, status: res.status });
    }
  } catch (err) {
    console.log(`  ✗ ${route} → ERROR: ${err.message}`);
    failed++;
    failures.push({ route, status: 'ERROR', error: err.message });
  }
}

async function main() {
  console.log(`\n🔍 Route check — ${BASE}\n`);
  for (const route of ROUTES) {
    await checkRoute(route);
  }
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Total: ${ROUTES.length} | ✓ ${passed} | ✗ ${failed}`);
  if (failures.length) {
    console.log('\n  Failed routes:');
    failures.forEach(f => console.log(`    ${f.route} → ${f.status}`));
    process.exit(1);
  } else {
    console.log('\n  ✅ All routes passed\n');
  }
}

main();

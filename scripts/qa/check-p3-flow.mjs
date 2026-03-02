#!/usr/bin/env node
/**
 * QA: P3 smoke checks (MLS + showing flow + map/list sync hooks)
 * Usage:
 *   node scripts/qa/check-p3-flow.mjs [base_url] [--with-writes]
 */

const BASE = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : 'http://localhost:3060';
const WITH_WRITES = process.argv.includes('--with-writes');

let passed = 0;
let failed = 0;
const failures = [];

function ok(label) {
  passed += 1;
  console.log(`  ✓ ${label}`);
}

function fail(label, reason) {
  failed += 1;
  failures.push({ label, reason });
  console.log(`  ✗ ${label}${reason ? ` — ${reason}` : ''}`);
}

async function fetchText(pathname) {
  const res = await fetch(`${BASE}${pathname}`, { redirect: 'follow' });
  const text = await res.text();
  return { res, text };
}

async function checkPropertiesMapPanel() {
  const page = await fetch(`${BASE}/en/properties`, { redirect: 'follow' });
  if (!page.ok) return fail('GET /en/properties', `status ${page.status}`);

  const api = await fetch(`${BASE}/api/content/items?locale=en&directory=properties`);
  if (!api.ok) return fail('GET /api/content/items properties', `status ${api.status}`);
  const payload = await api.json();
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) return fail('properties API seed data', 'no properties returned');

  const mapReady = items.filter(
    (p) =>
      p &&
      typeof p === 'object' &&
      p.coordinates &&
      typeof p.coordinates.lat === 'number' &&
      typeof p.coordinates.lng === 'number'
  );

  if (mapReady.length === 0) {
    console.log('  • No coordinates found yet; map panel will render after MLS geo sync.');
  }
  ok('properties page + API availability');
}

async function checkPropertyDetailShowing() {
  const res = await fetch(`${BASE}/en/properties/45-oak-ridge-lane`, { redirect: 'follow' });
  if (!res.ok) return fail('GET property detail', `status ${res.status}`);
  ok('property detail route availability');
}

async function checkMlsEndpointShape() {
  const res = await fetch(`${BASE}/api/admin/mls/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  // In local dev this should be auth/input guarded and never 500.
  if ([400, 401, 403].includes(res.status)) {
    ok('mls ingest endpoint guard behavior');
    return;
  }
  if (res.status >= 500) {
    fail('mls ingest endpoint guard behavior', `unexpected server error ${res.status}`);
    return;
  }
  ok(`mls ingest endpoint responded ${res.status}`);
}

async function checkLeadEventWrite() {
  const res = await fetch(`${BASE}/api/lead-events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: 'reb-template',
      locale: 'en',
      eventName: `qa_p3_smoke_${Date.now()}`,
      source: 'qa-script',
      pagePath: '/en/properties',
      metadata: { check: 'p3-flow' },
    }),
  });
  if (!res.ok) return fail('POST /api/lead-events', `status ${res.status}`);
  ok('lead event write');
}

async function checkShowingWrite() {
  const res = await fetch(`${BASE}/api/showing-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: 'reb-template',
      locale: 'en',
      source: 'qa-script',
      pagePath: '/en/properties/45-oak-ridge-lane',
      name: 'QA Smoke',
      email: `qa-smoke+${Date.now()}@example.com`,
      phone: '555-555-5555',
      propertySlug: '45-oak-ridge-lane',
      propertyAddress: '45 Oak Ridge Lane',
      preferredDate: '2026-03-15',
      preferredTime: '2:00 PM',
      message: 'QA smoke check',
    }),
  });
  if (!res.ok) return fail('POST /api/showing-request', `status ${res.status}`);
  ok('showing request write');
}

async function main() {
  console.log(`\n🔍 P3 smoke check — ${BASE}`);
  console.log(`   Writes enabled: ${WITH_WRITES ? 'yes' : 'no'}\n`);

  await checkPropertiesMapPanel();
  await checkPropertyDetailShowing();
  await checkMlsEndpointShape();

  if (WITH_WRITES) {
    await checkLeadEventWrite();
    await checkShowingWrite();
  } else {
    console.log('  • Skipped write checks (pass --with-writes to enable).');
  }

  console.log(`\n${'─'.repeat(56)}`);
  console.log(`  Total checks: ${passed + failed} | ✓ ${passed} | ✗ ${failed}`);
  if (failures.length) {
    console.log('\n  Failures:');
    failures.forEach((entry) => console.log(`    - ${entry.label}: ${entry.reason}`));
    process.exit(1);
  } else {
    console.log('\n  ✅ P3 smoke checks passed\n');
  }
}

main().catch((err) => {
  console.error('\nUnexpected error running P3 smoke checks:', err);
  process.exit(1);
});

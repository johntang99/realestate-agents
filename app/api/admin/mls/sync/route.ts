import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import {
  canUseContentDb,
  listContentEntriesByPrefix,
  upsertContentEntry,
} from '@/lib/contentDb';
import { writeAuditLog } from '@/lib/admin/audit';
import { mlsGridAdapter } from '@/lib/mls/providers/mlsGrid';
import type { User } from '@/lib/types';
import type { RawMlsRecord } from '@/lib/mls/providers/types';

const MLS_GRID_ENDPOINT =
  process.env.MLS_GRID_ENDPOINT ?? 'https://api.mlsgrid.com/v2/Property';
const MLS_GRID_ACCESS_TOKEN = process.env.MLS_GRID_ACCESS_TOKEN ?? '';
const MLS_GRID_ORIGINATING_SYSTEM =
  process.env.MLS_GRID_ORIGINATING_SYSTEM_NAME ?? 'key2';
const MLS_GRID_SITE_ID = process.env.MLS_GRID_SITE_ID ?? '';
const CRON_SECRET = process.env.CRON_SECRET ?? '';

// A system-level actor used for cron-initiated syncs
const CRON_USER: User = {
  id: 'system-cron',
  email: 'cron@system',
  name: 'Cron Sync',
  role: 'super_admin',
  sites: [],
  createdAt: new Date(0).toISOString(),
  lastLoginAt: new Date().toISOString(),
};

/** Fetch all active listings from MLS Grid with automatic pagination. */
async function fetchMlsGridListings(
  systemName: string
): Promise<RawMlsRecord[]> {
  if (!MLS_GRID_ACCESS_TOKEN) {
    throw new Error('MLS_GRID_ACCESS_TOKEN is not configured');
  }

  const filter = [
    `MlgCanView eq true`,
    `StandardStatus eq 'Active'`,
    `OriginatingSystemName eq '${systemName}'`,
  ].join(' and ');

  const records: RawMlsRecord[] = [];
  let url: string | null =
    `${MLS_GRID_ENDPOINT}` +
    `?$filter=${encodeURIComponent(filter)}` +
    `&$expand=Media` +
    `&$top=500` +
    `&$orderby=ModificationTimestamp desc`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${MLS_GRID_ACCESS_TOKEN}` },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`MLS Grid API ${res.status}: ${body.slice(0, 300)}`);
    }
    const json = (await res.json()) as {
      value?: unknown[];
      '@odata.nextLink'?: string;
      'odata.nextLink'?: string;
    };
    const page = Array.isArray(json.value) ? (json.value as RawMlsRecord[]) : [];
    records.push(...page);
    url = (json['@odata.nextLink'] ?? json['odata.nextLink'] ?? null) as
      | string
      | null;
  }

  return records;
}

/** Core sync logic — can be called by both the POST (session) and GET (cron) handlers. */
async function runSync(opts: {
  siteId: string;
  locale: string;
  systemName: string;
  actor: User;
}): Promise<NextResponse> {
  const { siteId, locale, systemName, actor } = opts;
  const startedAt = new Date().toISOString();

  if (!canUseContentDb()) {
    return NextResponse.json(
      { message: 'DB mode is not enabled (missing SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 400 }
    );
  }

  let fetchedCount = 0;
  let createdOrUpdated = 0;
  let skipped = 0;
  let archived = 0;

  try {
    const records = await fetchMlsGridListings(systemName);
    fetchedCount = records.length;

    const listingKeys = new Set<string>();

    for (const record of records) {
      const normalized = mlsGridAdapter.normalize(record);
      if (!normalized) {
        skipped += 1;
        continue;
      }
      listingKeys.add(normalized.mlsSource.listingId);
      const contentPath = `properties/${normalized.slug}.json`;
      const result = await upsertContentEntry({
        siteId,
        locale,
        path: contentPath,
        data: normalized,
        updatedBy: actor.email,
      });
      if (result) createdOrUpdated += 1;
      else skipped += 1;
    }

    // Archive listings that were not in this sync batch
    const existing = await listContentEntriesByPrefix(siteId, locale, 'properties/');
    for (const entry of existing) {
      const data = (entry.content ?? entry.data) as Record<string, unknown> | null;
      const source = (data?.mlsSource ?? {}) as Record<string, unknown>;
      if (String(source.provider ?? '') !== 'mlsgrid') continue;
      const key = String(source.listingId ?? '');
      if (!key || listingKeys.has(key)) continue;

      await upsertContentEntry({
        siteId,
        locale,
        path: entry.path,
        data: {
          ...(data ?? {}),
          status: 'off-market',
          mlsSource: {
            ...source,
            provider: 'mlsgrid',
            listingId: key,
            syncedAt: new Date().toISOString(),
            syncStatus: 'archived',
          },
        },
        updatedBy: actor.email,
      });
      archived += 1;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message, startedAt, fetchedCount }, { status: 500 });
  }

  await writeAuditLog({
    actor,
    action: 'mls_sync',
    siteId,
    metadata: { locale, systemName, fetchedCount, createdOrUpdated, skipped, archived },
  });

  return NextResponse.json({
    success: true,
    startedAt,
    fetchedCount,
    createdOrUpdated,
    skipped,
    archived,
  });
}

// ── POST /api/admin/mls/sync — Admin UI (session auth) ────────────────────────
export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const body = (await request.json()) as {
    siteId?: string;
    locale?: string;
    systemName?: string;
  };
  const siteId = String(body.siteId ?? '').trim();
  const locale = String(body.locale ?? 'en').trim();
  const systemName = String(body.systemName ?? MLS_GRID_ORIGINATING_SYSTEM).trim();

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return runSync({ siteId, locale, systemName, actor: session.user });
}

// ── GET /api/admin/mls/sync — Vercel cron (CRON_SECRET auth) ─────────────────
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const siteId = searchParams.get('siteId') ?? MLS_GRID_SITE_ID;
  const locale = searchParams.get('locale') ?? 'en';
  const systemName = searchParams.get('systemName') ?? MLS_GRID_ORIGINATING_SYSTEM;

  if (!siteId) {
    return NextResponse.json(
      { message: 'siteId is required (query param or MLS_GRID_SITE_ID env)' },
      { status: 400 }
    );
  }

  return runSync({ siteId, locale, systemName, actor: CRON_USER });
}

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canWriteContent, requireSiteAccess } from '@/lib/admin/permissions';
import {
  canUseContentDb,
  listContentEntriesByPrefix,
  upsertContentEntry,
} from '@/lib/contentDb';
import { writeAuditLog } from '@/lib/admin/audit';
import { genericJsonMlsAdapter } from '@/lib/mls/providers/genericJson';
import type { RawMlsRecord } from '@/lib/mls/providers/types';

type IngestPayload = {
  siteId?: string;
  locale?: string;
  provider?: 'generic-json';
  records?: RawMlsRecord[];
  archiveMissing?: boolean;
};

const PROVIDERS = {
  'generic-json': genericJsonMlsAdapter,
} as const;

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canUseContentDb()) {
    return NextResponse.json(
      { message: 'DB mode is not enabled (missing SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 400 }
    );
  }

  const payload = (await request.json()) as IngestPayload;
  const siteId = String(payload.siteId || '').trim();
  const locale = String(payload.locale || 'en').trim();
  const providerId = payload.provider || 'generic-json';
  const archiveMissing = Boolean(payload.archiveMissing);
  const records = Array.isArray(payload.records) ? payload.records : [];

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }
  if (records.length === 0) {
    return NextResponse.json({ message: 'records is required' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canWriteContent(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const adapter = PROVIDERS[providerId];
  if (!adapter) {
    return NextResponse.json({ message: 'Unsupported provider' }, { status: 400 });
  }

  let createdOrUpdated = 0;
  let skipped = 0;
  let archived = 0;
  const listingIds = new Set<string>();

  for (const record of records) {
    const normalized = adapter.normalize(record);
    if (!normalized) {
      skipped += 1;
      continue;
    }
    listingIds.add(normalized.mlsSource.listingId);
    const path = `properties/${normalized.slug}.json`;
    const result = await upsertContentEntry({
      siteId,
      locale,
      path,
      data: normalized,
      updatedBy: session.user.email,
    });
    if (result) createdOrUpdated += 1;
    else skipped += 1;
  }

  if (archiveMissing) {
    const existing = await listContentEntriesByPrefix(siteId, locale, 'properties/');
    for (const entry of existing) {
      const data = (entry.content ?? entry.data) as Record<string, unknown> | null;
      const source = (data?.mlsSource || {}) as Record<string, unknown>;
      const sourceProvider = String(source.provider || '');
      const listingId = String(source.listingId || '');
      if (sourceProvider !== providerId || !listingId) continue;
      if (listingIds.has(listingId)) continue;

      const archivedData = {
        ...(data || {}),
        status: 'off-market',
        mlsSource: {
          ...source,
          provider: providerId,
          listingId,
          syncedAt: new Date().toISOString(),
          syncStatus: 'archived',
        },
      };

      const archivedResult = await upsertContentEntry({
        siteId,
        locale,
        path: entry.path,
        data: archivedData,
        updatedBy: session.user.email,
      });
      if (archivedResult) archived += 1;
    }
  }

  await writeAuditLog({
    actor: session.user,
    action: 'mls_ingest',
    siteId,
    metadata: {
      locale,
      provider: providerId,
      inputCount: records.length,
      createdOrUpdated,
      skipped,
      archived,
      archiveMissing,
    },
  });

  return NextResponse.json({
    success: true,
    provider: providerId,
    createdOrUpdated,
    skipped,
    archived,
    archiveMissing,
  });
}

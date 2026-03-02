import { NextRequest, NextResponse } from 'next/server';
import { getSiteById, updateSite } from '@/lib/sites';
import { getSessionFromRequest } from '@/lib/admin/auth';
import type { RuntimeEnvironment, SiteConfig } from '@/lib/types';
import { isSuperAdmin, requireRole, requireSiteAccess } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import {
  deleteSiteDomainByIdDb,
  listSiteDomainsDb,
  normalizeDomain,
  upsertSiteDomainDb,
} from '@/lib/siteDomainsDb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    requireSiteAccess(session.user, params.id);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const site = await getSiteById(params.id);
  if (!site) {
    return NextResponse.json({ message: 'Site not found' }, { status: 404 });
  }

  return NextResponse.json(site);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    requireRole(session.user, ['super_admin', 'site_admin', 'broker_admin']);
    requireSiteAccess(session.user, params.id);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = (await request.json()) as Partial<SiteConfig> & {
    domainAliases?: Array<{
      id?: string;
      domain: string;
      environment: RuntimeEnvironment;
      isPrimary?: boolean;
      enabled?: boolean;
    }>;
  };
  const allowed: Partial<SiteConfig> = {
    name: payload.name,
    domain: payload.domain,
    enabled: payload.enabled,
    defaultLocale: payload.defaultLocale,
    supportedLocales: payload.supportedLocales,
  };

  const updated = await updateSite(params.id, allowed);
  if (!updated) {
    return NextResponse.json({ message: 'Site not found' }, { status: 404 });
  }

  let aliasChanges = 0;
  if (Array.isArray(payload.domainAliases)) {
    const sanitized = payload.domainAliases
      .filter((alias) => alias.domain && alias.environment)
      .map((alias) => ({
        id: alias.id,
        domain: normalizeDomain(alias.domain),
        environment: alias.environment,
        isPrimary: alias.isPrimary ?? true,
        enabled: alias.enabled ?? true,
      }))
      .filter((alias) => alias.domain.length > 0);

    const dedupedByKey = new Map<string, (typeof sanitized)[number]>();
    for (const alias of sanitized) {
      dedupedByKey.set(`${alias.environment}::${alias.domain}`, alias);
    }
    const deduped = Array.from(dedupedByKey.values());

    const existing = await listSiteDomainsDb(params.id);
    const keepIds = new Set<string>();

    for (const alias of deduped) {
      const saved = await upsertSiteDomainDb({
        siteId: params.id,
        domain: alias.domain,
        environment: alias.environment,
        isPrimary: alias.isPrimary,
        enabled: alias.enabled,
      });
      if (saved?.id) {
        keepIds.add(saved.id);
      }
      aliasChanges += 1;
    }

    for (const alias of existing) {
      if (!keepIds.has(alias.id)) {
        await deleteSiteDomainByIdDb(alias.id);
        aliasChanges += 1;
      }
    }
  }

  await writeAuditLog({
    actor: session.user,
    action: 'site_updated',
    siteId: params.id,
    metadata: {
      updatedFields: Object.keys(allowed).filter((key) => (allowed as any)[key] !== undefined),
      aliasChanges,
    },
  });

  return NextResponse.json({
    ...updated,
    domainAliases: await listSiteDomainsDb(params.id),
  });
}

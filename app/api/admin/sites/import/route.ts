import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canUseSitesDb, upsertSiteDb } from '@/lib/sitesDb';
import type { SiteConfig } from '@/lib/types';
import { getAdminUserCountDb } from '@/lib/admin/usersDb';
import { canImportSites } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';
import { upsertSiteDomainDb } from '@/lib/siteDomainsDb';

const SITES_FILE = path.join(process.cwd(), 'content', '_sites.json');
const SITE_DOMAINS_FILE = path.join(process.cwd(), 'content', '_site-domains.json');

interface SitesPayload {
  sites?: SiteConfig[];
}

interface SiteDomainsPayload {
  domains?: Array<{
    siteId?: string;
    domain?: string;
    environment?: 'dev' | 'staging' | 'prod';
    enabled?: boolean;
  }>;
}

export async function POST(request: NextRequest) {
  if (!canUseSitesDb()) {
    return NextResponse.json(
      { message: 'Supabase service role key is required for import.' },
      { status: 400 }
    );
  }

  const session = await getSessionFromRequest(request);
  if (!session) {
    const existingCount = await getAdminUserCountDb();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
  } else if (!canImportSites(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const raw = await fs.readFile(SITES_FILE, 'utf-8');
    const payload = JSON.parse(raw) as SitesPayload;
    const sites = payload.sites || [];

    let imported = 0;
    let skipped = 0;
    let domainAliasesImported = 0;

    for (const site of sites) {
      if (!site?.id || !site?.name) {
        skipped += 1;
        continue;
      }
      const saved = await upsertSiteDb(site);
      if (saved) {
        imported += 1;
      } else {
        skipped += 1;
      }
    }

    try {
      const rawDomainAliases = await fs.readFile(SITE_DOMAINS_FILE, 'utf-8');
      const domainPayload = JSON.parse(rawDomainAliases) as SiteDomainsPayload;
      const aliases = Array.isArray(domainPayload.domains) ? domainPayload.domains : [];
      for (const alias of aliases) {
        if (!alias.siteId || !alias.domain) continue;
        const saved = await upsertSiteDomainDb({
          siteId: alias.siteId,
          domain: alias.domain,
          environment: alias.environment || 'prod',
          isPrimary: false,
          enabled: alias.enabled ?? true,
        });
        if (saved) domainAliasesImported += 1;
      }
    } catch {
      // optional file
    }

    if (session?.user) {
      await writeAuditLog({
        actor: session.user,
        action: 'sites_imported',
        metadata: { imported, skipped, domainAliasesImported },
      });
    }

    return NextResponse.json({ success: true, imported, skipped, domainAliasesImported });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to import sites' },
      { status: 500 }
    );
  }
}

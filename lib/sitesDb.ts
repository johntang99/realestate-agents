import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { SiteConfig } from '@/lib/types';
import { listSiteDomainsDb, upsertSiteDomainDb } from './siteDomainsDb';

interface SiteRow {
  id: string;
  name: string;
  domain: string | null;
  enabled: boolean;
  default_locale: string;
  supported_locales: string[];
  created_at: string;
  updated_at: string;
}

function mapSiteRow(row: SiteRow): SiteConfig {
  return {
    id: row.id,
    name: row.name,
    domain: row.domain || undefined,
    enabled: row.enabled,
    defaultLocale: row.default_locale as SiteConfig['defaultLocale'],
    supportedLocales: (row.supported_locales || []) as SiteConfig['supportedLocales'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function canUseSitesDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listSitesDb(): Promise<SiteConfig[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('sites').select('*');
  if (error) {
    console.error('Supabase listSitesDb error:', error);
    return [];
  }
  const sites = (data || []).map((row) => mapSiteRow(row as SiteRow));
  const aliases = await listSiteDomainsDb();
  const aliasesBySite = new Map<string, typeof aliases>();
  for (const alias of aliases) {
    const current = aliasesBySite.get(alias.siteId) || [];
    current.push(alias);
    aliasesBySite.set(alias.siteId, current);
  }
  return sites.map((site) => ({
    ...site,
    domainAliases: aliasesBySite.get(site.id) || [],
  }));
}

export async function getSiteByIdDb(siteId: string): Promise<SiteConfig | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .maybeSingle();
  if (error) {
    console.error('Supabase getSiteByIdDb error:', error);
    return null;
  }
  if (!data) return null;
  const site = mapSiteRow(data as SiteRow);
  return {
    ...site,
    domainAliases: await listSiteDomainsDb(site.id),
  };
}

export async function createSiteDb(
  input: Omit<SiteConfig, 'createdAt' | 'updatedAt'>
): Promise<SiteConfig | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sites')
    .insert({
      id: input.id,
      name: input.name,
      domain: input.domain || null,
      enabled: input.enabled,
      default_locale: input.defaultLocale,
      supported_locales: input.supportedLocales,
    })
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase createSiteDb error:', error);
    return null;
  }
  const created = data ? mapSiteRow(data as SiteRow) : null;
  if (!created) return null;
  if (input.domain) {
    await upsertSiteDomainDb({
      siteId: created.id,
      domain: input.domain,
      environment: 'prod',
      isPrimary: true,
      enabled: true,
    });
  }
  return {
    ...created,
    domainAliases: await listSiteDomainsDb(created.id),
  };
}

export async function updateSiteDb(
  siteId: string,
  updates: Partial<SiteConfig>
): Promise<SiteConfig | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const payload: Partial<SiteRow> = {
    name: updates.name,
    domain: updates.domain ?? null,
    enabled: updates.enabled,
    default_locale: updates.defaultLocale,
    supported_locales: updates.supportedLocales,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('sites')
    .update(payload)
    .eq('id', siteId)
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase updateSiteDb error:', error);
    return null;
  }
  const updated = data ? mapSiteRow(data as SiteRow) : null;
  if (!updated) return null;
  if (updates.domain) {
    await upsertSiteDomainDb({
      siteId,
      domain: updates.domain,
      environment: 'prod',
      isPrimary: true,
      enabled: true,
    });
  }
  return {
    ...updated,
    domainAliases: await listSiteDomainsDb(siteId),
  };
}

export async function upsertSiteDb(params: SiteConfig): Promise<SiteConfig | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const existing = await getSiteByIdDb(params.id);
  const payload: Partial<SiteRow> = {
    id: params.id,
    name: params.name,
    domain: params.domain || null,
    enabled: params.enabled,
    default_locale: params.defaultLocale,
    supported_locales: params.supportedLocales,
    created_at: existing?.createdAt || params.createdAt,
    updated_at: params.updatedAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('sites')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase upsertSiteDb error:', error);
    return null;
  }
  const saved = data ? mapSiteRow(data as SiteRow) : null;
  if (!saved) return null;
  if (params.domain) {
    await upsertSiteDomainDb({
      siteId: saved.id,
      domain: params.domain,
      environment: 'prod',
      isPrimary: true,
      enabled: true,
    });
  }
  return {
    ...saved,
    domainAliases: await listSiteDomainsDb(saved.id),
  };
}

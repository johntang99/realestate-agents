import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { RuntimeEnvironment, SiteDomainAlias } from '@/lib/types';

interface SiteDomainRow {
  id: string;
  site_id: string;
  domain: string;
  environment: RuntimeEnvironment;
  is_primary: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

function mapSiteDomainRow(row: SiteDomainRow): SiteDomainAlias {
  return {
    id: row.id,
    siteId: row.site_id,
    domain: row.domain,
    environment: row.environment,
    isPrimary: row.is_primary,
    enabled: row.enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function normalizeDomain(value: string): string {
  return value.replace(/:\d+$/, '').replace(/^www\./, '').toLowerCase();
}

export async function listSiteDomainsDb(siteId?: string): Promise<SiteDomainAlias[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  let query = supabase.from('site_domains').select('*');
  if (siteId) {
    query = query.eq('site_id', siteId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Supabase listSiteDomainsDb error:', error);
    return [];
  }
  return (data || []).map((row) => mapSiteDomainRow(row as SiteDomainRow));
}

export async function getSiteDomainMatchDb(domain: string): Promise<SiteDomainAlias | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const normalized = normalizeDomain(domain);
  const { data, error } = await supabase
    .from('site_domains')
    .select('*')
    .eq('domain', normalized)
    .eq('enabled', true)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('Supabase getSiteDomainMatchDb error:', error);
    return null;
  }
  return data ? mapSiteDomainRow(data as SiteDomainRow) : null;
}

export async function upsertSiteDomainDb(params: {
  siteId: string;
  domain: string;
  environment: RuntimeEnvironment;
  isPrimary?: boolean;
  enabled?: boolean;
}): Promise<SiteDomainAlias | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;
  const normalizedDomain = normalizeDomain(params.domain);
  const { data, error } = await supabase
    .from('site_domains')
    .upsert(
      {
        site_id: params.siteId,
        domain: normalizedDomain,
        environment: params.environment,
        is_primary: params.isPrimary ?? true,
        enabled: params.enabled ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id,domain,environment' }
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Supabase upsertSiteDomainDb error:', error);
    return null;
  }

  return data ? mapSiteDomainRow(data as SiteDomainRow) : null;
}

export async function deleteSiteDomainByIdDb(id: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;
  const { error } = await supabase.from('site_domains').delete().eq('id', id);
  if (error) {
    console.error('Supabase deleteSiteDomainByIdDb error:', error);
  }
}

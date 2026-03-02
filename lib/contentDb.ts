import { getSupabaseServerClient } from '@/lib/supabase/server';

export interface ContentEntryRecord {
  id: string;
  site_id: string;
  locale: string;
  path: string;
  content: unknown;
  /** @deprecated alias for content — use .content */
  data?: unknown;
  updated_at: string;
  updated_by: string | null;
}

const table = 'content_entries';

export function canUseContentDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function fetchContentEntry(
  siteId: string,
  locale: string,
  path: string
): Promise<ContentEntryRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('site_id', siteId)
    .eq('locale', locale)
    .eq('path', path)
    .maybeSingle();

  if (error) {
    console.error('Supabase fetchContentEntry error:', error);
    return null;
  }

  return data as ContentEntryRecord | null;
}

export async function fetchThemeEntry(
  siteId: string,
  locale?: string
): Promise<ContentEntryRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  if (locale) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('site_id', siteId)
      .eq('locale', locale)
      .eq('path', 'theme.json')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return data as ContentEntryRecord;
    }
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('site_id', siteId)
    .eq('path', 'theme.json')
    .in('locale', ['en', 'zh'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Supabase fetchThemeEntry error:', error);
    return null;
  }

  if (!error && data) {
    return data as ContentEntryRecord;
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from(table)
    .select('*')
    .eq('site_id', siteId)
    .eq('path', 'theme.json')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) {
    console.error('Supabase fetchThemeEntry fallback error:', fallbackError);
    return null;
  }

  return fallbackData as ContentEntryRecord | null;
}

export async function listContentEntries(
  siteId: string,
  locale: string
): Promise<ContentEntryRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('site_id', siteId)
    .eq('locale', locale);

  if (error) {
    console.error('Supabase listContentEntries error:', error);
    return [];
  }

  return (data || []) as ContentEntryRecord[];
}

export async function listContentEntriesForSite(
  siteId: string
): Promise<ContentEntryRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from(table).select('*').eq('site_id', siteId);
  if (error) {
    console.error('Supabase listContentEntriesForSite error:', error);
    return [];
  }

  return (data || []) as ContentEntryRecord[];
}

export async function listContentEntriesByPrefix(
  siteId: string,
  locale: string,
  prefix: string
): Promise<ContentEntryRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('site_id', siteId)
    .eq('locale', locale)
    .like('path', `${prefix}%`);

  if (error) {
    console.error('Supabase listContentEntriesByPrefix error:', error);
    return [];
  }

  return (data || []) as ContentEntryRecord[];
}

export async function upsertContentEntry(params: {
  siteId: string;
  locale: string;
  path: string;
  data: unknown;
  updatedBy?: string;
}): Promise<ContentEntryRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(table)
    .upsert(
      {
        site_id: params.siteId,
        locale: params.locale,
        path: params.path,
        content: params.data,
        // updated_by column not present in this DB schema — omitted
      },
      { onConflict: 'site_id,locale,path' }
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Supabase upsertContentEntry error:', error);
    return null;
  }

  return data as ContentEntryRecord | null;
}

export async function insertContentRevision(params: {
  entryId: string;
  data: unknown;
  createdBy?: string;
  note?: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from('content_revisions').insert({
    entry_id: params.entryId,
    data: params.data,
    created_by: params.createdBy || null,
    note: params.note || null,
  });

  if (error) {
    console.error('Supabase insertContentRevision error:', error);
  }
}

export async function deleteContentEntry(params: {
  siteId: string;
  locale: string;
  path: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('site_id', params.siteId)
    .eq('locale', params.locale)
    .eq('path', params.path);

  if (error) {
    console.error('Supabase deleteContentEntry error:', error);
  }
}

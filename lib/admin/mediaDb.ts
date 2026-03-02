import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { MediaItem } from '@/lib/admin/media';
import path from 'path';

interface MediaRow {
  id: string;
  site_id: string;
  path: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface LegacyMediaRow {
  id: string;
  site_id: string;
  file_path: string;
  storage_url: string;
}

export function canUseMediaDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listMediaDb(siteId: string): Promise<MediaItem[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('media_assets')
    .select('id,site_id,path,url')
    .eq('site_id', siteId)
    .order('path', { ascending: true });

  if (!error) {
    return (data || []).map((row) => ({
      id: (row as MediaRow).id,
      path: (row as MediaRow).path,
      url: (row as MediaRow).url,
    }));
  }

  const { data: legacyData, error: legacyError } = await supabase
    .from('media_assets')
    .select('id,site_id,file_path,storage_url')
    .eq('site_id', siteId)
    .order('file_path', { ascending: true });

  if (legacyError) {
    console.error('Supabase listMediaDb error:', error, legacyError);
    return [];
  }

  return (legacyData || []).map((row) => ({
    id: (row as LegacyMediaRow).id,
    path: (row as LegacyMediaRow).file_path,
    url: (row as LegacyMediaRow).storage_url,
  }));
}

export async function upsertMediaDb(params: {
  siteId: string;
  path: string;
  url: string;
}): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('media_assets')
    .upsert(
      {
        site_id: params.siteId,
        path: params.path,
        url: params.url,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id,path' }
    );

  if (!error) return;

  const legacyPayload = {
    site_id: params.siteId,
    file_name: path.posix.basename(params.path),
    file_path: params.path,
    storage_url: params.url,
  };

  const { data: existing, error: findError } = await supabase
    .from('media_assets')
    .select('id')
    .eq('site_id', params.siteId)
    .eq('file_path', params.path)
    .maybeSingle();

  if (findError) {
    console.error('Supabase upsertMediaDb error:', error, findError);
    return;
  }

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from('media_assets')
      .update({
        file_name: legacyPayload.file_name,
        storage_url: legacyPayload.storage_url,
      })
      .eq('id', existing.id);
    if (updateError) {
      console.error('Supabase upsertMediaDb legacy update error:', updateError);
    }
    return;
  }

  const { error: insertError } = await supabase.from('media_assets').insert(legacyPayload);
  if (insertError) {
    console.error('Supabase upsertMediaDb legacy insert error:', insertError);
  }
}

export async function deleteMediaDb(siteId: string, path: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('media_assets')
    .delete()
    .eq('site_id', siteId)
    .eq('path', path);

  if (!error) return;

  const { error: legacyError } = await supabase
    .from('media_assets')
    .delete()
    .eq('site_id', siteId)
    .eq('file_path', path);

  if (legacyError) {
    console.error('Supabase deleteMediaDb error:', error, legacyError);
  }
}

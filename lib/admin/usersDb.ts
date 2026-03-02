import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { User } from '@/lib/types';

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: User['role'];
  // DB may have `sites` (array) or legacy `site_id` (single string)
  sites?: string[] | null;
  site_id?: string | null;
  avatar?: string | null;
  password_hash: string;
  created_at: string;
  // DB may have `last_login_at` or legacy `updated_at`
  last_login_at?: string | null;
  updated_at?: string | null;
  is_active?: boolean;
}

function mapAdminUser(row: AdminUserRow): User {
  const sites = Array.isArray(row.sites)
    ? row.sites
    : row.site_id
      ? [row.site_id]
      : [];
  return {
    id: row.id,
    email: row.email,
    name: row.name || '',
    role: row.role,
    sites,
    avatar: row.avatar || undefined,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at || row.updated_at || row.created_at,
  };
}

export function canUseAdminDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listAdminUsersDb(): Promise<User[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('admin_users')
    .select('*');
  if (error) {
    console.error('Supabase listAdminUsersDb error:', error);
    return [];
  }
  return (data || []).map((row) => mapAdminUser(row as AdminUserRow));
}

export async function findAdminUserByEmailDb(
  email: string
): Promise<AdminUserRow | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (!error) {
      return (data as AdminUserRow) || null;
    }

    const isNetworkIssue =
      /fetch failed|ETIMEDOUT|ECONNRESET|ENOTFOUND/i.test(
        `${error.message} ${error.details || ''}`
      );
    if (!isNetworkIssue) {
      console.error('Supabase findAdminUserByEmailDb error:', error);
      return null;
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      continue;
    }

    const dbError = new Error('Admin DB unavailable');
    (dbError as Error & { code?: string }).code = 'ADMIN_DB_UNAVAILABLE';
    throw dbError;
  }

  return null;
}

export async function findAdminUserByIdDb(
  userId: string
): Promise<AdminUserRow | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('Supabase findAdminUserByIdDb error:', error);
    return null;
  }
  return (data as AdminUserRow) || null;
}

export async function createAdminUserDb(params: {
  id?: string;
  email: string;
  name: string;
  role: User['role'];
  sites: string[];
  passwordHash: string;
}): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      id: params.id || `user-${Date.now()}`,
      email: params.email,
      name: params.name,
      role: params.role,
      sites: params.sites,          // column may not exist yet — handled by migration
      site_id: params.sites?.[0] || null,  // legacy fallback
      password_hash: params.passwordHash,
    })
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase createAdminUserDb error:', error);
    return null;
  }
  return data ? mapAdminUser(data as AdminUserRow) : null;
}

export async function upsertAdminUserDb(params: {
  id?: string;
  email: string;
  name: string;
  role: User['role'];
  sites: string[];
  avatar?: string | null;
  passwordHash: string;
  createdAt?: string;
  lastLoginAt?: string;
}): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const existing = await findAdminUserByEmailDb(params.email);
  if (existing) {
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        name: params.name,
        role: params.role,
        password_hash: params.passwordHash,
      })
      .eq('id', existing.id)
      .select('*')
      .maybeSingle();
    if (error) {
      console.error('Supabase upsertAdminUserDb update error:', error);
      return null;
    }
    return data ? mapAdminUser(data as AdminUserRow) : null;
  }

  const createdAt = params.createdAt || new Date().toISOString();
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      id: params.id || `user-${Date.now()}`,
      email: params.email,
      name: params.name,
      role: params.role,
      site_id: params.sites?.[0] || null,
      password_hash: params.passwordHash,
      created_at: createdAt,
    })
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase upsertAdminUserDb insert error:', error);
    return null;
  }
  return data ? mapAdminUser(data as AdminUserRow) : null;
}

export async function updateAdminUserDb(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const payload: Partial<AdminUserRow> = {
    ...(updates.email !== undefined ? { email: updates.email } : {}),
    ...(updates.name !== undefined ? { name: updates.name } : {}),
    ...(updates.role !== undefined ? { role: updates.role } : {}),
    // `sites` is a non-standard column — only set if column exists
    // fall back to site_id (single) for older schemas
    ...(updates.sites !== undefined
      ? { site_id: updates.sites?.[0] || null }
      : {}),
  };

  const { data, error } = await supabase
    .from('admin_users')
    .update(payload)
    .eq('id', userId)
    .select('*')
    .maybeSingle();
  if (error) {
    console.error('Supabase updateAdminUserDb error:', error);
    return null;
  }
  return data ? mapAdminUser(data as AdminUserRow) : null;
}

export async function deleteAdminUserDb(userId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase.from('admin_users').delete().eq('id', userId);
  if (error) {
    console.error('Supabase deleteAdminUserDb error:', error);
  }
}

export async function setAdminPasswordDb(userId: string, passwordHash: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('admin_users')
    .update({ password_hash: passwordHash })
    .eq('id', userId);
  if (error) {
    console.error('Supabase setAdminPasswordDb error:', error);
  }
}

export async function updateLastLoginDb(userId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('admin_users')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) {
    console.error('Supabase updateLastLoginDb error:', error);
  }
}

export async function getAdminUserCountDb(): Promise<number> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from('admin_users')
    .select('id', { count: 'exact', head: true });
  if (error) {
    console.error('Supabase getAdminUserCountDb error:', error);
    return 0;
  }
  return count || 0;
}

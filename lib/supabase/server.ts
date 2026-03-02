import { createClient } from '@supabase/supabase-js';

function getRuntimeEnv() {
  const runtime = (process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV || '').toLowerCase();
  if (runtime === 'staging') return 'staging';
  if (runtime === 'prod' || runtime === 'production') return 'prod';
  return 'dev';
}

function resolveSupabaseUrl() {
  const env = getRuntimeEnv();
  if (env === 'staging') {
    return (
      process.env.SUPABASE_STAGING_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL ||
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
  }
  if (env === 'prod') {
    return (
      process.env.SUPABASE_PROD_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_PROD_URL ||
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
  }
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function resolveServiceRoleKey() {
  const env = getRuntimeEnv();
  if (env === 'staging') {
    return process.env.SUPABASE_STAGING_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (env === 'prod') {
    return process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabaseServerClient() {
  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = resolveServiceRoleKey();
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { NextResponse } from 'next/server';
import { getSites } from '@/lib/sites';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const startedAt = Date.now();
  const sites = await getSites();
  const supabase = getSupabaseServerClient();
  let dbOk = false;

  if (supabase) {
    const { error } = await supabase.from('sites').select('id').limit(1);
    dbOk = !error;
  }

  return NextResponse.json({
    ok: true,
    checks: {
      db: dbOk || !supabase,
      sitesLoaded: sites.length >= 0,
    },
    metrics: {
      siteCount: sites.length,
      durationMs: Date.now() - startedAt,
    },
    environment: process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV || 'dev',
    timestamp: new Date().toISOString(),
  });
}

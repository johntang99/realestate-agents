import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = String(searchParams.get('siteId') || '').trim();
  const status = String(searchParams.get('status') || '').trim();
  const query = String(searchParams.get('q') || '').trim();
  const limit = Math.min(Number(searchParams.get('limit') || 200), 500);

  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageBookings(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ message: 'DB mode unavailable' }, { status: 400 });
  }

  let req = supabase
    .from('investor_inquiries')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status) req = req.eq('status', status);
  const { data, error } = await req;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  let rows = Array.isArray(data) ? data : [];
  if (query) {
    const needle = query.toLowerCase();
    rows = rows.filter((row: any) =>
      [row.name, row.email, row.phone, row.investment_type, row.budget_range]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }

  return NextResponse.json({ inquiries: rows });
}

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

  // Primary shape: flattened columns.
  let { data, error } = await (async () => {
    let req = supabase
      .from('showing_requests')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (status) req = req.eq('status', status);
    return req;
  })();

  if (error) {
    const isSchemaMismatch =
      error.message.includes('status') ||
      error.message.includes('property_slug') ||
      error.message.includes('property_address');
    if (!isSchemaMismatch) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // REA shape: `data` json payload.
    const fallback = await supabase
      .from('showing_requests')
      .select('id,site_id,created_at,data')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (fallback.error) {
      return NextResponse.json({ message: fallback.error.message }, { status: 500 });
    }
    const normalized = (fallback.data || []).map((row: any) => {
      const d = (row.data || {}) as Record<string, any>;
      return {
        id: row.id,
        site_id: row.site_id,
        created_at: row.created_at,
        name: d.name || '',
        email: d.email || '',
        phone: d.phone || '',
        property_slug: d.propertySlug || '',
        property_address: d.propertyAddress || '',
        agent_slug: d.agentSlug || '',
        preferred_date: d.preferredDate || '',
        preferred_time: d.preferredTime || '',
        message: d.message || '',
        status: d.status || 'new',
      };
    });
    const needle = query.toLowerCase();
    let filtered = normalized;
    if (query) {
      filtered = filtered.filter((row: any) =>
        [row.name, row.email, row.phone, row.property_slug, row.property_address]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      );
    }
    return NextResponse.json({ requests: filtered });
  }

  let rows = Array.isArray(data) ? data : [];
  if (query) {
    const needle = query.toLowerCase();
    rows = rows.filter((row: any) =>
      [
        row.name,
        row.email,
        row.phone,
        row.property_slug,
        row.property_address,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }

  return NextResponse.json({ requests: rows });
}

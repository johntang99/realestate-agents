import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { writeAuditLog } from '@/lib/admin/audit';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = String(payload?.siteId || '').trim();
  const status = String(payload?.status || '').trim();
  const id = String(params.id || '').trim();

  if (!siteId || !status || !id) {
    return NextResponse.json(
      { message: 'siteId, id, and status are required' },
      { status: 400 }
    );
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

  // Primary shape: flattened status column.
  let { data, error } = await supabase
    .from('showing_requests')
    .update({ status })
    .eq('id', id)
    .eq('site_id', siteId)
    .select('*')
    .maybeSingle();

  if (error) {
    const isSchemaMismatch = error.message.includes('status');
    if (!isSchemaMismatch) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // REA shape: status inside `data` json payload.
    const existing = await supabase
      .from('showing_requests')
      .select('id,site_id,created_at,data')
      .eq('id', id)
      .eq('site_id', siteId)
      .maybeSingle();
    if (existing.error) {
      return NextResponse.json({ message: existing.error.message }, { status: 500 });
    }
    if (!existing.data) {
      return NextResponse.json({ message: 'Showing request not found' }, { status: 404 });
    }

    const existingData = (existing.data as any).data || {};
    const updated = await supabase
      .from('showing_requests')
      .update({
        data: {
          ...existingData,
          status,
        },
      })
      .eq('id', id)
      .eq('site_id', siteId)
      .select('id,site_id,created_at,data')
      .maybeSingle();
    if (updated.error) {
      return NextResponse.json({ message: updated.error.message }, { status: 500 });
    }
    data = updated.data as any;
    error = null;
  }

  if (!data) {
    return NextResponse.json({ message: 'Showing request not found' }, { status: 404 });
  }

  await writeAuditLog({
    actor: session.user,
    action: 'showing_request_status_updated',
    siteId,
    metadata: {
      id,
      status,
    },
  });

  return NextResponse.json({ request: data });
}

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

  const { data, error } = await supabase
    .from('investor_inquiries')
    .update({ status })
    .eq('id', id)
    .eq('site_id', siteId)
    .select('*')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
  }

  await writeAuditLog({
    actor: session.user,
    action: 'investor_inquiry_status_updated',
    siteId,
    metadata: { id, status },
  });

  return NextResponse.json({ inquiry: data });
}

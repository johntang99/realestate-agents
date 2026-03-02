import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { listBookings } from '@/lib/booking/storage';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  if (!siteId || !from || !to) {
    return NextResponse.json({ message: 'Missing siteId or date range' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageBookings(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const bookings = await listBookings(siteId, from, to);
  return NextResponse.json({ bookings });
}

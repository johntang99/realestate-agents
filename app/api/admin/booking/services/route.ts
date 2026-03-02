import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { loadBookingServices, saveBookingServices } from '@/lib/booking/storage';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId') || '';
  if (!siteId) {
    return NextResponse.json({ message: 'Missing siteId' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageBookings(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  const services = await loadBookingServices(siteId);
  return NextResponse.json({ services });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const payload = await request.json();
  const siteId = String(payload?.siteId || '');
  const services = Array.isArray(payload?.services) ? payload.services : null;
  if (!siteId || !services) {
    return NextResponse.json({ message: 'Missing siteId or services' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageBookings(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  await saveBookingServices(siteId, services);
  return NextResponse.json({ status: 'ok' });
}

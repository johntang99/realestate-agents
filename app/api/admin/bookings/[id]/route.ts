import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { moveBooking, updateBooking } from '@/lib/booking/storage';
import type { BookingRecord } from '@/lib/types';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const payload = await request.json();
  const siteId = String(payload?.siteId || '');
  const booking = payload?.booking as BookingRecord | undefined;
  const originalDate = String(payload?.originalDate || '');

  if (!siteId || !booking) {
    return NextResponse.json({ message: 'Missing siteId or booking' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageBookings(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (booking.id !== params.id) {
    return NextResponse.json({ message: 'Booking ID mismatch' }, { status: 400 });
  }

  if (originalDate && originalDate !== booking.date) {
    await moveBooking(siteId, originalDate, booking);
  } else {
    await updateBooking(siteId, booking);
  }

  return NextResponse.json({ booking });
}

import { NextRequest, NextResponse } from 'next/server';
import { getRequestSiteId } from '@/lib/content';
import { listBookings } from '@/lib/booking/storage';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const email = String(payload?.email || '').trim().toLowerCase();
  const phone = String(payload?.phone || '').trim();

  if (!email || !phone) {
    return NextResponse.json({ message: 'Email and phone are required' }, { status: 400 });
  }

  const siteId = await getRequestSiteId();
  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  const endDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 6, today.getUTCDate())
  )
    .toISOString()
    .slice(0, 10);

  const bookings = await listBookings(siteId, startDate, endDate);
  const filtered = bookings.filter(
    (booking) =>
      booking.email.toLowerCase() === email &&
      booking.phone.replace(/[^\d+]/g, '') === phone.replace(/[^\d+]/g, '')
  );

  return NextResponse.json({ bookings: filtered });
}

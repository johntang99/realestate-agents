import { NextRequest, NextResponse } from 'next/server';
import { getRequestSiteId } from '@/lib/content';
import { listBookings, loadBookingSettings, updateBooking } from '@/lib/booking/storage';
import { sendBookingEmails } from '@/lib/booking/email';
import { sendBookingSms } from '@/lib/booking/sms';
import type { BookingRecord } from '@/lib/types';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const bookingId = String(payload?.bookingId || '').trim();
  const email = String(payload?.email || '').trim().toLowerCase();

  if (!bookingId || !email) {
    return NextResponse.json({ message: 'Booking ID and email are required' }, { status: 400 });
  }

  const siteId = await getRequestSiteId();
  const today = new Date().toISOString().slice(0, 10);
  const endDate = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 6, new Date().getUTCDate())
  )
    .toISOString()
    .slice(0, 10);
  const bookings = await listBookings(siteId, today, endDate);
  const booking = bookings.find(
    (item) => item.id === bookingId && item.email.toLowerCase() === email
  );

  if (!booking) {
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
  }

  const updated: BookingRecord = {
    ...booking,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };

  const settings = await loadBookingSettings(siteId);
  await updateBooking(siteId, updated);
  await sendBookingEmails({
    booking: updated,
    subject: 'Your booking has been cancelled',
    message: 'Your appointment has been cancelled. If this is a mistake, please contact us.',
    adminRecipients: settings?.notificationEmails || [],
  });
  await sendBookingSms({
    booking: updated,
    message: 'Your booking has been cancelled.',
    adminRecipients: settings?.notificationPhones || [],
  });

  return NextResponse.json({ booking: updated });
}

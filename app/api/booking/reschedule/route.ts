import { NextRequest, NextResponse } from 'next/server';
import { getRequestSiteId } from '@/lib/content';
import { generateAvailableSlots, isDateWithinRange } from '@/lib/booking/availability';
import {
  listBookings,
  loadBookingServices,
  loadBookingSettings,
  moveBooking,
} from '@/lib/booking/storage';
import { sendBookingEmails } from '@/lib/booking/email';
import { sendBookingSms } from '@/lib/booking/sms';
import type { BookingRecord } from '@/lib/types';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const bookingId = String(payload?.bookingId || '').trim();
  const email = String(payload?.email || '').trim().toLowerCase();
  const date = String(payload?.date || '').trim();
  const time = String(payload?.time || '').trim();

  if (!bookingId || !email || !date || !time) {
    return NextResponse.json(
      { message: 'Booking ID, email, date, and time are required' },
      { status: 400 }
    );
  }

  const siteId = await getRequestSiteId();
  const [services, settings] = await Promise.all([
    loadBookingServices(siteId),
    loadBookingSettings(siteId),
  ]);

  if (!settings) {
    return NextResponse.json({ message: 'Booking settings not configured' }, { status: 400 });
  }

  if (!isDateWithinRange({ date, settings })) {
    return NextResponse.json({ message: 'Date is outside booking window' }, { status: 400 });
  }

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

  const service = services.find((item) => item.id === booking.serviceId);
  if (!service) {
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
  }

  const dayBookings = await listBookings(siteId, date, date);
  const slots = generateAvailableSlots({
    date,
    service,
    settings,
    bookings: dayBookings,
  });

  if (!slots.includes(time)) {
    return NextResponse.json({ message: 'Time slot is no longer available' }, { status: 409 });
  }

  const updated: BookingRecord = {
    ...booking,
    date,
    time,
    status: 'rescheduled',
    updatedAt: new Date().toISOString(),
  };

  await moveBooking(siteId, booking.date, updated);
  await sendBookingEmails({
    booking: updated,
    service,
    subject: 'Your booking has been rescheduled',
    message: 'Your appointment has been rescheduled. Updated details are below:',
    adminRecipients: settings?.notificationEmails || [],
  });
  await sendBookingSms({
    booking: updated,
    service,
    message: 'Your booking has been rescheduled.',
    adminRecipients: settings?.notificationPhones || [],
  });

  return NextResponse.json({ booking: updated });
}

import { NextRequest, NextResponse } from 'next/server';
import { getRequestSiteId } from '@/lib/content';
import { generateAvailableSlots, isDateWithinRange } from '@/lib/booking/availability';
import {
  loadBookingServices,
  loadBookingSettings,
  listBookings,
} from '@/lib/booking/storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || '';
  const serviceId = searchParams.get('serviceId') || '';

  if (!date || !serviceId) {
    return NextResponse.json({ message: 'Missing date or serviceId' }, { status: 400 });
  }

  const siteId = await getRequestSiteId();
  const [services, settings] = await Promise.all([
    loadBookingServices(siteId),
    loadBookingSettings(siteId),
  ]);
  if (!settings) {
    return NextResponse.json({ message: 'Booking settings not configured' }, { status: 400 });
  }

  const service = services.find((item) => item.id === serviceId);
  if (!service) {
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
  }

  if (!isDateWithinRange({ date, settings })) {
    return NextResponse.json({ slots: [], timezone: settings.timezone });
  }

  const bookings = await listBookings(siteId, date, date);
  const slots = generateAvailableSlots({
    date,
    service,
    settings,
    bookings,
  });

  return NextResponse.json({ slots, timezone: settings.timezone });
}

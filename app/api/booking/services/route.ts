import { NextResponse } from 'next/server';
import { getRequestSiteId } from '@/lib/content';
import { loadBookingServices } from '@/lib/booking/storage';

export async function GET() {
  const siteId = await getRequestSiteId();
  const services = await loadBookingServices(siteId);
  return NextResponse.json({
    services: services.filter((service) => service.active !== false),
  });
}

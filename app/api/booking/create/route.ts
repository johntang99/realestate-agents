import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getRequestSiteId } from '@/lib/content';
import { generateAvailableSlots, isDateWithinRange } from '@/lib/booking/availability';
import {
  addBooking,
  listBookings,
  loadBookingServices,
  loadBookingSettings,
} from '@/lib/booking/storage';
import { sendBookingEmails } from '@/lib/booking/email';
import { sendBookingSms } from '@/lib/booking/sms';
import type { BookingRecord, BookingServiceType } from '@/lib/types';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const {
    serviceId,
    date,
    time,
    name,
    phone,
    email,
    note,
    serviceType,
    pickupAddress,
    deliveryAddress,
    unitOrApt,
    zipCode,
    bags,
    estimatedWeightLb,
    addOnIds,
    requestType,
    recurringRule,
  } = payload || {};

  if (!serviceId || !date || !time || !name || !phone || !email) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
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
  if (!service || service.active === false) {
    return NextResponse.json({ message: 'Service not available' }, { status: 400 });
  }

  const allowedServiceTypes: BookingServiceType[] = [
    'appointment',
    'onsite',
    'remote',
    'delivery',
    'pickup_delivery',
    'dropoff',
    'self_service',
    'commercial',
  ];
  const rawServiceType = typeof serviceType === 'string' ? serviceType : service.serviceType;
  const effectiveServiceType = allowedServiceTypes.includes(
    rawServiceType as BookingServiceType
  )
    ? (rawServiceType as BookingServiceType)
    : undefined;
  const requiresAddress =
    service.requiresAddress ??
    (effectiveServiceType === 'pickup_delivery' ||
      effectiveServiceType === 'commercial' ||
      effectiveServiceType === 'delivery');
  const requiresZipCode = service.requiresZipCode ?? requiresAddress;

  if ((requiresAddress && !pickupAddress) || (requiresZipCode && !zipCode)) {
    return NextResponse.json(
      { message: 'Address details are required for this service type' },
      { status: 400 }
    );
  }
  if (
    requiresZipCode &&
    Array.isArray(settings.serviceAreaZips) &&
    settings.serviceAreaZips.length > 0
  ) {
    const normalizedZip = String(zipCode || '').trim();
    if (!settings.serviceAreaZips.includes(normalizedZip)) {
      return NextResponse.json(
        { message: 'Service is not available in this ZIP code yet' },
        { status: 400 }
      );
    }
  }

  if (!isDateWithinRange({ date, settings })) {
    return NextResponse.json({ message: 'Date is outside booking window' }, { status: 400 });
  }

  const bookings = await listBookings(siteId, date, date);
  const slots = generateAvailableSlots({
    date,
    service,
    settings,
    bookings,
  });

  if (!slots.includes(time)) {
    return NextResponse.json({ message: 'Time slot is no longer available' }, { status: 409 });
  }

  const now = new Date().toISOString();
  const booking: BookingRecord = {
    id: `bk_${uuid()}`,
    siteId,
    serviceId,
    date,
    time,
    durationMinutes: service.durationMinutes,
    name,
    phone,
    email,
    note: typeof note === 'string' ? note : undefined,
    serviceType: effectiveServiceType,
    pickupAddress: typeof pickupAddress === 'string' ? pickupAddress : undefined,
    deliveryAddress: typeof deliveryAddress === 'string' ? deliveryAddress : undefined,
    unitOrApt: typeof unitOrApt === 'string' ? unitOrApt : undefined,
    zipCode: typeof zipCode === 'string' ? zipCode : undefined,
    bags: Number.isFinite(Number(bags)) ? Number(bags) : undefined,
    estimatedWeightLb: Number.isFinite(Number(estimatedWeightLb))
      ? Number(estimatedWeightLb)
      : undefined,
    addOnIds: Array.isArray(addOnIds) ? addOnIds.filter((item) => typeof item === 'string') : [],
    requestType:
      requestType === 'recurring' || requestType === 'one_time' ? requestType : undefined,
    recurringRule:
      recurringRule && typeof recurringRule === 'object'
        ? (recurringRule as BookingRecord['recurringRule'])
        : undefined,
    status: 'confirmed',
    createdAt: now,
    updatedAt: now,
    details: {
      source: 'public_booking_form',
      serviceCategory: service.category || null,
      pricingModel: service.pricingModel || null,
    },
  };

  await addBooking(siteId, booking);
  await sendBookingEmails({
    booking,
    service,
    subject: 'Your booking is confirmed',
    message: 'Thank you for booking with us. Here are your appointment details:',
    adminRecipients: settings.notificationEmails || [],
  });
  await sendBookingSms({
    booking,
    service,
    message: 'Your booking is confirmed.',
    adminRecipients: settings.notificationPhones || [],
  });

  return NextResponse.json({ booking });
}

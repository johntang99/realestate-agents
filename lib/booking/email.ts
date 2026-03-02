import { Resend } from 'resend';
import type { BookingRecord, BookingService } from '@/lib/types';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function formatBookingDetails(booking: BookingRecord, service?: BookingService) {
  return [
    `Service: ${service?.name || booking.serviceId}`,
    booking.serviceType ? `Service Type: ${booking.serviceType}` : null,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    booking.pickupAddress ? `Pickup Address: ${booking.pickupAddress}` : null,
    booking.deliveryAddress ? `Delivery Address: ${booking.deliveryAddress}` : null,
    booking.zipCode ? `ZIP: ${booking.zipCode}` : null,
    booking.bags ? `Bags: ${booking.bags}` : null,
    booking.estimatedWeightLb ? `Estimated Weight (lb): ${booking.estimatedWeightLb}` : null,
    booking.addOnIds?.length ? `Add-ons: ${booking.addOnIds.join(', ')}` : null,
    booking.requestType ? `Request Type: ${booking.requestType}` : null,
    booking.note ? `Note: ${booking.note}` : null,
    `Status: ${booking.status}`,
    `Booking ID: ${booking.id}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendBookingEmails({
  booking,
  service,
  subject,
  message,
  adminRecipients,
}: {
  booking: BookingRecord;
  service?: BookingService;
  subject: string;
  message: string;
  adminRecipients?: string[];
}) {
  if (!resend || !resendFrom) {
    console.warn('Resend not configured. Missing RESEND_API_KEY or RESEND_FROM.');
    return;
  }

  const detailText = formatBookingDetails(booking, service);
  const body = `${message}\n\n${detailText}`;

  try {
    await resend.emails.send({
      from: resendFrom,
      to: booking.email,
      subject,
      text: body,
    });
  } catch (error) {
    console.warn('Client email failed:', error);
  }

  if (adminRecipients && adminRecipients.length > 0) {
    try {
      await resend.emails.send({
        from: resendFrom,
        to: adminRecipients,
        subject: `[Admin] ${subject}`,
        text: body,
      });
    } catch (error) {
      console.warn('Admin email failed:', error);
    }
  }
}

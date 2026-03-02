import twilio from 'twilio';
import type { BookingRecord, BookingService } from '@/lib/types';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsFrom = process.env.TWILIO_FROM;
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

function formatBookingSms(booking: BookingRecord, service?: BookingService) {
  const serviceName = service?.name || booking.serviceId;
  return [
    `Appointment confirmed`,
    `${serviceName}`,
    `${booking.date} ${booking.time}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    booking.note ? `Note: ${booking.note}` : null,
    `ID: ${booking.id}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendBookingSms({
  booking,
  service,
  message,
  adminRecipients,
}: {
  booking: BookingRecord;
  service?: BookingService;
  message: string;
  adminRecipients?: string[];
}) {
  if (!client || !smsFrom) {
    console.warn('Twilio not configured. Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM.');
    return;
  }

  const body = `${message}\n${formatBookingSms(booking, service)}`;

  try {
    await client.messages.create({
      from: smsFrom,
      to: booking.phone,
      body,
    });
  } catch (error) {
    console.warn('SMS send failed:', error);
  }

  if (adminRecipients && adminRecipients.length > 0) {
    try {
      await Promise.all(
        adminRecipients.map((phone) =>
          client.messages.create({
            from: smsFrom,
            to: phone,
            body: `[Admin]\n${body}`,
          })
        )
      );
    } catch (error) {
      console.warn('Admin SMS send failed:', error);
    }
  }
}

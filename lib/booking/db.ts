import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { BookingRecord, BookingService, BookingSettings } from '@/lib/types';

function isMissingRelationError(error: { code?: string; message?: string } | null | undefined, table: string) {
  if (!error) return false;
  const msg = String(error.message || '');
  return (
    error.code === 'PGRST205' ||
    msg.includes(`Could not find the table 'public.${table}'`) ||
    msg.includes(`relation "${table}" does not exist`)
  );
}

interface BookingRow {
  id: string;
  site_id: string;
  service_id: string;
  service_type?: string | null;
  date: string;
  time: string;
  duration_minutes: number;
  name: string;
  phone: string;
  email: string;
  note: string | null;
  details?: Record<string, unknown> | null;
  status: BookingRecord['status'];
  created_at: string;
  updated_at: string;
}

function mapBookingRow(row: BookingRow): BookingRecord {
  const details = row.details || {};
  return {
    id: row.id,
    siteId: row.site_id,
    serviceId: row.service_id,
    serviceType: (row.service_type as BookingRecord['serviceType']) || undefined,
    date: row.date,
    time: row.time,
    durationMinutes: row.duration_minutes,
    name: row.name,
    phone: row.phone,
    email: row.email,
    note: row.note || undefined,
    pickupAddress:
      typeof details.pickupAddress === 'string' ? (details.pickupAddress as string) : undefined,
    deliveryAddress:
      typeof details.deliveryAddress === 'string' ? (details.deliveryAddress as string) : undefined,
    unitOrApt: typeof details.unitOrApt === 'string' ? (details.unitOrApt as string) : undefined,
    zipCode: typeof details.zipCode === 'string' ? (details.zipCode as string) : undefined,
    bags: typeof details.bags === 'number' ? (details.bags as number) : undefined,
    estimatedWeightLb:
      typeof details.estimatedWeightLb === 'number'
        ? (details.estimatedWeightLb as number)
        : undefined,
    addOnIds: Array.isArray(details.addOnIds) ? (details.addOnIds as string[]) : undefined,
    requestType:
      details.requestType === 'recurring' || details.requestType === 'one_time'
        ? (details.requestType as 'one_time' | 'recurring')
        : undefined,
    recurringRule:
      details.recurringRule && typeof details.recurringRule === 'object'
        ? (details.recurringRule as BookingRecord['recurringRule'])
        : undefined,
    details: details || undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function canUseBookingDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function loadBookingServicesDb(siteId: string): Promise<BookingService[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('booking_services')
    .select('services')
    .eq('site_id', siteId)
    .maybeSingle();
  if (error) {
    if (isMissingRelationError(error, 'booking_services')) return [];
    console.error('Supabase loadBookingServicesDb error:', error);
    return [];
  }
  return (data?.services as BookingService[]) || [];
}

export async function saveBookingServicesDb(siteId: string, services: BookingService[]) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('booking_services')
    .upsert(
      {
        site_id: siteId,
        services,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id' }
    );
  if (error) {
    if (isMissingRelationError(error, 'booking_services')) return;
    console.error('Supabase saveBookingServicesDb error:', error);
  }
}

export async function loadBookingSettingsDb(
  siteId: string
): Promise<BookingSettings | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('booking_settings')
    .select('settings')
    .eq('site_id', siteId)
    .maybeSingle();
  if (error) {
    if (isMissingRelationError(error, 'booking_settings')) return null;
    console.error('Supabase loadBookingSettingsDb error:', error);
    return null;
  }
  return (data?.settings as BookingSettings) || null;
}

export async function saveBookingSettingsDb(siteId: string, settings: BookingSettings) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('booking_settings')
    .upsert(
      {
        site_id: siteId,
        settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id' }
    );
  if (error) {
    if (isMissingRelationError(error, 'booking_settings')) return;
    console.error('Supabase saveBookingSettingsDb error:', error);
  }
}

export async function listBookingsDb(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<BookingRecord[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('site_id', siteId)
    .gte('date', startDate)
    .lte('date', endDate);
  if (error) {
    console.error('Supabase listBookingsDb error:', error);
    return [];
  }
  return (data || []).map((row) => mapBookingRow(row as BookingRow));
}

export async function upsertBookingDb(siteId: string, booking: BookingRecord) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return;

  const basePayload = {
    id: booking.id,
    site_id: siteId,
    service_id: booking.serviceId,
    date: booking.date,
    time: booking.time,
    duration_minutes: booking.durationMinutes,
    name: booking.name,
    phone: booking.phone,
    email: booking.email,
    note: booking.note || null,
    status: booking.status,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  };
  const extendedPayload = {
    ...basePayload,
    service_type: booking.serviceType || null,
    details: {
      ...booking.details,
      pickupAddress: booking.pickupAddress || null,
      deliveryAddress: booking.deliveryAddress || null,
      unitOrApt: booking.unitOrApt || null,
      zipCode: booking.zipCode || null,
      bags: typeof booking.bags === 'number' ? booking.bags : null,
      estimatedWeightLb:
        typeof booking.estimatedWeightLb === 'number' ? booking.estimatedWeightLb : null,
      addOnIds: booking.addOnIds || [],
      requestType: booking.requestType || null,
      recurringRule: booking.recurringRule || null,
    },
  };

  const { error } = await supabase.from('bookings').upsert(extendedPayload, { onConflict: 'id' });
  if (!error) return;

  console.warn('Supabase upsertBookingDb extended payload failed, retrying basic payload:', error);
  const { error: retryError } = await supabase
    .from('bookings')
    .upsert(basePayload, { onConflict: 'id' });
  if (retryError) {
    console.error('Supabase upsertBookingDb retry error:', retryError);
  }
}

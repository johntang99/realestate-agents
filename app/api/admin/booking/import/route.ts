import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageBookings, requireSiteAccess } from '@/lib/admin/permissions';
import { saveBookingServicesDb, saveBookingSettingsDb, upsertBookingDb } from '@/lib/booking/db';
import type { BookingRecord, BookingService, BookingSettings } from '@/lib/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = String(payload?.siteId || '');
  if (!siteId) {
    return NextResponse.json({ message: 'siteId is required' }, { status: 400 });
  }

  try {
    requireSiteAccess(session.user, siteId);
    if (!canManageBookings(session.user)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const bookingRoot = path.join(CONTENT_DIR, siteId, 'booking');
  const servicesPath = path.join(bookingRoot, 'services.json');
  const settingsPath = path.join(bookingRoot, 'settings.json');
  const bookingsDir = path.join(bookingRoot, 'bookings');

  const services = await readJson<BookingService[]>(servicesPath, []);
  const settings = await readJson<BookingSettings | null>(settingsPath, null);

  if (services.length) {
    await saveBookingServicesDb(siteId, services);
  }
  if (settings) {
    await saveBookingSettingsDb(siteId, settings);
  }

  let importedBookings = 0;
  try {
    const bookingFiles = await fs.readdir(bookingsDir);
    for (const file of bookingFiles) {
      if (!file.endsWith('.json')) continue;
      const filePath = path.join(bookingsDir, file);
      const entries = await readJson<BookingRecord[]>(filePath, []);
      for (const booking of entries) {
        if (!booking?.id) continue;
        await upsertBookingDb(siteId, booking);
        importedBookings += 1;
      }
    }
  } catch (error) {
    // ignore missing bookings dir
  }

  return NextResponse.json({
    success: true,
    servicesImported: services.length,
    settingsImported: settings ? 1 : 0,
    bookingsImported: importedBookings,
  });
}

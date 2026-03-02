import fs from 'fs/promises';
import path from 'path';
import type { BookingRecord, BookingService, BookingSettings } from '@/lib/types';
import {
  canUseBookingDb,
  listBookingsDb,
  loadBookingServicesDb,
  loadBookingSettingsDb,
  saveBookingServicesDb,
  saveBookingSettingsDb,
  upsertBookingDb,
} from '@/lib/booking/db';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function getBookingRoot(siteId: string) {
  return path.join(CONTENT_DIR, siteId, 'booking');
}

function getServicesPath(siteId: string) {
  return path.join(getBookingRoot(siteId), 'services.json');
}

function getSettingsPath(siteId: string) {
  return path.join(getBookingRoot(siteId), 'settings.json');
}

function getBookingsDir(siteId: string) {
  return path.join(getBookingRoot(siteId), 'bookings');
}

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

function getBookingFilePath(siteId: string, monthKey: string) {
  return path.join(getBookingsDir(siteId), `${monthKey}.json`);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, payload: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2));
}

export async function loadBookingServices(siteId: string): Promise<BookingService[]> {
  if (canUseBookingDb()) {
    const services = await loadBookingServicesDb(siteId);
    if (services.length) return services;
  }
  return readJsonFile<BookingService[]>(getServicesPath(siteId), []);
}

export async function saveBookingServices(siteId: string, services: BookingService[]) {
  if (canUseBookingDb()) {
    await saveBookingServicesDb(siteId, services);
    return;
  }
  await writeJsonFile(getServicesPath(siteId), services);
}

export async function loadBookingSettings(siteId: string): Promise<BookingSettings | null> {
  if (canUseBookingDb()) {
    const settings = await loadBookingSettingsDb(siteId);
    if (settings) return settings;
  }
  return readJsonFile<BookingSettings | null>(getSettingsPath(siteId), null);
}

export async function saveBookingSettings(siteId: string, settings: BookingSettings) {
  if (canUseBookingDb()) {
    await saveBookingSettingsDb(siteId, settings);
    return;
  }
  await writeJsonFile(getSettingsPath(siteId), settings);
}

export async function loadBookingsForMonth(
  siteId: string,
  monthKey: string
): Promise<BookingRecord[]> {
  return readJsonFile<BookingRecord[]>(getBookingFilePath(siteId, monthKey), []);
}

export async function saveBookingsForMonth(
  siteId: string,
  monthKey: string,
  bookings: BookingRecord[]
) {
  await writeJsonFile(getBookingFilePath(siteId, monthKey), bookings);
}

function parseDateToUtc(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function listMonthKeysBetween(startDate: string, endDate: string) {
  const start = new Date(parseDateToUtc(startDate));
  const end = new Date(parseDateToUtc(endDate));
  const keys: string[] = [];
  const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  const last = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
  while (cursor <= last) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    keys.push(`${year}-${month}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return keys;
}

export async function listBookings(
  siteId: string,
  startDate: string,
  endDate: string
): Promise<BookingRecord[]> {
  if (canUseBookingDb()) {
    return listBookingsDb(siteId, startDate, endDate);
  }
  const monthKeys = listMonthKeysBetween(startDate, endDate);
  const all = await Promise.all(
    monthKeys.map((key) => loadBookingsForMonth(siteId, key))
  );
  return all
    .flat()
    .filter((booking) => booking.date >= startDate && booking.date <= endDate);
}

export async function addBooking(siteId: string, booking: BookingRecord) {
  if (canUseBookingDb()) {
    await upsertBookingDb(siteId, booking);
    return;
  }
  const monthKey = getMonthKey(booking.date);
  const bookings = await loadBookingsForMonth(siteId, monthKey);
  bookings.push(booking);
  await saveBookingsForMonth(siteId, monthKey, bookings);
}

export async function updateBooking(siteId: string, updated: BookingRecord) {
  if (canUseBookingDb()) {
    await upsertBookingDb(siteId, updated);
    return;
  }
  const monthKey = getMonthKey(updated.date);
  const bookings = await loadBookingsForMonth(siteId, monthKey);
  const index = bookings.findIndex((booking) => booking.id === updated.id);
  if (index === -1) {
    bookings.push(updated);
  } else {
    bookings[index] = updated;
  }
  await saveBookingsForMonth(siteId, monthKey, bookings);
}

export async function moveBooking(
  siteId: string,
  originalDate: string,
  updated: BookingRecord
) {
  if (canUseBookingDb()) {
    await upsertBookingDb(siteId, updated);
    return;
  }
  const originalKey = getMonthKey(originalDate);
  const newKey = getMonthKey(updated.date);
  if (originalKey === newKey) {
    await updateBooking(siteId, updated);
    return;
  }
  const originalBookings = await loadBookingsForMonth(siteId, originalKey);
  const filtered = originalBookings.filter((booking) => booking.id !== updated.id);
  await saveBookingsForMonth(siteId, originalKey, filtered);
  await updateBooking(siteId, updated);
}

export function getBookingMonthKey(date: string) {
  return getMonthKey(date);
}

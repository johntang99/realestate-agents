'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BookingRecord, BookingService, BookingStatus, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface BookingsManagerProps {
  sites: SiteConfig[];
  selectedSiteId: string;
}

const STATUS_OPTIONS: BookingStatus[] = ['confirmed', 'rescheduled', 'cancelled'];

function getDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function BookingsManager({ sites, selectedSiteId }: BookingsManagerProps) {
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [from, setFrom] = useState(getDateOffset(0));
  const [to, setTo] = useState(getDateOffset(30));
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [services, setServices] = useState<BookingService[]>([]);
  const [drafts, setDrafts] = useState<Record<string, BookingRecord>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedCustomerKey, setSelectedCustomerKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'customers'>('calendar');
  const [hoverCard, setHoverCard] = useState<{
    x: number;
    y: number;
    title: string;
    serviceName: string;
    status: string;
    email: string;
    phone: string;
    note?: string;
  } | null>(null);

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((service) => {
      map.set(service.id, service.name);
    });
    return map;
  }, [services]);

  const loadServices = async () => {
    if (!siteId) return;
    try {
      const response = await fetch(`/api/admin/booking/services?siteId=${siteId}`);
      if (!response.ok) return;
      const payload = await response.json();
      setServices(payload.services || []);
    } catch (error) {
      // ignore load failures
    }
  };

  const loadBookings = async () => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/admin/bookings?siteId=${siteId}&from=${from}&to=${to}`
      );
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Failed to load bookings');
      }
      const payload = await response.json();
      setBookings(payload.bookings || []);
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!siteId) return;
    const confirmed = window.confirm(
      'Import bookings (plus settings/services) from JSON files into the database?'
    );
    if (!confirmed) return;
    setImporting(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/booking/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      setStatus(
        `Imported services: ${payload.servicesImported || 0}, settings: ${
          payload.settingsImported || 0
        }, bookings: ${payload.bookingsImported || 0}.`
      );
      await loadServices();
      await loadBookings();
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    loadBookings();
    loadServices();
  }, [siteId, from, to]);

  useEffect(() => {
    const nextDrafts: Record<string, BookingRecord> = {};
    bookings.forEach((booking) => {
      nextDrafts[booking.id] = { ...booking };
    });
    setDrafts(nextDrafts);
  }, [bookings]);

  const customers = useMemo(() => {
    const map = new Map<string, { key: string; name: string; email: string; phone: string; bookings: BookingRecord[] }>();
    bookings.forEach((booking) => {
      const key = `${booking.email.toLowerCase()}|${booking.phone}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          bookings: [],
        });
      }
      map.get(key)?.bookings.push(booking);
    });
    return Array.from(map.values())
      .map((customer) => ({
        ...customer,
        bookings: [...customer.bookings].sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [bookings]);

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.key === selectedCustomerKey) || null,
    [customers, selectedCustomerKey]
  );

  const updateDraft = (id: string, updates: Partial<BookingRecord>) => {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...updates },
    }));
  };

  const saveBooking = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        booking: { ...draft, updatedAt: new Date().toISOString() },
        originalDate: bookings.find((item) => item.id === id)?.date || '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Save failed');
      return;
    }
    setStatus('Saved');
    await loadBookings();
  };

  const calendarEvents = useMemo(() => {
    return bookings.map((booking) => {
      const start = `${booking.date}T${booking.time}`;
      const duration = booking.durationMinutes || 60;
      const startDate = new Date(start);
      const endDate = new Date(startDate.getTime() + duration * 60000);
      const statusColor =
        booking.status === 'cancelled'
          ? '#9CA3AF'
          : booking.status === 'rescheduled'
            ? '#F59E0B'
            : '#16A34A';
      const serviceName = serviceNameById.get(booking.serviceId) || booking.serviceId;
      return {
        id: booking.id,
        title: `${booking.name} · ${serviceName}`,
        start,
        end: endDate.toISOString(),
        backgroundColor: statusColor,
        borderColor: statusColor,
        extendedProps: {
          serviceName,
          status: booking.status,
          email: booking.email,
          phone: booking.phone,
          note: booking.note || '',
        },
      };
    });
  }, [bookings, serviceNameById]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-600">Review and manage client bookings.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4 sm:items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500">Site</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={handleImport} disabled={importing}>
              {importing ? 'Importing…' : 'Import from JSON'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={viewMode === 'calendar' ? 'primary' : 'outline'}
          onClick={() => setViewMode('calendar')}
        >
          Calendar View
        </Button>
        <Button
          type="button"
          variant={viewMode === 'list' ? 'primary' : 'outline'}
          onClick={() => setViewMode('list')}
        >
          List View
        </Button>
        <Button
          type="button"
          variant={viewMode === 'customers' ? 'primary' : 'outline'}
          onClick={() => setViewMode('customers')}
        >
          Customers
        </Button>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && bookings.length === 0 && (
          <div className="text-sm text-gray-500">No bookings found.</div>
        )}
        {!loading && bookings.length > 0 && viewMode === 'calendar' && (
          <div className="h-[720px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              nowIndicator
              height="100%"
              events={calendarEvents}
              eventMouseEnter={(info: any) => {
                const native = info.jsEvent as MouseEvent;
                setHoverCard({
                  x: native.clientX,
                  y: native.clientY,
                  title: info.event.title,
                  serviceName: info.event.extendedProps.serviceName,
                  status: info.event.extendedProps.status,
                  email: info.event.extendedProps.email,
                  phone: info.event.extendedProps.phone,
                  note: info.event.extendedProps.note || undefined,
                });
              }}
              eventMouseLeave={() => setHoverCard(null)}
            />
          </div>
        )}
        {!loading && bookings.length > 0 && viewMode === 'list' && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const draft = drafts[booking.id];
              if (!draft) return null;
              return (
                <div key={booking.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {draft.name} · {serviceNameById.get(draft.serviceId) || draft.serviceId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {draft.email} · {draft.phone}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">ID: {draft.id}</div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div>
                      <label className="block text-xs text-gray-500">Date</label>
                      <input
                        type="date"
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={draft.date}
                        onChange={(event) => updateDraft(draft.id, { date: event.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Time</label>
                      <input
                        type="time"
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={draft.time}
                        onChange={(event) => updateDraft(draft.id, { time: event.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Status</label>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={draft.status}
                        onChange={(event) =>
                          updateDraft(draft.id, { status: event.target.value as BookingStatus })
                        }
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={() => saveBooking(draft.id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                  {draft.note && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Note:</span> {draft.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {!loading && viewMode === 'customers' && (
          <div className="space-y-2">
            {customers.length === 0 && (
              <div className="text-sm text-gray-500">No customers found.</div>
            )}
            {customers.map((customer) => (
              <button
                key={customer.key}
                type="button"
                onClick={() => setSelectedCustomerKey(customer.key)}
                className="w-full text-left rounded-lg border border-gray-100 px-3 py-3 hover:bg-gray-50"
              >
                <div className="text-sm font-semibold text-gray-900">
                  {customer.name}
                </div>
                <div className="text-xs text-gray-500">
                  {customer.email} · {customer.phone}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {customer.bookings.length} booking{customer.bookings.length === 1 ? '' : 's'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {hoverCard && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: hoverCard.x + 12, top: hoverCard.y + 12 }}
        >
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-4 w-72">
            <div className="text-sm font-semibold text-gray-900">{hoverCard.title}</div>
            <div className="text-xs text-gray-500 mt-1">{hoverCard.serviceName}</div>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <div>
                <span className="font-semibold text-gray-700">Status:</span> {hoverCard.status}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span> {hoverCard.email}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Phone:</span> {hoverCard.phone}
              </div>
              {hoverCard.note && (
                <div>
                  <span className="font-semibold text-gray-700">Note:</span> {hoverCard.note}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomerKey(null)}
        title={selectedCustomer?.name}
        description={selectedCustomer ? `${selectedCustomer.email} · ${selectedCustomer.phone}` : undefined}
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-3">
            {selectedCustomer.bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm font-semibold text-gray-900">
                    {serviceNameById.get(booking.serviceId) || booking.serviceId} · {booking.date} {booking.time}
                  </div>
                  <div className="text-xs text-gray-500">{booking.status}</div>
                </div>
                {booking.note && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">Note:</span> {booking.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

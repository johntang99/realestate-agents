'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SiteConfig } from '@/lib/types';

type InvestorInquiryRecord = {
  id: string;
  site_id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  investment_type?: string | null;
  budget_range?: string | null;
  timeline?: string | null;
  message?: string | null;
  status: string;
};

interface InvestorInquiriesManagerProps {
  sites: SiteConfig[];
  selectedSiteId: string;
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed', 'cancelled'];

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function InvestorInquiriesManager({
  sites,
  selectedSiteId,
}: InvestorInquiriesManagerProps) {
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');
  const [inquiries, setInquiries] = useState<InvestorInquiryRecord[]>([]);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadInquiries = async () => {
    if (!siteId) return;
    setLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams({ siteId, limit: '300' });
      if (statusFilter) params.set('status', statusFilter);
      if (query.trim()) params.set('q', query.trim());
      const response = await fetch(`/api/admin/investor-inquiries?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to load investor inquiries');
      const rows = Array.isArray(payload.inquiries) ? (payload.inquiries as InvestorInquiryRecord[]) : [];
      setInquiries(rows);
      const nextDrafts: Record<string, string> = {};
      rows.forEach((row) => {
        nextDrafts[row.id] = row.status || 'new';
      });
      setDraftStatuses(nextDrafts);
    } catch (error: any) {
      setMessage(error.message || 'Failed to load investor inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, statusFilter]);

  const saveStatus = async (id: string) => {
    const nextStatus = draftStatuses[id];
    if (!nextStatus) return;
    setSavingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/investor-inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, status: nextStatus }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to update inquiry');
      setInquiries((current) =>
        current.map((row) => (row.id === id ? { ...row, status: nextStatus } : row))
      );
      setMessage('Status updated.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  };

  const visibleInquiries = useMemo(() => {
    if (!query.trim()) return inquiries;
    const needle = query.trim().toLowerCase();
    return inquiries.filter((row) =>
      [row.name, row.email, row.phone || '', row.investment_type || '', row.budget_range || '']
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [inquiries, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Investor Inquiries</h1>
          <p className="text-sm text-gray-600">Track inbound investor leads and update follow-up status.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            <label className="block text-xs font-medium text-gray-500">Status</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Search</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-[320px] max-w-[55vw] rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="name, email, type, budget"
              />
              <button
                type="button"
                onClick={loadInquiries}
                className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {message}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-x-auto">
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {!loading && visibleInquiries.length === 0 && (
          <div className="text-sm text-gray-500">No investor inquiries found.</div>
        )}
        {!loading && visibleInquiries.length > 0 && (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-3 font-medium">Created</th>
                <th className="py-2 pr-3 font-medium">Lead</th>
                <th className="py-2 pr-3 font-medium">Investment</th>
                <th className="py-2 pr-3 font-medium">Timeline</th>
                <th className="py-2 pr-3 font-medium">Message</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-0 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleInquiries.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 align-top">
                  <td className="py-3 pr-3 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(row.created_at)}</td>
                  <td className="py-3 pr-3">
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.email}</p>
                    {row.phone ? <p className="text-xs text-gray-500">{row.phone}</p> : null}
                  </td>
                  <td className="py-3 pr-3">
                    <p className="text-gray-800">{row.investment_type || '—'}</p>
                    <p className="text-xs text-gray-500">{row.budget_range || '—'}</p>
                  </td>
                  <td className="py-3 pr-3 text-xs text-gray-600">{row.timeline || '—'}</td>
                  <td className="py-3 pr-3 max-w-[280px] text-xs text-gray-600">
                    <p className="line-clamp-3">{row.message || '—'}</p>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      className="rounded-md border border-gray-200 px-2 py-1 text-xs"
                      value={draftStatuses[row.id] || row.status || 'new'}
                      onChange={(event) =>
                        setDraftStatuses((current) => ({ ...current, [row.id]: event.target.value }))
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-0">
                    <button
                      type="button"
                      onClick={() => saveStatus(row.id)}
                      disabled={savingId === row.id}
                      className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {savingId === row.id ? 'Saving…' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

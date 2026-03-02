'use client';

import { useEffect, useMemo, useState } from 'react';
import type { SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';

interface MediaItem {
  id: string;
  url: string;
  path: string;
}

interface MediaManagerProps {
  sites: SiteConfig[];
  selectedSiteId: string;
}

async function parseApiError(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text) as { message?: string };
    return parsed.message || fallback;
  } catch {
    return fallback;
  }
}

export function MediaManager({ sites, selectedSiteId }: MediaManagerProps) {
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('general');
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);

  const loadMedia = async () => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/admin/media/list?siteId=${siteId}`);
      if (!response.ok) {
        const message = await parseApiError(response, 'Failed to load media');
        throw new Error(message);
      }
      const payload = await response.json();
      setItems(payload.items || []);
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [siteId]);

  const filteredItems = useMemo(() => {
    if (!search) return items;
    const term = search.toLowerCase();
    return items.filter(
      (item) =>
        item.path.toLowerCase().includes(term) || item.url.toLowerCase().includes(term)
    );
  }, [items, search]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('siteId', siteId);
    formData.append('folder', folder);
    formData.append('file', file);
    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const message = await parseApiError(response, 'Upload failed');
        throw new Error(message);
      }
      await loadMedia();
      setStatus('Uploaded');
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const confirmed = window.confirm(`Delete ${item.path}? This cannot be undone.`);
    if (!confirmed) return;
    const response = await fetch(
      `/api/admin/media/file?siteId=${siteId}&path=${encodeURIComponent(item.path)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const message = await parseApiError(response, 'Delete failed');
      setStatus(message);
      return;
    }
    await loadMedia();
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setStatus('Copied URL');
  };

  const handleImport = async () => {
    if (!siteId) return;
    const confirmed = window.confirm(
      'Sync media metadata from storage/uploads into the database?'
    );
    if (!confirmed) return;
    setImporting(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/media/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const text = await response.text();
      let payload: { imported?: number; message?: string } = {};
      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          payload = {};
        }
      }
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      setStatus(`Imported ${payload.imported || 0} media item(s).`);
      await loadMedia();
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Media</h1>
          <p className="text-sm text-gray-600">
            Upload, optimize, and organize images for each site.
          </p>
        </div>
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
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500">Search</label>
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Search by filename or URL"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-500">Upload folder</label>
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
              event.currentTarget.value = '';
            }}
          />
          <span className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50">
            {uploading ? 'Uploading…' : 'Upload Image'}
          </span>
        </label>
        <Button variant="outline" onClick={loadMedia} disabled={loading}>
          Refresh
        </Button>
        <Button variant="outline" onClick={handleImport} disabled={importing}>
          {importing ? 'Syncing…' : 'Sync media'}
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading media…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <img src={item.url} alt={item.path} className="h-full w-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <div className="text-xs text-gray-600 break-all">{item.path}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="px-2 py-1 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-sm text-gray-500">No media files found.</div>
          )}
        </div>
      )}
    </div>
  );
}

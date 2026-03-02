'use client';

import { useEffect, useMemo, useState } from 'react';

interface ImagePickerModalProps {
   open: boolean;
   siteId: string;
   onClose: () => void;
   onSelect: (url: string) => void;
}

interface MediaItem {
   id: string;
   url: string;
   path: string;
}

interface ProviderItem {
  id: string;
  previewUrl: string;
  sourceUrl: string;
  alt: string;
  author?: string;
}

type SourceTab = 'library' | 'unsplash' | 'pexels';

async function parseApiPayload(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function ImagePickerModal({ open, siteId, onClose, onSelect }: ImagePickerModalProps) {
   const [items, setItems] = useState<MediaItem[]>([]);
  const [providerItems, setProviderItems] = useState<ProviderItem[]>([]);
  const [sourceTab, setSourceTab] = useState<SourceTab>('library');
   const [query, setQuery] = useState('');
  const [folder, setFolder] = useState('all');
   const [loading, setLoading] = useState(false);
  const [providerPage, setProviderPage] = useState(1);
  const [providerTotalPages, setProviderTotalPages] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/media/list?siteId=${siteId}`);
      const payload = await parseApiPayload(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load media library');
      }
      setItems(payload.items || []);
    } catch (error: any) {
      setStatus(error?.message || 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const loadProvider = async (tab: 'unsplash' | 'pexels', page = 1) => {
    if (!query.trim()) {
      setProviderItems([]);
      setProviderTotalPages(0);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        siteId,
        provider: tab,
        query: query.trim(),
        page: String(page),
        perPage: '24',
      });
      const response = await fetch(`/api/admin/media/provider/search?${params.toString()}`);
      const payload = await parseApiPayload(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Provider search failed');
      }
      setProviderItems(payload.items || []);
      setProviderPage(Number(payload.page || page));
      setProviderTotalPages(Number(payload.totalPages || 0));
    } catch (error: any) {
      setStatus(error?.message || 'Provider search failed');
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
     if (!open) return;
    setSourceTab('library');
    setProviderItems([]);
    setProviderPage(1);
    setProviderTotalPages(0);
    setStatus(null);
    setQuery('');
    setFolder('all');
    loadLibrary();
  }, [open, siteId]);

  const folders = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const [first] = item.path.split('/');
      if (first) set.add(first);
    }
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !lower || item.path.toLowerCase().includes(lower);
      const firstFolder = item.path.split('/')[0] || '';
      const matchesFolder = folder === 'all' || firstFolder === folder;
      return matchesQuery && matchesFolder;
    });
  }, [items, query, folder]);

  const handleImportProviderImage = async (item: ProviderItem) => {
    if (sourceTab === 'library') return;
    setImportingId(item.id);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/media/provider/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          provider: sourceTab,
          sourceUrl: item.sourceUrl,
          folder: 'general',
        }),
      });
      const payload = await parseApiPayload(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      onSelect(payload.url);
      onClose();
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
    } finally {
      setImportingId(null);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setStatus(null);
    const formData = new FormData();
    formData.append('siteId', siteId);
    formData.append('folder', 'general');
    formData.append('file', file);
    try {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });
      const payload = await parseApiPayload(response);
      if (!response.ok) {
        throw new Error(payload.message || 'Upload failed');
      }
      onSelect(payload.url);
      onClose();
    } catch (error: any) {
      setStatus(error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onProviderSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (sourceTab === 'library') return;
    loadProvider(sourceTab, 1);
  };

  const renderProviderGrid = () => (
    <div className="space-y-3">
      <div className="text-xs text-gray-500">
        {providerItems.length} result{providerItems.length === 1 ? '' : 's'}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providerItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-gray-100">
              <img
                src={item.previewUrl}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3 space-y-2">
              <div className="text-xs text-gray-600 line-clamp-2">{item.alt}</div>
              {item.author && (
                <div className="text-[11px] text-gray-500">Photo by {item.author}</div>
              )}
              <button
                type="button"
                onClick={() => handleImportProviderImage(item)}
                disabled={Boolean(importingId)}
                className="px-2 py-1 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {importingId === item.id ? 'Importing…' : 'Use this image'}
              </button>
            </div>
          </div>
        ))}
        {providerItems.length === 0 && !loading && (
          <div className="text-sm text-gray-500">
            Search for images to import from {sourceTab}.
          </div>
        )}
      </div>
      {providerTotalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={providerPage <= 1 || loading}
            onClick={() => loadProvider(sourceTab as 'unsplash' | 'pexels', providerPage - 1)}
            className="px-2 py-1 rounded-md border border-gray-200 text-xs disabled:opacity-60"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">
            Page {providerPage} / {providerTotalPages}
          </span>
          <button
            type="button"
            disabled={providerPage >= providerTotalPages || loading}
            onClick={() => loadProvider(sourceTab as 'unsplash' | 'pexels', providerPage + 1)}
            className="px-2 py-1 rounded-md border border-gray-200 text-xs disabled:opacity-60"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

   if (!open) return null;

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
       <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[80vh] flex flex-col">
         <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
           <div>
            <h2 className="text-lg font-semibold">Image Picker</h2>
            <p className="text-xs text-gray-500">
              Choose from Library, Unsplash, Pexels, or upload from your computer.
            </p>
           </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-xs text-gray-700">
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
              <span className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50">
                {uploading ? 'Uploading…' : 'Upload'}
              </span>
            </label>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
            >
              Close
            </button>
          </div>
         </div>

        <div className="px-5 py-3 border-b border-gray-200 space-y-3">
          <div className="flex items-center gap-2">
            {(['library', 'unsplash', 'pexels'] as SourceTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSourceTab(tab);
                  setStatus(null);
                  if (tab === 'library') {
                    loadLibrary();
                  } else {
                    setProviderItems([]);
                    setProviderPage(1);
                    setProviderTotalPages(0);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-md text-xs border ${
                  sourceTab === tab
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'library'
                  ? 'Library'
                  : tab === 'unsplash'
                    ? 'Unsplash'
                    : 'Pexels'}
              </button>
            ))}
          </div>

          <form
            className={`grid gap-3 ${sourceTab === 'library' ? 'md:grid-cols-[1fr_220px]' : 'md:grid-cols-[1fr_auto]'}`}
            onSubmit={onProviderSearchSubmit}
          >
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder={sourceTab === 'library' ? 'Search by filename' : 'Search images'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {sourceTab === 'library' ? (
              <select
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
              >
                {folders.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry === 'all' ? 'All folders' : entry}
                  </option>
                ))}
              </select>
            ) : (
              <button
                type="submit"
                className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
              >
                Search
              </button>
            )}
          </form>
        </div>

         <div className="p-5 overflow-y-auto">
          {status && (
            <div className="mb-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
              {status}
            </div>
          )}

          {loading ? (
             <div className="text-sm text-gray-500">Loading images…</div>
          ) : sourceTab === 'library' ? (
            <div>
              <div className="mb-3 text-xs text-gray-500">
                {filtered.length} result{filtered.length === 1 ? '' : 's'}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className="border border-gray-200 rounded-lg overflow-hidden text-left hover:shadow-sm"
                  >
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={item.url}
                        alt={item.path}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-3 py-2 text-xs text-gray-600 truncate">{item.path}</div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-500">No images found.</div>
                )}
              </div>
            </div>
           ) : (
            renderProviderGrid()
           )}
         </div>
       </div>
     </div>
   );
 }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ImportSitesButton() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    const confirmed = window.confirm(
      'Import sites from content/_sites.json into the database?'
    );
    if (!confirmed) return;

    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/sites/import', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      setStatus(`Imported ${payload.imported || 0} site(s).`);
      router.refresh();
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleImport}
        disabled={loading}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
      >
        {loading ? 'Importing…' : 'Import Sites'}
      </button>
      {status && <div className="text-xs text-gray-500">{status}</div>}
    </div>
  );
}

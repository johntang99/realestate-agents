'use client';

import { useEffect, useState } from 'react';

export default function ResourcesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locale = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    fetch(`/api/content/items?locale=${locale}&directory=resources`)
      .then((r) => r.json())
      .then((res) => {
        const rows = Array.isArray(res.items) ? res.items : [];
        setItems(rows.sort((a: any, b: any) => String(b.publishDate || '').localeCompare(String(a.publishDate || ''))));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
      <div className="container-custom">
        <h1 className="font-serif text-4xl font-semibold mb-3" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          Resources
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Buyer and seller guides, checklists, and downloadable handbooks.
        </p>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-gray-500">No resources yet.</p>}
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.slug} className="bg-white rounded-xl border border-[var(--border)] p-5">
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--secondary)' }}>
                {item.category || 'Resource'}
              </p>
              <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                {item.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.excerpt || ''}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CaseStudiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const locale = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    fetch(`/api/content/items?locale=${locale}&directory=case-studies`)
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
          Case Studies
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Real examples of buyer, seller, and investment outcomes.
        </p>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-gray-500">No case studies yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article key={item.slug} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="relative aspect-[4/3]">
                {item.heroImage ? (
                  <Image src={item.heroImage} alt={item.title || ''} fill className="object-cover" sizes="33vw" />
                ) : (
                  <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--secondary)' }}>
                  {item.category || 'Case Study'}
                </p>
                <h2 className="font-serif text-lg font-semibold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.excerpt || ''}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

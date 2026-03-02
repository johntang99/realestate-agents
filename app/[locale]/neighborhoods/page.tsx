'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`)
      .then(r=>r.json()).then(res => { setNeighborhoods(Array.isArray(res.items) ? res.items : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>;

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '40vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-12 md:pb-14" style={{ minHeight: 'calc(40vh - 5rem)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Local Expertise</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Orange County Neighborhoods</h1>
            <p className="text-white/70 max-w-xl">Local knowledge that no algorithm can replicate. Explore Orange County's most sought-after communities.</p>
          </div>
        </div>
      </section>
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((nb: any) => (
              <Link key={nb.slug} href={`/${locale}/neighborhoods/${nb.slug}`}
                className="group block bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--secondary)] transition-all"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {nb.coverImage ? <Image src={nb.coverImage} alt={nb.name||''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                    : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{nb.name}</h2>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{nb.tagline}</p>
                  {nb.marketSnapshot?.medianPrice && <p className="text-xs font-semibold" style={{ color: 'var(--secondary)' }}>Median: {nb.marketSnapshot.medianPrice}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(nb.lifestyle || []).slice(0,3).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'var(--backdrop-mid)', color: 'var(--text-secondary)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 bg-white border-t border-[var(--border)]">
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Not Sure Which Neighborhood Is Right for You?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Our agents live here. We'll match you to the right community based on your priorities.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Talk to a Local Expert</Link>
        </div>
      </section>
    </>
  );
}

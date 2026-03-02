'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketReport {
  slug: string; title?: string; date?: string; area?: string;
  keyMetrics?: Array<{label:string;value:string;change:string;direction:'up'|'down'|'neutral'}>;
  body?: string;
}

export default function MarketReportsPage() {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/market-reports.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=market-reports`).then(r => r.json()),
    ]).then(([pageRes, itemsRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      const items = Array.isArray(itemsRes.items) ? itemsRes.items as MarketReport[] : [];
      setReports(items.filter(Boolean).sort((a, b) => (b.date || '').localeCompare(a.date || '')));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const latest = reports.find(r => r.slug === pageData.latestReport?.reportSlug) || reports[0];
  const archive = latest ? reports.filter(r => r.slug !== latest.slug) : reports;

  const DirectionIcon = ({ dir }: { dir: string }) =>
    dir === 'up' ? <TrendingUp className="w-3 h-3 metric-up" /> :
    dir === 'down' ? <TrendingDown className="w-3 h-3 metric-down" /> :
    <Minus className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />;

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {pageData.hero?.headline || 'Orange County Real Estate Market Reports'}
          </h1>
        </div>
      </section>

      {!loading && latest && (
        <section className="section-padding bg-white border-b border-[var(--border)]">
          <div className="container-custom">
            <span className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: 'var(--secondary)' }}>Latest Report</span>
            <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--primary)' }}>{latest.title}</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{latest.area} · {latest.date}</p>
            {latest.keyMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {latest.keyMetrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-lg border border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{m.label}</p>
                    <p className="font-serif text-xl font-semibold" style={{ color: 'var(--primary)' }}>{m.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <DirectionIcon dir={m.direction} />
                      <span className={`text-xs font-semibold ${m.direction==='up'?'metric-up':m.direction==='down'?'metric-down':''}`}>{m.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href={`/${locale}/market-reports/${latest.slug}`} className="btn-gold inline-block">
              Read Full Report →
            </Link>
          </div>
        </section>
      )}

      {archive.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>Report Archive</h2>
            <div className="space-y-3">
              {archive.map(r => (
                <Link key={r.slug} href={`/${locale}/market-reports/${r.slug}`}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <div>
                    <p className="font-semibold text-sm group-hover:text-[var(--secondary)] transition-colors" style={{ color: 'var(--primary)' }}>{r.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{r.area} · {r.date}</p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--secondary)' }}>Read →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {pageData.newsletter && (
        <section className="py-14 bg-white border-t border-[var(--border)]">
          <div className="container-custom max-w-lg mx-auto text-center">
            <h2 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--primary)' }}>
              {pageData.newsletter.headline || 'Get Monthly Market Data'}
            </h2>
            <div className="flex gap-2 mt-4">
              <input type="email" placeholder="Your email address"
                className="flex-1 border border-[var(--border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--secondary)] transition-colors" />
              <button className="btn-gold text-sm px-5">{pageData.newsletter.submitLabel || 'Subscribe'}</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

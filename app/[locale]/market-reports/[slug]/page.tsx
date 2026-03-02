'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MarketReportDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const [report, setReport] = useState<any>(null);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.split('/')[1] === 'zh' ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=market-reports/${params.slug}.json`).then(r => r.json()).then(res => {
      try { setReport(JSON.parse(res.content || 'null')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="pt-40 container-custom"><div className="animate-pulse h-8 bg-gray-100 rounded w-1/2 mb-4" /></div>;
  if (!report) return (
    <div className="pt-40 container-custom text-center">
      <p className="font-serif text-2xl mb-4" style={{ color: 'var(--primary)' }}>Report not found</p>
      <Link href={`/${locale}/market-reports`} className="text-sm underline" style={{ color: 'var(--secondary)' }}>← Market Reports</Link>
    </div>
  );

  const DirectionIcon = ({ dir }: { dir: string }) =>
    dir === 'up' ? <TrendingUp className="w-4 h-4 metric-up" /> :
    dir === 'down' ? <TrendingDown className="w-4 h-4 metric-down" /> :
    <Minus className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />;

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <Link href={`/${locale}/market-reports`} className="text-xs uppercase tracking-widest mb-4 block"
            style={{ color: 'var(--secondary)' }}>← Market Reports</Link>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2" style={{ color: 'var(--primary)' }}>{report.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{report.area} · {report.date}</p>
        </div>
      </section>

      {report.keyMetrics && (
        <section className="section-padding bg-white border-b border-[var(--border)]">
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {report.keyMetrics.map((m: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-[var(--border)]" style={{ background: 'var(--backdrop-primary)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{m.label}</p>
                  <p className="font-serif text-xl font-semibold mb-1" style={{ color: 'var(--primary)' }}>{m.value}</p>
                  <div className="flex items-center gap-1">
                    <DirectionIcon dir={m.direction} />
                    <span className={`text-xs font-semibold ${m.direction==='up'?'metric-up':m.direction==='down'?'metric-down':''}`}>{m.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          {report.body && (
            <div className="text-base leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: report.body.replace(/\n/g,'<br>').replace(/## (.*)/g,'<h2 style="font-family:var(--font-heading);font-size:1.4rem;font-weight:600;color:var(--primary);margin:2rem 0 1rem">$1</h2>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>') }} />
          )}
        </div>
      </section>

      {report.neighborhoodBreakdown?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ color: 'var(--primary)' }}>By Neighborhood</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Neighborhood','Median Price','Inventory','Days on Market'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.neighborhoodBreakdown.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[var(--border)] hover:bg-white transition-colors">
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--primary)' }}>{row.neighborhood}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{row.medianPrice}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{row.inventory}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{row.daysOnMarket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <p className="font-serif text-2xl text-white mb-3">What does this mean for you?</p>
          <p className="text-white/70 mb-6">Let's discuss what these market conditions mean for your specific situation.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Schedule a Consultation</Link>
        </div>
      </section>
    </>
  );
}

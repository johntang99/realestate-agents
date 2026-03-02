'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, School } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';

export default function NeighborhoodDetailPage() {
  const [nb, setNb] = useState<any>(null);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    const slug = window.location.pathname.split('/').pop() || '';
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r=>r.json()),
    ]).then(([nbRes, agentsRes, propsRes]) => {
      const allNbs = Array.isArray(nbRes.items) ? nbRes.items : [];
      setNb(allNbs.find((n: any) => n.slug === slug) || null);
      const allAgents = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
      setAgents(allAgents.filter((a: any) => (a.neighborhoods||[]).includes(slug)));
      const allProps = Array.isArray(propsRes.items) ? propsRes.items : [];
      setProperties(allProps.filter((p: any) => p.neighborhood === slug && p.status !== 'sold').slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>;
  if (!nb) return <div className="min-h-screen flex items-center justify-center"><p style={{ color: 'var(--text-secondary)' }}>Neighborhood not found.</p></div>;

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '55vh', background: 'var(--primary)' }}>
        {nb.coverImage && <Image src={nb.coverImage} alt={nb.name||''} fill className="object-cover opacity-35" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,39,68,0.75) 0%, rgba(26,39,68,0.3) 60%, transparent 100%)' }} />
        <div className="relative z-10 container-custom pt-6 pb-14">
          <Link href={`/${locale}/neighborhoods`} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Neighborhoods
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--secondary)' }}>{nb.region}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{nb.name}</h1>
          <p className="text-lg text-white/75 mb-6">{nb.tagline}</p>
          {nb.marketSnapshot && (
            <div className="flex flex-wrap gap-5">
              {[
                { l: 'Median Price', v: nb.marketSnapshot.medianPrice },
                { l: 'Avg Days on Market', v: nb.marketSnapshot.avgDaysOnMarket ? `${nb.marketSnapshot.avgDaysOnMarket} days` : null },
                { l: 'Active Inventory', v: nb.marketSnapshot.inventoryCount ? `${nb.marketSnapshot.inventoryCount} homes` : null },
                { l: 'YoY Change', v: nb.marketSnapshot.yoyChange },
              ].filter(s => s.v).map((s, i) => (
                <div key={i}>
                  <p className="font-serif text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{s.v}</p>
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {nb.overview && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-3xl">
            <p className="text-base leading-relaxed editorial-body">{nb.overview}</p>
            {nb.lifestyle?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {nb.lifestyle.map((tag: string) => <span key={tag} className="px-3 py-1.5 text-sm rounded-full font-medium" style={{ background: 'var(--backdrop-mid)', color: 'var(--primary)' }}>{tag}</span>)}
              </div>
            )}
          </div>
        </section>
      )}

      {nb.schools?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-6">
              <School className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
              <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Schools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nb.schools.map((s: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-[var(--border)]"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{s.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.type} · Grades {s.grades}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: 'var(--secondary)' }}>{s.rating}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {properties.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Featured Listings in {nb.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {properties.map((p: any) => (
                <Link key={p.slug} href={`/${locale}/properties/${p.slug}`}
                  className="group block bg-white border border-[var(--border)] hover:border-[var(--secondary)] rounded-xl overflow-hidden transition-all"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.coverImage && <Image src={p.coverImage} alt={p.address||''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>{p.priceDisplay||(p.price?`$${p.price.toLocaleString()}`:'')}</p>
                    <p className="text-sm" style={{ color: 'var(--primary)' }}>{p.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {agents.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Agents Who Specialize in {nb.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {agents.slice(0,3).map(a => <AgentCard key={a.slug} agent={a} locale={locale} variant="compact" />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-14" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Interested in {nb.name}?</h2>
          <p className="text-white/70 mb-6 text-sm">Talk to an agent who knows every street.</p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Contact a {nb.name} Specialist</Link>
        </div>
      </section>
    </>
  );
}

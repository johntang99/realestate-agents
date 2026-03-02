'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Maximize2 } from 'lucide-react';

interface Property {
  slug: string; address?: string; city?: string; state?: string;
  price?: number; priceDisplay?: string; status?: string; type?: string;
  beds?: number; baths?: number; sqft?: number; coverImage?: string;
  neighborhood?: string; listingAgentSlug?: string;
  soldDetails?: { soldPrice?: number; soldDate?: string; daysOnMarket?: number; saleToListRatio?: string; notes?: string };
}
interface Agent { slug: string; name?: string }
interface SiteData { stats?: Record<string, string> }

export default function SoldPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [site, setSite] = useState<SiteData>({});
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=properties`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=site.json`).then(r => r.json()),
    ]).then(([propsRes, agentsRes, siteRes]) => {
      setProperties(Array.isArray(propsRes.items) ? propsRes.items as Property[] : []);
      setAgents(Array.isArray(agentsRes.items) ? agentsRes.items as Agent[] : []);
      try { setSite(JSON.parse(siteRes.content || '{}')); } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const sold = useMemo(() => {
    let list = properties.filter(p => p.status === 'sold');
    if (agentFilter) list = list.filter(p => p.listingAgentSlug === agentFilter);
    if (typeFilter) list = list.filter(p => p.type === typeFilter);
    return list.sort((a, b) => (b.soldDetails?.soldDate || '').localeCompare(a.soldDetails?.soldDate || ''));
  }, [properties, agentFilter, typeFilter]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
    </div>
  );

  const stats = site.stats || {};

  return (
    <>
      {/* HERO + STATS */}
      <section className="relative pt-20" style={{ background: 'var(--primary)' }}>
        <div className="container-custom pt-14 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Track Record</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Sold Portfolio</h1>
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Total Sales Volume', value: stats.totalVolume || '$180M+' },
              { label: 'Transactions', value: stats.totalTransactions || '620+' },
              { label: 'Avg Sale-to-List', value: stats.saleToListRatio || '103%' },
              { label: 'Avg Days on Market', value: stats.avgDaysOnMarket ? `${stats.avgDaysOnMarket} days` : '24 days' },
            ].map((s, i) => (
              <div key={i} className="text-center px-3 py-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <p className="font-serif text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="sticky top-0 z-30 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="container-custom py-3 flex flex-wrap gap-3 items-center">
          <select value={agentFilter} onChange={e=>setAgentFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <option value="">All Agents</option>
            {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <option value="">All Types</option>
            <option value="single-family">Single Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <p className="text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>{sold.length} sold propert{sold.length !== 1 ? 'ies' : 'y'}</p>
        </div>
      </section>

      {/* SOLD GRID */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          {sold.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {sold.map(p => (
                <div key={p.slug} className="group relative overflow-hidden bg-white border border-[var(--border)] rounded-xl"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.coverImage
                      ? <Image src={p.coverImage} alt={p.address||''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" />
                      : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(139,26,26,0.75)' }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1">SOLD</p>
                        {p.soldDetails?.soldDate && <p className="text-xs">{p.soldDetails.soldDate}</p>}
                        {p.soldDetails?.saleToListRatio && <p className="text-sm font-bold mt-1">{p.soldDetails.saleToListRatio} of ask</p>}
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-bold text-white rounded" style={{ background: 'var(--status-sold)', borderRadius: 'var(--effect-badge-radius)' }}>SOLD</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>
                      {p.soldDetails?.soldPrice ? `$${p.soldDetails.soldPrice.toLocaleString()}` : p.priceDisplay || ''}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--primary)' }}>{p.address}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{p.city}, {p.state}</p>
                    {p.soldDetails?.notes && (
                      <p className="text-xs mt-1 font-medium" style={{ color: 'var(--accent)' }}>{p.soldDetails.notes}</p>
                    )}
                    {p.listingAgentSlug && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {agents.find(a=>a.slug===p.listingAgentSlug)?.name}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>No sold properties found for your filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white border-t border-[var(--border)]">
        <div className="container-custom text-center">
          <h2 className="font-serif text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
            Want results like these?
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Schedule a free consultation and we'll show you what Jin Pang Homes can achieve for your home.
          </p>
          <Link href={`/${locale}/contact`} className="btn-gold inline-block">Schedule a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}

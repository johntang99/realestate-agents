'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { trackLeadEvent } from '@/lib/leads/client';
import { TrustPromise } from '@/components/sections/TrustPromise';

export default function RelocatingPage() {
  const [d, setD] = useState<any>({});
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ name:'', email:'', phone:'', movingFrom:'', message:'' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/relocating.json`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=neighborhoods`).then(r=>r.json()),
    ]).then(([pageRes, nbRes]) => {
      try { setD(JSON.parse(pageRes.content||'{}')); } catch {}
      setNeighborhoods(Array.isArray(nbRes.items) ? nbRes.items : []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
    const source = d.leadCapture?.sourceTag || 'relocating-page';
    await trackLeadEvent({ siteId, locale, eventName: 'form_submit', source, pagePath: `/${locale}/relocating` });
    await fetch('/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        ...form,
        category:'relocate',
        locale,
        siteId,
        source,
        pagePath: `/${locale}/relocating`,
        consentAccepted: true,
        consentText: d.leadCapture?.consentText || '',
      }),
    }).catch(()=>{});
    setSubmitted(true);
  };

  const SCHOOLS = [
    { name: 'Port Jervis High School', district: 'Port Jervis UFSD', grades: '9–12', rating: '10/10' },
    { name: 'Edgemont High School', district: 'Edgemont UFSD', grades: '9–12', rating: '10/10' },
    { name: 'Middletown High School', district: 'Middletown UFSD', grades: '9–12', rating: '10/10' },
    { name: 'Ardsley High School', district: 'Ardsley UFSD', grades: '9–12', rating: '9/10' },
    { name: 'Mamaroneck High School', district: 'Mamaroneck UFSD', grades: '9–12', rating: '9/10' },
  ];
  const heroEyebrow = d.hero?.eyebrow || 'Relocating';
  const areaFacts = d.areaFacts?.items || [
    { label: 'Distance to Midtown NYC', value: '16–45 min', note: 'Via Metro-North' },
    { label: 'County Population', value: '1M+', note: 'Orange County' },
    { label: 'Top-Ranked School Districts', value: '10+', note: 'Nationally recognized' },
    { label: 'Median Household Income', value: '$110K+', note: 'Above national avg' },
  ];
  const schools = d.schools?.items || SCHOOLS;
  const relocationRoadmap = d.relocationRoadmap?.steps || [];
  const costOfLivingGuide = d.costOfLivingGuide?.items || [];
  const relocationResources = d.relocationResources?.items || [];
  const newcomerGuide = d.newcomerGuide || {};
  const leadCapture = d.leadCapture || {};
  const cta = d.cta || {};

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '50vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-12 md:pb-14" style={{ minHeight: 'calc(50vh - 5rem)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>{heroEyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {d.hero?.headline || 'Welcome to Orange County. We Know This Place.'}
            </h1>
            <p className="text-white/75 max-w-xl">{d.hero?.subline || 'Deep local knowledge. School guidance. Community insight. Your complete relocation resource.'}</p>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOOD PREVIEW */}
      {neighborhoods.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--secondary)' }}>Where to Live</p>
                <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Explore Our Neighborhoods</h2>
              </div>
              <Link href={`/${locale}/neighborhoods`} className="hidden md:flex items-center gap-2 text-sm font-semibold group" style={{ color: 'var(--secondary)' }}>
                All Neighborhoods <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {neighborhoods.slice(0,3).map((nb: any) => (
                <Link key={nb.slug} href={`/${locale}/neighborhoods/${nb.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3]">
                    {nb.coverImage && <Image src={nb.coverImage} alt={nb.name||''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,39,68,0.65) 0%, transparent 60%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-serif text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{nb.name}</h3>
                      <p className="text-white/80 text-xs">{nb.tagline}</p>
                      {nb.marketSnapshot?.medianPrice && <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--secondary)' }}>Median: {nb.marketSnapshot.medianPrice}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AREA QUICK FACTS */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Area Quick Facts</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {areaFacts.map((f: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-[var(--border)] text-center"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <p className="font-serif text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{f.value}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{f.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustPromise
        locale={locale}
        title="Why Relocating Families Trust Jin Pang Homes"
        body="We pair neighborhood-level insight with practical relocation planning, so your move is coordinated, informed, and less overwhelming."
        ctaLabel="Schedule Relocation Help"
        ctaHref="/contact"
      />

      {/* SCHOOLS */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Education</p>
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{d.schools?.title || 'Top School Districts'}</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{d.schools?.subline || "Orange County is home to some of New York's highest-rated public schools."}</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--primary)', color: 'white' }}>
                  <th className="text-left px-4 py-3 font-semibold">School</th>
                  <th className="text-left px-4 py-3 font-semibold">District</th>
                  <th className="text-center px-4 py-3 font-semibold">Grades</th>
                  <th className="text-center px-4 py-3 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s: any, i: number) => (
                  <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--primary)' }}>{s.name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.district}</td>
                    <td className="px-4 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{s.grades}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: 'var(--secondary)' }}>{s.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>Ratings from GreatSchools.org. Verify directly with school districts.</p>
        </div>
      </section>

      {(relocationRoadmap.length > 0 || costOfLivingGuide.length > 0 || relocationResources.length > 0) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {relocationRoadmap.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {d.relocationRoadmap?.headline || 'Relocation Roadmap'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {relocationRoadmap.map((step: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--secondary)' }}>{String(i + 1).padStart(2, '0')}</p>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>{step.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {costOfLivingGuide.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.costOfLivingGuide?.headline || 'Cost of Living Guide'}
                  </h3>
                  <div className="space-y-3">
                    {costOfLivingGuide.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-[var(--border)]">
                        <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {relocationResources.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.relocationResources?.headline || 'Relocation Resources'}
                  </h3>
                  <div className="space-y-3">
                    {relocationResources.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-[var(--border)]">
                        <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {newcomerGuide.headline ? (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {newcomerGuide.headline}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{newcomerGuide.subline}</p>
            <Link href={`/${locale}${newcomerGuide.ctaHref || '/contact'}`} className="btn-gold inline-flex items-center gap-2 px-7 py-3">
              {newcomerGuide.ctaLabel || 'Get Relocation Guide'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* RELOCATION FORM */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{leadCapture.headline || 'Moving to Orange County?'}</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{leadCapture.subline || "Let's find the right neighborhood for your family."}</p>
          </div>
          {submitted ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
              <p className="font-semibold" style={{ color: 'var(--primary)' }}>Thank you! A relocation specialist will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[var(--border)] space-y-4"
              style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full Name" className="calc-input" />
                <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input" />
                <input value={form.movingFrom} onChange={e=>setForm(f=>({...f,movingFrom:e.target.value}))} placeholder="Moving from (city/country)" className="calc-input" />
              </div>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us about your family's priorities — schools, commute, lifestyle…" className="calc-input w-full min-h-[80px]" />
              <button type="submit" className="btn-gold w-full py-3.5">Schedule a Relocation Consultation</button>
              {leadCapture.consentText ? <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{leadCapture.consentText}</p> : null}
            </form>
          )}
        </div>
      </section>
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            {cta.headline || 'Plan Your Move With Confidence'}
          </h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">{cta.subline || 'Talk with a relocation specialist who understands your priorities.'}</p>
          <Link href={`/${locale}${cta.primaryActionHref || '/contact'}`} className="btn-gold inline-block px-8 py-3.5">
            {cta.primaryActionLabel || 'Schedule a Relocation Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}

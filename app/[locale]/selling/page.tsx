'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { trackLeadEvent } from '@/lib/leads/client';
import { TrustPromise } from '@/components/sections/TrustPromise';

export default function SellingPage() {
  const [d, setD] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [form, setForm] = useState({ address:'', beds:'', baths:'', sqft:'', condition:'', name:'', email:'', phone:'', timeline:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/selling.json`)
      .then(r => r.json()).then(res => { try { setD(JSON.parse(res.content || '{}')); } catch {} });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const siteId = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes';
    const source = d.leadCapture?.sourceTag || 'selling-page';
    await trackLeadEvent({ siteId, locale, eventName: 'form_submit', source, pagePath: `/${locale}/selling` });
    await fetch('/api/valuation', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        ...form,
        locale,
        siteId,
        source,
        pagePath: `/${locale}/selling`,
        consentAccepted: true,
        consentText: d.leadCapture?.consentText || '',
      }),
    }).catch(()=>{});
    setSubmitted(true); setSubmitting(false);
  };

  const MARKETING = [
    { title: 'Professional Photography', desc: 'Included on every listing. Wide-angle, properly lit, staged for maximum appeal.' },
    { title: 'Drone & Video', desc: 'Aerial photography and video walkthroughs for properties that benefit from elevated views.' },
    { title: 'MLS + Portal Syndication', desc: 'Listed on every major platform — Zillow, Realtor.com, Compass, StreetEasy, and more.' },
    { title: 'Social Media Campaigns', desc: 'Targeted social ads reaching qualified buyers in Orange County, NY and the NYC metro area.' },
    { title: 'Agent Network', desc: 'Immediate exposure to our full agent network and their active buyer clients.' },
    { title: 'Open House Strategy', desc: 'Broker preview + public open house when appropriate, with staged presentation.' },
  ];
  const heroEyebrow = d.hero?.eyebrow || 'Selling';
  const stats = d.proofStats?.items || [{ v: '103%', l: 'Avg Sale-to-List' }, { v: '24 days', l: 'Avg DOM' }, { v: '620+', l: 'Homes Sold' }];
  const marketing = d.marketingPlan?.items || MARKETING;
  const process = d.sellingProcess?.steps || ['Consultation', 'Pricing Strategy', 'Home Prep', 'List & Market', 'Offers & Negotiate', 'Close'];
  const objections = d.objections?.items || [];
  const sellerTestimonials = d.sellerTestimonials?.items || [];
  const whatWeDo = d.whatWeDoForSellers?.items || [];
  const timingAdvice = d.timingAdvice?.items || [];
  const stagingTips = d.stagingTips?.items || [];
  const supportResources = d.supportResources?.items || [];
  const sellerGuide = d.sellerGuide || {};
  const downloadablePackage = d.downloadablePackage || {};
  const cta = d.cta || {};
  const leadCapture = d.leadCapture || {};

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '52vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-12 md:pb-16" style={{ minHeight: 'calc(52vh - 5rem)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>{heroEyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {d.hero?.headline || 'We Sell Homes Faster and For More.'}
            </h1>
            <div className="flex gap-6 mb-7">
              {stats.map((s: any, i: number) => (
                <div key={i}>
                  <p className="font-serif text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{s.value || s.v}</p>
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{s.label || s.l}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/home-valuation`} className="btn-gold px-7 py-3" onClick={() => trackLeadEvent({ siteId: process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || 'jinpanghomes', locale, eventName: 'cta_click', source: 'selling-page', pagePath: `/${locale}/selling`, metadata: { cta: 'home-valuation' } })}>Get My Home's Value</Link>
              <Link href={`/${locale}/contact`} className="border-2 border-white text-white hover:bg-white/10 transition-colors px-7 py-3 text-sm font-semibold"
                style={{ borderRadius: 'var(--effect-button-radius)' }}>Talk to a Listing Agent</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING PLAN */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Our Marketing</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {d.marketingPlan?.title || 'How We Market Your Home'}
            </h2>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {d.marketingPlan?.subline || "Most agents list your home on the MLS and wait. We run a full marketing campaign — here's exactly what that means."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketing.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc || item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {whatWeDo.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {d.whatWeDoForSellers?.headline || 'What We Do for Sellers'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {whatWeDo.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-xl border border-[var(--border)] bg-white" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SELLER CONCERNS */}
      {objections.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Common Questions</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                Seller Concerns, Clearly Answered
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {objections.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustPromise
        locale={locale}
        title="Why Sellers Trust Jin Pang Homes to Maximize Their Outcome"
        body="We combine pricing discipline, marketing execution, and negotiation strategy so you can sell with more certainty and less stress."
        ctaLabel="Book a Listing Consultation"
        ctaHref="/contact"
      />

      {/* HOME VALUATION FORM */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Free Valuation</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{leadCapture.headline || 'What Is Your Home Worth?'}</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{leadCapture.subline || 'A local agent will prepare your personalized valuation report within 24 hours.'}</p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
            {submitted ? (
              <div className="text-center py-8">
                <p className="font-serif text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Your valuation is being prepared!</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>A local agent will contact you within 24 hours with your personalized home value report.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} placeholder="Property Address" className="calc-input w-full" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input value={form.beds} onChange={e=>setForm(f=>({...f,beds:e.target.value}))} placeholder="Bedrooms" className="calc-input" />
                  <input value={form.baths} onChange={e=>setForm(f=>({...f,baths:e.target.value}))} placeholder="Bathrooms" className="calc-input" />
                  <input value={form.sqft} onChange={e=>setForm(f=>({...f,sqft:e.target.value}))} placeholder="Approx Sq Ft" className="calc-input" />
                </div>
                <select value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))} className="calc-input w-full">
                  <option value="">Property Condition</option>
                  <option value="excellent">Excellent — move-in ready</option>
                  <option value="good">Good — minor updates needed</option>
                  <option value="fair">Fair — needs some work</option>
                  <option value="needs-work">Needs significant renovation</option>
                </select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your Name" className="calc-input" />
                  <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" className="calc-input" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="Phone (optional)" className="calc-input" />
                  <select value={form.timeline} onChange={e=>setForm(f=>({...f,timeline:e.target.value}))} className="calc-input">
                    <option value="">Timeline to sell</option>
                    <option value="asap">ASAP</option>
                    <option value="3months">Within 3 months</option>
                    <option value="6months">Within 6 months</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting} className="btn-gold w-full py-3.5 font-semibold">
                  {submitting ? 'Sending…' : 'Get My Free Valuation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SELLER TESTIMONIALS */}
      {sellerTestimonials.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Results</p>
              <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                What Sellers Say About Working With Us
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellerTestimonials.map((item: any, i: number) => (
                <div key={i} className="p-6 border border-[var(--border)] rounded-xl" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <blockquote className="font-serif text-lg leading-relaxed mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    "{item.quote}"
                  </blockquote>
                  <p className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>{item.name}</p>
                  {item.context ? (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.context}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(sellerGuide.headline || downloadablePackage.headline) && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellerGuide.headline ? (
                <div className="p-6 rounded-xl border border-[var(--border)] bg-white" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-serif text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {sellerGuide.headline}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{sellerGuide.subline}</p>
                  <Link href={`/${locale}${sellerGuide.ctaHref || '/contact'}`} className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 text-sm">
                    {sellerGuide.ctaLabel || 'Get Seller Guide'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : null}
              {downloadablePackage.headline ? (
                <div className="p-6 rounded-xl border border-[var(--border)] bg-white" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-serif text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {downloadablePackage.headline}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{downloadablePackage.subline}</p>
                  <Link href={`/${locale}${downloadablePackage.ctaHref || '/contact'}`} className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 text-sm">
                    {downloadablePackage.ctaLabel || 'Request Prep Package'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* SELLING PROCESS */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>The Selling Process</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
            {process.map((step: string, i: number) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3" style={{ background: 'var(--secondary)' }}>{i+1}</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(timingAdvice.length > 0 || stagingTips.length > 0 || supportResources.length > 0) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {timingAdvice.length > 0 && (
              <div className="mb-10">
                <h2 className="font-serif text-2xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {d.timingAdvice?.headline || 'Should You Sell Now?'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {timingAdvice.map((item: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                      <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stagingTips.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.stagingTips?.headline || 'Staging and Prep Tips'}
                  </h3>
                  <div className="space-y-2">
                    {stagingTips.map((tip: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {supportResources.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.supportResources?.headline || 'Seller Support Resources'}
                  </h3>
                  <div className="space-y-3">
                    {supportResources.map((item: any, i: number) => (
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

      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{cta.headline || 'Ready to Sell?'}</h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">{cta.subline || 'Schedule a free listing consultation — no obligation, just expert advice.'}</p>
          <Link href={`/${locale}${cta.primaryActionHref || '/contact'}`} className="btn-gold inline-block px-8 py-3.5">{cta.primaryActionLabel || 'Schedule a Listing Consultation'}</Link>
          {leadCapture.consentText ? <p className="text-xs mt-3" style={{ color: 'var(--text-on-dark-muted)' }}>{leadCapture.consentText}</p> : null}
        </div>
      </section>
    </>
  );
}

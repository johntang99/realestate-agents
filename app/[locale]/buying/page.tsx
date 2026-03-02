'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TrustPromise } from '@/components/sections/TrustPromise';
import { MortgageCalculator } from '@/components/ui/MortgageCalculator';

const DEFAULT_STEPS = [
  { number: '01', name: 'Get Pre-Approved', description: 'Secure a mortgage pre-approval before you search. In Orange County, NY, sellers expect it.' },
  { number: '02', name: 'Define Your Search', description: 'School district, commute, lifestyle, budget — we help you prioritize what matters most.' },
  { number: '03', name: 'Tour Properties', description: 'We schedule showings, including off-market properties not yet on the MLS.' },
  { number: '04', name: 'Make an Offer', description: 'We craft a competitive offer strategy and negotiate on your behalf.' },
  { number: '05', name: 'Inspection Period', description: 'Home inspection, attorney review, and due diligence — we guide every step.' },
  { number: '06', name: 'Closing Day', description: 'We coordinate with attorneys and lenders to get you to the closing table smoothly.' },
];

const FAQ_ITEMS = [
  { q: "Do I need a buyer's agent?", a: "In New York, buyer representation is strongly recommended. Your agent's commission is typically paid by the seller — so you get expert representation at no cost to you." },
  { q: "How long does it take to buy a home in Orange County, NY?", a: "From accepted offer to closing typically takes 60–90 days. The search itself varies — some buyers find the right home in 2 weeks, others take 6 months." },
  { q: "What's the difference between pre-qualification and pre-approval?", a: "Pre-qualification is a quick estimate. Pre-approval involves a full lender review and is required to be taken seriously as a buyer in this market." },
  { q: "Can I buy and sell at the same time?", a: "Yes — it requires careful coordination. We specialize in synchronized buy/sell transactions and can structure contingencies to protect you." },
  { q: "What are typical closing costs for buyers in New York?", a: "Budget 2–4% of the purchase price. This includes attorney fees, lender fees, title insurance, and transfer taxes (varies by town and price point)." },
];

export default function BuyingPage() {
  const [d, setD] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showingForm, setShowingForm] = useState({ name: '', email: '', phone: '', areas: '', timeline: '' });
  const [showingSubmitting, setShowingSubmitting] = useState(false);
  const [showingDone, setShowingDone] = useState(false);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/buying.json`)
      .then(r => r.json()).then(res => { try { setD(JSON.parse(res.content || '{}')); } catch {} });
  }, []);

  const heroEyebrow = d.hero?.eyebrow || 'Buying';
  const heroVariant = d.hero?.variant || 'centered';
  const heroImage = typeof d.hero?.image === 'string' ? d.hero.image : '';
  const usePhotoBackground = heroVariant === 'photo-background' && heroImage.trim().length > 0;
  const parsedHeroHeightVh = Number(d.hero?.heightVh);
  const heroHeightVh =
    Number.isFinite(parsedHeroHeightVh) && parsedHeroHeightVh > 0
      ? Math.min(95, Math.max(52, parsedHeroHeightVh))
      : 82;
  const heroOverlayOpacity =
    typeof d.hero?.overlayOpacity === 'number'
      ? Math.max(0, Math.min(0.9, d.hero.overlayOpacity))
      : 0.45;
  const whyItems = d.whyBuyWithUs?.items || [
    { heading: 'Deep Local Expertise', description: 'We know every school district, street, and micro-market in Orange County, NY.' },
    { heading: 'Off-Market Access', description: 'Our agent network surfaces properties before they hit the MLS.' },
    { heading: 'Proven Negotiation', description: '103% average sale-to-list ratio — we know how to win the right way.' },
    { heading: 'First-Time Buyer Guidance', description: 'Patient, thorough guidance through every step for first-time buyers.' },
    { heading: 'Competitive Strategy', description: 'In multiple-offer situations, our clients win more often than not.' },
    { heading: 'No Buyer Agent Fee*', description: 'Your buyer representation is typically paid by the seller under standard New York practice.' },
  ];
  const processSteps = d.process?.steps || DEFAULT_STEPS;
  const faqItems = d.faq?.items || FAQ_ITEMS;
  const successStories = d.successStories?.items || [];
  const buyerGuides = d.buyerGuides?.items || [];
  const mistakesToAvoid = d.mistakesToAvoid?.items || [];
  const financingEducation = d.financingEducation?.items || [];
  const newToAreaResources = d.newToAreaResources?.items || [];
  const vendorTips = d.vendorTips?.items || [];
  const cta = d.cta || {};
  const leadCapture = d.leadCapture || {};
  const showingRequest = d.showingRequest || {};

  const handleShowingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowingSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: showingForm.name,
          email: showingForm.email,
          phone: showingForm.phone,
          category: 'buy',
          locale,
          message: `Buyer showing request. Areas: ${showingForm.areas || 'N/A'}. Timeline: ${showingForm.timeline || 'N/A'}.`,
          source: showingRequest.sourceTag || 'buying-showing-request',
        }),
      });
      setShowingDone(true);
    } catch {
      // Keep UX simple: the main contact page remains available.
    }
    setShowingSubmitting(false);
  };

  return (
    <>
      {/* HERO */}
      <section
        className="relative pt-20 overflow-hidden"
        style={{
          minHeight: usePhotoBackground ? `${heroHeightVh}vh` : '52vh',
          background: usePhotoBackground ? undefined : 'var(--primary)',
        }}
      >
        {usePhotoBackground && (
          <>
            <div
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url("${heroImage}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top right, rgba(26,39,68,${heroOverlayOpacity}) 0%, rgba(26,39,68,0.18) 55%, rgba(26,39,68,0.08) 100%)`,
              }}
            />
          </>
        )}
        <div
          className="container-custom relative z-10 flex items-end pb-12 md:pb-16"
          style={{ minHeight: usePhotoBackground ? `calc(${heroHeightVh}vh - 5rem)` : undefined }}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>{heroEyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {d.hero?.headline || 'Find Your Perfect Home in Orange County, NY'}
            </h1>
            <p className="text-lg text-white/75 mb-8 max-w-xl">{d.hero?.subline || 'Expert buyer representation. Off-market access. Proven negotiation.'}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}${leadCapture.secondaryActionHref || '/properties'}`} className="btn-gold px-7 py-3">{leadCapture.secondaryActionLabel || 'Search Properties'}</Link>
              <Link href={`/${locale}${leadCapture.primaryActionHref || '/team'}`} className="border-2 border-white text-white hover:bg-white/10 transition-colors px-7 py-3 text-sm font-semibold"
                style={{ borderRadius: 'var(--effect-button-radius)' }}>Talk to a Buyer's Agent</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY BUY WITH US */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Why Jin Pang Homes</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              Why Buy With Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyItems.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.heading}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustPromise
        locale={locale}
        title="Why Buyers Trust Jin Pang Homes With Their Next Move"
        body="From financing prep to negotiation and closing, we help you avoid costly mistakes and make confident decisions in competitive markets."
        ctaLabel="Talk to a Buyer's Agent"
        ctaHref={leadCapture.primaryActionHref || '/team'}
      />

      {successStories.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {d.successStories?.headline || 'Buyer Success Stories'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {successStories.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--primary)' }}>{item.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BUYING PROCESS */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>The Process</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>How Buying Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                <p className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)' }}>{step.number}</p>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>{step.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORTGAGE CALCULATOR */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-center" style={{ color: 'var(--secondary)' }}>Tools</p>
          <MortgageCalculator defaultPrice="" />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Questions</p>
            <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Buyer FAQ</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden"
                style={{ borderRadius: 'var(--effect-card-radius)' }}>
                <button className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {(buyerGuides.length > 0 || mistakesToAvoid.length > 0 || financingEducation.length > 0 || newToAreaResources.length > 0 || vendorTips.length > 0) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {buyerGuides.length > 0 && (
              <div className="mb-10">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.buyerGuides?.headline || 'Buyer Guide Library'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {buyerGuides.map((item: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                      <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>{item.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link href={`/${locale}${d.buyerGuides?.ctaHref || '/contact'}`} className="btn-gold inline-flex items-center gap-2 px-7 py-3 text-sm">
                    {d.buyerGuides?.ctaLabel || 'Request Buyer Guides'} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mistakesToAvoid.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.mistakesToAvoid?.headline || 'Common Mistakes to Avoid'}
                  </h3>
                  <div className="space-y-2">
                    {mistakesToAvoid.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {financingEducation.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {d.financingEducation?.headline || 'Financing Education'}
                  </h3>
                  <div className="space-y-2">
                    {financingEducation.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--secondary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {(newToAreaResources.length > 0 || vendorTips.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {newToAreaResources.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                      {d.newToAreaResources?.headline || 'New to the Area Resources'}
                    </h3>
                    <div className="space-y-3">
                      {newToAreaResources.map((item: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-[var(--border)]">
                          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {vendorTips.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                      {d.vendorTips?.headline || 'Trusted Vendor Connections'}
                    </h3>
                    <div className="space-y-3">
                      {vendorTips.map((item: any, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-[var(--border)]">
                          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SHOWING REQUEST */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Request a Tour</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {showingRequest.headline || 'Plan Your Private Showings'}
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {showingRequest.subline || 'Tell us what you want to see and we will build a showing plan around your schedule.'}
            </p>
          </div>
          <div className="bg-white p-7 rounded-2xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
            {showingDone ? (
              <div className="text-center py-8">
                <p className="font-serif text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  Request received!
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  A buyer specialist will follow up shortly to coordinate showings.
                </p>
              </div>
            ) : (
              <form onSubmit={handleShowingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input required value={showingForm.name} onChange={e => setShowingForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" className="calc-input" />
                  <input required type="email" value={showingForm.email} onChange={e => setShowingForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" className="calc-input" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={showingForm.phone} onChange={e => setShowingForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone (optional)" className="calc-input" />
                  <input value={showingForm.timeline} onChange={e => setShowingForm(f => ({ ...f, timeline: e.target.value }))} placeholder="Timeline (e.g. 30-60 days)" className="calc-input" />
                </div>
                <textarea value={showingForm.areas} onChange={e => setShowingForm(f => ({ ...f, areas: e.target.value }))} placeholder="Preferred neighborhoods, must-haves, or listing links" className="calc-input w-full min-h-[110px]" />
                <button type="submit" disabled={showingSubmitting} className="btn-gold w-full py-3.5 font-semibold">
                  {showingSubmitting ? 'Submitting…' : (showingRequest.ctaLabel || 'Request Showings')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{cta.headline || 'Ready to Start Your Search?'}</h2>
          <p className="text-white/70 mb-7 max-w-md mx-auto">{cta.subline || "Let's find you a buyer's agent who specializes in exactly what you're looking for."}</p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link href={`/${locale}${leadCapture.primaryActionHref || '/team'}`} className="btn-gold px-8 py-3.5">{leadCapture.primaryActionLabel || "Find a Buyer's Agent"}</Link>
            <Link href={`/${locale}${leadCapture.secondaryActionHref || '/properties'}`} className="border-2 border-white text-white hover:bg-white/10 transition-colors px-8 py-3.5 text-sm font-semibold"
              style={{ borderRadius: 'var(--effect-button-radius)' }}>Browse Properties</Link>
          </div>
          {leadCapture.consentText ? (
            <p className="text-xs mt-3" style={{ color: 'var(--text-on-dark-muted)' }}>{leadCapture.consentText}</p>
          ) : null}
        </div>
      </section>
    </>
  );
}

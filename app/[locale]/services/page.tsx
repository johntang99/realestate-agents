'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/services.json`).then(r => r.json()).then(res => {
      try { setPageData(JSON.parse(res.content || '{}')); } catch {}
    });
  }, []);

  const d = pageData;

  // Reusable service section renderer
  const ServiceSection = ({ section, id, reverse = false }: { section: any; id: string; reverse?: boolean }) => {
    if (!section?.title) return null;
    return (
      <section id={id} className="section-padding border-b border-[var(--border)]" style={{ background: reverse ? 'var(--backdrop-primary)' : 'white' }}>
        <div className="container-custom">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
            <div className={reverse ? 'md:order-2' : ''}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Services</p>
              <h2 className="font-serif text-3xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>{section.title}</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{section.body}</p>

              {/* Steps (buying) */}
              {section.steps?.length > 0 && (
                <div className="space-y-3 mb-6">
                  {section.steps.map((step: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'var(--secondary)' }}>{step.number || i + 1}</div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{step.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Marketing highlights (selling) */}
              {section.marketingHighlights?.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {section.marketingHighlights.map((h: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      {h.title}
                    </div>
                  ))}
                </div>
              )}

              {/* Capabilities list */}
              {(section.capabilities || section.propertyTypes)?.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {(section.capabilities || section.propertyTypes).map((item: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      {item.text || item}
                    </li>
                  ))}
                </ul>
              )}

              {section.ctaLabel && section.ctaHref && (
                <Link href={`/${locale}${section.ctaHref}`} className="btn-gold inline-block text-sm">
                  {section.ctaLabel}
                </Link>
              )}
            </div>
            <div className={reverse ? 'md:order-1' : ''}>
              {section.image ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--card-shadow)' }}>
                  <Image src={section.image} alt={section.imageAlt || section.title} fill className="object-cover" sizes="50vw" />
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--primary)', opacity: 0.08, borderRadius: 'var(--card-radius)' }} />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 min-h-[45vh] flex items-end" style={{ background: 'var(--primary)' }}>
        {d.hero?.image && (
          <Image src={d.hero.image} alt={d.hero.imageAlt || ''} fill className="object-cover opacity-30" priority />
        )}
        <div className="relative z-10 container-custom pb-16 pt-20">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Services</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3">
            {d.hero?.headline || 'Full-Service Real Estate'}
          </h1>
          <p className="text-lg text-white/70 max-w-xl">{d.hero?.subline}</p>
        </div>
      </section>

      <ServiceSection section={d.buyingServices} id="buying" />
      <ServiceSection section={d.sellingServices} id="selling" reverse />
      <ServiceSection section={d.leasingServices} id="leasing" />
      <ServiceSection section={d.commercialServices} id="commercial" reverse />
      <ServiceSection section={d.investmentServices} id="investment" />
      <ServiceSection section={d.relocationServices} id="relocation" reverse />

      {/* Process timeline */}
      {d.process?.steps?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-10 text-center" style={{ color: 'var(--primary)' }}>
              {d.process?.headline || 'Your Journey With Me'}
            </h2>
            {/* Desktop horizontal */}
            <div className="hidden md:flex items-start gap-0">
              {d.process.steps.map((step: any, i: number) => (
                <div key={i} className="flex-1 relative text-center px-4">
                  {i < d.process.steps.length - 1 && (
                    <div className="absolute top-5 left-1/2 w-full h-px" style={{ background: 'var(--border)' }} />
                  )}
                  <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-3"
                    style={{ background: 'var(--secondary)' }}>{step.number || i + 1}</div>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--primary)' }}>{step.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              ))}
            </div>
            {/* Mobile vertical */}
            <div className="md:hidden space-y-4">
              {d.process.steps.map((step: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'var(--secondary)' }}>{step.number || i + 1}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{step.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4">
            {d.cta?.headline || 'Which service do you need? Let\'s talk.'}
          </h2>
          <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block mt-2">
            {d.cta?.ctaLabel || 'Schedule a Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}

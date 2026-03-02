'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ExternalLink } from 'lucide-react';

export default function PressPage() {
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    fetch(`/api/content/file?locale=${loc}&path=pages/press.json`).then(r => r.json()).then(res => {
      try { setPageData(JSON.parse(res.content || '{}')); } catch {}
    });
  }, []);

  const d = pageData;

  return (
    <>
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Recognition</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold" style={{ color: 'var(--primary)' }}>
            {d.hero?.headline || 'Awards & Recognition'}
          </h1>
        </div>
      </section>

      {/* Awards */}
      {d.awards?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>Awards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {d.awards.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-5 border border-[var(--border)] rounded-xl">
                  <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {item.organization} · {item.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Press */}
      {d.press?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-primary)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>Press Features</h2>
            <div className="space-y-4 max-w-3xl">
              {d.press.map((item: any, i: number) => (
                <div key={i} className="flex items-start justify-between gap-4 p-5 bg-white border border-[var(--border)] rounded-xl">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--secondary)' }}>{item.publication}</p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.date}</p>
                  </div>
                  {item.url && item.url !== '#' && (
                    <a href={item.url} target="_blank" rel="noreferrer"
                      className="flex-shrink-0 hover:opacity-70 transition-opacity mt-0.5"
                      style={{ color: 'var(--secondary)' }}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Designations */}
      {d.designations?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="font-serif text-2xl font-semibold mb-8" style={{ color: 'var(--primary)' }}>Professional Designations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
              {d.designations.map((item: any, i: number) => (
                <div key={i} className="p-5 border border-[var(--border)] rounded-xl">
                  <p className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--secondary)' }}>{item.abbreviation}</p>
                  <p className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>{item.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
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
            {d.cta?.headline || 'Work with an award-winning agent.'}
          </h2>
          <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block mt-2">
            {d.cta?.ctaLabel || 'Schedule a Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}

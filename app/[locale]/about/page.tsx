'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Heart, Shield, MapPin } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';
import { TrustPromise } from '@/components/sections/TrustPromise';

const ICON_MAP: Record<string, React.ElementType> = { Heart, Shield, MapPin, Award };

export default function AboutPage() {
  const [d, setD] = useState<any>({});
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/about.json`).then(r => r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r => r.json()),
    ]).then(([pageRes, agentsRes]) => {
      try { setD(JSON.parse(pageRes.content || '{}')); } catch {}
      const raw = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
      setAgents(raw.sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const leadership = agents.filter(a => ['principal_broker', 'managing_broker', 'director'].includes((a as any).role || ''));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--backdrop-light)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <>
      {/* 1. HERO */}
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '52vh', background: 'var(--primary)' }}>
        {d.hero?.image && <Image src={d.hero.image} alt={d.hero.imageAlt || ''} fill className="object-cover opacity-30" priority />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,39,68,0.7) 0%, rgba(26,39,68,0.3) 60%, transparent 100%)' }} />
        <div className="relative z-10 container-custom flex items-end pb-12 md:pb-16" style={{ minHeight: 'calc(52vh - 5rem)' }}>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>About Us</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-heading)', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {d.hero?.headline || 'About Jin Pang Homes'}
            </h1>
            <p className="text-lg text-white/75">{d.hero?.subline}</p>
          </div>
        </div>
      </section>

      {/* 2. COMPANY STORY */}
      {d.story?.blocks?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            {d.story.headline && (
              <div className="mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Our Story</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{d.story.headline}</h2>
                <div className="w-12 h-0.5 mt-4" style={{ background: 'var(--secondary)' }} />
              </div>
            )}
            <div className="space-y-16">
              {d.story.blocks.map((block: any, i: number) => (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    {block.image ? (
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ boxShadow: 'var(--photo-shadow)' }}>
                        <Image src={block.image} alt={block.imageAlt || ''} fill className="object-cover" sizes="50vw" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] rounded-xl" style={{ background: 'var(--backdrop-mid)' }} />
                    )}
                  </div>
                  <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}>{block.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. MISSION & VALUES */}
      {d.values?.items?.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>What Guides Us</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {d.values.headline || 'Our Mission & Values'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {d.values.items.map((item: any, i: number) => {
                const Icon = ICON_MAP[item.icon] || Heart;
                return (
                  <div key={i} className="p-7 bg-white rounded-xl border border-[var(--border)]"
                    style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--backdrop-mid)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{item.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <TrustPromise
        locale={locale}
        title="Why Clients Trust Jin Pang Homes's Advice"
        body="Our recommendations are grounded in local market reality, not sales pressure. We focus on clarity, accountability, and long-term outcomes."
        ctaLabel="Start With a Consultation"
        ctaHref="/contact"
      />

      {/* 3B. DIFFERENTIATORS */}
      {d.differentiators?.items?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Why Choose Us</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {d.differentiators.headline || 'Our Differentiators'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {d.differentiators.items.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-serif text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. BY THE NUMBERS */}
      {d.stats?.items?.length > 0 && (
        <section className="py-16" style={{ background: 'var(--backdrop-dark)' }}>
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--secondary)' }}>By the Numbers</p>
              <h2 className="font-serif text-2xl text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{d.stats.headline || 'The Track Record'}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              {d.stats.items.map((item: any, i: number) => (
                <div key={i} className="px-2">
                  <p className="font-serif text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--secondary)' }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PRINCIPAL BROKER / BROKER WELCOME */}
      {d.principalBroker && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden max-w-sm mx-auto md:mx-0"
                style={{ boxShadow: 'var(--photo-shadow)' }}>
                {d.principalBroker.photo
                  ? <Image src={d.principalBroker.photo} alt={d.principalBroker.headline || 'Principal Broker'} fill className="object-cover object-top" sizes="50vw" />
                  : <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white/30"
                      style={{ background: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                      {(d.principalBroker.headline || 'P').charAt(0)}
                    </div>}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Message from the Broker</p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {d.principalBroker.headline}
                </h2>
                <p className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-secondary)' }}>{d.principalBroker.title}</p>
                <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}>{d.principalBroker.bio}</p>
                {d.principalBroker.credentials?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {d.principalBroker.credentials.map((c: string, i: number) => (
                      <span key={i} className="px-3 py-1 text-xs font-medium rounded-full border" style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>{c}</span>
                    ))}
                  </div>
                )}
                {d.principalBroker.ctaHref && (
                  <Link href={`/${locale}${d.principalBroker.ctaHref}`} className="inline-flex items-center gap-2 font-semibold group" style={{ color: 'var(--secondary)' }}>
                    {d.principalBroker.ctaLabel || 'Meet Our Team'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. LEADERSHIP TEAM */}
      {leadership.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Leadership</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Meet the Leadership Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {leadership.map(a => <AgentCard key={a.slug} agent={a} locale={locale} variant="detailed" />)}
            </div>
            <div className="text-center mt-8">
              <Link href={`/${locale}/team`} className="btn-gold inline-block">Meet All Our Agents</Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. AWARDS */}
      {d.awards?.items?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Recognition</p>
              <h2 className="font-serif text-3xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                {d.awards.headline || 'Awards & Recognition'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {d.awards.items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 border border-[var(--border)] rounded-xl"
                  style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <Award className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--secondary)' }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.organization} · {item.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. COMMUNITY */}
      {d.community?.body && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Community</p>
            <h2 className="font-serif text-3xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {d.community.headline || 'Community Involvement'}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.85' }}>{d.community.body}</p>
          </div>
        </section>
      )}

      {/* 9. AGENT TESTIMONIALS (recruitment-facing) */}
      {d.agentTestimonials?.items?.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>From Our Agents</p>
              <h2 className="font-serif text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>What Our Agents Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {d.agentTestimonials.items.map((item: any, i: number) => (
                <div key={i} className="p-6 border border-[var(--border)] rounded-xl" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <blockquote className="font-serif text-lg leading-relaxed mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                    "{item.quote}"
                  </blockquote>
                  <p className="text-sm font-semibold" style={{ color: 'var(--secondary)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.tenure}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. DUAL CTA */}
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl border border-white/10 text-center" style={{ borderRadius: 'var(--effect-card-radius)', background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>For Buyers & Sellers</p>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                {d.cta?.headline || "Let's Work Together"}
              </h3>
              <p className="text-white/70 text-sm mb-6">{d.cta?.subline || "Buying, selling, or investing — we're ready to help."}</p>
              <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block">
                {d.cta?.ctaLabel || 'Contact Us'}
              </Link>
            </div>
            <div className="p-8 rounded-xl border border-white/10 text-center" style={{ borderRadius: 'var(--effect-card-radius)', background: 'rgba(201,169,110,0.08)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>For Agents</p>
              <h3 className="font-serif text-2xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Join Our Team</h3>
              <p className="text-white/70 text-sm mb-6">Ready to build your career at an independent brokerage that invests in your success?</p>
              <Link href={`/${locale}/join`} className="inline-block px-7 py-3 border-2 border-[var(--secondary)] text-[var(--secondary)] font-semibold hover:bg-[var(--secondary)] hover:text-white transition-colors text-sm"
                style={{ borderRadius: 'var(--effect-button-radius)' }}>
                Learn About Joining
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

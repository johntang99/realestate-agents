'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface Testimonial {
  id?: string; quote?: string; author?: string; title?: string;
  category?: string; rating?: number; featured?: boolean; date?: string; transactionType?: string;
}

const CAT_LABELS: Record<string, string> = {
  all: 'All', buyers: 'Buyers', sellers: 'Sellers',
  renters: 'Renters', commercial: 'Commercial', investors: 'Investors',
};

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= count ? 'star-filled fill-current' : 'star-empty'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pageData, setPageData] = useState<any>({});
  const [locale, setLocale] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    Promise.all([
      fetch(`/api/content/file?locale=${loc}&path=pages/testimonials.json`).then(r => r.json()),
      fetch(`/api/content/file?locale=${loc}&path=testimonials.json`).then(r => r.json()),
    ]).then(([pageRes, testRes]) => {
      try { setPageData(JSON.parse(pageRes.content || '{}')); } catch {}
      try {
        const t = JSON.parse(testRes.content || '{}');
        setTestimonials(Array.isArray(t.items) ? t.items : []);
      } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = testimonials.filter(t =>
    activeCategory === 'all' || t.category === activeCategory
  );
  const displayed = filtered.slice(0, visibleCount);
  const d = pageData;
  const categories = Object.keys(CAT_LABELS);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-10 md:pt-40" style={{ background: 'var(--backdrop-primary)' }}>
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>Reviews</p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {d.hero?.headline || 'What My Clients Say'}
          </h1>
          <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>{d.hero?.subline}</p>

          {/* Aggregate stats */}
          {d.hero?.aggregateStats && (
            <div className="flex gap-8">
              {d.hero.aggregateStats.totalReviews && (
                <div>
                  <p className="font-serif text-3xl font-bold" style={{ color: 'var(--secondary)' }}>{d.hero.aggregateStats.totalReviews}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Reviews</p>
                </div>
              )}
              {d.hero.aggregateStats.avgRating && (
                <div>
                  <p className="font-serif text-3xl font-bold flex items-center gap-1" style={{ color: 'var(--secondary)' }}>
                    <Star className="w-6 h-6 star-filled fill-current" />{d.hero.aggregateStats.avgRating}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Average Rating</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--border)] py-3">
        <div className="container-custom flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeCategory === cat
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'
              }`}>
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_,i) => <div key={i} className="h-40 animate-pulse" style={{ background: 'var(--backdrop-primary)', borderRadius: 'var(--card-radius)' }} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl" style={{ color: 'var(--primary)' }}>No testimonials in this category yet.</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{filtered.length} review{filtered.length !== 1 ? 's' : ''}</p>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
                {displayed.map((t, i) => (
                  <div key={t.id || i}
                    className={`break-inside-avoid mb-5 p-6 border border-[var(--border)] rounded-xl ${t.featured ? 'border-l-4' : ''}`}
                    style={t.featured ? { borderLeftColor: 'var(--secondary)' } : {}}>
                    <Stars count={t.rating} />
                    <blockquote className="text-sm leading-relaxed mb-4 italic"
                      style={{ color: 'var(--text-primary)' }}>
                      "{t.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{t.author}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t.title}</p>
                      {t.transactionType && (
                        <p className="text-xs mt-1 font-medium" style={{ color: 'var(--secondary)' }}>{t.transactionType}</p>
                      )}
                    </div>
                    {t.category && (
                      <span className="inline-block mt-3 text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)]"
                        style={{ color: 'var(--text-secondary)' }}>
                        {CAT_LABELS[t.category] || t.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {displayed.length < filtered.length && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount(v => v + 12)}
                    className="border border-[var(--primary)] px-8 py-3 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                    style={{ color: 'var(--primary)' }}>Load More Reviews</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: 'var(--primary)' }}>
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4">
            {d.cta?.headline || 'Ready to be my next success story?'}
          </h2>
          <Link href={`/${locale}${d.cta?.ctaHref || '/contact'}`} className="btn-gold inline-block mt-2">
            {d.cta?.ctaLabel || 'Schedule a Consultation'}
          </Link>
        </div>
      </section>
    </>
  );
}

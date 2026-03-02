'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = ['All','market-updates','buyer-tips','seller-tips','investor-insights','relocation','neighborhood-guides','new-construction','lifestyle'];

export default function KnowledgeCenterPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    // Check URL category param
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) setCategory(params.get('category')!);
    fetch(`/api/content/items?locale=${loc}&directory=knowledge-center`)
      .then(r=>r.json()).then(res => {
        const raw = Array.isArray(res.items) ? res.items : [];
        setPosts(raw.sort((a: any, b: any) => (b.publishDate||'').localeCompare(a.publishDate||'')));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? posts : posts.filter((p: any) => p.category === category);
  const featured = filtered.find((p: any) => p.featured) || filtered[0];
  const rest = filtered.filter((p: any) => p !== featured);

  const labelCategory = (cat: string) => cat.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '38vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-10 md:pb-12" style={{ minHeight: 'calc(38vh - 5rem)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Resources</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Knowledge Center</h1>
            <p className="text-white/70 max-w-xl">Your complete resource for Orange County real estate. Market updates, buyer guides, neighborhood insights, and more.</p>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-20 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="container-custom py-3 flex gap-2 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${category === cat ? 'text-white' : 'border border-gray-200 hover:border-gray-400'}`}
              style={category === cat ? { background: 'var(--secondary)', color: 'white' } : { color: 'var(--text-secondary)' }}>
              {cat === 'All' ? 'All Posts' : labelCategory(cat)}
            </button>
          ))}
        </div>
      </div>

      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No posts in this category yet.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link href={`/${locale}/knowledge-center/${featured.slug}`}
                  className="group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--secondary)] transition-all mb-8 bg-white"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    {featured.heroImage ? <Image src={featured.heroImage} alt={featured.title||''} fill className="object-cover" sizes="50vw" />
                      : <div className="w-full h-full min-h-[240px]" style={{ background: 'var(--backdrop-mid)' }} />}
                  </div>
                  <div className="p-7 flex flex-col justify-center">
                    <span className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>{labelCategory(featured.category||'')}</span>
                    <h2 className="font-serif text-2xl font-semibold mb-3 group-hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{featured.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{featured.readTime} · {featured.publishDate}</p>
                  </div>
                </Link>
              )}
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post: any) => (
                  <Link key={post.slug} href={`/${locale}/knowledge-center/${post.slug}`}
                    className="group block bg-white rounded-xl border border-[var(--border)] hover:border-[var(--secondary)] overflow-hidden transition-all"
                    style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.heroImage ? <Image src={post.heroImage} alt={post.title||''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                        : <div className="w-full h-full" style={{ background: 'var(--backdrop-mid)' }} />}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>{labelCategory(post.category||'')}</span>
                      <h3 className="font-serif text-base font-semibold mt-2 mb-1 leading-snug group-hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{post.title}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{post.readTime} · {post.publishDate}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

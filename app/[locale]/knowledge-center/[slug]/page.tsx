'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { AgentCard, type AgentData } from '@/components/ui/AgentCard';

export default function KnowledgeCenterPostPage() {
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<AgentData | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loc = window.location.pathname.startsWith('/zh') ? 'zh' : 'en';
    setLocale(loc);
    const slug = window.location.pathname.split('/').pop() || '';
    Promise.all([
      fetch(`/api/content/items?locale=${loc}&directory=knowledge-center`).then(r=>r.json()),
      fetch(`/api/content/items?locale=${loc}&directory=agents`).then(r=>r.json()),
    ]).then(([postsRes, agentsRes]) => {
      const allPosts = Array.isArray(postsRes.items) ? postsRes.items : [];
      const p = allPosts.find((x: any) => x.slug === slug);
      setPost(p || null);
      if (p?.author) {
        const allAgents = Array.isArray(agentsRes.items) ? agentsRes.items as AgentData[] : [];
        setAuthor(allAgents.find((a: any) => a.slug === p.author) || null);
      }
      setRelated(allPosts.filter((x: any) => x.slug !== slug && x.category === p?.category).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--secondary)', borderTopColor: 'transparent' }} /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center pt-20"><p style={{ color: 'var(--text-secondary)' }}>Post not found.</p></div>;

  return (
    <>
      <div className="pt-20" style={{ background: 'var(--primary)' }}>
        <div className="container-custom pt-6 pb-8">
          <Link href={`/${locale}/knowledge-center`} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Knowledge Center
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--secondary)' }}>
            {post.category?.replace(/-/g,' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-white mt-2 mb-3 max-w-3xl leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{post.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>{post.readTime} · {post.publishDate}</p>
        </div>
      </div>

      {post.heroImage && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image src={post.heroImage} alt={post.title||''} fill className="object-cover" sizes="100vw" />
        </div>
      )}

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            <article>
              {post.excerpt && <p className="text-lg font-medium mb-8 pb-8 border-b border-[var(--border)]" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>}
              <div className="editorial-body whitespace-pre-wrap">{post.body}</div>
            </article>
            <aside className="space-y-6">
              {author && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Written By</p>
                  <AgentCard agent={author} locale={locale} variant="compact" />
                </div>
              )}
              <div className="p-5 rounded-xl border border-[var(--border)]" style={{ borderRadius: 'var(--effect-card-radius)', background: 'var(--backdrop-light)' }}>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>Questions About This Market?</p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Our agents are available 7 days a week.</p>
                <Link href={`/${locale}/contact`} className="btn-gold block text-center text-xs py-2">Talk to an Agent</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom">
            <h2 className="font-serif text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p: any) => (
                <Link key={p.slug} href={`/${locale}/knowledge-center/${p.slug}`}
                  className="group block bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--secondary)] transition-all"
                  style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}>
                  {p.heroImage && <div className="relative aspect-[4/3]"><Image src={p.heroImage} alt={p.title||''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" /></div>}
                  <div className="p-4">
                    <h3 className="font-serif text-sm font-semibold leading-snug" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{p.title}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.publishDate}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

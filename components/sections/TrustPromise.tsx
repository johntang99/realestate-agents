'use client';

import Link from 'next/link';

export function TrustPromise({
  locale,
  title = 'Why Clients Trust Us With Their Biggest Transaction',
  body = 'You get local expertise, honest strategy, and clear communication at every step. We protect your downside while guiding you to the best possible outcome.',
  ctaLabel = 'Book a Free Consultation',
  ctaHref = '/contact',
}: {
  locale: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="py-10 bg-white border-y border-[var(--border)]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
            style={{ color: 'var(--secondary)' }}
          >
            Trust & Promise
          </p>
          <h2
            className="font-serif text-2xl md:text-3xl font-semibold mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--primary)',
            }}
          >
            {title}
          </h2>
          <p
            className="text-sm md:text-base leading-relaxed mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            {body}
          </p>
          <Link
            href={`/${locale}${ctaHref}`}
            className="btn-gold inline-block px-7 py-3 text-sm"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

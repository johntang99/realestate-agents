import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--backdrop-primary, #FAF8F5)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--secondary, #C4A265)' }}>
        404
      </p>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-5" style={{ color: 'var(--primary, #2C2C2C)' }}>
        Page Not Found
      </h1>
      <p className="text-base mb-10 max-w-sm" style={{ color: 'var(--text-secondary, #6B6B6B)' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/en" className="btn-gold px-8 py-3 text-sm">
          Go Home
        </Link>
        <Link
          href="/en/portfolio"
          className="px-8 py-3 text-sm border border-[var(--border,#E5E2DD)] font-medium transition-colors hover:border-[var(--primary)]"
          style={{ color: 'var(--primary, #2C2C2C)' }}
        >
          View Portfolio
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Home, DollarSign, MapPin, TrendingUp, Users, ArrowRight } from 'lucide-react';

interface GoalPath {
  label: string;
  subline?: string;
  href: string;
  icon: string;
}

interface GoalEntryPathsProps {
  headline?: string;
  items?: GoalPath[];
  locale?: string;
}

const ICONS: Record<string, React.ElementType> = {
  Home, DollarSign, MapPin, TrendingUp, Users,
};

const DEFAULT_PATHS: GoalPath[] = [
  { label: 'I Want to Buy', subline: 'Find your perfect home with expert guidance', href: '/buying', icon: 'Home' },
  { label: 'I Want to Sell', subline: 'Strategic pricing and premium marketing', href: '/selling', icon: 'DollarSign' },
  { label: "I'm Relocating", subline: 'Deep local knowledge for your move', href: '/relocating', icon: 'MapPin' },
  { label: "I'm an Investor", subline: 'Data-driven investment strategy', href: '/investing', icon: 'TrendingUp' },
  { label: 'I Want to Join', subline: 'Build your career with the best', href: '/join', icon: 'Users' },
];

export function GoalEntryPaths({ headline, items, locale = 'en' }: GoalEntryPathsProps) {
  const paths = (items && items.length > 0) ? items : DEFAULT_PATHS;

  return (
    <section className="section-padding" style={{ background: 'var(--backdrop-light, #F8F6F2)' }}>
      <div className="container-custom">
        {headline && (
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>Get Started</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {headline}
            </h2>
            <div className="w-12 h-0.5 mx-auto mt-4" style={{ background: 'var(--secondary)' }} />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {paths.map((path) => {
            const Icon = ICONS[path.icon] || Home;
            return (
              <Link
                key={path.href}
                href={`/${locale}${path.href}`}
                className="goal-path-card group flex flex-col items-center text-center p-6 md:p-8 rounded-2xl border bg-white"
                style={{
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--effect-card-radius)',
                  boxShadow: 'var(--effect-card-shadow)',
                  minHeight: '200px',
                  transition: 'all var(--effect-transition-base)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--effect-card-shadow-hover)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--secondary)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--effect-card-shadow)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[var(--secondary)]"
                  style={{ background: 'var(--backdrop-mid)', borderRadius: 'var(--effect-card-radius)' }}>
                  <Icon className="w-7 h-7 transition-colors group-hover:text-white" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 className="font-semibold text-base mb-2 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {path.label}
                </h3>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: 'var(--text-secondary)' }}>
                  {path.subline}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold mt-auto group-hover:gap-2 transition-all"
                  style={{ color: 'var(--secondary)' }}>
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </div>
                {/* Gold underline on hover */}
                <div className="w-0 group-hover:w-8 h-0.5 mt-2 transition-all duration-300" style={{ background: 'var(--secondary)' }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

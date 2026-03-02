import Link from 'next/link';
import Image from 'next/image';
import { Globe, Star } from 'lucide-react';

export interface AgentData {
  slug: string;
  name?: string;
  title?: string;
  photo?: string;
  specialties?: string[];
  languages?: string[];
  yearsExperience?: number;
  transactionCount?: number;
  volumeLabel?: string;
  avgDaysOnMarket?: number;
  saleToListRatio?: string;
  testimonials?: Array<{ rating?: number }>;
  role?: string;
  featured?: boolean;
}

interface AgentCardProps {
  agent: AgentData;
  locale?: string;
  variant?: 'compact' | 'detailed' | 'featured';
}

function avgRating(testimonials?: Array<{ rating?: number }>): number {
  if (!testimonials?.length) return 0;
  return Math.round(testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length);
}

export function AgentCard({ agent, locale = 'en', variant = 'detailed' }: AgentCardProps) {
  const href = `/${locale}/team/${agent.slug}`;
  const rating = avgRating(agent.testimonials);

  if (variant === 'compact') {
    return (
      <Link href={href} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--secondary)] transition-colors bg-white group">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: 'var(--effect-card-shadow)' }}>
          {agent.photo
            ? <Image src={agent.photo} alt={agent.name || ''} fill className="object-cover" sizes="48px" />
            : <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: 'var(--primary)' }}>{(agent.name || 'A').charAt(0)}</div>}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>{agent.name}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{agent.title}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="agent-card group block bg-white rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--secondary)]"
      style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)', transition: 'var(--effect-transition-base)' }}>
      {/* Photo */}
      <div className={`relative overflow-hidden bg-[var(--backdrop-mid)] ${variant === 'featured' ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
        {agent.photo
          ? <Image src={agent.photo} alt={agent.name || ''} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
          : <div className="w-full h-full flex items-center justify-center text-white font-serif text-5xl font-semibold" style={{ background: 'var(--primary)' }}>{(agent.name || 'A').charAt(0)}</div>}
        {agent.role === 'principal_broker' && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded text-white" style={{ background: 'var(--secondary)' }}>Principal Broker</div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-0.5 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{agent.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>{agent.title}</p>

        {/* Stars */}
        {rating > 0 && (
          <div className="flex gap-0.5 mb-3">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'fill-current' : ''}`} style={{ color: i <= rating ? 'var(--gold-star)' : 'var(--border)' }} />
            ))}
          </div>
        )}

        {/* Specialties */}
        {agent.specialties && agent.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {agent.specialties.slice(0, 4).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ background: 'var(--primary)', borderRadius: 'var(--effect-badge-radius)' }}>{s}</span>
            ))}
            {agent.specialties.length > 4 && (
              <span className="px-2 py-0.5 rounded text-xs text-gray-500 border border-gray-200">+{agent.specialties.length - 4} more</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          {agent.transactionCount && <span><strong className="font-semibold" style={{ color: 'var(--primary)' }}>{agent.transactionCount}+</strong> Deals</span>}
          {agent.yearsExperience && <span><strong className="font-semibold" style={{ color: 'var(--primary)' }}>{agent.yearsExperience}</strong> Yrs</span>}
        </div>

        {/* Languages */}
        {agent.languages && agent.languages.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{agent.languages.join(', ')}</span>
          </div>
        )}

        <div className="text-xs font-semibold group-hover:gap-2 transition-all flex items-center gap-1" style={{ color: 'var(--secondary)' }}>
          View Profile →
        </div>
      </div>
    </Link>
  );
}

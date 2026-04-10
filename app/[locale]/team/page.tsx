import type { Metadata } from 'next';
import Link from 'next/link';
import { getRequestSiteId, loadAllItems, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/types';

type Props = {
  params: {
    locale: Locale;
  };
};

type Agent = {
  name?: string;
  slug?: string;
  title?: string;
  bio?: string;
  status?: string;
  featured?: boolean;
  languages?: string[];
  specialties?: string[];
};

type TeamPageContent = {
  hero?: {
    headline?: string;
    subline?: string;
  };
};

const LOCATION_SLUGS = ['middletown', 'deerpark', 'port-jervis'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<TeamPageContent>('team', params.locale, siteId);
  return buildPageMetadata({
    siteId,
    locale: params.locale,
    slug: 'team',
    title: content?.hero?.headline || 'Our Team',
    description:
      content?.hero?.subline ||
      'Meet the Jin Pang Homes team and connect with local agents serving Middletown, Deerpark, and Port Jervis.',
  });
}

export default async function TeamPage({ params }: Props) {
  const siteId = await getRequestSiteId();
  const content = await loadPageContent<TeamPageContent>('team', params.locale, siteId);
  const allAgents = await loadAllItems<Agent>(siteId, params.locale, 'agents');
  const activeAgents = allAgents.filter((agent) => agent.status !== 'inactive' && agent.slug);
  const agents = [...activeAgents].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });

  return (
    <>
      <section className="pt-28 pb-12 md:pt-36 bg-white border-b border-[var(--border)]">
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--secondary)' }}>
            Team
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" style={{ color: 'var(--primary)' }}>
            {content?.hero?.headline || 'Meet Our Team'}
          </h1>
          <p className="text-base max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            {content?.hero?.subline ||
              'Connect with agents who know Middletown, Deerpark, and Port Jervis and can guide your next move with local strategy.'}
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <article
                key={agent.slug}
                className="p-6 bg-white rounded-xl border border-[var(--border)]"
                style={{ borderRadius: 'var(--effect-card-radius)', boxShadow: 'var(--effect-card-shadow)' }}
              >
                <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--primary)' }}>
                  {agent.name || agent.slug}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--secondary)' }}>
                  {agent.title || 'Licensed Real Estate Agent'}
                </p>
                {agent.bio ? (
                  <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                    {agent.bio}
                  </p>
                ) : null}
                {(agent.languages?.length || agent.specialties?.length) ? (
                  <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
                    {agent.languages?.length ? `Languages: ${agent.languages.join(', ')}. ` : ''}
                    {agent.specialties?.length ? `Specialties: ${agent.specialties.join(', ')}.` : ''}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  {LOCATION_SLUGS.map((locationSlug) => (
                    <Link
                      key={`${agent.slug}-${locationSlug}`}
                      href={`/en/${agent.slug}-${locationSlug}-real-estate-agent`}
                      className="px-3 py-1.5 text-xs font-semibold border"
                      style={{ borderColor: 'var(--primary)', color: 'var(--primary)', borderRadius: '9999px' }}
                    >
                      {locationSlug === 'port-jervis' ? 'Port Jervis' : locationSlug[0].toUpperCase() + locationSlug.slice(1)}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

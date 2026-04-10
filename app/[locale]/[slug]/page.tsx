import fs from 'fs/promises';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo';
import { getRequestSiteId } from '@/lib/content';
import { canUseContentDb, fetchContentEntry } from '@/lib/contentDb';
import { getSEOPagesBySlug } from '@/lib/seo-pages';
import type { Locale } from '@/lib/types';

type Props = {
  params: {
    locale: Locale;
    slug: string;
  };
};

type SeoLocationPage = {
  pageType: string;
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    keywords?: string[];
  };
  hero?: {
    eyebrow?: string;
    h1?: string;
    subline?: string;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  sections?: {
    overviewHeading?: string;
    overviewParagraphs?: string[];
    strengthsHeading?: string;
    strengths?: string[];
    relatedSearchesHeading?: string;
    relatedSearches?: Array<string | { label: string; href?: string }>;
    faqHeading?: string;
    faqItems?: Array<{ q: string; a: string }>;
  };
  links?: {
    locationLinks?: Array<{ label: string; href: string }>;
  };
  agent?: {
    name?: string;
    slug?: string;
    title?: string;
    photo?: string;
    bio?: string;
    yearsExperience?: number;
    transactionCount?: number;
    languages?: string[];
    specialties?: string[];
    locationName?: string;
  };
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function loadSeoPageContent(
  siteId: string,
  locale: string,
  slug: string,
): Promise<SeoLocationPage | null> {
  const contentPath = `seo-pages/${slug}.json`;

  if (canUseContentDb()) {
    const entry = await fetchContentEntry(siteId, locale, contentPath);
    if (entry?.content ?? entry?.data) {
      return (entry.content ?? entry.data) as SeoLocationPage;
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, siteId, locale, 'seo-pages', `${slug}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as SeoLocationPage;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const registryEntry = await getSEOPagesBySlug(siteId, slug);
  if (!registryEntry || !registryEntry.locales.includes(locale)) {
    return {};
  }

  const page = await loadSeoPageContent(siteId, locale, slug);
  if (!page) return {};

  return buildPageMetadata({
    siteId,
    locale,
    slug,
    title: page.seo?.title || page.hero?.h1,
    description: page.seo?.description || page.hero?.subline,
    canonicalPath: page.seo?.canonicalUrl || `/${locale}/${slug}`,
  });
}

export default async function DynamicSeoPage({ params }: Props) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  const registryEntry = await getSEOPagesBySlug(siteId, slug);
  if (!registryEntry || !registryEntry.locales.includes(locale)) {
    notFound();
  }

  const page = await loadSeoPageContent(siteId, locale, slug);
  if (!page) notFound();

  const faqSchema =
    page.sections?.faqItems && page.sections.faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.sections.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        }
      : null;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.hero?.h1 || slug,
        item: `/${locale}/${slug}`,
      },
    ],
  };
  const realEstateAgentSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: page.agent?.name || 'Jin Pang Homes',
    areaServed: page.agent?.locationName || page.hero?.eyebrow || 'Orange County, NY',
    description: page.hero?.subline || page.seo?.description || '',
    url: `/${locale}/${slug}`,
  };
  const relatedSearchItems = (page.sections?.relatedSearches || []).map((item) =>
    typeof item === 'string' ? { label: item } : item,
  );

  return (
    <>
      <section className="relative pt-20 overflow-hidden" style={{ minHeight: '44vh', background: 'var(--primary)' }}>
        <div className="container-custom flex items-end pb-10 md:pb-12" style={{ minHeight: 'calc(44vh - 5rem)' }}>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--secondary)' }}>
              {page.hero?.eyebrow || 'Local Real Estate'}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {page.hero?.h1 || 'Best Real Estate Agent'}
            </h1>
            {page.hero?.subline ? (
              <p className="text-white/75 mt-4 text-lg">{page.hero.subline}</p>
            ) : null}
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href={`/${locale}${page.hero?.primaryCtaHref || '/contact'}`} className="btn-gold px-7 py-3">
                {page.hero?.primaryCtaLabel || 'Talk to an Agent'}
              </Link>
              <Link
                href={`/${locale}${page.hero?.secondaryCtaHref || '/properties'}`}
                className="border-2 border-white text-white hover:bg-white/10 transition-colors px-7 py-3 text-sm font-semibold"
                style={{ borderRadius: 'var(--effect-button-radius)' }}
              >
                {page.hero?.secondaryCtaLabel || 'Browse Homes'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {page.pageType === 'rea-agent-location' && page.agent ? (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="font-serif text-3xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              Meet your {page.agent.locationName || ''} real estate specialist
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {page.agent.bio}
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {page.agent.yearsExperience ? <li>- {page.agent.yearsExperience}+ years of local real estate experience</li> : null}
              {page.agent.transactionCount ? <li>- {page.agent.transactionCount}+ closed transactions</li> : null}
              {(page.agent.languages || []).length > 0 ? <li>- Languages: {(page.agent.languages || []).join(', ')}</li> : null}
              {(page.agent.specialties || []).length > 0 ? <li>- Specialties: {(page.agent.specialties || []).join(', ')}</li> : null}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="font-serif text-3xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
            {page.sections?.overviewHeading || 'Local market overview'}
          </h2>
          <div className="space-y-4">
            {(page.sections?.overviewParagraphs || []).map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {(page.sections?.strengths || []).length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-4xl">
            <h2 className="font-serif text-3xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {page.sections?.strengthsHeading || 'How we help buyers and sellers'}
            </h2>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {page.sections?.strengths?.map((item, index) => <li key={index}>- {item}</li>)}
            </ul>
          </div>
        </section>
      )}

      {relatedSearchItems.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <h2 className="font-serif text-3xl font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {page.sections?.relatedSearchesHeading || 'Related real estate searches'}
            </h2>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {relatedSearchItems.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  {item.href ? (
                    <>
                      -{' '}
                      <Link
                        href={item.href}
                        className="underline decoration-[var(--secondary)] underline-offset-4 hover:text-[var(--primary)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </>
                  ) : (
                    <>- {item.label}</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {(page.sections?.faqItems || []).length > 0 && (
        <section className="section-padding" style={{ background: 'var(--backdrop-light)' }}>
          <div className="container-custom max-w-4xl">
            <h2 className="font-serif text-3xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              {page.sections?.faqHeading || 'Frequently asked questions'}
            </h2>
            <div className="space-y-4">
              {page.sections?.faqItems?.map((item, index) => (
                <div key={index} className="p-5 rounded-xl border border-[var(--border)] bg-white" style={{ borderRadius: 'var(--effect-card-radius)' }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--primary)' }}>
                    {item.q}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(page.links?.locationLinks || []).length > 0 && (
        <section className="py-14 bg-white border-t border-[var(--border)]">
          <div className="container-custom">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
              Explore nearby service areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {page.links?.locationLinks?.map((locationLink) => (
                <Link
                  key={locationLink.href}
                  href={locationLink.href}
                  className="px-6 py-2.5 text-sm font-semibold border-2"
                  style={{ borderRadius: 'var(--effect-button-radius)', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  {locationLink.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
    </>
  );
}

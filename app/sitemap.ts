import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jinpanghomes.com';
const LOCALES = ['en', 'zh'] as const;

function entries(path: string, options?: { changeFrequency?: MetadataRoute.Sitemap[0]['changeFrequency']; priority?: number }) {
  return LOCALES.map(locale => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: options?.changeFrequency || ('monthly' as const),
    priority: options?.priority ?? 0.7,
    alternates: {
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    ...entries('', { changeFrequency: 'weekly', priority: 1.0 }),
    ...entries('/about', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/properties', { changeFrequency: 'daily', priority: 0.9 }),
    ...entries('/neighborhoods', { changeFrequency: 'weekly', priority: 0.8 }),
    ...entries('/buying', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/selling', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/investing', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/relocating', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/knowledge-center', { changeFrequency: 'weekly', priority: 0.8 }),
    ...entries('/market-reports', { changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/case-studies', { changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/resources', { changeFrequency: 'monthly', priority: 0.7 }),
    ...entries('/home-valuation', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/contact', { changeFrequency: 'monthly', priority: 0.8 }),
    ...entries('/faq', { changeFrequency: 'monthly', priority: 0.6 }),
    ...entries('/testimonials', { changeFrequency: 'monthly', priority: 0.7 }),
  ];

  // Seeded dynamic pages (keep updated with seed content)
  const propertyPages = ['77-highland-terrace', '45-oak-ridge-lane', '12-harbor-view-drive', '88-riverside-court', '220-maple-avenue']
    .flatMap((slug) => entries(`/properties/${slug}`, { changeFrequency: 'weekly', priority: 0.8 }));
  const neighborhoodPages = ['scarsdale', 'bronxville', 'larchmont']
    .flatMap((slug) => entries(`/neighborhoods/${slug}`, { changeFrequency: 'monthly', priority: 0.7 }));
  const knowledgePages = ['first-time-buyer-guide-orange-county', 'orange-county-market-report-2026', 'relocating-to-orange-county']
    .flatMap((slug) => entries(`/knowledge-center/${slug}`, { changeFrequency: 'monthly', priority: 0.7 }));
  const reportPages = ['february-2026']
    .flatMap((slug) => entries(`/market-reports/${slug}`, { changeFrequency: 'monthly', priority: 0.7 }));

  return [
    ...staticPages,
    ...propertyPages,
    ...neighborhoodPages,
    ...knowledgePages,
    ...reportPages,
  ];
}

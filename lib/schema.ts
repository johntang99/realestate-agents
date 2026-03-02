// REA2 (Jin Pang Homes) — Schema.org structured data helpers
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jinpanghomes.com';
const SITE_NAME = 'Jin Pang Homes';
const FOUNDER = 'Jin Pang';

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_NAME,
    description: 'Jin Pang Homes provides trusted real estate guidance for buyers, sellers, investors, and relocating families in Port Jervis and Orange County, NY.',
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    telephone: '(845) 555-0190',
    email: 'info@jinpanghomes.com',
    founder: { '@type': 'Person', name: FOUNDER },
    foundingDate: '2020',
    numberOfEmployees: '1-10',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '21 Painted Apron Ter',
      addressLocality: 'Port Jervis',
      addressRegion: 'NY',
      postalCode: '12771',
      addressCountry: 'US',
    },
    areaServed: ['Port Jervis', 'Orange County', 'Hudson Valley', 'New York'],
    sameAs: [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Real Estate Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Buyer Representation', description: 'Property search, showing guidance, and offer strategy for buyers.' },
        { '@type': 'Offer', name: 'Seller Representation', description: 'Pricing strategy, marketing plan, and negotiation support for sellers.' },
        { '@type': 'Offer', name: 'Relocation Support', description: 'Local market guidance and neighborhood orientation for relocating families.' },
        { '@type': 'Offer', name: 'Investment Advisory', description: 'Rental yield and cap-rate focused investment property guidance.' },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '100',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@jinpanghomes.com',
    },
    sameAs: [],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/properties?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePortfolioProjectSchema(project: {
  title?: string;
  description?: string;
  coverImage?: string;
  year?: string;
  location?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.description,
    image: project.coverImage,
    datePublished: project.year ? `${project.year}-01-01` : undefined,
    author: { '@type': 'Person', name: FOUNDER },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon` } },
    mainEntityOfPage: `${SITE_URL}/case-studies/${project.slug}`,
  };
}

export function generateProductSchema(product: {
  title?: string;
  description?: string;
  price?: number;
  images?: Array<{ src?: string }>;
  slug?: string;
  status?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map(i => i.src).filter(Boolean),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.status === 'sold-out' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: `${SITE_URL}/properties/${product.slug}`,
    },
    brand: { '@type': 'Brand', name: SITE_NAME },
  };
}

export function generateArticleSchema(post: {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  date?: string;
  author?: string;
  slug?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author || FOUNDER },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon` } },
    mainEntityOfPage: `${SITE_URL}/knowledge-center/${post.slug}`,
  };
}

export function generateFAQSchema(categories: Array<{
  items?: Array<{ question?: string; answer?: string }>;
}>) {
  const items = categories.flatMap(cat => cat.items || []).map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

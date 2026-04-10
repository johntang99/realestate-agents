#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const CONTENT_DIR = path.join(ROOT, 'content');

const args = process.argv.slice(2);
const SITE_ID = args.find((arg) => !arg.startsWith('--'));
const locationsArg = args.find((arg) => arg.startsWith('--locations='));
const agentsArg = args.find((arg) => arg.startsWith('--agents='));
const includeIntentArg = args.find((arg) => arg.startsWith('--include-intent='));

if (!SITE_ID) {
  console.error('Usage: node scripts/seed-seo-pages.mjs <site-id> [--locations=middletown,deerpark,port-jervis] [--agents=jin-pang]');
  process.exit(1);
}

const locations = (locationsArg?.split('=')[1] || 'middletown,deerpark,port-jervis')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);
const agents = (agentsArg?.split('=')[1] || 'jin-pang')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);
const includeIntentPages = includeIntentArg ? includeIntentArg.split('=')[1] !== 'false' : true;

const locationLabelMap = {
  middletown: 'Middletown',
  deerpark: 'Deerpark',
  'port-jervis': 'Port Jervis',
};

const locationSlug = (name) => `${name}-real-estate`;
const agentLocationSlug = (agentSlug, citySlug) => `${agentSlug}-${citySlug}-real-estate-agent`;
const buyLocationSlug = (citySlug) => `buy-house-${citySlug}-ny`;
const sellLocationSlug = (citySlug) => `sell-house-${citySlug}-ny`;
const locationLabel = (name) => locationLabelMap[name] || name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
const titleCaseName = (slug) => slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');

function buildPage(citySlug, allLocationSlugs) {
  const city = locationLabel(citySlug);
  const slug = locationSlug(citySlug);
  const siblings = allLocationSlugs.filter((entry) => entry !== citySlug);

  return {
    pageType: 'rea-location-landing',
    seo: {
      title: `Best Real Estate Agent in ${city} NY | Jin Pang`,
      description: `Looking for the best real estate agent in ${city}, NY? Jin Pang helps buyers and sellers with local strategy, negotiation support, and market guidance.`,
      canonicalUrl: `/en/${slug}`,
      keywords: [
        `best real estate agent in ${city.toLowerCase()} ny`,
        `buy house in ${city.toLowerCase()} ny`,
        `sell my house in ${city.toLowerCase()} ny`,
        `homes for sale in ${city.toLowerCase()} ny`,
      ],
    },
    hero: {
      eyebrow: `${city}, NY`,
      h1: `Best Real Estate Agent in ${city}, NY`,
      subline: `Work with Jin Pang to buy or sell in ${city} using local market strategy and clear transaction execution.`,
      primaryCtaLabel: `Talk to a ${city} Agent`,
      primaryCtaHref: '/contact',
      secondaryCtaLabel: `Browse ${city} Area Homes`,
      secondaryCtaHref: '/properties',
    },
    sections: {
      overviewHeading: `${city} real estate strategy`,
      overviewParagraphs: [
        `${city} is an active local market where block-level context and pricing discipline can materially change outcomes.`,
        `We help buyers compare options and help sellers launch with practical positioning based on active competition.`,
      ],
      strengthsHeading: `How we help in ${city}`,
      strengths: [
        `Buyer strategy for search, touring, and offer planning in ${city}.`,
        `Seller strategy for prep, pricing, and negotiation in ${city}.`,
        `Contract-to-close support with clear milestone management.`,
      ],
      relatedSearchesHeading: `Related ${city} searches`,
      relatedSearches: [
        `best real estate agent in ${city} NY`,
        `buy house in ${city} NY`,
        `sell my house in ${city} NY`,
        `homes for sale in ${city} NY`,
      ],
      faqHeading: `${city} real estate FAQ`,
      faqItems: [
        {
          q: `How do I choose a real estate agent in ${city}?`,
          a: `Evaluate local track record, pricing process, communication speed, and a clear negotiation plan for your situation.`,
        },
        {
          q: `Can one agent help me buy and sell in ${city}?`,
          a: `Yes. We coordinate timelines, contingencies, and transaction steps so both sides of the move stay aligned.`,
        },
      ],
    },
    links: {
      locationLinks: siblings.map((entry) => ({
        label: `${locationLabel(entry)} Real Estate Agent`,
        href: `/en/${locationSlug(entry)}`,
      })),
    },
  };
}

function buildBuyLocationPage(citySlug, allLocationSlugs) {
  const city = locationLabel(citySlug);
  const slug = buyLocationSlug(citySlug);
  const siblings = allLocationSlugs.filter((entry) => entry !== citySlug);

  return {
    pageType: 'rea-buy-location',
    seo: {
      title: `Buy a House in ${city} NY | Local Buyer Guide`,
      description: `Planning to buy a house in ${city}, NY? Get local strategy on neighborhoods, pricing, offer structure, and closing steps.`,
      canonicalUrl: `/en/${slug}`,
      keywords: [
        `buy house in ${city.toLowerCase()} ny`,
        `homes for sale in ${city.toLowerCase()} ny`,
        `${city.toLowerCase()} ny first time home buyer`,
      ],
    },
    hero: {
      eyebrow: `${city} Buyer Guide`,
      h1: `Buy a House in ${city}, NY`,
      subline: `Use a local plan to compare neighborhoods, avoid overpaying, and submit stronger offers in ${city}.`,
      primaryCtaLabel: 'Talk to a Buyer Agent',
      primaryCtaHref: '/contact',
      secondaryCtaLabel: 'Browse Homes',
      secondaryCtaHref: '/properties',
    },
    sections: {
      overviewHeading: `How to buy in ${city}`,
      overviewParagraphs: [
        `Buying in ${city} is easier when you evaluate inventory, pricing, and negotiation leverage before touring.`,
        `We help buyers move from financing prep to closing with clear priorities and fewer surprises.`,
      ],
      strengthsHeading: 'Buyer strategy checklist',
      strengths: [
        'Pre-approval and budget alignment before search starts.',
        'Neighborhood and property-fit review against your timeline.',
        'Offer and contingency strategy based on active competition.',
      ],
      relatedSearchesHeading: 'Related buyer searches',
      relatedSearches: [
        `buy house in ${city} NY`,
        `homes for sale in ${city} NY`,
        `${city} NY buyer agent`,
      ],
      faqHeading: `${city} buyer FAQ`,
      faqItems: [
        {
          q: `What is the first step to buy in ${city}?`,
          a: 'Start with financing clarity and neighborhood priorities before active showings.',
        },
      ],
    },
    links: {
      locationLinks: [
        { label: `${city} Real Estate Overview`, href: `/en/${locationSlug(citySlug)}` },
        ...siblings.map((entry) => ({
          label: `Buy in ${locationLabel(entry)}`,
          href: `/en/${buyLocationSlug(entry)}`,
        })),
      ],
    },
  };
}

function buildSellLocationPage(citySlug, allLocationSlugs) {
  const city = locationLabel(citySlug);
  const slug = sellLocationSlug(citySlug);
  const siblings = allLocationSlugs.filter((entry) => entry !== citySlug);

  return {
    pageType: 'rea-sell-location',
    seo: {
      title: `Sell My House in ${city} NY | Local Seller Guide`,
      description: `Need to sell your house in ${city}, NY? Get local pricing, launch, and negotiation strategy to improve your outcome.`,
      canonicalUrl: `/en/${slug}`,
      keywords: [
        `sell my house in ${city.toLowerCase()} ny`,
        `sell house fast in ${city.toLowerCase()} ny`,
        `${city.toLowerCase()} ny home value`,
      ],
    },
    hero: {
      eyebrow: `${city} Seller Guide`,
      h1: `Sell Your House in ${city}, NY`,
      subline: `Use local pricing and launch strategy to attract stronger offers and close with more confidence in ${city}.`,
      primaryCtaLabel: 'Request a Listing Consultation',
      primaryCtaHref: '/contact',
      secondaryCtaLabel: 'Get Home Valuation',
      secondaryCtaHref: '/home-valuation',
    },
    sections: {
      overviewHeading: `How to sell in ${city}`,
      overviewParagraphs: [
        `Sellers in ${city} perform best when pricing and preparation are aligned with current buyer demand.`,
        `Our process covers prep, positioning, offer evaluation, and negotiation through closing.`,
      ],
      strengthsHeading: 'Seller strategy checklist',
      strengths: [
        'Condition-aware pricing and launch planning.',
        'Offer comparison by full terms, not price alone.',
        'Inspection and closing coordination to reduce delays.',
      ],
      relatedSearchesHeading: 'Related seller searches',
      relatedSearches: [
        `sell my house in ${city} NY`,
        `sell house fast in ${city} NY`,
        `${city} NY home valuation`,
      ],
      faqHeading: `${city} seller FAQ`,
      faqItems: [
        {
          q: `How should I price my home in ${city}?`,
          a: 'Use sold comps, active competition, and condition-adjusted positioning for the current market window.',
        },
      ],
    },
    links: {
      locationLinks: [
        { label: `${city} Real Estate Overview`, href: `/en/${locationSlug(citySlug)}` },
        ...siblings.map((entry) => ({
          label: `Sell in ${locationLabel(entry)}`,
          href: `/en/${sellLocationSlug(entry)}`,
        })),
      ],
    },
  };
}

async function loadAgent(siteDir, agentSlug) {
  try {
    const filePath = path.join(siteDir, 'en', 'agents', `${agentSlug}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildAgentLocationPage(agent, citySlug, allLocationSlugs) {
  const city = locationLabel(citySlug);
  const slug = agentLocationSlug(agent.slug, citySlug);
  const siblings = allLocationSlugs.filter((entry) => entry !== citySlug);
  const agentName = agent.name || titleCaseName(agent.slug);

  return {
    pageType: 'rea-agent-location',
    seo: {
      title: `${agentName} | Real Estate Agent in ${city} NY`,
      description: `${agentName} helps buyers and sellers in ${city}, NY with practical local strategy, pricing guidance, and closing support.`,
      canonicalUrl: `/en/${slug}`,
      keywords: [
        `${agentName.toLowerCase()} ${city.toLowerCase()} real estate agent`,
        `best real estate agent in ${city.toLowerCase()} ny`,
        `buy house in ${city.toLowerCase()} ny`,
        `sell my house in ${city.toLowerCase()} ny`,
      ],
    },
    hero: {
      eyebrow: `${city} Agent Page`,
      h1: `${agentName}: Real Estate Agent in ${city}, NY`,
      subline: `${agentName} helps clients in ${city} buy or sell with clear strategy from consultation through closing.`,
      primaryCtaLabel: `Talk to ${agentName}`,
      primaryCtaHref: '/contact',
      secondaryCtaLabel: `Browse ${city} Listings`,
      secondaryCtaHref: '/properties',
    },
    agent: {
      name: agentName,
      slug: agent.slug,
      title: agent.title || 'Licensed Real Estate Agent',
      photo: agent.photo || '',
      bio: agent.bio || '',
      yearsExperience: agent.yearsExperience || undefined,
      transactionCount: agent.transactionCount || undefined,
      languages: Array.isArray(agent.languages) ? agent.languages : [],
      specialties: Array.isArray(agent.specialties) ? agent.specialties : [],
      locationName: city,
    },
    sections: {
      overviewHeading: `Working with ${agentName} in ${city}`,
      overviewParagraphs: [
        `${agentName} supports buyers and sellers across ${city} with market-aware strategy and practical guidance.`,
        `We focus on decisions that improve outcomes: pricing, negotiation terms, and timeline control.`,
      ],
      relatedSearchesHeading: 'Related searches',
      relatedSearches: [
        `${agentName} ${city} real estate agent`,
        `best real estate agent in ${city} NY`,
        `buy house in ${city} NY`,
        `sell my house in ${city} NY`,
      ],
      faqHeading: `${city} agent FAQ`,
      faqItems: [
        {
          q: `What does ${agentName} help with in ${city}?`,
          a: 'Buyer and seller representation, pricing strategy, negotiation, and full transaction coordination through closing.',
        },
      ],
    },
    links: {
      locationLinks: [
        { label: `${city} Area Overview`, href: `/en/${locationSlug(citySlug)}` },
        ...siblings.map((entry) => ({
          label: `${locationLabel(entry)} Agent Page`,
          href: `/en/${agentLocationSlug(agent.slug, entry)}`,
        })),
      ],
    },
  };
}

async function main() {
  const siteDir = path.join(CONTENT_DIR, SITE_ID);
  const enSeoDir = path.join(siteDir, 'en', 'seo-pages');

  await fs.mkdir(enSeoDir, { recursive: true });

  const registryPages = locations.map((citySlug) => ({
      slug: locationSlug(citySlug),
      pageType: 'rea-location-landing',
      active: true,
      locales: ['en'],
      priority: citySlug === 'port-jervis' ? 0.9 : 0.85,
      keywords: [
        `best real estate agent in ${locationLabel(citySlug).toLowerCase()} ny`,
        `buy house in ${locationLabel(citySlug).toLowerCase()} ny`,
        `sell my house in ${locationLabel(citySlug).toLowerCase()} ny`,
      ],
    }));

  if (includeIntentPages) {
    for (const citySlug of locations) {
      registryPages.push({
        slug: buyLocationSlug(citySlug),
        pageType: 'rea-buy-location',
        active: true,
        locales: ['en'],
        priority: 0.8,
        keywords: [
          `buy house in ${locationLabel(citySlug).toLowerCase()} ny`,
          `homes for sale in ${locationLabel(citySlug).toLowerCase()} ny`,
        ],
      });
      registryPages.push({
        slug: sellLocationSlug(citySlug),
        pageType: 'rea-sell-location',
        active: true,
        locales: ['en'],
        priority: 0.8,
        keywords: [
          `sell my house in ${locationLabel(citySlug).toLowerCase()} ny`,
          `sell house fast in ${locationLabel(citySlug).toLowerCase()} ny`,
        ],
      });
    }
  }

  const agentRecords = [];
  for (const agentSlug of agents) {
    const agent = await loadAgent(siteDir, agentSlug);
    if (!agent) continue;
    for (const citySlug of locations) {
      agentRecords.push({ agent, citySlug });
      registryPages.push({
        slug: agentLocationSlug(agent.slug, citySlug),
        pageType: 'rea-agent-location',
        active: true,
        locales: ['en'],
        priority: 0.82,
        keywords: [
          `${(agent.name || titleCaseName(agent.slug)).toLowerCase()} ${locationLabel(citySlug).toLowerCase()} real estate agent`,
          `best real estate agent in ${locationLabel(citySlug).toLowerCase()} ny`,
          `buy house in ${locationLabel(citySlug).toLowerCase()} ny`,
        ],
      });
    }
  }

  const registry = { pages: registryPages };

  await fs.writeFile(
    path.join(siteDir, 'seo-pages.json'),
    JSON.stringify(registry, null, 2),
    'utf-8',
  );

  for (const citySlug of locations) {
    const page = buildPage(citySlug, locations);
    await fs.writeFile(
      path.join(enSeoDir, `${locationSlug(citySlug)}.json`),
      JSON.stringify(page, null, 2),
      'utf-8',
    );
  }

  if (includeIntentPages) {
    for (const citySlug of locations) {
      const buyPage = buildBuyLocationPage(citySlug, locations);
      await fs.writeFile(
        path.join(enSeoDir, `${buyLocationSlug(citySlug)}.json`),
        JSON.stringify(buyPage, null, 2),
        'utf-8',
      );

      const sellPage = buildSellLocationPage(citySlug, locations);
      await fs.writeFile(
        path.join(enSeoDir, `${sellLocationSlug(citySlug)}.json`),
        JSON.stringify(sellPage, null, 2),
        'utf-8',
      );
    }
  }

  for (const record of agentRecords) {
    const page = buildAgentLocationPage(record.agent, record.citySlug, locations);
    await fs.writeFile(
      path.join(enSeoDir, `${agentLocationSlug(record.agent.slug, record.citySlug)}.json`),
      JSON.stringify(page, null, 2),
      'utf-8',
    );
  }

  const intentCount = includeIntentPages ? locations.length * 2 : 0;
  console.log(`Seeded ${locations.length} location pages, ${agentRecords.length} agent-location pages, and ${intentCount} buy/sell intent pages for site "${SITE_ID}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

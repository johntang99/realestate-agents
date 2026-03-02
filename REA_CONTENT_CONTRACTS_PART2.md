# BAAM System G2 — REA Content Contracts
# Part 2 of 3: Page Contracts (P1–P12)

> **Document:** REA_CONTENT_CONTRACTS_PART2.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Version:** 1.0
> **Date:** March 2026
> **Part:** 2 of 3 — Page Contracts
> **Cursor usage:** Attach during Phase 1 (core pages) and Phase 2 (service + content pages)
> **Reference:** `@REA_COMPLETE_PLAN.md` + `@REA_CONTENT_CONTRACTS_PART1.md`

---

## Page Contracts Index

- [P1: home.json](#p1-homejson)
- [P2: about.json](#p2-aboutjson)
- [P3: buying.json](#p3-buyingjson)
- [P4: selling.json](#p4-sellingjson)
- [P5: investing.json](#p5-investingjson)
- [P6: relocating.json](#p6-relocatingjson)
- [P7: home-valuation.json](#p7-home-valuationjson)
- [P8: contact.json](#p8-contactjson)
- [P9: properties.json](#p9-propertiesjson)
- [P10: sold.json](#p10-soldjson)
- [P11: blog.json](#p11-blogjson)
- [P12: faq.json](#p12-faqjson)

**Note:** case-studies.json, testimonials.json, market-reports.json, neighborhoods.json, and resources.json are in Part 3 (collection-driven pages).

---

## Layout File Convention

Every page has two files:
- `content/jinpang-homes/en/pages/[slug].json` — content data
- `content/jinpang-homes/en/pages/[slug].layout.json` — section order array

Layout file format:
```json
{ "sections": ["hero", "goalPaths", "intro", "stats", "..."] }
```

---

## P1: home.json

**File:** `content/jinpang-homes/en/pages/home.json`
**Route:** `/[locale]`
**Layout:** `pages/home.layout.json`

### Schema

```typescript
interface HomePage {
  seo: PageSeo
  hero: {
    variant: "agent-brand-full" | "split-image" | "editorial"
    headline: string
    subline: string
    bilingualBadge: boolean        // Shows "EN + 中文" badge
    image: string                  // Agent photo URL
    imageAlt: string
    ctaPrimary: Cta
    ctaSecondary: Cta
    scrollIndicator: boolean
    overlayOpacity?: number
  }
  goalPaths: {
    heading: string
    subheading?: string
    paths: GoalPath[]
  }
  intro: {
    heading: string
    body: string                   // Rich text / markdown
    pullQuote?: string
    image: string
    imageAlt: string
    ctaLabel: string
    ctaHref: string
  }
  stats: {
    variant: "dark-bar" | "light-bar" | "cards"
    items: StatItem[]
  }
  featuredListings: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
    maxDisplay: number             // 3 | 6
    featuredSlugs?: string[]       // Optional: pin specific listing slugs
  }
  whyWorkWithMe: {
    heading: string
    subheading?: string
    items: IconItem[]
  }
  soldPreview: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
    maxDisplay: number
  }
  caseStudiesPreview: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
    maxDisplay: number
  }
  testimonialsStrip: {
    variant: "single-rotating" | "three-cards"
    heading?: string
    ctaLabel: string
    ctaHref: string
  }
  neighborhoodsSpotlight: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
    featuredSlugs: string[]        // 3 neighborhood slugs to feature
  }
  marketReportTeaser: {
    heading: string
    ctaLabel: string
    ctaHref: string
  }
  blogPreview: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
    maxDisplay: number
  }
  bilingualCta: {
    headingEn: string
    headingZh: string
    sublineEn?: string
    sublineZh?: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
    bgImage?: string
  }
  contactStrip: {
    heading: string
    subheading?: string
  }
}

interface GoalPath {
  icon: string
  label: string
  labelZh?: string
  subline: string
  sublineZh?: string
  href: string
  bgImage?: string
}

interface StatItem {
  value: string
  label: string
  labelZh?: string
}

interface IconItem {
  icon: string
  title: string
  body: string
}

interface Cta {
  label: string
  href: string
}

interface PageSeo {
  title: string
  description: string
  ogImage?: string
  canonical?: string
}
```

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Jin Pang | Port Jervis & Orange County NY Real Estate Agent",
    "description": "Jin Pang is Port Jervis's top bilingual real estate agent serving buyers, sellers, and investors in Orange County NY. Expert service in English and Chinese. Call (845) 555-0142.",
    "ogImage": "/og-home.jpg"
  },
  "hero": {
    "variant": "agent-brand-full",
    "headline": "Your Port Jervis & Orange County Real Estate Expert",
    "subline": "Buying, selling, and investing in Orange County — expert guidance in English and 中文.",
    "bilingualBadge": true,
    "image": "/images/jin-pang-hero.jpg",
    "imageAlt": "Jin Pang — Port Jervis Real Estate Agent",
    "ctaPrimary": { "label": "Find Your Home", "href": "/en/properties" },
    "ctaSecondary": { "label": "Get Your Home's Value", "href": "/en/home-valuation" },
    "scrollIndicator": true,
    "overlayOpacity": 0.42
  },
  "goalPaths": {
    "heading": "How Can I Help You Today?",
    "subheading": "Every real estate journey is different. Choose yours.",
    "paths": [
      {
        "icon": "Home",
        "label": "I Want to Buy",
        "labelZh": "我想买房",
        "subline": "Find your perfect home in Orange County",
        "sublineZh": "在橙县找到您理想的家",
        "href": "/en/buying",
        "bgImage": "/images/goal-buy.jpg"
      },
      {
        "icon": "TrendingUp",
        "label": "I Want to Sell",
        "labelZh": "我想卖房",
        "subline": "Get the best value for your home",
        "sublineZh": "以最佳价格出售您的房产",
        "href": "/en/selling",
        "bgImage": "/images/goal-sell.jpg"
      },
      {
        "icon": "MapPin",
        "label": "I'm Relocating",
        "labelZh": "我要搬迁",
        "subline": "Discover the best neighborhoods for your life",
        "sublineZh": "发现最适合您的社区",
        "href": "/en/relocating",
        "bgImage": "/images/goal-relocate.jpg"
      },
      {
        "icon": "BarChart2",
        "label": "I'm an Investor",
        "labelZh": "我想投资",
        "subline": "Build your portfolio in a high-growth market",
        "sublineZh": "在高增长市场构建您的投资组合",
        "href": "/en/investing",
        "bgImage": "/images/goal-invest.jpg"
      }
    ]
  },
  "intro": {
    "heading": "A Real Estate Agent Who Actually Knows This Market",
    "body": "I'm Jin Pang, and I've spent years building deep expertise in Port Jervis, Orange County, and the tri-state border area. Whether you're buying your first home, selling after decades, or building an investment portfolio, I bring the same personal attention to every transaction.\n\nI work in English and Chinese — which means if you're more comfortable in 中文, we'll work entirely in Chinese, from our first conversation to the closing table. No translation apps. No confusion. Just clear, expert guidance in the language you trust.\n\nI represent buyers and sellers personally. When you work with me, you get me — not an assistant, not a junior agent.",
    "pullQuote": "Your biggest financial decisions deserve a real person who's genuinely invested in your outcome.",
    "image": "/images/jin-pang-about.jpg",
    "imageAlt": "Jin Pang — Orange County Real Estate Agent",
    "ctaLabel": "My Full Story",
    "ctaHref": "/en/about"
  },
  "stats": {
    "variant": "dark-bar",
    "items": [
      { "value": "$45M+", "label": "Sales Volume", "labelZh": "销售总额" },
      { "value": "120+", "label": "Transactions Closed", "labelZh": "成交总数" },
      { "value": "8+", "label": "Years of Experience", "labelZh": "从业年限" },
      { "value": "90+", "label": "Five-Star Reviews", "labelZh": "五星好评" },
      { "value": "12+", "label": "Neighborhoods Served", "labelZh": "服务社区" }
    ]
  },
  "featuredListings": {
    "heading": "Current Listings",
    "subheading": "Handpicked properties across Orange County and the tri-state border area.",
    "ctaLabel": "View All Listings",
    "ctaHref": "/en/properties",
    "maxDisplay": 6
  },
  "whyWorkWithMe": {
    "heading": "Why Work With Me",
    "subheading": "What sets my service apart from other agents in Orange County.",
    "items": [
      {
        "icon": "Languages",
        "title": "True Bilingual Service",
        "body": "Complete real estate guidance in English and Chinese — written, spoken, and negotiated. The only bilingual agent dedicated to Port Jervis and Orange County."
      },
      {
        "icon": "MapPin",
        "title": "Unmatched Local Knowledge",
        "body": "I know every neighborhood, street, school, and market trend in Orange County. You get insider knowledge that no out-of-area agent can match."
      },
      {
        "icon": "User",
        "title": "Personal Representation",
        "body": "You work with me directly — not a team, not a showing assistant. I personally handle your transaction from first conversation to closing day."
      },
      {
        "icon": "BarChart2",
        "title": "Data-Driven Strategy",
        "body": "Every pricing decision, offer strategy, and negotiation is backed by real market data. I don't guess — I analyze."
      }
    ]
  },
  "soldPreview": {
    "heading": "Recent Successes",
    "subheading": "A sample of what I've delivered for buyers and sellers.",
    "ctaLabel": "See Full Track Record",
    "ctaHref": "/en/sold",
    "maxDisplay": 3
  },
  "caseStudiesPreview": {
    "heading": "Real Stories. Real Results.",
    "subheading": "Every transaction has a story. Here are a few of mine.",
    "ctaLabel": "All Case Studies",
    "ctaHref": "/en/case-studies",
    "maxDisplay": 3
  },
  "testimonialsStrip": {
    "variant": "single-rotating",
    "ctaLabel": "Read All Reviews",
    "ctaHref": "/en/testimonials"
  },
  "neighborhoodsSpotlight": {
    "heading": "Explore Orange County Neighborhoods",
    "subheading": "From the tri-state border to the Hudson Valley — find where you belong.",
    "ctaLabel": "All Neighborhoods",
    "ctaHref": "/en/neighborhoods",
    "featuredSlugs": ["port-jervis", "middletown", "warwick"]
  },
  "marketReportTeaser": {
    "heading": "What's the Market Doing?",
    "ctaLabel": "Read the Latest Market Report",
    "ctaHref": "/en/market-reports"
  },
  "blogPreview": {
    "heading": "Knowledge Center",
    "subheading": "Guides, market insights, and local expertise — published regularly.",
    "ctaLabel": "Explore All Articles",
    "ctaHref": "/en/blog",
    "maxDisplay": 3
  },
  "bilingualCta": {
    "headingEn": "Ready to Make Your Move?",
    "headingZh": "准备好开始您的房产之旅了吗？",
    "sublineEn": "Whether you're buying, selling, or investing — I'm here to help. Let's talk.",
    "sublineZh": "无论您是购房、卖房还是投资，我都随时为您提供专业指导。",
    "ctaPrimaryLabel": "Book a Consultation",
    "ctaPrimaryHref": "/en/contact",
    "ctaSecondaryLabel": "预约咨询",
    "ctaSecondaryHref": "/zh/contact",
    "bgImage": "/images/cta-bg.jpg"
  },
  "contactStrip": {
    "heading": "Get in Touch",
    "subheading": "I respond personally within 2 hours during business hours."
  }
}
```

### Layout File

```json
{
  "sections": [
    "hero",
    "goalPaths",
    "intro",
    "stats",
    "featuredListings",
    "whyWorkWithMe",
    "soldPreview",
    "caseStudiesPreview",
    "testimonialsStrip",
    "neighborhoodsSpotlight",
    "marketReportTeaser",
    "blogPreview",
    "bilingualCta",
    "contactStrip"
  ]
}
```

---

## P2: about.json

**File:** `content/jinpang-homes/en/pages/about.json`
**Route:** `/[locale]/about`

### Schema

```typescript
interface AboutPage {
  seo: PageSeo
  hero: {
    headline: string
    subline?: string
    image: string
    imageAlt: string
    variant: "portrait-left" | "centered" | "full-bleed"
  }
  myStory: {
    heading: string
    body: string                   // Rich text — 500–800 words personal story
    image?: string
    imageCaption?: string
  }
  philosophy: {
    heading: string
    subheading?: string
    items: {
      icon: string
      title: string
      body: string
    }[]
  }
  whyPortJervis: {
    heading: string
    body: string
    image: string
    imageAlt: string
  }
  bilingualCommitment: {
    heading: string
    headingZh: string
    body: string
    bodyZh: string
    wechatId?: string
    wechatQrImage?: string
  }
  stats: {
    items: StatItem[]
  }
  credentials: {
    heading: string
    licenseNumber: string
    licenseState: string
    licenseType: string
    brokerageName: string
    mlsMembership: string
    certifications: string[]
    continuingEducation?: string
  }
  community: {
    heading: string
    body: string
    image?: string
  }
  workingWithMe: {
    heading: string
    steps: {
      number: string
      title: string
      body: string
    }[]
  }
  cta: {
    heading: string
    subheading?: string
    ctaLabel: string
    ctaHref: string
  }
}
```

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "About Jin Pang | Port Jervis & Orange County Real Estate Agent",
    "description": "Learn about Jin Pang — Port Jervis's bilingual real estate agent with 8+ years of experience serving buyers, sellers, and investors in Orange County, NY."
  },
  "hero": {
    "headline": "My Story",
    "subline": "Why I chose real estate, what I believe, and how I work.",
    "image": "/images/jin-pang-about-hero.jpg",
    "imageAlt": "Jin Pang — About",
    "variant": "portrait-left"
  },
  "myStory": {
    "heading": "How I Got Here",
    "body": "I didn't plan to become a real estate agent. I became one because I saw too many buyers and sellers — particularly Chinese-speaking families — navigate the biggest financial decisions of their lives with inadequate guidance. Agents who didn't speak their language. Systems they didn't understand. Contracts they couldn't read.\n\nI grew up understanding what it means to be between two worlds — fluent in both, but not fully served by either. When I found real estate, I found a profession where I could actually close that gap.\n\nPort Jervis chose me as much as I chose it. The tri-state area is genuinely special — close enough to New York City for a real commute, far enough away to have real space and community. I've watched families who made the move here bloom in ways that surprised even them. I've seen investors find returns they couldn't get in more expensive markets.\n\nEvery transaction I close is someone's life changing. That weight is something I've never taken lightly, and I never will.",
    "image": "/images/jin-pang-story.jpg",
    "imageCaption": "Jin Pang at a local Port Jervis property, Spring 2025."
  },
  "philosophy": {
    "heading": "How I Work",
    "subheading": "Three beliefs that shape every client relationship.",
    "items": [
      {
        "icon": "User",
        "title": "You Work With Me, Not My Team",
        "body": "I don't hand clients off to assistants or junior agents. When you hire me, I personally manage every step — from our first conversation to closing day. That's a commitment, not a marketing line."
      },
      {
        "icon": "MessageSquare",
        "title": "Real Information, Not Cheerleading",
        "body": "You deserve honest analysis, not a cheerleader who tells you what you want to hear. If a house is overpriced, I'll tell you. If your listing price is too high, I'll tell you that too — with the data to back it up."
      },
      {
        "icon": "Languages",
        "title": "Language Is More Than Words",
        "body": "Bilingual service means cultural fluency, not just translation. Understanding how Chinese families approach home buying — the role of feng shui, multi-generational living, investment mindset — makes me a fundamentally better agent for these clients."
      }
    ]
  },
  "whyPortJervis": {
    "heading": "Why Port Jervis & Orange County",
    "body": "I'm not a generalist who dabbles in this market. Port Jervis, Middletown, Goshen, Warwick, Newburgh — I know these communities the way only someone who actually works and lives here can. I know which school zones are improving. I know which streets flood in heavy rain. I know which neighborhoods are three years from becoming desirable and which are already past their peak.\n\nThe Orange County market is in a genuine transition moment — NYC commuters discovering it, remote workers choosing space over proximity, Chinese families building multigenerational homes here. That combination creates opportunities that careful local expertise can capture and avoid.",
    "image": "/images/port-jervis-area.jpg",
    "imageAlt": "Port Jervis, NY — Delaware River area"
  },
  "bilingualCommitment": {
    "heading": "Full Bilingual Service — English and Chinese",
    "headingZh": "提供完整中英双语服务",
    "body": "If you're more comfortable in Chinese, we'll work entirely in Chinese — from our first phone call to reading the purchase contract together. This isn't a translation service. It's native-language real estate guidance by someone who understands the Chinese real estate mindset, family priorities, and investment philosophy.\n\nFor Chinese-speaking clients, working with a non-Chinese agent often means critical nuances get lost. Negotiation tone. Contract implications. What a neighborhood truly offers a Chinese family. I close that gap completely.",
    "bodyZh": "如果您更习惯用中文沟通，我们可以全程使用中文——从第一次电话联系到共同阅读购房合同。这不是翻译服务，而是由真正了解华人购房心理、家庭需求和投资理念的专业人士，以您的母语提供全面的房产服务。\n\n对于华人客户来说，与不懂中文的经纪人合作往往会导致关键细节被忽略——谈判语气、合同含义、一个社区对华人家庭的真实意义。我能够完全弥合这一差距。",
    "wechatId": "jinpanghomes",
    "wechatQrImage": ""
  },
  "stats": {
    "items": [
      { "value": "$45M+", "label": "Career Sales Volume" },
      { "value": "120+", "label": "Transactions Closed" },
      { "value": "8+", "label": "Years in Orange County" },
      { "value": "90+", "label": "Five-Star Reviews" },
      { "value": "2", "label": "Languages Served" },
      { "value": "12+", "label": "Neighborhoods Covered" }
    ]
  },
  "credentials": {
    "heading": "Credentials & License",
    "licenseNumber": "10401300000",
    "licenseState": "NY",
    "licenseType": "Licensed Real Estate Salesperson",
    "brokerageName": "Jin Pang Homes",
    "mlsMembership": "OneKey MLS Member",
    "certifications": [
      "NAR Member — National Association of Realtors",
      "Buyer Representation Specialist",
      "Relocation Specialist",
      "New York State Fair Housing Certified"
    ],
    "continuingEducation": "Annual CE completion — NYS requirements met."
  },
  "community": {
    "heading": "In the Community",
    "body": "Port Jervis and Orange County are more than my market — they're my community. I'm actively involved in local events, connected to area business networks, and committed to the growth and wellbeing of the neighborhoods I serve. Real estate is local, and so am I.",
    "image": "/images/jin-pang-community.jpg"
  },
  "workingWithMe": {
    "heading": "What Working With Me Looks Like",
    "steps": [
      {
        "number": "01",
        "title": "First Conversation",
        "body": "We talk — by phone, video, or in person. I learn what you need, and I tell you honestly what I can deliver. No pressure. Just a real conversation."
      },
      {
        "number": "02",
        "title": "Strategy Session",
        "body": "Whether you're buying, selling, or investing, I prepare a customized analysis: market data, comparable properties, timing strategy, and a clear plan."
      },
      {
        "number": "03",
        "title": "Active Representation",
        "body": "I personally show properties, negotiate offers, coordinate inspections, manage attorney communication, and advocate for your interests at every step."
      },
      {
        "number": "04",
        "title": "Closing & Beyond",
        "body": "I'm present at closing. After closing, I'm still available — for referrals, questions, and any future real estate needs. My clients tend to stay my clients."
      }
    ]
  },
  "cta": {
    "heading": "Let's Talk About Your Real Estate Goals",
    "subheading": "No obligation. Just a real conversation about what you're trying to accomplish.",
    "ctaLabel": "Schedule a Free Consultation",
    "ctaHref": "/en/contact"
  }
}
```

---

## P3: buying.json

**File:** `content/jinpang-homes/en/pages/buying.json`
**Route:** `/[locale]/buying`

### Schema

```typescript
interface BuyingPage {
  seo: PageSeo
  hero: {
    variant: "photo-background" | "split-image"
    headline: string
    subline: string
    image: string
    ctaPrimary: Cta
    ctaSecondary: Cta
    heightVh?: number
  }
  whyBuyWithMe: {
    heading: string
    items: IconItem[]
  }
  myApproach: {
    heading: string
    subheading?: string
    steps: ProcessStep[]
  }
  successStories: {
    heading: string
    subheading?: string
    featuredCaseSlugs: string[]
    ctaLabel: string
    ctaHref: string
  }
  mortgageCalculator: {
    heading: string
    subheading?: string
    disclaimerRef: "site.compliance.calculatorDisclaimer"
    defaultPrice: number
    defaultDownPaymentPct: number
    defaultInterestRate: number
    defaultTermYears: number
  }
  mortgageBasics: {
    heading: string
    items: {
      title: string
      body: string
    }[]
  }
  internationalBuyerGuide: {
    heading: string
    headingZh: string
    body: string
    bodyZh: string
    image?: string
  }
  gatedGuides: {
    heading: string
    subheading?: string
    guides: GatedGuideRef[]
  }
  vendorPartners: {
    heading: string
    subheading?: string
    partners: VendorPartner[]
  }
  faqPreview: {
    heading: string
    items: FaqItem[]
    ctaLabel: string
    ctaHref: string
  }
  showingRequestForm: {
    heading: string
    subheading?: string
  }
  workWithMeCta: {
    heading: string
    subheading: string
    image: string
    ctaLabel: string
    ctaHref: string
  }
}

interface ProcessStep {
  number: string
  title: string
  body: string
  icon?: string
}

interface GatedGuideRef {
  slug: string
  title: string
  description: string
  icon: string
}

interface VendorPartner {
  category: string
  name: string
  description?: string
  phone?: string
  website?: string
}

interface FaqItem {
  question: string
  answer: string
}
```

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Buying a Home in Orange County NY | Jin Pang Real Estate",
    "description": "Expert buyer's agent in Port Jervis and Orange County, NY. English and Chinese service. Mortgage calculator, buyer guides, and personal representation. Call (845) 555-0142."
  },
  "hero": {
    "variant": "photo-background",
    "headline": "Find Your Perfect Home in Orange County",
    "subline": "Expert buyer representation — from first search to closing day. In English and 中文.",
    "image": "/images/buying-hero.jpg",
    "ctaPrimary": { "label": "Search Available Homes", "href": "/en/properties" },
    "ctaSecondary": { "label": "Talk to Me First", "href": "/en/contact" },
    "heightVh": 75
  },
  "whyBuyWithMe": {
    "heading": "Why Buy With Me",
    "items": [
      { "icon": "MapPin", "title": "True Local Access", "body": "I know about listings before they hit the market. My Orange County network means you see opportunities others miss." },
      { "icon": "Gavel", "title": "Competitive Market Strategy", "body": "Orange County is competitive. I prepare buyers to move fast, make strong offers, and win — without overpaying." },
      { "icon": "Languages", "title": "Bilingual Guidance", "body": "Work with me in English or Chinese. Every document, negotiation, and conversation can happen in your preferred language." },
      { "icon": "Heart", "title": "First-Time Buyer Expertise", "body": "I've guided dozens of first-time buyers through the process. I explain everything — twice, in both languages if needed." },
      { "icon": "Building", "title": "New Construction Access", "body": "Buying new construction requires specialized knowledge. I represent buyers in builder negotiations — a service many agents skip." },
      { "icon": "Shield", "title": "Inspection & Contract Protection", "body": "I help buyers understand every contingency, inspection finding, and contract clause — protecting you at every step." }
    ]
  },
  "myApproach": {
    "heading": "My Buying Process",
    "subheading": "What working with me looks like from start to finish.",
    "steps": [
      { "number": "01", "title": "Buyer Consultation", "body": "We meet to discuss your goals, budget, timeline, and must-haves. I learn what you need — including things you might not have thought of yet.", "icon": "MessageSquare" },
      { "number": "02", "title": "Pre-Approval Strategy", "body": "I connect you with trusted lenders and help you get pre-approved at the right amount — neither undershooting nor overextending.", "icon": "FileText" },
      { "number": "03", "title": "Targeted Search", "body": "No endless scrolling. I curate properties that actually match your criteria and alert you the moment matching listings appear.", "icon": "Search" },
      { "number": "04", "title": "Property Showings", "body": "I personally accompany every showing. My job is to spot what you might miss — good and bad — so you make informed decisions.", "icon": "Key" },
      { "number": "05", "title": "Offer & Negotiation", "body": "I analyze comps, advise on offer price and terms, and negotiate on your behalf with full market context and clear strategy.", "icon": "Gavel" },
      { "number": "06", "title": "Inspection & Due Diligence", "body": "I coordinate inspections, review reports with you, and negotiate repairs or credits when issues arise.", "icon": "ClipboardCheck" },
      { "number": "07", "title": "Closing Day", "body": "I walk you through the closing disclosure, attend closing, and make sure you leave with keys and full understanding of what just happened.", "icon": "CheckCircle" }
    ]
  },
  "successStories": {
    "heading": "Buyer Success Stories",
    "subheading": "Real transactions with real outcomes.",
    "featuredCaseSlugs": ["first-time-buyer-port-jervis", "competitive-offer-middletown"],
    "ctaLabel": "All Case Studies",
    "ctaHref": "/en/case-studies"
  },
  "mortgageCalculator": {
    "heading": "Estimate Your Monthly Payment",
    "subheading": "Use this calculator to get a quick estimate. Always consult a licensed lender for your actual numbers.",
    "disclaimerRef": "site.compliance.calculatorDisclaimer",
    "defaultPrice": 350000,
    "defaultDownPaymentPct": 20,
    "defaultInterestRate": 7.0,
    "defaultTermYears": 30
  },
  "mortgageBasics": {
    "heading": "Financing 101",
    "items": [
      { "title": "Pre-Approval vs. Pre-Qualification", "body": "Pre-qualification is a quick estimate. Pre-approval is a verified commitment — and the only one that carries weight in a competitive offer." },
      { "title": "Conventional vs. FHA vs. VA vs. USDA", "body": "Orange County has USDA-eligible areas — meaning zero-down rural loans are available in parts of the market most buyers don't know about." },
      { "title": "Down Payment Assistance Programs", "body": "New York State SONYMA programs offer down payment assistance for first-time buyers. Many eligible buyers never learn about them." },
      { "title": "PMI and How to Avoid It", "body": "Private Mortgage Insurance adds cost to loans below 20% down. There are strategies to minimize or eliminate it — I'll walk you through them." },
      { "title": "Financing for Non-US Citizens", "body": "Chinese nationals and green card holders can absolutely buy property in the US. The lending path is different — I work with lenders who specialize in this." }
    ]
  },
  "internationalBuyerGuide": {
    "heading": "Buying in the US as an International or Chinese-Speaking Buyer",
    "headingZh": "外籍及华人买家购房指南",
    "body": "Buying US real estate as an international buyer or Chinese-speaking family involves a different process than what most agents explain. From ITIN-based financing to understanding title insurance, from wire transfer logistics to the role of real estate attorneys in New York — I guide international buyers through every step that is typically glossed over.",
    "bodyZh": "作为外籍买家或华人家庭在美国购置房产，涉及的流程与大多数经纪人通常解释的截然不同。从基于ITIN的融资方案、到理解产权保险，从电汇转账的具体操作、到纽约州房产律师的角色——我将全程引导国际买家顺利完成每一个通常被忽略的重要环节。",
    "image": "/images/international-buyers.jpg"
  },
  "gatedGuides": {
    "heading": "Free Buyer Guides",
    "subheading": "Download any guide — just leave your email and I'll send it right over.",
    "guides": [
      { "slug": "complete-buyer-guide", "title": "Complete Buyer's Guide to Orange County", "description": "Everything you need to know about buying a home in Orange County, NY — from pre-approval to closing.", "icon": "BookOpen" },
      { "slug": "first-time-buyer-guide", "title": "First-Time Buyer Guide", "description": "A plain-language walkthrough of the entire buying process, written for first-timers.", "icon": "Home" },
      { "slug": "relocation-guide", "title": "Relocating to Orange County Guide", "description": "Neighborhoods, schools, commute options, and lifestyle — everything you need before you move.", "icon": "MapPin" },
      { "slug": "international-buyer-guide", "title": "International Buyer Guide (EN + 中文)", "description": "A complete guide for overseas and Chinese-speaking buyers navigating US real estate.", "icon": "Globe" }
    ]
  },
  "vendorPartners": {
    "heading": "My Trusted Partners",
    "subheading": "Professionals I personally recommend to my buyer clients.",
    "partners": [
      { "category": "Mortgage Lenders", "name": "Trusted Lender — Contact me for referral", "description": "I work with several lenders who specialize in Orange County buyers, including USDA loans and international buyer financing." },
      { "category": "Home Inspectors", "name": "Trusted Inspector — Contact me for referral", "description": "Experienced, thorough home inspectors who know the Orange County housing stock." },
      { "category": "Real Estate Attorneys", "name": "Trusted Attorney — Contact me for referral", "description": "New York real estate transactions require an attorney. I work with attorneys who also serve Chinese-speaking clients." },
      { "category": "Title Companies", "name": "Trusted Title — Contact me for referral", "description": "Efficient title companies familiar with Orange County transactions." }
    ]
  },
  "faqPreview": {
    "heading": "Buyer FAQs",
    "items": [
      { "question": "Do I need a buyer's agent in New York?", "answer": "You're not legally required to have one, but in New York's competitive market, representing yourself against a seller's agent is a significant disadvantage. A buyer's agent costs you nothing — the seller pays agent commissions in most transactions." },
      { "question": "How long does buying a home in Orange County take?", "answer": "From search to closing, the typical timeline is 60–120 days. This varies by market conditions, financing type, and how quickly you find the right property. In competitive situations, contracts can move to accepted offer within days." },
      { "question": "Can I buy in Orange County if I live outside the US?", "answer": "Yes. Non-resident foreigners can purchase property in New York. There are specific financing paths, tax considerations, and legal requirements. I work with international buyers regularly and can walk you through the full process." }
    ],
    "ctaLabel": "All Buyer FAQs",
    "ctaHref": "/en/faq"
  },
  "showingRequestForm": {
    "heading": "Ready to See a Property?",
    "subheading": "Schedule a showing or buyer consultation directly with me."
  },
  "workWithMeCta": {
    "heading": "Your Home Search Deserves a Real Expert",
    "subheading": "I personally represent every buyer client. Let's find your home together.",
    "image": "/images/jin-pang-buying.jpg",
    "ctaLabel": "Let's Talk",
    "ctaHref": "/en/contact"
  }
}
```

---

## P4: selling.json

**File:** `content/jinpang-homes/en/pages/selling.json`
**Route:** `/[locale]/selling`

### Schema

```typescript
interface SellingPage {
  seo: PageSeo
  hero: {
    variant: "photo-background" | "split-image"
    headline: string
    subline: string
    image: string
    statsInline: { value: string; label: string }[]
    ctaPrimary: Cta
    ctaSecondary: Cta
    heightVh?: number
  }
  marketingApproach: {
    heading: string
    subheading?: string
    items: IconItem[]
  }
  sellerResults: {
    heading: string
    subheading?: string
    featuredCaseSlugs: string[]
    statsHighlights: { value: string; label: string }[]
    ctaLabel: string
    ctaHref: string
  }
  homeValuationCta: {
    heading: string
    subheading: string
    body: string
    image: string
    ctaLabel: string
    ctaHref: string
  }
  sellingProcess: {
    heading: string
    steps: ProcessStep[]
  }
  stagingTips: {
    heading: string
    subheading?: string
    tips: { title: string; body: string }[]
    image?: string
  }
  gatedGuides: {
    heading: string
    guides: GatedGuideRef[]
  }
  vendorPartners: {
    heading: string
    partners: VendorPartner[]
  }
  sellerTestimonialsPreview: {
    heading: string
    featuredSlugs?: string[]
    ctaLabel: string
    ctaHref: string
  }
  faqPreview: {
    heading: string
    items: FaqItem[]
    ctaLabel: string
    ctaHref: string
  }
  workWithMeCta: {
    heading: string
    subheading: string
    image: string
    ctaLabel: string
    ctaHref: string
  }
}
```

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Sell Your Home in Orange County NY | Jin Pang Real Estate",
    "description": "List with Jin Pang and sell your Orange County home faster and for more. Expert marketing, honest pricing strategy, and personal representation. Call (845) 555-0142."
  },
  "hero": {
    "variant": "photo-background",
    "headline": "Sell Your Home for More. In Less Time.",
    "subline": "Strategic marketing, expert pricing, and personal representation from listing to closing.",
    "image": "/images/selling-hero.jpg",
    "statsInline": [
      { "value": "98.5%", "label": "Avg Sale-to-List Ratio" },
      { "value": "28", "label": "Avg Days on Market" }
    ],
    "ctaPrimary": { "label": "Get Your Home's Value", "href": "/en/home-valuation" },
    "ctaSecondary": { "label": "Talk to Me First", "href": "/en/contact" },
    "heightVh": 75
  },
  "marketingApproach": {
    "heading": "How I Market Your Home",
    "subheading": "Most agents put your home on MLS and wait. I don't.",
    "items": [
      { "icon": "Camera", "title": "Professional Photography", "body": "Included with every listing. Wide-angle lenses, natural light, staging consultation. First impressions happen online — I make yours count." },
      { "icon": "Video", "title": "Drone & Video Tour", "body": "For properties with land, water views, or distinctive exteriors — drone photography and walkthrough videos that MLS photos can't capture." },
      { "icon": "Globe", "title": "MLS + Portal Syndication", "body": "Your listing appears on Zillow, Realtor.com, Trulia, and 50+ portal sites within hours of going live." },
      { "icon": "Instagram", "title": "Social Media Campaigns", "body": "Targeted social media reach to buyers actively looking in Orange County — including Chinese-language campaigns that most agents ignore." },
      { "icon": "Mail", "title": "Email to Active Buyers", "body": "I maintain a database of active buyers in the market. Your listing goes directly to people already looking to buy." },
      { "icon": "Home", "title": "Open House Strategy", "body": "Strategic open house scheduling timed to market activity peaks, with professional presentation and follow-up on every attendee." }
    ]
  },
  "sellerResults": {
    "heading": "What I've Delivered for Sellers",
    "subheading": "Not claims. Actual transaction results.",
    "featuredCaseSlugs": ["seller-above-asking-warwick", "quick-sale-port-jervis"],
    "statsHighlights": [
      { "value": "98.5%", "label": "Average Sale-to-List Price Ratio" },
      { "value": "28 days", "label": "Average Days on Market" },
      { "value": "75%", "label": "Of Listings Sold at or Above Asking" }
    ],
    "ctaLabel": "All Seller Case Studies",
    "ctaHref": "/en/case-studies"
  },
  "homeValuationCta": {
    "heading": "What Is Your Home Worth?",
    "subheading": "Get a real answer — not a Zillow estimate.",
    "body": "I prepare a personalized Comparative Market Analysis (CMA) — real comps, actual sold data, and my local market knowledge — delivered within 24 hours. No obligation. No pressure. Just the real number.",
    "image": "/images/valuation-cta.jpg",
    "ctaLabel": "Request Your Free Valuation",
    "ctaHref": "/en/home-valuation"
  },
  "sellingProcess": {
    "heading": "The Selling Process",
    "steps": [
      { "number": "01", "title": "Listing Consultation", "body": "We meet at your home. I evaluate condition, discuss your goals, and explain my full marketing plan.", "icon": "MessageSquare" },
      { "number": "02", "title": "Pricing Strategy", "body": "I analyze recent comparable sales and active competition to price your home to sell at maximum value — not just to sit on market.", "icon": "BarChart2" },
      { "number": "03", "title": "Home Preparation", "body": "I provide a staging consultation and a prioritized prep list — what to fix, what to skip, what to stage.", "icon": "Home" },
      { "number": "04", "title": "Professional Photography", "body": "Photography session scheduled. Your listing goes live with the best possible visual presentation.", "icon": "Camera" },
      { "number": "05", "title": "Go Live & Showings", "body": "Your home is listed across MLS and all major portals. I coordinate all showings and collect feedback after each one.", "icon": "Key" },
      { "number": "06", "title": "Offers & Negotiation", "body": "I review every offer with you, explain terms and net proceeds, and negotiate to get you the best result — not just any result.", "icon": "Gavel" },
      { "number": "07", "title": "Under Contract to Close", "body": "I manage inspection response, attorney communication, appraisal, and all closing logistics through closing day.", "icon": "CheckCircle" }
    ]
  },
  "stagingTips": {
    "heading": "Preparing Your Home to Sell",
    "subheading": "Practical steps that make a measurable difference in sale price and time on market.",
    "tips": [
      { "title": "Declutter Ruthlessly", "body": "Buyers need to visualize themselves in the space. Personal items, excess furniture, and clutter prevent that. Less is always more." },
      { "title": "Deep Clean Everything", "body": "Clean homes sell for more. Hire a professional cleaner before photography and before the first showing." },
      { "title": "Curb Appeal Matters Most", "body": "The photo of the front of your home is the single most viewed image in any listing. Fresh mulch, painted front door, trimmed shrubs — high ROI." },
      { "title": "Neutral Paint Colors", "body": "Strong personal color choices narrow your buyer pool. A neutral palette costs $500–$1,500 and can add thousands to your sale price." },
      { "title": "Address the Small Things", "body": "Dripping faucets, broken light switches, missing cabinet hardware — buyers notice everything and assume worse if small things are ignored." }
    ]
  },
  "gatedGuides": {
    "heading": "Free Seller Resources",
    "guides": [
      { "slug": "seller-complete-guide", "title": "Seller's Complete Guide", "description": "Everything from listing to closing — in plain language.", "icon": "BookOpen" },
      { "slug": "staging-checklist", "title": "Home Staging Checklist", "description": "Room-by-room staging prep to maximize your sale price.", "icon": "ClipboardCheck" },
      { "slug": "timing-guide", "title": "When to Sell: Timing Guide", "description": "Orange County market seasonality and how timing affects your net proceeds.", "icon": "Calendar" },
      { "slug": "moving-checklist", "title": "Moving Checklist", "description": "A comprehensive moving checklist so nothing gets missed.", "icon": "Truck" }
    ]
  },
  "vendorPartners": {
    "heading": "My Trusted Seller Partners",
    "partners": [
      { "category": "Contractors", "name": "Trusted Contractor — Contact me for referral", "description": "Pre-listing repair work done right, on time." },
      { "category": "Staging", "name": "Trusted Stager — Contact me for referral", "description": "Professional staging for vacant and occupied homes." },
      { "category": "Moving Companies", "name": "Trusted Movers — Contact me for referral", "description": "Reliable local and long-distance moving services." }
    ]
  },
  "sellerTestimonialsPreview": {
    "heading": "What Sellers Say",
    "ctaLabel": "All Testimonials",
    "ctaHref": "/en/testimonials"
  },
  "faqPreview": {
    "heading": "Seller FAQs",
    "items": [
      { "question": "How do you determine the right asking price?", "answer": "I prepare a detailed Comparative Market Analysis using recent comparable sales (not Zillow estimates), current active competition, and market trend data. The goal is to price where we attract multiple buyers without leaving money on the table." },
      { "question": "What is your commission?", "answer": "My commission structure is competitive and transparent. Let's discuss your specific situation — contact me for a direct conversation." },
      { "question": "How long will it take to sell my home?", "answer": "In today's Orange County market, correctly priced homes in good condition typically sell in 20–45 days. Overpriced homes sit — and sitting homes become stigmatized. Pricing right from the start is the single most important decision." }
    ],
    "ctaLabel": "All Seller FAQs",
    "ctaHref": "/en/faq"
  },
  "workWithMeCta": {
    "heading": "Your Home Is Your Biggest Asset — Protect It",
    "subheading": "I'll tell you honestly what your home is worth and exactly what I'll do to sell it for the most.",
    "image": "/images/jin-pang-selling.jpg",
    "ctaLabel": "Get Your Free Home Valuation",
    "ctaHref": "/en/home-valuation"
  }
}
```

---

## P5: investing.json

**File:** `content/jinpang-homes/en/pages/investing.json`
**Route:** `/[locale]/investing`

### Schema

```typescript
interface InvestingPage {
  seo: PageSeo
  hero: {
    variant: "photo-background"
    headline: string
    subline: string
    image: string
    marketSnapshot: { value: string; label: string }[]
    ctaPrimary: Cta
    ctaSecondary: Cta
  }
  investmentCase: {
    heading: string
    body: string
    keyPoints: { icon: string; title: string; body: string }[]
  }
  investmentTypes: {
    heading: string
    types: { icon: string; title: string; body: string; href?: string }[]
  }
  rentalMarketData: {
    heading: string
    subheading?: string
    lastUpdated: string
    areas: {
      neighborhood: string
      avgRent1BR: string
      avgRent2BR: string
      avgRent3BR: string
      grossYieldRange: string
    }[]
    disclaimer: string
  }
  capRateCalculator: {
    heading: string
    subheading?: string
    disclaimerRef: "site.compliance.calculatorDisclaimer"
    defaults: {
      propertyPrice: number
      monthlyRent: number
      vacancyPct: number
      annualExpenses: number
    }
  }
  rentalYieldCalculator: {
    heading: string
    subheading?: string
    disclaimerRef: "site.compliance.calculatorDisclaimer"
    defaults: {
      purchasePrice: number
      monthlyRent: number
    }
  }
  investmentCaseStudies: {
    heading: string
    featuredCaseSlugs: string[]
    ctaLabel: string
    ctaHref: string
  }
  offMarketSignup: {
    heading: string
    subheading: string
    body: string
  }
  exchangeGuide: {
    heading: string
    body: string
  }
  investorConsultationForm: {
    heading: string
    subheading?: string
    fields: string[]
  }
}
```

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Investment Properties Orange County NY | Jin Pang Real Estate",
    "description": "Invest in Orange County NY real estate with Jin Pang. CAP rate calculator, rental yield data, investment case studies, and bilingual investor guidance. Call (845) 555-0142."
  },
  "hero": {
    "variant": "photo-background",
    "headline": "Build Wealth in Orange County Real Estate",
    "subline": "Strong rental demand, growing appreciation, and below-metro pricing create a genuine investment opportunity.",
    "image": "/images/investing-hero.jpg",
    "marketSnapshot": [
      { "value": "5–8%", "label": "Typical Gross Rental Yield" },
      { "value": "12%", "label": "YoY Median Price Appreciation (2024)" },
      { "value": "97%", "label": "Rental Occupancy Rate, Orange County" }
    ],
    "ctaPrimary": { "label": "See Investment Opportunities", "href": "/en/properties" },
    "ctaSecondary": { "label": "Schedule Investor Consultation", "href": "/en/contact" }
  },
  "investmentCase": {
    "heading": "Why Invest in Orange County, NY",
    "body": "Orange County sits at an inflection point. NYC commuters priced out of Orange County and Bergen County are discovering it. Remote workers are choosing it for space and lifestyle. Chinese-American families are building multigenerational homes here. And the price entry points are still dramatically below comparable suburban markets.\n\nThe infrastructure is following the people: Metro-North expansion planning, I-84 corridor development, and a growing services economy are creating the conditions for sustained appreciation. Early movers are capturing the best yields.",
    "keyPoints": [
      { "icon": "TrendingUp", "title": "Strong Appreciation Trajectory", "body": "Median prices in Orange County have appreciated 12% year-over-year with constrained new supply in desirable areas." },
      { "icon": "Users", "title": "High Rental Demand", "body": "Inbound migration from NYC and surrounding counties keeps rental vacancy rates below 4% in core areas." },
      { "icon": "DollarSign", "title": "Below-Metro Entry Pricing", "body": "Purchase prices 40–60% below equivalent Orange County and Bergen County properties with similar commute access." },
      { "icon": "Star", "title": "STR Opportunity", "body": "The Hudson Valley tourism economy creates short-term rental income potential in areas like Warwick, Greenwood Lake, and Goshen." }
    ]
  },
  "investmentTypes": {
    "heading": "Investment Types I Support",
    "types": [
      { "icon": "Home", "title": "Single-Family Rentals", "body": "The most accessible entry point. Strong long-term tenant base in Orange County's growing commuter population." },
      { "icon": "Building2", "title": "Multifamily (2–6 Units)", "body": "2–4 unit properties qualify for residential financing. Orange County has strong multifamily inventory at accessible price points." },
      { "icon": "Repeat", "title": "1031 Exchange", "body": "Defer capital gains by rolling proceeds into a like-kind property. I work with qualified intermediaries and can coordinate the full transaction timeline." },
      { "icon": "Airplay", "title": "Short-Term Rental (STR/Airbnb)", "body": "Hudson Valley's tourism demand creates STR income potential. Local regulations vary by municipality — I know which areas permit STRs." },
      { "icon": "Hammer", "title": "Fix and Flip", "body": "Orange County has a mix of dated housing stock with strong ARV potential. I know contractors and can assess renovation scope." },
      { "icon": "TreePine", "title": "Land / Development", "body": "Rural land and development parcels in the tri-state border area at prices that urban-adjacent land elsewhere commands multiples of." }
    ]
  },
  "rentalMarketData": {
    "heading": "Orange County Rental Market Data",
    "subheading": "Current average rents by area — updated quarterly.",
    "lastUpdated": "Q1 2026",
    "areas": [
      { "neighborhood": "Port Jervis", "avgRent1BR": "$1,200–$1,500", "avgRent2BR": "$1,600–$2,000", "avgRent3BR": "$2,000–$2,600", "grossYieldRange": "6–8%" },
      { "neighborhood": "Middletown", "avgRent1BR": "$1,400–$1,800", "avgRent2BR": "$1,800–$2,200", "avgRent3BR": "$2,200–$2,800", "grossYieldRange": "5.5–7.5%" },
      { "neighborhood": "Newburgh", "avgRent1BR": "$1,300–$1,700", "avgRent2BR": "$1,700–$2,100", "avgRent3BR": "$2,100–$2,700", "grossYieldRange": "5–7%" },
      { "neighborhood": "Goshen", "avgRent1BR": "$1,500–$1,900", "avgRent2BR": "$1,900–$2,400", "avgRent3BR": "$2,400–$3,000", "grossYieldRange": "5–6.5%" },
      { "neighborhood": "Warwick", "avgRent1BR": "$1,600–$2,000", "avgRent2BR": "$2,000–$2,500", "avgRent3BR": "$2,500–$3,200", "grossYieldRange": "4.5–6%" }
    ],
    "disclaimer": "Rental data is approximate, based on available market information, and is provided for illustrative purposes only. Actual rents vary by property condition, size, and market conditions. This is not a guarantee of rental income."
  },
  "capRateCalculator": {
    "heading": "CAP Rate Calculator",
    "subheading": "Analyze any potential investment property with this interactive tool.",
    "disclaimerRef": "site.compliance.calculatorDisclaimer",
    "defaults": {
      "propertyPrice": 350000,
      "monthlyRent": 2200,
      "vacancyPct": 5,
      "annualExpenses": 8000
    }
  },
  "rentalYieldCalculator": {
    "heading": "Quick Rental Yield Calculator",
    "subheading": "Fast gross yield estimate for any property.",
    "disclaimerRef": "site.compliance.calculatorDisclaimer",
    "defaults": {
      "purchasePrice": 300000,
      "monthlyRent": 2000
    }
  },
  "investmentCaseStudies": {
    "heading": "Investment Transaction Case Studies",
    "featuredCaseSlugs": ["multifamily-port-jervis-investor", "str-warwick-acquisition"],
    "ctaLabel": "All Case Studies",
    "ctaHref": "/en/case-studies"
  },
  "offMarketSignup": {
    "heading": "Get Early Access to Investment Opportunities",
    "subheading": "Off-market and pre-market deals come through agent networks first.",
    "body": "Leave your criteria and contact information. When a property matches your parameters — before it hits MLS — I'll reach out directly."
  },
  "exchangeGuide": {
    "heading": "1031 Exchange: The Basics",
    "body": "A 1031 exchange allows you to sell an investment property and roll the proceeds into a like-kind replacement property — deferring capital gains tax. Key rules: identify the replacement property within 45 days of closing, complete the purchase within 180 days, and use a qualified intermediary to hold proceeds between transactions. I've guided clients through multiple 1031 exchanges and work with trusted intermediaries who can manage the transaction structure."
  },
  "investorConsultationForm": {
    "heading": "Schedule an Investor Consultation",
    "subheading": "Tell me what you're looking for — I'll tell you honestly what's available and what to expect.",
    "fields": ["name", "email", "phone", "investmentType", "budgetRange", "timeline", "currentPortfolio", "goals", "preferredLanguage"]
  }
}
```

---

## P6: relocating.json

**File:** `content/jinpang-homes/en/pages/relocating.json`
**Route:** `/[locale]/relocating`

### Seed JSON (EN — abbreviated schema, mirrors buying.json pattern)

```json
{
  "seo": {
    "title": "Relocating to Orange County NY | Jin Pang Real Estate",
    "description": "Moving to Port Jervis or Orange County, NY? Jin Pang provides bilingual relocation guidance for families, NYC commuters, and international buyers. Download free relocation guide."
  },
  "hero": {
    "variant": "photo-background",
    "headline": "Welcome to Orange County, NY. I'll Help You Find Your Place Here.",
    "subline": "Local knowledge, bilingual guidance, and genuine care for families making the move.",
    "image": "/images/relocating-hero.jpg",
    "ctaPrimary": { "label": "Download Relocation Guide", "href": "#gated-guides" },
    "ctaSecondary": { "label": "Schedule a Consultation", "href": "/en/contact" }
  },
  "whyOrangeCounty": {
    "heading": "Why Families Choose Orange County",
    "body": "Orange County sits in a sweet spot — far enough from New York City to have real space, community, and affordability, close enough to commute when it matters. The Delaware River, the Shawangunk Mountains, the Hudson Valley lifestyle — these are genuine quality-of-life advantages that people discover and never want to leave.\n\nFor Chinese-speaking families in particular, Orange County offers something rare: a growing Chinese-American community in a market that's still accessible, before prices reflect what it's becoming.",
    "highlights": [
      { "icon": "Train", "title": "Real NYC Access", "body": "Port Jervis Metro-North line runs directly to Penn Station. Drive time to I-87 and I-84 on-ramps is under 15 minutes." },
      { "icon": "DollarSign", "title": "Real Affordability", "body": "Median home prices 40–60% below Orange County and Bergen County — with more space, land, and community." },
      { "icon": "TreePine", "title": "Outdoor Lifestyle", "body": "Delaware Water Gap, Harriman State Park, Catskill Mountains — world-class outdoor recreation within 30 minutes." },
      { "icon": "Users", "title": "Growing Community", "body": "A growing Chinese-American and multicultural community in a market that's welcoming and still undiscovered by most." }
    ]
  },
  "commuterGuide": {
    "heading": "The Commuter's Guide",
    "items": [
      { "route": "Port Jervis → NYC Penn Station", "mode": "Metro-North Rail", "time": "~90 min", "cost": "~$450/month monthly pass" },
      { "route": "Port Jervis → NYC", "mode": "Drive (I-84 E)", "time": "75–90 min off-peak", "cost": "Varies" },
      { "route": "Middletown → NYC", "mode": "Drive (I-84 E)", "time": "60–75 min off-peak", "cost": "Varies" },
      { "route": "Newburgh → NYC", "mode": "Drive (I-84 E)", "time": "65–80 min off-peak", "cost": "Varies" }
    ]
  },
  "areaQuickFacts": {
    "heading": "Orange County at a Glance",
    "facts": [
      { "label": "Population", "value": "~420,000" },
      { "label": "County Seat", "value": "Goshen, NY" },
      { "label": "Median Home Price", "value": "~$420,000 (2026)" },
      { "label": "Median Household Income", "value": "~$82,000" },
      { "label": "Climate", "value": "Four distinct seasons; avg 40 inches annual snowfall" },
      { "label": "Nearest Major Airport", "value": "Stewart International (SWF) — 25 min; JFK/EWR — 80 min" }
    ]
  },
  "schoolGuide": {
    "heading": "School Districts in Orange County",
    "intro": "School quality varies significantly by district in Orange County. I help relocating families research specific schools and map their neighborhood search to district boundaries.",
    "districts": [
      { "name": "Warwick Valley CSD", "towns": "Warwick, Florida, Greenwood Lake", "rating": "8/10", "notes": "Consistently high-rated. Popular with families." },
      { "name": "Goshen CSD", "towns": "Goshen, Chester", "rating": "7/10", "notes": "Strong academics, smaller class sizes." },
      { "name": "Middletown CSD", "towns": "Middletown, Wallkill", "rating": "5/10", "notes": "Larger urban district. Private school alternatives nearby." },
      { "name": "Port Jervis CSD", "towns": "Port Jervis", "rating": "5/10", "notes": "Improving. New leadership initiatives in recent years." },
      { "name": "Monroe-Woodbury CSD", "towns": "Monroe, Central Valley", "rating": "7/10", "notes": "Growing district, strong STEM programs." }
    ],
    "note": "School ratings are from publicly available sources and are provided for general reference only. Families should conduct their own research for current academic performance data."
  },
  "internationalRelocatorGuide": {
    "heading": "Relocating to Orange County as an International or Chinese-Speaking Family",
    "headingZh": "外籍及华人家庭搬迁至橙县指南",
    "body": "For Chinese-speaking families relocating from China, Hong Kong, Taiwan, or other US cities, Orange County offers something rare: a growing Chinese-American community, accessibility to NYC's Chinese neighborhoods via transit, and home prices that are still achievable.\n\nI personally guide international families through every step — from understanding the US purchase process to connecting with Chinese-speaking schools, community organizations, and service providers in the area.",
    "bodyZh": "对于从中国大陆、香港、台湾或美国其他城市搬迁而来的华人家庭，橙县提供了一个难得的机会：不断壮大的华人社区、便捷的纽约市华人社区交通连接，以及仍然负担得起的房价。\n\n我亲自引导海外家庭完成每一个步骤——从了解美国购房流程，到联系当地中文学校、华人社区组织和服务提供商。"
  },
  "gatedGuides": {
    "heading": "Free Relocation Resources",
    "guides": [
      { "slug": "relocation-guide", "title": "Complete Orange County Relocation Guide", "description": "Neighborhoods, schools, commute, lifestyle — everything before you move.", "icon": "MapPin" },
      { "slug": "international-buyer-guide", "title": "International & Chinese Buyer Guide (EN + 中文)", "description": "The complete guide for overseas families buying in the US.", "icon": "Globe" },
      { "slug": "school-districts-guide", "title": "Orange County School Districts Guide", "description": "Detailed breakdown of every major school district.", "icon": "GraduationCap" },
      { "slug": "commuter-guide", "title": "NYC Commuter's Guide to Orange County", "description": "Every commute route, cost, and time — for remote and office commuters.", "icon": "Train" }
    ]
  },
  "workWithMeCta": {
    "heading": "Moving to Orange County? Let's Find the Right Neighborhood for Your Life.",
    "subheading": "I'll help you understand every neighborhood before you commit to one.",
    "image": "/images/jin-pang-relocating.jpg",
    "ctaLabel": "Schedule a Relocation Consultation",
    "ctaHref": "/en/contact"
  }
}
```

---

## P7: home-valuation.json

**File:** `content/jinpang-homes/en/pages/home-valuation.json`
**Route:** `/[locale]/home-valuation`

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Free Home Valuation | Orange County NY | Jin Pang",
    "description": "Get a free, personalized home valuation from Jin Pang — not a Zillow estimate. Real comps, real market knowledge, delivered within 24 hours. Serving Orange County, NY."
  },
  "hero": {
    "headline": "What Is Your Home Worth?",
    "subline": "Get a real answer — not an algorithm's guess. My personalized CMA is delivered within 24 hours.",
    "image": "/images/valuation-hero.jpg",
    "ctaPrimary": { "label": "Request Free Valuation", "href": "#valuation-form" }
  },
  "whyMyValuation": {
    "heading": "Why My Valuation Is Different",
    "points": [
      { "icon": "User", "title": "Personal Analysis", "body": "I prepare your Comparative Market Analysis personally — not a bot, not an algorithm. I look at the actual comps, the condition, the location, and my knowledge of current buyer demand." },
      { "icon": "Clock", "title": "Within 24 Hours", "body": "I deliver your valuation within 24 hours of your request. No waiting for a generic report." },
      { "icon": "BarChart2", "title": "Real Comparable Sales", "body": "Your valuation is based on actual sold properties — recent sales within your area, appropriately adjusted for size, condition, and features." },
      { "icon": "MessageSquare", "title": "No Pressure Follow-Up", "body": "I'll follow up by phone to walk you through the analysis. No pressure to list — just real information." }
    ]
  },
  "valuationForm": {
    "heading": "Request Your Free Home Valuation",
    "subheading": "Takes 2 minutes. I'll have your personalized report within 24 hours.",
    "fields": ["address", "propertyType", "bedrooms", "bathrooms", "approximateSqft", "yearBuilt", "condition", "recentUpdates", "name", "email", "phone", "preferredLanguage", "additionalNotes"],
    "submitLabel": "Request My Free Valuation",
    "confirmationMessage": "Thank you! I'll prepare your personalized home valuation and reach out within 24 hours.",
    "confirmationMessageZh": "谢谢您！我将为您准备个性化的房屋估值报告，并在24小时内与您联系。"
  },
  "whatHappensNext": {
    "heading": "What Happens After You Submit",
    "steps": [
      { "number": "01", "title": "I Review Your Submission", "body": "I personally review your property details and begin pulling comparable sales in your area." },
      { "number": "02", "title": "I Prepare Your CMA", "body": "A Comparative Market Analysis using real sold data, adjusted for your property's specific characteristics." },
      { "number": "03", "title": "I Reach Out Within 24 Hours", "body": "I email your valuation and follow up by phone to walk you through the numbers and answer any questions." }
    ]
  },
  "sellerTestimonialsPreview": {
    "heading": "What Sellers Say",
    "ctaLabel": "All Testimonials",
    "ctaHref": "/en/testimonials"
  },
  "faqValuation": {
    "heading": "Valuation FAQs",
    "items": [
      { "question": "Is this like a Zillow Zestimate?", "answer": "No. A Zillow Zestimate is an algorithm with no knowledge of your home's actual condition, updates, or local market nuances. My CMA is a professional analysis prepared with real comparable sales and my personal knowledge of the Orange County market." },
      { "question": "Am I obligated to list with you after getting a valuation?", "answer": "Absolutely not. This is a no-obligation service. I provide it because an informed homeowner makes better decisions — whether or not they work with me." },
      { "question": "How current is the data?", "answer": "I use sold transactions from the last 3–6 months, weighted toward the most recent sales, to capture current market conditions." }
    ]
  }
}
```

---

## P8: contact.json

**File:** `content/jinpang-homes/en/pages/contact.json`
**Route:** `/[locale]/contact`

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Contact Jin Pang | Port Jervis & Orange County Real Estate",
    "description": "Contact Jin Pang — bilingual real estate agent in Port Jervis and Orange County, NY. Call, text, email, or use the form. Full Chinese service available."
  },
  "hero": {
    "headline": "Let's Talk.",
    "subline": "I personally respond to every inquiry within 2 hours during business hours.",
    "image": "/images/jin-pang-contact.jpg",
    "imageAlt": "Jin Pang — Contact"
  },
  "directContact": {
    "heading": "Reach Me Directly",
    "phone": "(845) 555-0142",
    "phoneHref": "tel:+18455550142",
    "smsHref": "sms:+18455550142",
    "email": "jin@jinpanghomes.com",
    "emailHref": "mailto:jin@jinpanghomes.com",
    "wechatId": "jinpanghomes",
    "wechatNote": "Add me on WeChat for Chinese-language communication.",
    "wechatNoteZh": "加我微信，用中文无障碍沟通。",
    "responsePromise": "I personally respond within 2 hours during business hours.",
    "responsePromiseZh": "工作时间内，我本人承诺在2小时内回复。"
  },
  "officeHours": {
    "weekdays": "Mon–Fri 9am–6pm",
    "saturday": "Sat 10am–4pm",
    "sunday": "Sun by appointment"
  },
  "contactForm": {
    "heading": "Send a Message",
    "subheading": "I read every message personally.",
    "fields": ["name", "phone", "email", "reason", "message", "preferredLanguage"],
    "reasonOptions": ["Buying a home", "Selling a home", "Home valuation", "Investing", "Relocating", "General question"],
    "reasonOptionsZh": ["购房", "卖房", "房屋估值", "投资", "搬迁", "其他咨询"],
    "submitLabel": "Send Message",
    "submitLabelZh": "发送消息",
    "confirmationMessage": "Message received! I'll be in touch within 2 hours during business hours.",
    "confirmationMessageZh": "已收到您的消息！工作时间内我将在2小时内回复您。"
  },
  "chineseServiceSection": {
    "heading": "Full Chinese Language Service",
    "headingZh": "提供全面中文服务",
    "body": "If you prefer to communicate in Chinese — phone, email, WeChat, or in person — I'm completely fluent and happy to work entirely in Chinese. No translation needed.",
    "bodyZh": "如果您更喜欢用中文沟通——电话、邮件、微信或面谈——我完全能够用中文为您提供全面的服务，无需翻译。",
    "ctaLabel": "Contact in Chinese",
    "ctaLabelZh": "用中文联系我"
  },
  "mapEmbed": {
    "heading": "Service Area",
    "subheading": "Based in Port Jervis — serving all of Orange County and the tri-state border area.",
    "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.0000000000!2d-74.6931!3d41.3751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s21+Painted+Apron+Ter%2C+Port+Jervis%2C+NY+12771!5e0!3m2!1sen!2sus!4v1234567890"
  }
}
```

---

## P9: properties.json

**File:** `content/jinpang-homes/en/pages/properties.json`
**Route:** `/[locale]/properties`

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Properties For Sale | Orange County NY | Jin Pang",
    "description": "Browse Jin Pang's current listings across Port Jervis, Middletown, Goshen, Warwick, and Orange County NY. Search by price, beds, neighborhood, and more."
  },
  "hero": {
    "headline": "Current Listings",
    "subline": "Properties across Orange County and the tri-state border area.",
    "image": "/images/properties-hero.jpg"
  },
  "filterConfig": {
    "statuses": ["active", "pending", "coming-soon", "for-rent"],
    "types": ["Single Family", "Condo", "Townhouse", "Multifamily", "Land", "Commercial"],
    "priceMin": 50000,
    "priceMax": 2000000,
    "priceStep": 25000,
    "bedsOptions": [1, 2, 3, 4, 5],
    "bathsOptions": [1, 1.5, 2, 2.5, 3, 4],
    "enableMapToggle": true,
    "enableNeighborhoodFilter": true
  },
  "idxCta": {
    "enabled": true,
    "heading": "Looking for More?",
    "subheading": "Search the full MLS database for all available Orange County listings.",
    "ctaLabel": "Search All MLS Listings",
    "ctaHref": "/en/search"
  },
  "contactStrip": {
    "heading": "See a Property You Like?",
    "subheading": "Contact me directly to schedule a showing — I'll respond within 2 hours.",
    "ctaLabel": "Request a Showing",
    "ctaHref": "/en/contact"
  }
}
```

---

## P10: sold.json

**File:** `content/jinpang-homes/en/pages/sold.json`
**Route:** `/[locale]/sold`

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Sold Properties | Jin Pang Real Estate Track Record | Orange County NY",
    "description": "See Jin Pang's track record of sold properties across Orange County, NY. Real sales data — price, DOM, sale-to-list ratio. Over 120 transactions closed."
  },
  "hero": {
    "headline": "Proven Track Record",
    "subline": "Over 120 transactions closed across Orange County. Real results, not promises.",
    "image": "/images/sold-hero.jpg"
  },
  "statsHeader": {
    "items": [
      { "value": "$45M+", "label": "Total Sold Volume" },
      { "value": "120+", "label": "Transactions Closed" },
      { "value": "98.5%", "label": "Avg Sale-to-List Ratio" },
      { "value": "28", "label": "Avg Days on Market" }
    ]
  },
  "filterConfig": {
    "years": ["2026", "2025", "2024", "2023", "2022"],
    "priceRanges": ["Under $200K", "$200K–$350K", "$350K–$500K", "$500K–$750K", "$750K+"],
    "types": ["Single Family", "Condo", "Multifamily", "Land"],
    "enableNeighborhoodFilter": true,
    "enableAgentFilter": false
  },
  "featuredSalesHeading": "Highlighted Transactions",
  "caseStudiesCta": {
    "heading": "Want the Full Story?",
    "subheading": "My case studies share the strategy behind the result — not just the numbers.",
    "ctaLabel": "Read Case Studies",
    "ctaHref": "/en/case-studies"
  }
}
```

---

## P11: blog.json

**File:** `content/jinpang-homes/en/pages/blog.json`
**Route:** `/[locale]/blog`

### Seed JSON (EN)

```json
{
  "seo": {
    "title": "Real Estate Blog | Orange County NY Market Insights | Jin Pang",
    "description": "Orange County real estate guides, market reports, neighborhood spotlights, and buyer/seller tips — published by Jin Pang, bilingual agent in Port Jervis, NY."
  },
  "hero": {
    "headline": "Knowledge Center",
    "subline": "Real estate guides, market insights, and local expertise — in English and Chinese.",
    "image": "/images/blog-hero.jpg"
  },
  "categories": [
    { "slug": "market-updates", "label": "Market Updates", "labelZh": "市场动态" },
    { "slug": "buyer-guides", "label": "Buyer Guides", "labelZh": "购房指南" },
    { "slug": "seller-guides", "label": "Seller Guides", "labelZh": "卖房指南" },
    { "slug": "investor-insights", "label": "Investor Insights", "labelZh": "投资洞察" },
    { "slug": "neighborhood-spotlights", "label": "Neighborhood Spotlights", "labelZh": "社区聚焦" },
    { "slug": "relocation", "label": "Relocation", "labelZh": "搬迁指南" },
    { "slug": "lifestyle", "label": "Lifestyle", "labelZh": "生活方式" }
  ],
  "featuredPostSlug": "",
  "postsPerPage": 9,
  "newsletterSignup": {
    "heading": "Get Monthly Market Updates",
    "subheading": "Monthly insights on Orange County real estate — in English and Chinese.",
    "ctaLabel": "Subscribe",
    "ctaLabelZh": "订阅"
  },
  "marketReportCta": {
    "heading": "Looking for Market Data?",
    "subheading": "My monthly market reports have the numbers.",
    "ctaLabel": "View Market Reports",
    "ctaHref": "/en/market-reports"
  }
}
```

---

## P12: faq.json

**File:** `content/jinpang-homes/en/pages/faq.json`
**Route:** `/[locale]/faq`

### Seed JSON (EN — 25 core FAQ items across 6 categories)

```json
{
  "seo": {
    "title": "Real Estate FAQ | Orange County NY | Jin Pang",
    "description": "Answers to the most common real estate questions for buyers, sellers, investors, and relocators in Orange County, NY. In English and Chinese."
  },
  "hero": {
    "headline": "Frequently Asked Questions",
    "subline": "Honest answers to the questions I hear most often.",
    "image": "/images/faq-hero.jpg"
  },
  "categories": [
    {
      "id": "buying",
      "label": "Buying Questions",
      "labelZh": "购房问题",
      "items": [
        { "question": "Do I need a buyer's agent in New York State?", "answer": "You're not legally required to have one, but in New York's competitive market, representing yourself against a seller's trained agent is a serious disadvantage. A buyer's agent typically costs you nothing — in most transactions, the seller pays agent commissions. Since August 2024 NAR settlement rule changes, buyer agent compensation is negotiated separately — I'll walk you through what this means for you." },
        { "question": "How long does buying a home in Orange County take?", "answer": "From starting your search to closing, the typical timeline is 60–120 days. In competitive markets, you may go under contract faster. New construction takes longer — 6–18 months depending on where you are in the build timeline." },
        { "question": "What credit score do I need to buy a home?", "answer": "Conventional loans typically require a 620+ credit score, though the best rates come with 740+. FHA loans can go as low as 580 with 3.5% down. USDA loans (available in parts of Orange County) require 640+. I'll connect you with lenders who can assess your specific situation." },
        { "question": "Can I buy a home in Orange County if I live outside the US?", "answer": "Yes. Foreign nationals can purchase property in New York State. The financing path is different — most conventional lenders require US credit history and may require larger down payments. I work with buyers from China, Hong Kong, and other countries regularly and can connect you with lenders who specialize in international buyer financing." },
        { "question": "What are closing costs in New York?", "answer": "Buyers in New York typically pay 2–4% of the purchase price in closing costs, including attorney fees, title insurance, lender fees, homeowner's insurance prepaid, and taxes. New York State also has a mansion tax (1%+) on purchases over $1M. I'll prepare a detailed estimate for your specific transaction." }
      ]
    },
    {
      "id": "selling",
      "label": "Selling Questions",
      "labelZh": "卖房问题",
      "items": [
        { "question": "How do you determine the right asking price?", "answer": "I prepare a Comparative Market Analysis using actual sold transactions in your area — not Zillow estimates. I look at recent sales of similar properties, adjust for size, condition, location, and upgrades, and factor in current buyer demand. Pricing too high kills momentum; pricing right attracts multiple buyers." },
        { "question": "How long will my home take to sell?", "answer": "In Orange County's current market, correctly priced homes in good condition typically sell in 20–45 days. Overpriced homes sit, and sitting homes lose negotiating power. The data consistently shows that homes priced right from day one net more than homes that chase the market down." },
        { "question": "What does it cost to sell a home in New York?", "answer": "Sellers typically pay agent commissions (negotiable since the 2024 NAR rule changes), NY State transfer tax (0.4%), and your portion of closing costs. Attorney fees, any agreed-upon repairs, and staging costs are additional. I'll prepare a complete net proceeds estimate for your specific situation." },
        { "question": "Should I make repairs before listing?", "answer": "It depends on the repair and your market. I'll walk through your home and provide a prioritized list — what delivers ROI, what buyers will overlook, and what will cost you more than it returns. Not every repair is worth making." },
        { "question": "What is your commission?", "answer": "My commission is competitive and negotiable based on your specific situation. Since the 2024 NAR changes, buyer and seller agent compensation is now handled separately. Let's have a direct conversation — contact me and I'll be transparent about how this works." }
      ]
    },
    {
      "id": "investing",
      "label": "Investing Questions",
      "labelZh": "投资问题",
      "items": [
        { "question": "Is Orange County a good market for investment properties?", "answer": "Yes — for the right investor with the right strategy. Orange County offers yield levels that are difficult to find in more expensive suburban markets, with appreciation driven by inbound NYC commuter and relocator demand. Like any market, success requires understanding local submarkets, tenant demand by area, and realistic expense projections." },
        { "question": "What is a good CAP rate to look for in Orange County?", "answer": "Current Orange County residential investment properties typically yield gross CAP rates of 5–8% depending on area, property type, and condition. Lower-priced areas like Port Jervis tend toward the higher end of this range. Use my CAP rate calculator on the Investing page for specific property analysis." },
        { "question": "Are Airbnb / short-term rentals allowed in Orange County?", "answer": "Short-term rental regulations vary by municipality. Warwick, Greenwood Lake, and some rural areas are STR-friendly. Other municipalities restrict or require permits. Before purchasing with STR intent, verify local regulations — I know which areas permit STRs and which don't." },
        { "question": "What is a 1031 exchange and should I use one?", "answer": "A 1031 exchange lets you sell an investment property and defer capital gains taxes by rolling proceeds into a like-kind replacement property. You have 45 days to identify the replacement and 180 days to close. It requires a qualified intermediary to hold funds between transactions. I've worked with clients on multiple 1031s — contact me to discuss your situation." }
      ]
    },
    {
      "id": "relocating",
      "label": "Relocating Questions",
      "labelZh": "搬迁问题",
      "items": [
        { "question": "What is the NYC commute from Port Jervis really like?", "answer": "Port Jervis has direct Metro-North rail service to Penn Station — approximately 90 minutes one-way. Monthly pass costs approximately $400–$450. The drive via I-84 East is 75–90 minutes off-peak, longer during peak hours. Many residents in our market are hybrid workers commuting 2–3 days per week, which makes the commute very manageable." },
        { "question": "Which Orange County neighborhoods are best for families?", "answer": "It depends heavily on school district preferences, lifestyle priorities, and budget. Warwick, Goshen, and Monroe-Woodbury are consistently popular with families seeking strong schools. Port Jervis offers more affordability. I'll help you map your priorities to the right neighborhoods — a conversation is worth more than a generic list." },
        { "question": "Is there a Chinese community in Orange County?", "answer": "Yes, and it's growing. The Chinese-American community in Orange County is centered around Middletown and the I-84 corridor. There are Chinese grocery stores, restaurants, cultural organizations, and Chinese-language programs in the area. For Chinese-speaking families, this community support makes the transition significantly easier." },
        { "question": "Can I buy a home in Orange County before I relocate?", "answer": "Yes — and I help clients do this regularly. Virtual showings, video walkthroughs, and strong local knowledge allow out-of-area buyers to make informed decisions remotely. I'll be your eyes on the ground for every property visit." }
      ]
    },
    {
      "id": "process",
      "label": "The Process",
      "labelZh": "购房流程",
      "items": [
        { "question": "Do I need a real estate attorney in New York?", "answer": "Yes. Unlike many other states, New York real estate transactions require an attorney for the buyer and typically the seller as well. Your attorney reviews the contract, handles title, manages escrow, and attends closing. I'll connect you with trusted attorneys who also serve Chinese-speaking clients." },
        { "question": "What is an escrow deposit and how much should it be?", "answer": "An escrow deposit (earnest money) is made when you sign the purchase contract — it shows the seller you're serious. In New York, this is typically 10% of the purchase price, held by the seller's attorney until closing." },
        { "question": "What happens at a home inspection?", "answer": "A licensed inspector examines the property's structure, systems (HVAC, plumbing, electrical), and condition. The inspection report is yours — I'll review it with you and advise on which findings to negotiate, which to accept, and which are deal-breakers." }
      ]
    },
    {
      "id": "working-with-jin",
      "label": "Working With Jin",
      "labelZh": "与庞锦合作",
      "items": [
        { "question": "Do you really offer full Chinese-language service?", "answer": "Yes — completely. I'm fluent in both English and Chinese (Mandarin). Every conversation, every document review, every negotiation can happen in Chinese if that's your preference. This isn't translation service — it's native-language real estate guidance." },
        { "question": "Do you work with buyers and sellers at the same time?", "answer": "Yes. I represent buyers, sellers, and investors across Orange County simultaneously. I manage my schedule carefully to ensure every client receives full personal attention." },
        { "question": "What areas do you serve?", "answer": "I'm based in Port Jervis and primarily serve Orange County, NY — including Port Jervis, Middletown, Goshen, Warwick, Newburgh, Huguenot, Sparrowbush, and surrounding areas. I also work with buyers considering properties in nearby Sullivan County, Pike County (PA), and Sussex County (NJ) along the tri-state border." }
      ]
    }
  ]
}
```

---

## Part 2 Done-Gate

Before moving to Part 3 (Collection Contracts), verify:

- [ ] `content/jinpang-homes/en/pages/home.json` + `home.layout.json` — created
- [ ] `content/jinpang-homes/zh/pages/home.json` — Chinese version created
- [ ] `content/jinpang-homes/en/pages/about.json` — created
- [ ] `content/jinpang-homes/en/pages/buying.json` — created
- [ ] `content/jinpang-homes/en/pages/selling.json` — created
- [ ] `content/jinpang-homes/en/pages/investing.json` — created
- [ ] `content/jinpang-homes/en/pages/relocating.json` — created
- [ ] `content/jinpang-homes/en/pages/home-valuation.json` — created
- [ ] `content/jinpang-homes/en/pages/contact.json` — created
- [ ] `content/jinpang-homes/en/pages/properties.json` — created
- [ ] `content/jinpang-homes/en/pages/sold.json` — created
- [ ] `content/jinpang-homes/en/pages/blog.json` — created
- [ ] `content/jinpang-homes/en/pages/faq.json` — created
- [ ] All page JSON files seeded into Supabase `content_entries`
- [ ] All layout.json files created with section order arrays
- [ ] Chinese locale versions created for: home, about, buying, selling, investing, relocating, contact
- [ ] Admin Content Editor shows all page files with correct panels

---

*End of REA_CONTENT_CONTRACTS_PART2.md*
*Next: REA_CONTENT_CONTRACTS_PART3.md — Collection Contracts (Case Studies, Testimonials, Blog Posts, Neighborhoods, Market Reports, Properties, Gated Downloads)*

# BAAM System G2 — REA Phase 3
# Admin Hardening + SEO + Programmatic Pages + Schema.org + Performance

> **File:** REA_PHASE_3.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Phase:** 3 of 5
> **Duration:** Week 4 (Days 19–22)
> **Goal:** Harden the admin CMS (import/export/diff/sync), build all programmatic SEO infrastructure, add schema.org structured data to every page type, generate sitemap + robots.txt, run performance audit and fix all Core Web Vitals issues.
> **Cursor context:** Attach `@REA_COMPLETE_PLAN.md` + `@REA_PHASE_3.md`
> **Prerequisite:** Phase 2 completion gate passed.

---

## Prompt Index

| # | Prompt | Est. Time |
|---|---|---|
| 3A | Admin Hardening — Import / Export / Diff / Sync | 60 min |
| 3B | SEO Infrastructure — Meta, Canonical, hreflang, OG | 45 min |
| 3C | Schema.org Structured Data — All Page Types | 60 min |
| 3D | Sitemap + Robots.txt + Google Search Console Setup | 30 min |
| 3E | Core Web Vitals + Performance Audit | 60 min |

---

## Prompt 3A — Admin Hardening: Import / Export / Diff / Sync

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_COMPLETE_PLAN.md (Section: "Admin Architecture")

GOAL: Verify and harden all admin data management features carried from REB.
These are critical for safe content management — Jin Pang must be able to
export, back up, import, and sync content without risking data loss.

══════════════════════════════════════════
VERIFY: IMPORT / EXPORT SYSTEM
══════════════════════════════════════════

The import/export system is inherited from REB. Verify it works for all
content types specific to REA:

Export tests — run each and confirm valid JSON output:
  Admin → Content → home → Export
    Expected: home.json with all sections, EN locale
  Admin → Content → about → Export
    Expected: about.json with all sections
  Admin → Case Studies → [first item] → Export
    Expected: case-study item JSON with all fields
  Admin → Testimonials → Export all
    Expected: array of all testimonial items
  Admin → Gated Downloads → Export catalog
    Expected: array of all guide items
  Admin → Neighborhoods → [port-jervis] → Export
    Expected: neighborhood item JSON

Import tests — verify round-trip:
  1. Export home.json
  2. Modify one field in the exported file (e.g. change hero.headline)
  3. Import the modified file via Admin → Content → Import
  4. Verify the change is reflected on /en page
  5. Revert: export again with original value, import to restore

Verify import handles:
  - Valid JSON: imports cleanly
  - Invalid JSON: shows user-friendly error, does NOT corrupt existing data
  - Missing required fields: shows validation error
  - Duplicate slug (for collection items): prompts "overwrite or create new?"

══════════════════════════════════════════
VERIFY: DIFF SYSTEM
══════════════════════════════════════════

The diff system shows changes between the current DB state and an imported
file before committing. Inherited from REB — verify it works for REA content.

Test:
  1. Export current home.json
  2. Modify 3 fields in the file
  3. Upload via import with "Preview changes" option
  4. Diff view must show:
     - Green: fields being added
     - Yellow: fields being modified (old value → new value)
     - Red: fields being removed
  5. User can choose: "Apply all" or "Cancel"

If diff is not working for any REA-specific content type (case studies, testimonials,
gated downloads), fix the diff comparison logic to handle those schemas.

══════════════════════════════════════════
ADD: COLLECTION BULK EXPORT
══════════════════════════════════════════

Add bulk export for all REA collection types (not just individual items):

Admin → Case Studies → "Export All" button
  Output: case-studies-export-[date].json containing array of all items

Admin → Testimonials → "Export All" button
  Output: testimonials-export-[date].json

Admin → Gated Downloads → "Export Catalog" button
  Output: gated-downloads-catalog-[date].json

Admin → Properties → "Export All" button
  Output: properties-export-[date].json

Each export file must be human-readable, properly formatted JSON.
Add a timestamp comment at top: // Exported from BAAM REA on [ISO date]

══════════════════════════════════════════
ADD: AUTO-BACKUP SYSTEM
══════════════════════════════════════════

Add a simple scheduled backup mechanism using Supabase Edge Functions
or a cron job via Vercel cron (if deployed to Vercel):

Schedule: daily at 2am UTC
Action: export all content_entries for site_id "jinpang-homes" to a
        timestamped JSON file saved in Supabase Storage bucket "backups":
        backups/jinpang-homes-[YYYY-MM-DD].json

Retention: keep last 30 daily backups, delete older ones automatically.

Edge function path: supabase/functions/daily-backup/index.ts

If Supabase Edge Functions are not available, implement as:
  scripts/backup.ts — run manually or via CI/CD on schedule.

══════════════════════════════════════════
ADD: CONTENT SYNC VERIFICATION
══════════════════════════════════════════

Admin → Settings → "Content Health Check" button

Runs these checks and displays results:
  ✅ / ❌ All required page content_keys exist (home, about, contact, etc.)
  ✅ / ❌ ZH versions exist for all EN pages that have bilingual requirement
  ✅ / ❌ All collection items have required fields (no null slugs, no empty titles)
  ✅ / ❌ All property images have valid URLs (not empty strings)
  ✅ / ❌ theme.json present and all required color tokens defined
  ✅ / ❌ site.json has license number and brokerage name set
  ✅ / ❌ At least 1 active property in properties table
  ✅ / ❌ At least 5 testimonials published
  ✅ / ❌ At least 1 case study of each type (buyer, seller, investor, relocator)

Show results as a checklist with green/red indicators.
Link each failed check to the admin section that fixes it.
```

### Done-Gate 3A

- [ ] Export works for: home, about, contact, case study, testimonial, neighborhood, gated download
- [ ] Import round-trip: export → modify → import → verify change → revert — all clean
- [ ] Import error handling: invalid JSON shows error, no data corruption
- [ ] Duplicate slug on import prompts overwrite/new choice
- [ ] Diff preview works: shows add/modify/remove before committing
- [ ] Bulk export buttons present for all 5 collection types
- [ ] Auto-backup edge function or script created and tested
- [ ] Content Health Check runs and shows all 9 checks with correct status
- [ ] Git commit: `feat: admin hardening — import/export/diff/backup/health-check`

---

## Prompt 3B — SEO Infrastructure: Meta, Canonical, hreflang, OG

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART1.md (G5: seo.json)
Reference: @REA_COMPLETE_PLAN.md (A6: SEO Content Plan)

GOAL: Implement complete SEO infrastructure for the REA site.
Every page must have correct meta tags, canonical URLs, hreflang, and OG tags.
No page should have duplicate or missing meta content.

══════════════════════════════════════════
STEP 1 — BASE SEO UTILITY
══════════════════════════════════════════

Create/verify: lib/seo.ts

This utility generates Next.js Metadata objects for every page.

Functions to implement:

buildPageMeta({
  siteConfig,     // site.json
  seoDefaults,    // seo.json
  pageOverrides,  // page-level seo block from page JSON
  locale,         // "en" | "zh"
  slug,           // page URL slug (for canonical)
  collection?,    // collection type for collection items
}): Metadata

The function must:
  1. title: use seo.titleTemplate with {pageTitle} replaced by pageOverrides.title
     e.g. "Buying a Home in Orange County | Jin Pang — Port Jervis Real Estate"
  2. description: pageOverrides.description (max 160 chars — warn in admin if exceeded)
  3. canonical: seo.siteUrl + /[locale]/[slug]
  4. og:title: same as title
  5. og:description: same as description
  6. og:image: pageOverrides.ogImage OR seo.defaultOgImage
  7. og:image:alt: pageOverrides.ogImageAlt OR seo.defaultOgImageAlt
  8. og:type: "website" for pages, "article" for blog posts
  9. og:locale: seo.locale ("en_US" or "zh_CN")
  10. twitter:card: seo.twitterCard
  11. twitter:site: seo.twitterHandle
  12. robots: pageOverrides.robots OR seo.robots
  13. alternates.canonical: canonical URL
  14. alternates.languages: hreflang for both locales

══════════════════════════════════════════
STEP 2 — hreflang IMPLEMENTATION
══════════════════════════════════════════

Every page must declare both language versions:

<link rel="alternate" hreflang="en" href="https://jinpanghomes.com/en/[slug]" />
<link rel="alternate" hreflang="zh" href="https://jinpanghomes.com/zh/[slug]" />
<link rel="alternate" hreflang="x-default" href="https://jinpanghomes.com/en/[slug]" />

Implement via Next.js metadata alternates.languages:
{
  alternates: {
    languages: {
      'en': 'https://jinpanghomes.com/en/[slug]',
      'zh': 'https://jinpanghomes.com/zh/[slug]',
      'x-default': 'https://jinpanghomes.com/en/[slug]'
    }
  }
}

For collection items (blog/[slug], case-studies/[slug], etc.):
  Only declare ZH hreflang if ZH version actually exists (check content_entries)
  If no ZH version: omit zh hreflang, only use en + x-default

══════════════════════════════════════════
STEP 3 — APPLY TO EVERY PAGE
══════════════════════════════════════════

Apply buildPageMeta() in the generateMetadata() export of every page file:

Core pages:
  app/[locale]/page.tsx                       (home)
  app/[locale]/about/page.tsx
  app/[locale]/contact/page.tsx
  app/[locale]/home-valuation/page.tsx

Service pages:
  app/[locale]/buying/page.tsx
  app/[locale]/selling/page.tsx
  app/[locale]/investing/page.tsx
  app/[locale]/relocating/page.tsx

Collection hubs:
  app/[locale]/properties/page.tsx
  app/[locale]/sold/page.tsx
  app/[locale]/blog/page.tsx
  app/[locale]/market-reports/page.tsx
  app/[locale]/neighborhoods/page.tsx
  app/[locale]/case-studies/page.tsx
  app/[locale]/testimonials/page.tsx
  app/[locale]/faq/page.tsx
  app/[locale]/resources/page.tsx

Collection detail pages (dynamic metadata):
  app/[locale]/blog/[slug]/page.tsx
    → title from post.seo.title
    → description from post.seo.description
    → og:image from post.heroImage
    → og:type "article"
  app/[locale]/market-reports/[slug]/page.tsx
  app/[locale]/neighborhoods/[slug]/page.tsx
  app/[locale]/case-studies/[slug]/page.tsx
  app/[locale]/properties/[slug]/page.tsx
    → title: "{property.title} | {address} — Listed by Jin Pang"
    → description: "{beds}BR {baths}BA in {neighborhood}. {excerpt}"

══════════════════════════════════════════
STEP 4 — OG IMAGE STRATEGY
══════════════════════════════════════════

Default OG image (jinpanghomes.com/og-default.jpg):
  Create a static branded OG image:
  1200×630px, dark teal (#18292F) background
  Center: Jin Pang name in Cormorant Garamond + tagline
  Bottom right: agent photo (circular, 120px)
  Bottom bar: champagne gold (#BFA880) with "jinpanghomes.com"

  Create this image and upload to /public/og-default.jpg
  Add EN and ZH versions: og-default.jpg + og-default-zh.jpg

For blog posts: use post.heroImage as OG image
For properties: use first property photo as OG image
For case studies: use case study thumbnailImage
For neighborhoods: use neighborhood heroImage

══════════════════════════════════════════
STEP 5 — ROOT REDIRECT
══════════════════════════════════════════

GET / (root URL jinpanghomes.com) must redirect to /en
  middleware.ts: if path === "/" → redirect to "/en"
  Redirect type: 307 temporary (not 301 — preserves flexibility to change default locale)

Verify:
  jinpanghomes.com         → redirects to jinpanghomes.com/en ✅
  jinpanghomes.com/zh      → serves Chinese home page ✅
  jinpanghomes.com/en/buying → serves English buying page ✅
```

### Done-Gate 3B

- [ ] `lib/seo.ts` buildPageMeta() function created and working
- [ ] Every page exports generateMetadata() using buildPageMeta()
- [ ] View source on `/en/about`: title uses template, description under 160 chars
- [ ] hreflang tags present on every page (en + zh + x-default)
- [ ] og:image resolves to page-specific image or fallback to og-default.jpg
- [ ] og:type is "article" on blog posts, "website" on all others
- [ ] Root `/` redirects to `/en` (307)
- [ ] OG default image created (1200×630, branded)
- [ ] Canonical URLs are absolute (https://jinpanghomes.com/en/...)
- [ ] No duplicate title or description tags (check view source)
- [ ] Git commit: `feat: complete SEO infrastructure — meta, canonical, hreflang, OG`

---

## Prompt 3C — Schema.org Structured Data: All Page Types

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART1.md (G5: seo.json — schemaOrg block)

GOAL: Add schema.org JSON-LD structured data to every page type.
This is critical for appearing in rich results in Google Search — especially
for the real estate agent knowledge panel, property listings, and reviews.

Create utility: lib/schema.ts

Export these schema builder functions:

──────────────────────────────────────────────
1. buildAgentSchema(siteConfig) → RealEstateAgent
──────────────────────────────────────────────

Used on: Home, About, Contact pages (always present)

{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Jin Pang",
  "url": "https://jinpanghomes.com/en",
  "telephone": "+18455550142",
  "email": "jin@jinpanghomes.com",
  "image": "<agent-photo-url>",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "21 Painted Apron Ter",
    "addressLocality": "Port Jervis",
    "addressRegion": "NY",
    "postalCode": "12771",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.3751,
    "longitude": -74.6931
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "16:00" }
  ],
  "knowsLanguage": ["en", "zh"],
  "areaServed": ["Port Jervis NY", "Middletown NY", "Goshen NY", "Warwick NY", "Newburgh NY", "Orange County NY"],
  "memberOf": { "@type": "Organization", "name": "OneKey MLS" },
  "sameAs": [
    "https://www.facebook.com/jinpanghomes",
    "https://www.linkedin.com/in/jinpang-realtor",
    "https://www.zillow.com/profile/jinpang",
    "https://www.realtor.com/realestateagents/jinpang"
  ]
}

──────────────────────────────────────────────
2. buildWebSiteSchema(siteConfig) → WebSite + SearchAction
──────────────────────────────────────────────

Used on: Home page only

{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Jin Pang Real Estate",
  "url": "https://jinpanghomes.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://jinpanghomes.com/en/properties?keyword={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

──────────────────────────────────────────────
3. buildPropertySchema(property) → RealEstateListing
──────────────────────────────────────────────

Used on: every property detail page

{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": property.title,
  "description": property.description,
  "url": "https://jinpanghomes.com/en/properties/" + property.slug,
  "image": property.images[0],
  "offers": {
    "@type": "Offer",
    "price": property.price,
    "priceCurrency": "USD",
    "availability": property.status === "active"
      ? "https://schema.org/InStock"
      : "https://schema.org/SoldOut"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": property.address,
    "addressLocality": property.city,
    "addressRegion": property.state,
    "postalCode": property.zip,
    "addressCountry": "US"
  },
  "numberOfRooms": property.bedrooms,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": property.sqft,
    "unitCode": "FTK"
  }
}

──────────────────────────────────────────────
4. buildArticleSchema(post, siteConfig) → Article
──────────────────────────────────────────────

Used on: every blog post detail page

{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.heroImage,
  "author": {
    "@type": "Person",
    "name": "Jin Pang",
    "url": "https://jinpanghomes.com/en/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Jin Pang Real Estate",
    "logo": { "@type": "ImageObject", "url": "https://jinpanghomes.com/logo.png" }
  },
  "datePublished": post.publishDate,
  "dateModified": post.updatedAt || post.publishDate,
  "mainEntityOfPage": "https://jinpanghomes.com/en/blog/" + post.slug
}

──────────────────────────────────────────────
5. buildReviewSchema(testimonials) → AggregateRating
──────────────────────────────────────────────

Used on: Home page + Testimonials page + About page

Aggregate from all published testimonials:
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Jin Pang",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": <average of all testimonial ratings>,
    "reviewCount": <count of all published testimonials>,
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    // First 5 testimonials as individual Review objects
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "[clientName]" },
      "reviewBody": "[testimonialText first 200 chars]",
      "datePublished": "[publishDate]"
    }
  ]
}

──────────────────────────────────────────────
6. buildBreadcrumbSchema(crumbs) → BreadcrumbList
──────────────────────────────────────────────

Used on: all non-home pages

crumbs = [
  { name: "Home", url: "https://jinpanghomes.com/en" },
  { name: "Blog", url: "https://jinpanghomes.com/en/blog" },
  { name: "Post Title", url: "https://jinpanghomes.com/en/blog/post-slug" }
]

──────────────────────────────────────────────
7. buildFAQSchema(faqItems) → FAQPage
──────────────────────────────────────────────

Used on: FAQ page

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[question]",
      "acceptedAnswer": { "@type": "Answer", "text": "[answer]" }
    }
  ]
}

══════════════════════════════════════════
INJECT SCHEMAS INTO PAGES
══════════════════════════════════════════

Each schema must be injected as a <script type="application/ld+json"> tag
in the page's <head> via Next.js metadata or a <Script> component.

Use a helper component: components/SchemaScript.tsx
  Props: { schema: object | object[] }
  Renders: <script type="application/ld+json">{JSON.stringify(schema)}</script>

Apply per page:
  Home:             AgentSchema + WebSiteSchema + ReviewSchema (aggregate)
  About:            AgentSchema + ReviewSchema
  Contact:          AgentSchema
  Properties hub:   AgentSchema + BreadcrumbSchema
  Property detail:  PropertySchema + BreadcrumbSchema + AgentSchema
  Blog hub:         AgentSchema + BreadcrumbSchema
  Blog post:        ArticleSchema + BreadcrumbSchema
  Testimonials:     AgentSchema + ReviewSchema (full review list)
  FAQ:              FAQSchema + BreadcrumbSchema
  Neighborhoods:    AgentSchema + BreadcrumbSchema
  Case Studies:     AgentSchema + BreadcrumbSchema
  All other pages:  AgentSchema + BreadcrumbSchema (minimum)

══════════════════════════════════════════
VALIDATE ALL SCHEMAS
══════════════════════════════════════════

After implementation, validate using Google's Rich Results Test:
  https://search.google.com/test/rich-results

Test these URLs:
  - /en (RealEstateAgent + WebSite + AggregateRating)
  - /en/blog/[any-post] (Article)
  - /en/properties/[any-property] (RealEstateListing)
  - /en/faq (FAQPage)
  - /en/testimonials (AggregateRating)

Expected: zero errors, zero warnings in Rich Results Test.
Document any warnings and resolve them.
```

### Done-Gate 3C

- [ ] `lib/schema.ts` created with all 7 builder functions
- [ ] `components/SchemaScript.tsx` created
- [ ] Home page: AgentSchema + WebSiteSchema + ReviewSchema in `<head>`
- [ ] Blog post: ArticleSchema with correct author, datePublished
- [ ] Property detail: RealEstateListing schema with price, address, status
- [ ] FAQ page: FAQPage schema with all question/answer pairs
- [ ] Testimonials: AggregateRating computed from real testimonial data
- [ ] Breadcrumb schema on all non-home pages
- [ ] Rich Results Test passes with zero errors on home, blog post, property, faq
- [ ] Git commit: `feat: schema.org structured data — all page types`

---

## Prompt 3D — Sitemap + Robots.txt + Google Search Console Setup

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Generate a complete, dynamic XML sitemap and robots.txt.
Prepare for Google Search Console submission.

══════════════════════════════════════════
STEP 1 — XML SITEMAP
══════════════════════════════════════════

Create: app/sitemap.ts (Next.js app router dynamic sitemap)

The sitemap must include every publicly indexable URL, for both locales.

STATIC PAGES (both EN + ZH):
  /en              → priority 1.0, changefreq: daily
  /zh              → priority 1.0, changefreq: daily
  /en/about        → priority 0.8, changefreq: monthly
  /zh/about        → priority 0.8, changefreq: monthly
  /en/contact      → priority 0.8, changefreq: monthly
  /zh/contact      → priority 0.8, changefreq: monthly
  /en/home-valuation → priority 0.8, changefreq: monthly
  /zh/home-valuation → priority 0.8, changefreq: monthly
  /en/buying       → priority 0.8, changefreq: monthly
  /zh/buying       → priority 0.8, changefreq: monthly
  /en/selling      → priority 0.8, changefreq: monthly
  /zh/selling      → priority 0.8, changefreq: monthly
  /en/investing    → priority 0.8, changefreq: monthly
  /zh/investing    → priority 0.8, changefreq: monthly
  /en/relocating   → priority 0.8, changefreq: monthly
  /zh/relocating   → priority 0.8, changefreq: monthly
  /en/properties   → priority 0.9, changefreq: daily
  /en/sold         → priority 0.7, changefreq: weekly
  /en/blog         → priority 0.8, changefreq: weekly
  /zh/blog         → priority 0.7, changefreq: weekly
  /en/market-reports → priority 0.7, changefreq: monthly
  /zh/market-reports → priority 0.7, changefreq: monthly
  /en/neighborhoods  → priority 0.8, changefreq: monthly
  /zh/neighborhoods  → priority 0.7, changefreq: monthly
  /en/case-studies   → priority 0.8, changefreq: monthly
  /zh/case-studies   → priority 0.7, changefreq: monthly
  /en/testimonials   → priority 0.7, changefreq: weekly
  /zh/testimonials   → priority 0.7, changefreq: weekly
  /en/faq          → priority 0.7, changefreq: monthly
  /zh/faq          → priority 0.7, changefreq: monthly
  /en/resources    → priority 0.6, changefreq: monthly
  /zh/resources    → priority 0.6, changefreq: monthly

DYNAMIC PAGES — fetch from Supabase at sitemap generation time:

Properties (active only):
  SELECT slug FROM properties WHERE site_id='jinpang-homes' AND status='active'
  → /en/properties/[slug] → priority 0.9, changefreq: daily
  (Note: don't index sold properties — keep clean)

Blog posts (published only, all locales):
  SELECT slug, locale, updated_at FROM content_entries
  WHERE site_id='jinpang-homes' AND content_key LIKE 'blog:%' AND data->>'status'='published'
  → /[locale]/blog/[slug] → priority 0.7, changefreq: weekly
  → lastmod: updated_at

Market reports (published):
  → /en/market-reports/[slug] → priority 0.7, changefreq: monthly

Neighborhoods (all):
  → /en/neighborhoods/[slug] → priority 0.8, changefreq: monthly
  → /zh/neighborhoods/[slug] → priority 0.7, changefreq: monthly (if ZH exists)

Case studies (published):
  → /en/case-studies/[slug] → priority 0.7, changefreq: monthly

EXCLUDE from sitemap:
  /en/privacy, /en/terms, /zh/privacy, /zh/terms (low value — noindex)
  /admin/* (all admin routes — never indexed)
  /api/* (all API routes)

══════════════════════════════════════════
STEP 2 — ROBOTS.TXT
══════════════════════════════════════════

Create: app/robots.ts (Next.js dynamic robots)

Content:
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/
  Disallow: /en/privacy
  Disallow: /en/terms
  Disallow: /zh/privacy
  Disallow: /zh/terms

  Sitemap: https://jinpanghomes.com/sitemap.xml

══════════════════════════════════════════
STEP 3 — GOOGLE SEARCH CONSOLE PREP
══════════════════════════════════════════

Add Google Search Console verification:
  1. Jin will verify via DNS record (preferred) — no code change needed for DNS method
  2. Alternative: if verifying via meta tag:
     Add googleSiteVerification from seo.json to page <head>
     Already handled in buildPageMeta() from Prompt 3B — verify it injects correctly

GSC submission checklist (to be done by Jin post-deploy):
  [ ] Add property: jinpanghomes.com (domain property, not URL prefix)
  [ ] Verify ownership via DNS TXT record
  [ ] Submit sitemap: https://jinpanghomes.com/sitemap.xml
  [ ] Request indexing for key pages: home, about, buying, selling
  [ ] Set up email alerts for coverage errors

══════════════════════════════════════════
STEP 4 — ADDITIONAL SEO FILES
══════════════════════════════════════════

Create: public/.well-known/security.txt
  Contact: jin@jinpanghomes.com
  Expires: 2027-01-01T00:00:00.000Z

Create: public/favicon.ico (32×32 placeholder — Jin to replace with branded version)
Create: public/apple-touch-icon.png (180×180 placeholder)
Create: public/og-default.jpg (1200×630 — as described in 3B)

Verify all meta icon links in layout.tsx:
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

### Done-Gate 3D

- [ ] `/sitemap.xml` accessible and valid XML
- [ ] Sitemap includes all static pages (30+ EN+ZH URLs)
- [ ] Sitemap dynamically includes all published blog posts, active properties, neighborhoods
- [ ] Sold properties NOT in sitemap
- [ ] Admin routes NOT in sitemap
- [ ] `/robots.txt` accessible, blocks /admin/ and /api/
- [ ] Sitemap URL declared in robots.txt
- [ ] Google site verification meta tag injects from seo.json value
- [ ] Favicon and apple-touch-icon present in /public/
- [ ] OG default image (1200×630) created and at /public/og-default.jpg
- [ ] Git commit: `feat: sitemap + robots.txt + GSC prep`

---

## Prompt 3E — Core Web Vitals + Performance Audit

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Run a full performance audit and fix all Core Web Vitals issues.
Target: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile (Lighthouse score 85+).

STEP 1 — RUN BASELINE AUDIT

Run Lighthouse on these URLs (use production build, not dev server):
  npm run build && npm start

Test URLs:
  /en (home page — heaviest page, most critical)
  /en/buying
  /en/properties
  /en/blog/[first-post]

Record baseline scores for: Performance, Accessibility, Best Practices, SEO

STEP 2 — IMAGE OPTIMIZATION

Every image on the site must use Next.js <Image> component (next/image).
Search codebase for any <img> tags and replace with <Image>.

Specific fixes:

AgentBrandHero background image:
  Use priority={true} — this is the LCP element
  Use fill prop with object-cover
  Add proper sizes attribute: sizes="100vw"

PropertyCard images:
  Use fill prop inside relative container
  Add sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  Never use layout="responsive" (deprecated)

Agent photo (PersonalIntroSection, WorkWithMeSection):
  Fixed dimensions (e.g. 600×800)
  Add priority={true} if above the fold on the page

Neighborhood and Case Study card images:
  Appropriate sizes attribute

OG default image: pre-generate as WebP in addition to JPG

Set up image domains in next.config.js:
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },  // Supabase storage
      { protocol: 'https', hostname: 'images.unsplash.com' }, // dev placeholder images
    ]
  }

STEP 3 — FONT LOADING OPTIMIZATION

Fonts are the most common source of layout shift (CLS) and LCP delay.

Switch from Google Fonts <link> to next/font:
  import { Cormorant_Garamond, DM_Serif_Display, Inter, DM_Sans } from 'next/font/google'

For Chinese fonts (Noto Serif SC, Noto Sans SC) — these are large:
  Strategy: use font-display: swap with preload only for subset
  Only load on ZH locale (detect in layout)
  Use unicode-range to limit to Chinese characters + common punctuation

Verify no Flash of Unstyled Text (FOUT):
  - Fonts should load without visible swap on first meaningful paint

STEP 4 — LAZY LOADING AND CODE SPLITTING

Heavy components to lazy-load (use React.lazy or Next.js dynamic()):
  MortgageCalculator    → dynamic import (not needed until user scrolls)
  CapRateCalculator     → dynamic import
  RentalYieldCalculator → dynamic import
  All 3 financial calculators: load only on investing page
  MapEmbed              → dynamic import (heavy iframe)
  VideoEmbed (testimonials) → dynamic import

Properties map view: dynamic import with ssr: false
  import dynamic from 'next/dynamic'
  const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false })

STEP 5 — HERO VIDEO / ANIMATION OPTIMIZATION

If any section uses animation:
  - Use CSS transitions, not JavaScript animation libraries
  - Stat counter animation: use IntersectionObserver, trigger only when visible
  - No autoplay video in hero (use photo background only)
  - Testimonial rotation: use CSS opacity transition only (no layout shifts)

STEP 6 — THIRD-PARTY SCRIPT LOADING

Google Analytics:
  Load with next/script strategy="afterInteractive"
  NOT in <head> with no strategy (blocks render)

Google Maps embed:
  Load iframe with loading="lazy"
  Defer until user scrolls to map section (IntersectionObserver)

STEP 7 — CACHE HEADERS

In next.config.js, add cache headers for static assets:
  headers: [
    {
      source: '/og-default.jpg',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }]
    },
    {
      source: '/_next/static/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
    }
  ]

STEP 8 — ACCESSIBILITY AUDIT

Run axe DevTools or Lighthouse accessibility on home and buying pages.
Fix all critical issues:
  - All images must have alt text (from alt fields in content JSON)
  - Form inputs must have associated labels (not just placeholders)
  - Color contrast: all text must meet WCAG AA (4.5:1 for normal, 3:1 for large)
    Verify: dark teal (#18292F) on parchment (#F6F3EE) — should pass
    Verify: champagne gold (#BFA880) on dark (#111E24) — check contrast ratio
  - Interactive elements must have visible focus states
  - Skip to main content link in header (for keyboard navigation)
  - All accordions must be keyboard-accessible (Enter/Space to toggle)
  - Language switcher: aria-label="Switch language"
  - Nav dropdowns: aria-expanded, aria-haspopup attributes

STEP 9 — MOBILE PERFORMANCE

Test on simulated Moto G4 (Lighthouse mobile preset):
  - Touch targets minimum 48×48px (buttons, links, form inputs)
  - No horizontal scroll at 375px width
  - Mobile nav drawer: no layout shifts on open/close
  - Calculator inputs: numeric keyboard on mobile (inputmode="numeric")
  - All forms: large enough tap targets, no tiny labels

STEP 10 — FINAL AUDIT

Re-run Lighthouse after all fixes.
Target thresholds:
  Performance:    ≥ 85 (mobile), ≥ 95 (desktop)
  Accessibility:  ≥ 90
  Best Practices: ≥ 90
  SEO:            100

Document final scores in a comment at top of this phase file.
If any threshold is not met, log the failing audit item and its fix.
```

### Done-Gate 3E

- [ ] All `<img>` tags replaced with `<Image>` component (next/image)
- [ ] Hero image has `priority={true}` — LCP element loads immediately
- [ ] All 3 calculators dynamically imported — not in initial bundle
- [ ] PropertyMap dynamically imported with `ssr: false`
- [ ] Google Fonts migrated to next/font
- [ ] Chinese fonts load only on /zh locale
- [ ] Google Analytics loads with strategy="afterInteractive"
- [ ] Map embeds load lazily (IntersectionObserver or loading="lazy")
- [ ] All images have alt text from content fields (no empty alt="")
- [ ] All form inputs have associated `<label>` elements
- [ ] Accordion keyboard accessible (Enter/Space toggle)
- [ ] Skip to main content link present in header
- [ ] Calculator inputs have inputmode="numeric" on mobile
- [ ] Lighthouse mobile Performance ≥ 85
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse SEO = 100
- [ ] Git commit: `perf: core web vitals pass — performance + accessibility audit`

---

## Phase 3 Completion Gate

Before starting Phase 4:

- [ ] **3A** — Admin hardening: import/export/diff/backup/health check all working
- [ ] **3B** — SEO infrastructure: every page has title, description, canonical, hreflang, OG
- [ ] **3C** — Schema.org: all 7 schema types implemented, Rich Results Test passes
- [ ] **3D** — Sitemap dynamically generated, robots.txt correct, GSC prep done
- [ ] **3E** — Lighthouse scores meet targets: Performance ≥ 85, Accessibility ≥ 90, SEO = 100
- [ ] `npm run build` — zero errors, zero TypeScript warnings
- [ ] Git tag: `v0.3-phase3-complete`

---

*End of REA_PHASE_3.md*
*Next: REA_PHASE_4.md — QA + Content Swap + Production Deploy + Post-Launch*

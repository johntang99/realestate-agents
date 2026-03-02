# BAAM System G2 — REA Phase 2
# Service Pages + Properties + Calculators + Collections + Admin Editors

> **File:** REA_PHASE_2.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Phase:** 2 of 5
> **Duration:** Week 2–3 (Days 9–18)
> **Goal:** Build all service pages (Buying, Selling, Investing, Relocating), Properties + Sold, all content collection pages (Blog, Market Reports, Neighborhoods, Case Studies, Testimonials), interactive calculators, gated download system, lead routing, and all admin collection editors.
> **Cursor context:** Attach `@REA_COMPLETE_PLAN.md` + `@REA_CONTENT_CONTRACTS_PART2.md` + `@REA_CONTENT_CONTRACTS_PART3.md` + `@REA_PHASE_2.md`
> **Prerequisite:** Phase 1 completion gate passed.

---

## Prompt Index

| # | Prompt | Est. Time |
|---|---|---|
| 2A | Buying Page — Full Journey | 75 min |
| 2B | Selling Page + Home Valuation Wire | 60 min |
| 2C | Investing Page + CAP Rate + Rental Yield Calculators | 75 min |
| 2D | Relocating Page — Area Knowledge Hub | 60 min |
| 2E | Properties Hub + Property Detail + Sold Portfolio | 60 min |
| 2F | Blog Hub + Post Detail (Knowledge Center) | 45 min |
| 2G | Market Reports Hub + Report Detail | 40 min |
| 2H | Neighborhoods Hub + Neighborhood Detail | 50 min |
| 2I | Case Studies Hub + Case Study Detail | 60 min |
| 2J | Testimonials Page | 40 min |
| 2K | FAQ + Resources (Gated Downloads Hub) | 45 min |
| 2L | Gated Download System — Gate Forms + Email Delivery | 60 min |
| 2M | All Collection Admin Editors | 90 min |
| 2N | Persistent CTA System + WorkWithMe Sections | 45 min |

---

## Prompt 2A — Buying Page — Full Journey

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P5: buying.json)
Reference: @REA_COMPLETE_PLAN.md (A3: Page Design — Buying)

Page file: app/[locale]/buying/page.tsx
Data: content_key "page:buying"

Seed buying.json (EN + ZH) into content_entries.
ZH buying.json — translate all headings and body text natively.

BUILD ALL SECTIONS IN ORDER:

1. HERO (photo-background variant)
   - Full-width, 75vh
   - Background: local Orange County landscape or residential street photo
   - Dark overlay 0.42 opacity
   - Heading + subheading left-aligned, white
   - 2 CTA buttons: "Start Your Search" (primary) + "Talk to Me" (outline white)

2. WHY BUY WITH ME
   5-point grid:
   Each point: icon circle + heading + body
   Layout: 3-2 grid (desktop), 1-col (mobile)
   Section bg: white

3. MY APPROACH TO BUYING (6 steps)
   StepTimeline component (reuse WorkingWithMeSteps configured for 6 steps)
   Numbered circles connected by line
   Section bg: var(--color-backdrop-warm)

4. BUYER SUCCESS STORIES (3 case studies)
   CaseStudyCard grid — filterType: "buyer"
   Fetch 3 buyer case studies from collection
   CTA: "All Case Studies →"
   Section bg: white

5. MORTGAGE CALCULATOR
   Component: MortgageCalculator (reuse from REB — already exists)
   Inputs: home price, down payment %, interest rate, loan term (years)
   Outputs: monthly P+I payment, total interest paid, amortization summary
   Disclaimer text from site.json compliance.calculatorDisclaimer — required, always visible
   Section bg: var(--color-backdrop-warm)
   Heading: "Mortgage Payment Calculator"

6. MORTGAGE BASICS (4 items)
   Accordion or card grid — 4 educational items from buying.mortgageBasics
   Section bg: white

7. INTERNATIONAL BUYER SECTION
   Component: InternationalBuyerSection.tsx (NEW — reusable across pages)
   Data: buying.internationalBuyerSection
   Layout: 2-col — text left, keyPoints list right
   BG: var(--color-primary) = dark teal, text white
   Heading in EN + 中文 both visible
   Key points as checkmark list in champagne gold

8. GATED GUIDES (3 guides)
   GatedDownloadSection component (NEW — built in detail in Prompt 2L)
   Show 3 buyer guides from resources collection (filterType: "buyer")
   Each: title, description, gate form (email capture)
   Section bg: var(--color-backdrop-warm)

9. VENDOR PARTNERS
   4 partner category cards: Mortgage Lenders, Inspectors, Attorneys, Title
   Each: icon + heading + description
   Section bg: white

10. BUYER FAQ
    Accordion — 6 items from buying.buyerFaq.items
    Section bg: var(--color-backdrop-warm)

11. SHOWING REQUEST FORM
    ShowingRequestForm (reuse from REB — simplified for non-property-specific use)
    Submits to /api/showing-request → showing_requests table
    Section bg: white

12. WORK WITH ME CTA
    WorkWithMeSection (NEW — built in Prompt 2N)
    Dark bg, agent photo, personal quote, CTA button
    Heading from buying.workWithMeCta.heading

ADMIN WIRE:
Admin → Content → buying
  - whyBuyWithMe.points array editable
  - myApproach.steps array editable
  - mortgageBasics.items array editable
  - internationalBuyerSection.keyPoints array editable
  - buyerFaq.items array (add/edit/remove)
  - workWithMeCta heading editable
```

### Done-Gate 2A

- [ ] `/en/buying` and `/zh/buying` render all 12 sections
- [ ] Mortgage Calculator: inputs work, output updates live, disclaimer visible
- [ ] Buyer success stories: 3 case study cards render (buyer filter)
- [ ] International buyer section: dark teal bg, bilingual heading, checkmarks
- [ ] Showing request form submits → saves to showing_requests
- [ ] Gated guide placeholders render (full gate logic in 2L)
- [ ] WorkWithMe CTA section renders
- [ ] Admin roundtrip: edit + save reflects on public page
- [ ] Git commit: `feat: buying page — full journey`

---

## Prompt 2B — Selling Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P6: selling.json)

Page file: app/[locale]/selling/page.tsx
Data: content_key "page:selling"

Seed selling.json (EN + ZH) into content_entries.

BUILD ALL SECTIONS:

1. HERO — "Sell Your Home for More. In Less Time."
   photo-background variant, 75vh
   Inline stats badge: "98.3% Avg. List-to-Sale Ratio" — champagne gold pill
   2 CTAs: "Get My Home's Value" (→ /home-valuation) + "Talk to Me First"

2. MARKETING APPROACH (6 items)
   Icon + heading + body cards
   Layout: 3-col grid (desktop), 2-col (tablet), 1-col (mobile)
   Items: Photography, Video/Virtual Tour, MLS + Portals, Social Media, Email, Open House
   Section bg: white

3. RESULTS PROOF (4 stats)
   Mini stats bar — champagne gold bg (var(--color-secondary)), dark text
   Stats: List-to-Sale ratio, Days on Market, Transactions, Volume
   Smaller than home StatsBar — 4-col inline strip

4. SELLER SUCCESS STORIES (3 case studies)
   CaseStudyCard grid — filterType: "seller"
   Section bg: var(--color-backdrop-warm)

5. SOLD PORTFOLIO PREVIEW (6 items)
   SoldGrid — 6 most recent sold properties
   "Full Sold Portfolio →" CTA

6. HOME VALUATION CTA (primary seller conversion)
   Full-width card section — dark teal bg
   Heading + body explaining the CMA vs AVM difference
   Large CTA: "Get My Free Valuation" → /home-valuation
   Secondary: "Talk to Me First" → /contact

7. SELLING PROCESS (8 steps)
   StepTimeline (8 steps — more granular than buying)
   Horizontal on desktop (scroll-able), vertical on mobile

8. STAGING TIPS (5 tips)
   Simple cards with heading + body
   Optional: before/after photo slots (show placeholder if empty)
   Section bg: var(--color-backdrop-warm)

9. GATED SELLER GUIDES (3 guides)
   GatedDownloadSection — filterType: "seller"
   Section bg: white

10. SELLER TESTIMONIALS (4)
    TestimonialDisplay — filter: "seller"
    4 cards in 2×2 grid
    Section bg: var(--color-backdrop-warm)

11. SELLER FAQ (5 items)
    Accordion
    Section bg: white

12. WORK WITH ME CTA
    WorkWithMeSection — seller-specific heading

ADMIN WIRE: All arrays (marketingApproach, sellingProcess, stagingTips, faq) editable.
```

### Done-Gate 2B

- [ ] `/en/selling` and `/zh/selling` render all 12 sections
- [ ] Results stats bar renders in champagne gold
- [ ] Valuation CTA block links correctly to /home-valuation
- [ ] Selling process 8-step timeline renders
- [ ] Seller testimonials render (filter: seller)
- [ ] Admin roundtrip passes
- [ ] Git commit: `feat: selling page`

---

## Prompt 2C — Investing Page + CAP Rate + Rental Yield Calculators

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P7: investing.json)

Page file: app/[locale]/investing/page.tsx
Data: content_key "page:investing"

BUILD ALL SECTIONS:

1. HERO — "Invest in Orange County Real Estate — Where the Numbers Work"
   4 market metric badges in hero below headline:
     "75 Miles from Manhattan" | "4.2–6.8% Cap Rate" |
     "$2,800+ Monthly Rent (3BR)" | "8.2% Annual Appreciation"

2. INVESTMENT CASE — "Why Orange County, NY"
   Rich text body + 4 key metric chips
   Section bg: white

3. INVESTMENT TYPES (6 types)
   Icon card grid — 3-col desktop, 2-col tablet, 1-col mobile
   Types: SFR, Multifamily, STR, Fix & Flip, 1031 Exchange, Land

4. RENTAL MARKET DATA TABLE
   Component: RentalYieldTable.tsx (NEW)
   Table with columns: Area | 3BR SFH Rent | 2BR SFH Rent | Multifamily Unit | Gross Yield
   5 rows from investing.rentalData.tableRows
   Disclaimer below table
   Section bg: var(--color-backdrop-warm)
   Mobile: horizontal scroll or card stack

5. MORTGAGE CALCULATOR (INVESTOR MODE)
   Component: InvestmentMortgageCalculator.tsx (NEW — extends MortgageCalculator)
   Additional inputs vs standard calculator:
     - Monthly rental income (estimated)
     - Annual expenses (property tax, insurance, maintenance — %  or $)
     - Vacancy rate (%)
   Additional outputs:
     - Monthly cash flow (rent - mortgage - expenses)
     - Cash-on-cash return (annual cash flow / down payment)
     - Gross yield (annual rent / purchase price)
   Calculator disclaimer: required, always visible below
   Section bg: white

6. CAP RATE CALCULATOR
   Component: CapRateCalculator.tsx (NEW)
   Inputs:
     - Property purchase price ($)
     - Monthly gross rent ($)
     - Vacancy rate (% — default 5%)
     - Annual operating expenses ($) — or as % of gross rent
   Calculated fields:
     - Annual gross income
     - Effective gross income (after vacancy)
     - Net operating income (NOI = effective gross - expenses)
     - CAP rate = NOI / purchase price × 100
     - Gross yield = annual gross rent / purchase price × 100
   Display: clean results panel — large colored numbers for CAP rate
   Color coding: < 4% (orange warning), 4–6% (blue neutral), > 6% (green good)
   Disclaimer: required, always visible
   Section bg: var(--color-backdrop-warm)

7. RENTAL YIELD CALCULATOR (simpler companion tool)
   Component: RentalYieldCalculator.tsx (NEW)
   Inputs: Purchase price + Monthly rent
   Outputs:
     - Gross annual yield (%)
     - Monthly gross income
     - Annual gross income
     - Simple break-even analysis (months to recover down payment from cash flow)
   Inline, compact design — sits alongside or below CAP rate calculator
   Disclaimer required
   Section bg: var(--color-backdrop-warm) (same section as CAP rate)

8. INVESTMENT CASE STUDIES (2)
   CaseStudyCard grid — filterType: "investor"
   Section bg: white

9. OFF-MARKET OPPORTUNITIES GATE
   Form: name, email, investmentType, budgetRange, timeline
   Submits to /api/investor-inquiry → investor_inquiries table
   CRM sink emit
   Email notification to jin@jinpanghomes.com
   Success state: "I'll reach out personally when something matches your criteria."
   Section bg: var(--color-primary) — dark teal, text white
   Heading: "Access Off-Market Investment Opportunities"

10. 1031 EXCHANGE GUIDE
    Expandable section — key facts + CTA "Talk to Me About 1031"
    Section bg: white

11. INVESTOR CONSULTATION FORM
    Larger form — 8 fields from investing.investorConsultationForm
    Submits to /api/investor-inquiry (same table, tag as "consultation" vs "off-market")
    Section bg: var(--color-backdrop-warm)

CALCULATOR IMPLEMENTATION NOTES:
- All 3 calculators are client-side only (no API calls)
- All calculations recalculate on every input change (live update)
- Use React state — no external libraries needed
- Input validation: prevent NaN, show $0 / 0% for empty/invalid inputs
- All calculators must display site.compliance.calculatorDisclaimer
  (load from site.json — do not hardcode disclaimer text)
- Disclaimer style: small text, italic, muted color, border-top separator

ADMIN WIRE:
  - investmentCase.body editable (rich text)
  - investmentTypes.types array editable
  - rentalData.tableRows editable (table editor or JSON)
  - offMarketCta heading + body editable
  - exchangeGuide.body editable
```

### Done-Gate 2C

- [ ] `/en/investing` and `/zh/investing` render all 11 sections
- [ ] InvestmentMortgageCalculator: all inputs work, cash flow + CoC return compute correctly
- [ ] CapRateCalculator: NOI and CAP rate compute correctly, color coding works
- [ ] RentalYieldCalculator: gross yield computes correctly
- [ ] All 3 calculators show disclaimer text (loaded from site.json — not hardcoded)
- [ ] Off-market gate form submits → investor_inquiries table
- [ ] Investor consultation form submits → investor_inquiries table + email sent
- [ ] Admin roundtrip passes on editable sections
- [ ] Git commit: `feat: investing page + 3 financial calculators`

---

## Prompt 2D — Relocating Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P8: relocating.json)

Page file: app/[locale]/relocating/page.tsx
Data: content_key "page:relocating"

BUILD ALL SECTIONS:

1. HERO — "Welcome to Orange County, NY. I Know This Place."
   Warm, inviting — local landscape photo (Delaware River, Hudson Valley)
   Personal subheading tone (first person)

2. WHY ORANGE COUNTY (5 reasons)
   Icon + heading + body cards — 3-2 grid

3. COMMUTER'S GUIDE
   3 transport mode cards: Train / Drive / Remote+Hybrid
   Each card: mode badge, route, duration, cost, Jin's verdict
   "Verdict" shown in italic, champagne gold border
   Section bg: var(--color-backdrop-warm)

4. NEIGHBORHOOD PREVIEW GRID (5 neighborhoods)
   Compact neighborhood cards: name, character tagline, price range, school district
   Links to /neighborhoods/[slug]
   "All Neighborhood Guides →" CTA
   Section bg: white

5. AREA QUICK FACTS (6 facts)
   Icon + label + value
   2-col grid (desktop), 1-col (mobile)
   Section bg: var(--color-backdrop-warm)

6. SCHOOL GUIDE
   Table or card grid: district name, rating (X/10), Jin's honest note
   Disclaimer below ("Verify at GreatSchools.org")
   Section bg: white

7. INTERNATIONAL + CHINESE BUYER SECTION
   Same InternationalBuyerSection component from Buying page
   Customized for relocation context:
     - Heading EN + 中文 bilingual
     - 5 key points (bilingual-focused)
   BG: var(--color-primary) dark teal

8. GATED RELOCATION GUIDES (4 guides)
   GatedDownloadSection — filterType: "relocator"
   Section bg: var(--color-backdrop-warm)

9. THINGS TO DO (3 categories)
   Category cards: Outdoor & Nature / Dining & Local / Events & Community
   Each card: icon + heading + bulleted list of activities
   Section bg: white

10. RELOCATION CONSULTATION CTA
    Full-width, dark bg
    Personal heading + subheading + CTA → /contact
    This is WorkWithMeSection configured for relocating context
```

### Done-Gate 2D

- [ ] `/en/relocating` and `/zh/relocating` render all 10 sections
- [ ] Commuter guide cards show route, duration, cost, verdict
- [ ] School guide table renders with ratings and notes
- [ ] International/Chinese buyer section: dark teal bg, bilingual heading
- [ ] Gated guides section renders (gate logic wired in 2L)
- [ ] Admin roundtrip passes
- [ ] Git commit: `feat: relocating page — area knowledge hub`

---

## Prompt 2E — Properties Hub + Property Detail + Sold Portfolio

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P9: properties.json, P10: sold.json)
Reference: @REA_CONTENT_CONTRACTS_PART3.md (C6: properties collection)

Seed 5 property items into the properties table from Part3 C6 seed data.

Pages to build:
  app/[locale]/properties/page.tsx        → Properties Hub
  app/[locale]/properties/[slug]/page.tsx → Property Detail
  app/[locale]/sold/page.tsx              → Sold Portfolio

══════════════════════════════════════════
PROPERTIES HUB
══════════════════════════════════════════

Compact hero (simple-compact variant) — "Available Properties"
Filter bar (PropertyFilterBar component — reuse from REB):
  status, price range, beds, baths, type, neighborhood, keyword
View toggle: grid | map
PropertyGrid — 3-col desktop, 2-col tablet, 1-col mobile
Map view — coordinate-based markers using Google Maps or Mapbox
  (Use existing map implementation from REB)
MLS CTA card below grid: "Search all MLS listings →"
Contact section at bottom

Filter behavior:
  - Filters update URL params (?status=Active&beds=3)
  - Page reads filters from URL on load
  - No page reload — client-side filtering against fetched properties
  - "Clear filters" resets all params

══════════════════════════════════════════
PROPERTY DETAIL
══════════════════════════════════════════

Reuse PropertyDetail from REB with these REA-specific adjustments:
  - Remove "Listing Agent" section (all listings are Jin Pang's — implicit)
  - Add: agent bio mini-card at bottom ("Represented by Jin Pang")
  - Add: MortgageCalculator pre-filled with listing price
  - Add: Virtual tour embed slot (property.data.virtualTourUrl)
  - Keep: ShowingRequestForm pre-populated with property address
  - Keep: Similar Listings section (3 properties, same neighborhood/price range)

Property detail sections in order:
  1. Photo gallery (carousel/slider — multiple images)
  2. Key stats bar (price, beds, baths, sqft, lot, year built, DOM, status badge)
  3. Description (rich text)
  4. Property highlights (bulleted features)
  5. Virtual tour embed (if virtualTourUrl set)
  6. Interactive map (single property pin)
  7. Mortgage Calculator (pre-filled with listing price)
  8. Schedule a Showing form
  9. Agent card: "Represented by Jin Pang" — photo, name, phone, contact link
  10. Similar Listings (3 cards)

══════════════════════════════════════════
SOLD PORTFOLIO
══════════════════════════════════════════

Stats header bar (4 stats from sold.json)
Filter bar: year, price range, neighborhood, type
SoldGrid — all sold properties, filterable
Featured Sales: top 3 sold with link to case studies
CTA at bottom: "Get My Home's Value" + "Contact Me"

Admin for properties:
  Admin → Properties → CRUD: create, edit, delete, duplicate
  Fields: title, address, price, status, beds, baths, sqft, lot, yearBuilt,
          type, neighborhood, description, images (media picker array),
          virtualTourUrl, featured (boolean), coordinates (lat/lng)
  Sold toggle: changes status to "sold", records sold price
```

### Done-Gate 2E

- [ ] `/en/properties` renders with filter bar and property grid
- [ ] URL filter params work (status, beds, price range)
- [ ] Map view renders with property pins (or graceful fallback)
- [ ] Property detail page renders for each seed property
- [ ] MortgageCalculator on detail page pre-filled with listing price
- [ ] ShowingRequestForm on detail pre-filled with property address
- [ ] Virtual tour embed slot renders (empty state if no URL)
- [ ] `/en/sold` renders stats header + filtered sold grid
- [ ] Admin → Properties: create/edit/delete works, images upload
- [ ] Git commit: `feat: properties hub + detail + sold portfolio`

---

## Prompt 2F — Blog Hub + Post Detail (Knowledge Center)

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C3: blog posts)

Seed all 6 blog post items from Part3 C3 seed data into content_entries.
Collection path: content_key pattern "blog:[slug]"

Pages:
  app/[locale]/blog/page.tsx          → Blog Hub
  app/[locale]/blog/[slug]/page.tsx   → Blog Post Detail

BLOG HUB:
  Simple hero: "Your Orange County Real Estate Resource"
  Search bar (keyword filter)
  Category filter pills: Market Updates | Buyer Guides | Seller Guides |
                         Investor Insights | Neighborhood Spotlights | Relocation | Lifestyle
  Featured post (large card — latest or featured:true)
  Post grid: all posts paginated (6 per page), filterable by category
  Market report teaser: latest report card
  Newsletter signup section (NewsletterSignup component from REB)
    → submits to /api/newsletter → newsletter_subscribers table

BLOG POST DETAIL:
  Hero image (post.heroImage)
  Category badge + title + author (Jin Pang) + date + read time
  Rich text body (dangerouslySetInnerHTML — post.body)
  Table of contents (if post.tableOfContents enabled — auto-generated from H2/H3 headings)
  Author bio card at bottom:
    Jin Pang photo + name + tagline + "Work With Me" CTA link
  Related posts (3 cards — same category)
  Newsletter signup strip
  WorkWithMe CTA section
  Share buttons: copy link, Facebook, LinkedIn, WeChat

SEO for each post:
  title: post.seo.title
  description: post.seo.description
  og:image: post.heroImage
  og:type: article
  schema.org: Article with author Jin Pang

ADMIN WIRE:
Admin → Knowledge Center → CRUD:
  Create/edit/delete posts
  Fields: title, slug (auto-generated, editable), category, heroImage (media picker),
          excerpt, body (rich text editor), tableOfContents toggle, publishDate,
          featured toggle, tags, seo.title, seo.description
  ZH fields: titleZh, bodyZh (separate tab in editor)
  Publish/Draft status toggle
```

### Done-Gate 2F

- [ ] `/en/blog` renders hub with category filter
- [ ] `/zh/blog` renders with Chinese posts
- [ ] Featured post card renders prominently
- [ ] `/en/blog/[slug]` renders for all 6 seed posts
- [ ] Rich text body renders correctly (HTML, not raw tags)
- [ ] Author bio card at bottom of every post
- [ ] Newsletter form submits → newsletter_subscribers table
- [ ] Admin → Knowledge Center: create/edit/delete/publish works
- [ ] Rich text editor functional for body field
- [ ] ZH fields editable in admin
- [ ] Git commit: `feat: blog hub + post detail`

---

## Prompt 2G — Market Reports Hub + Report Detail

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C5: market-reports)

Seed 1 market report from Part3 C5 seed data.

Pages:
  app/[locale]/market-reports/page.tsx         → Market Reports Hub
  app/[locale]/market-reports/[slug]/page.tsx  → Report Detail

MARKET REPORTS HUB:
  Simple hero: "Orange County Real Estate Market Reports"
  Latest report: large featured card (full width) with key stat highlight + excerpt
  "Subscribe to monthly updates" — newsletter signup inline form
  Past reports grid: all previous reports as cards with date, headline, key stat
  Pagination

REPORT DETAIL:
  Month + area in hero (e.g. "March 2026 | Orange County, NY")
  Key stats summary strip (up to 5 stats from report.keyStats)
  Narrative body (rich text — Jin's analysis)
  Data tables or charts (if report.dataPoints array has data — render as styled table)
  Download PDF button (if report.pdfUrl set — link to Supabase storage)
  Subscribe strip ("Get this report every month")
  WorkWithMe CTA
  Related blog posts

ADMIN WIRE:
Admin → Market Reports → CRUD:
  Fields: title, slug, reportMonth, reportYear, area, coverImage,
          excerpt, keyStats (array), body (rich text), dataPoints (array),
          pdfUrl (file upload to Supabase storage), featured, publishDate
```

### Done-Gate 2G

- [ ] `/en/market-reports` hub renders with featured report prominent
- [ ] Report detail page renders for seed report
- [ ] Key stats strip renders with correct data
- [ ] PDF download link renders when pdfUrl set
- [ ] Newsletter signup on hub submits correctly
- [ ] Admin → Market Reports: create/edit/delete works
- [ ] Git commit: `feat: market reports hub + detail`

---

## Prompt 2H — Neighborhoods Hub + Neighborhood Detail

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C4: neighborhoods)

Seed all 5 neighborhood items from Part3 C4 seed data.

Pages:
  app/[locale]/neighborhoods/page.tsx         → Neighborhoods Hub
  app/[locale]/neighborhoods/[slug]/page.tsx  → Neighborhood Detail

NEIGHBORHOODS HUB:
  Hero: "Explore Orange County Neighborhoods"
  Filter bar: lifestyle type (commuter-friendly, family, waterfront, rural),
              price range, school rating
  Neighborhood card grid: all 5 at launch
  Each card: photo + neighborhood name + city + lifestyle tags +
             price range + school rating chip + brief tagline
  Map view toggle (pins for each neighborhood)

NEIGHBORHOOD DETAIL (reuse from REB + add REA-specific sections):
  Hero: full-width photo + neighborhood name + city overlay
  Overview: character description, who lives here (rich text)
  Key Stats: median price, price/sqft, avg DOM, YoY change, school rating
  Active Listings in This Neighborhood (PropertyGrid filtered by neighborhood)
  Recent Solds in This Neighborhood (SoldGrid filtered by neighborhood)
  Schools section: district name + rating + description
  Lifestyle section: local amenities, things to do (from neighborhood.lifestyle)
  Jin's Insider Take (NEW — InsiderNeighborhoodTake component):
    - Yellow/champagne gold left-border section
    - Heading: "Jin's Take on [Neighborhood Name]"
    - Body: neighborhood.insiderTake (personal knowledge paragraph)
    - Agent photo thumbnail + name
    This is the key REA differentiator — personal local knowledge
  Neighborhood-specific blog posts (BlogCard filter by neighborhood tag)
  CTA: "Looking in [Neighborhood]?" → contact

ADMIN WIRE:
Admin → Neighborhoods → CRUD:
  Fields: name, slug, city, state, heroImage, galleryImages,
          overview (rich text), lifestyleTags (array), priceRange,
          schoolDistrict, schoolRating, medianPrice, avgDOM, yoyChange,
          schools (array), lifestyle (rich text), insiderTake (textarea — personal note from Jin),
          coordinates (lat/lng for map pin)
  Note: insiderTake is critical — highlight in admin as "Jin's personal insight"
```

### Done-Gate 2H

- [ ] `/en/neighborhoods` hub with 5 neighborhood cards
- [ ] Filter bar works (lifestyle type, price range)
- [ ] `/en/neighborhoods/port-jervis` (and other 4) render detail pages
- [ ] Active listings filter works on detail page
- [ ] InsiderNeighborhoodTake section: champagne gold border, agent thumbnail
- [ ] Admin → Neighborhoods: create/edit/delete, insiderTake field prominent
- [ ] Git commit: `feat: neighborhoods hub + detail with insider take`

---

## Prompt 2I — Case Studies Hub + Case Study Detail

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C1: case-studies, C8: hub config)

Seed all 4 case study items from Part3 C1 seed data.

Pages:
  app/[locale]/case-studies/page.tsx         → Case Studies Hub
  app/[locale]/case-studies/[slug]/page.tsx  → Case Study Detail

CASE STUDIES HUB:
  Hero: "Real Transactions. Real Results."
  Filter: All | Buyer | Seller | Investor | Relocator | International Buyer
  CaseStudyCard grid (2-col desktop, 1-col mobile):
    Each card: thumbnail, transaction type badge, outcome headline,
               key result stat (e.g. "Sold 6.2% above asking"),
               client quote excerpt, "Read Full Story →"
  "Start Your Own Story" CTA at bottom → /contact

CASE STUDY DETAIL — all sections in order:

1. OUTCOME HEADER
   Large outcome headline: "Competitive Market Win: $295K Home Secured Under Asking"
   Transaction type badge (color-coded by type)
   Key metrics row: priceRange | location | result.keyWin

2. THE SITUATION
   Heading: "The Situation"
   Body: rich text — who the client was (anonymous), what they needed, obstacles
   Section bg: white

3. THE STRATEGY
   Heading: "The Strategy"
   Body: rich text — exactly what Jin did and why
   Section bg: var(--color-backdrop-warm)
   This section should have the most detail — it demonstrates expertise

4. THE RESULT
   Heading: "The Result"
   Body: rich text — specific outcome story
   Result metrics block (if applicable):
     Purchase price | List price | Sale-to-list | Days on market
   Section bg: white

5. CLIENT QUOTE
   Full-width testimonial block — champagne gold bg
   Large quote marks icon
   Quote text: Cormorant Garamond italic, 24px
   Attribution line + consent note ("Shared with client's permission.")
   Section bg: var(--color-secondary) = champagne gold, text dark

6. KEY TAKEAWAYS
   3 bullet points — boxed, with checkmark icons
   Heading: "Key Takeaways from This Transaction"
   These double as SEO content
   Section bg: var(--color-backdrop-warm)

7. RELATED SERVICES
   Small link chips: e.g. "Buying" | "Negotiation" | "First-Time Buyers"
   Links to relevant service pages

8. RELATED CASE STUDIES (2–3 cards)
   CaseStudyCard — relatedCaseStudySlugs from this case study
   Heading: "More Transaction Stories"

9. WORK WITH ME CTA
   WorkWithMeSection: "Ready to write your own success story?"

ADMIN WIRE (Case Studies Editor — new):
Admin → Case Studies → CRUD:
  Fields: title, slug, transactionType (dropdown), outcomeHeadline,
          clientProfile, location, priceRange,
          result.purchasePrice, result.salePrice, result.daysOnMarket,
          result.saleToListRatio, result.keyWin,
          thumbnailImage (media picker), heroImage (media picker),
          situation (rich text), strategy (rich text), outcome (rich text),
          clientQuote (textarea), clientQuoteAttribution, clientConsentNote,
          keyTakeaways (3-item array), relatedServices (tag input),
          relatedCaseStudySlugs (multi-select from existing cases),
          publishDate, featured (toggle)
  ZH fields: titleZh, outcomeHeadlineZh, keyWinZh (separate tab)
```

### Done-Gate 2I

- [ ] `/en/case-studies` hub with 4 cards, filter by type works
- [ ] All 4 case study detail pages render
- [ ] Client quote section: champagne gold bg, italic Cormorant Garamond
- [ ] Key takeaways: 3 bullet points with checkmarks
- [ ] Consent note present on every case study
- [ ] WorkWithMe CTA at bottom
- [ ] Admin → Case Studies: full CRUD works
- [ ] ZH fields editable in admin
- [ ] Git commit: `feat: case studies hub + detail + admin editor`

---

## Prompt 2J — Testimonials Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C2: testimonials, C8: hub config)

Seed all 15 testimonials from Part3 C2 seed data.

Page: app/[locale]/testimonials/page.tsx
Data: content_key "page:testimonials" + fetch testimonials collection

SECTIONS:

1. HERO
   "What My Clients Say"
   Aggregate rating display: ★★★★★  4.9 / 5 · 90+ reviews
   Subheading with source breakdown: "Google · Zillow · Direct"
   Section bg: var(--color-primary), text white

2. FILTER BAR
   Filter pills: All | Buyers | Sellers | Investors | Relocators | Chinese (中文)
   Secondary filter: by neighborhood (dropdown)
   Active filter highlighted in champagne gold

3. TESTIMONIALS MASONRY GRID
   2-col (desktop), 1-col (mobile) masonry or CSS column layout
   Each testimonial card:
     - Stars (1–5, gold)
     - Quote text (line-clamp: 6 lines with "Read more" expand)
     - Attribution: "— [name], [transactionType], [neighborhood]"
     - Date (month year format)
     - Source badge: "Google" | "Zillow" | "Direct"
   Cards alternate bg: white / var(--color-backdrop-warm)
   Featured testimonials pinned to top of grid

4. VIDEO TESTIMONIAL (optional)
   If testimonial has videoUrl: render large embedded video
   Section bg: var(--color-backdrop-dark)
   Heading: "In Their Own Words"
   (Show only if at least one testimonial has videoUrl set)

5. LEAVE A REVIEW CTA
   Section with 3 review platform links:
     "Leave a Google Review →" | "Leave a Zillow Review →" | "Contact Me Directly"
   Section bg: var(--color-backdrop-warm)

6. WORK WITH ME CTA
   WorkWithMeSection at bottom

FILTER LOGIC:
  - Filters update URL params (?type=buyer&neighborhood=port-jervis)
  - Client-side filtering — no page reload
  - "中文" filter: shows testimonials where locale = "zh" OR isChineseLanguage = true

ADMIN WIRE (Testimonials Editor — new):
Admin → Testimonials → CRUD:
  Fields: clientName, rating (1–5), transactionType (dropdown),
          neighborhood, testimonialText (textarea), source (dropdown),
          featured (toggle), publishDate, videoUrl (optional),
          locale (en/zh), isChineseLanguage (toggle — for EN testimonials from Chinese clients)
  ZH fields: testimonialTextZh (separate field if original was in Chinese)
```

### Done-Gate 2J

- [ ] `/en/testimonials` renders with masonry grid of 15 testimonials
- [ ] `/zh/testimonials` renders, Chinese filter shows ZH testimonials
- [ ] Filter by type works (buyer, seller, investor, relocator)
- [ ] "Read more" expand works on long testimonials
- [ ] Star ratings render correctly (1–5 gold stars)
- [ ] Source badges show (Google / Zillow / Direct)
- [ ] Admin → Testimonials: create/edit/delete/feature works
- [ ] Git commit: `feat: testimonials page + admin editor`

---

## Prompt 2K — FAQ + Resources Hub (Gated Downloads)

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C7: gated downloads, C8: resources hub)

Pages:
  app/[locale]/faq/page.tsx       → FAQ
  app/[locale]/resources/page.tsx → Resources / Gated Downloads Hub

══════════════════════════════════════════
FAQ PAGE
══════════════════════════════════════════

Hero: "Frequently Asked Questions"
Category tabs or section headers:
  - Buying Questions (6 items)
  - Selling Questions (5 items)
  - Investing Questions (4 items)
  - Relocating Questions (4 items)
  - Working With Jin (4 items)
  - 常见问题 Chinese FAQ section (on ZH locale — 4 items in Chinese)

Each category: accordion with smooth open/close animation
"Still have questions?" CTA at bottom → /contact

Admin: FAQ items managed in Content Editor for faq.json page
Admin → Content → faq: accordion items editable (question/answer pairs per category)

══════════════════════════════════════════
RESOURCES HUB (GATED DOWNLOADS)
══════════════════════════════════════════

Seed 6 gated download items from Part3 C7 seed data.

Hero: "Free Guides & Resources" + subtitle
Category filter: All | Buyers | Sellers | Investors | Relocators

Guide cards grid (3-col desktop, 2-col tablet, 1-col mobile):
  Each card:
    - Cover image or icon (large, centered)
    - Category badge
    - Title + description
    - "Download Free Guide" button → triggers gate form (built in 2L)
  Card hover: champagne gold border, subtle lift

Section bg: var(--color-backdrop-warm)
"Can't find what you need? Contact me →" link at bottom

Admin → Gated Downloads → CRUD:
  Fields: title, titleZh, category (dropdown), description, descriptionZh,
          icon (select from icon list), coverImage (media picker),
          pdfUrl (file upload to Supabase Storage),
          emailSubjectLine, emailBodyPreview, active (toggle), sortOrder
```

### Done-Gate 2K

- [ ] `/en/faq` with all 5 category sections, accordion works
- [ ] `/zh/faq` shows Chinese FAQ section prominently
- [ ] `/en/resources` with 6 guide cards, category filter works
- [ ] Guide card "Download" button triggers gate form (placeholder until 2L)
- [ ] Admin → Content → faq: accordion items editable
- [ ] Admin → Gated Downloads: create/edit/delete/sort works
- [ ] PDF upload to Supabase Storage works (test with dummy PDF)
- [ ] Git commit: `feat: faq + resources hub`

---

## Prompt 2L — Gated Download System (Gate Forms + Email Delivery)

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART3.md (C7: gated downloads)

GOAL: Build the complete gated download system — inline gate forms that capture
email, save to Supabase, and trigger PDF delivery via email.

══════════════════════════════════════════
COMPONENT: GatedDownloadGate.tsx
══════════════════════════════════════════

Props: { guideSlug: string, title: string, variant: "inline" | "modal" }

Renders as "inline" (default — embedded in guide cards and service pages):
  - Small form: First Name + Email + submit button
  - Submit label: "Send Me the Guide" (EN) / "发送指南" (ZH)
  - Privacy note below: "No spam. Unsubscribe anytime." (small, muted)
  - After submit: shows confirmation state (checkmark + "Check your email!")

Renders as "modal": same form in a centered modal overlay

State flow:
  idle → submitting → success | error

On submit → POST /api/gated-download with:
  { guideSlug, firstName, email, locale, siteId }

══════════════════════════════════════════
API ROUTE: /api/gated-download
══════════════════════════════════════════

Steps:
  1. Validate: email required, guideSlug required
  2. Look up guide in gated_downloads_catalog (content_entries key "resources:[guideSlug]")
     Get: pdfUrl, emailSubjectLine, emailBodyPreview
  3. Upsert into gated_downloads table:
     { site_id, email, first_name, guide_slug, locale, download_sent: false }
  4. If pdfUrl is set and not empty:
     Send delivery email via Resend:
       To: submitter email
       From: jin@jinpanghomes.com (or noreply@jinpanghomes.com)
       Subject: guide.emailSubjectLine
       Body: guide.emailBodyPreview + download link (pdfUrl)
       Update download_sent = true in gated_downloads table
  5. If pdfUrl is empty (guide not yet uploaded):
     Send placeholder email: "Your guide is being prepared. Jin will send it to you personally."
  6. Emit to CRM sink (name, email, guide slug — high-intent lead signal)
  7. Subscribe email to newsletter list (add to newsletter_subscribers if not exists)
  8. Return { success: true }
  Never block on step 4+ failures — DB write is primary

══════════════════════════════════════════
WIRE GATE INTO ALL SERVICE PAGES
══════════════════════════════════════════

Replace all "GatedDownloadSection" placeholders in these pages:
  - Buying page: 3 buyer guides
  - Selling page: 3 seller guides
  - Relocating page: 4 relocation guides
  - Resources hub: all 6 guides

For service pages — inline variant embedded in guide card
For resources hub — inline variant below each card

══════════════════════════════════════════
ADMIN: GATED DOWNLOADS MANAGEMENT
══════════════════════════════════════════

Admin → Gated Downloads → add download tracking view:
  Show list of all email captures from gated_downloads table:
    email | first_name | guide_slug | created_at | download_sent | locale
  Sort by created_at desc
  Filter by guide_slug
  Export to CSV button
  (Read-only — no editing of submissions)
```

### Done-Gate 2L

- [ ] GatedDownloadGate component renders inline on buying, selling, relocating, resources pages
- [ ] Form submits → saves to gated_downloads table
- [ ] Delivery email sent when pdfUrl is set (test with real PDF URL)
- [ ] Placeholder email sent when pdfUrl is empty
- [ ] CRM sink receives lead event on gate form submit
- [ ] Submitter added to newsletter_subscribers
- [ ] Admin → Gated Downloads shows submission list with filter + CSV export
- [ ] Gate form renders correctly in ZH locale (Chinese labels)
- [ ] Git commit: `feat: gated download system — gate forms + email delivery`

---

## Prompt 2M — All Collection Admin Editors

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Ensure all 5 collection admin editors are fully operational.
Replace the Phase 0 placeholder pages with real CRUD editors.

For each collection, the editor must support:
  - List view: all items in table/list, sortable by date, filterable by status
  - Create: new item form
  - Edit: edit existing item — all fields
  - Delete: with confirmation dialog
  - Duplicate: copy existing item as draft
  - Publish/Draft: status toggle
  - ZH fields: separate locale tab in each editor

══════════════════════════════════════════
EDITOR 1: Admin → Case Studies
══════════════════════════════════════════
Route: /admin/case-studies
List columns: title | transactionType | publishDate | featured | status
Form fields: all fields from C1 schema (see Done-Gate 2I for field list)
Rich text: situation, strategy, outcome fields use existing rich text editor
Media: thumbnailImage, heroImage use media picker

══════════════════════════════════════════
EDITOR 2: Admin → Testimonials
══════════════════════════════════════════
Route: /admin/testimonials
List columns: clientName | rating (stars) | transactionType | featured | date
Form fields: all fields from C2 schema (see Done-Gate 2J for field list)
Star rating input: 1–5 selector (5 star icons, clickable)
Featured toggle: promotes testimonial to top of walls

══════════════════════════════════════════
EDITOR 3: Admin → Gated Downloads (catalog management)
══════════════════════════════════════════
Route: /admin/gated-downloads
Two tabs:
  Tab 1: "Guides Catalog" — manage guide items (CRUD)
  Tab 2: "Download Submissions" — read-only log of gated_downloads table
Catalog list columns: title | category | active | sortOrder | pdfUrl (yes/no)
PDF upload: file picker → uploads to Supabase Storage → writes URL to pdfUrl field

══════════════════════════════════════════
EDITOR 4: Admin → Investor Inquiries
══════════════════════════════════════════
Route: /admin/investor-inquiries
Read-only list view:
  Columns: name | email | phone | investmentType | budgetRange | timeline | status | created_at
  Filter by status (new / contacted / qualified / closed)
  Status update: dropdown on each row — updates status field in investor_inquiries table
  Export to CSV

══════════════════════════════════════════
EDITOR 5: Admin → Leads & Requests (verify all existing)
══════════════════════════════════════════
Verify these existing REB editors still work correctly for REA:
  - Contact Requests (consultation_requests table)
  - Valuation Requests (valuation_requests table)
  - Showing Requests (showing_requests table)
  - Newsletter Subscribers (newsletter_subscribers table)
For each: confirm list view loads, status update works, export works.
```

### Done-Gate 2M

- [ ] Admin → Case Studies: list, create, edit, delete, publish/draft all work
- [ ] Admin → Testimonials: list, create, edit, delete, star rating input works
- [ ] Admin → Gated Downloads: catalog CRUD + submissions log view + CSV export
- [ ] Admin → Investor Inquiries: list view with status updates + CSV export
- [ ] All 4 existing leads editors (Contact, Valuation, Showing, Newsletter) verified working
- [ ] ZH locale tab functional in Case Studies and Testimonials editors
- [ ] Git commit: `feat: all collection admin editors complete`

---

## Prompt 2N — Persistent CTA System + WorkWithMe Sections

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Build the persistent CTA system (floating button, sticky header behavior)
and the reusable WorkWithMeSection component used across all service pages.

══════════════════════════════════════════
COMPONENT: WorkWithMeSection.tsx (NEW)
══════════════════════════════════════════

Props:
  heading: string
  subheading?: string
  cta: { label: string, href: string }
  variant: "portrait-left" | "centered" | "dark"
  agentPhoto?: string  (from site.json or passed directly)

Variant "portrait-left" (default for service pages):
  2-col layout:
    Left (40%): agent photo (rounded, shadow)
    Right (60%): heading + subheading + CTA button
  Section bg: var(--color-backdrop-warm)
  Photo: Jin Pang lifestyle/professional shot

Variant "centered":
  Centered layout, photo above text
  Used on About page bottom CTA

Variant "dark":
  BG: var(--color-backdrop-dark)
  All text white
  CTA button: champagne gold bg, dark text
  Used on home page, case studies

Wire WorkWithMeSection into these pages (replace existing CTAs):
  - Buying page (2N adds if not already in 2A)
  - Selling page
  - Investing page
  - Relocating page
  - Case study detail pages
  - Blog post detail pages
  - Neighborhood detail pages

══════════════════════════════════════════
PERSISTENT CTA: FLOATING BUTTON
══════════════════════════════════════════

Component: FloatingCtaButton.tsx (NEW)

Behavior:
  - Appears after user scrolls 600px down from top
  - Position: fixed bottom-right, z-index 50
  - Button: "Book a Consultation" — primary bg, white text, rounded, shadow
  - On mobile: slightly smaller, bottom center (not right)
  - Dismiss: small X button hides it for the session (sessionStorage flag)
  - Does NOT show on: /contact, /home-valuation (user is already converting)

Implementation:
  - Add to app/[locale]/layout.tsx (renders on all public pages)
  - useEffect + scroll listener to control visibility
  - Animate in: slide-up + fade-in on appearance
  - Href: /[locale]/contact

══════════════════════════════════════════
STICKY HEADER CTA (already in header — verify)
══════════════════════════════════════════

The header CTA button ("Book a Consultation") must always be visible on scroll.
Verify the sticky/solid header behavior works correctly on all page types.
Test on: home (transparent hero), about, buying, blog post.
```

### Done-Gate 2N

- [ ] WorkWithMeSection renders in "portrait-left" variant on buying, selling, investing, relocating
- [ ] WorkWithMeSection "dark" variant on home, case studies, blog posts
- [ ] Agent photo loads from site.json or media (not hardcoded)
- [ ] FloatingCtaButton appears after 600px scroll on all pages except /contact and /home-valuation
- [ ] Floating button dismiss works (sessionStorage — stays dismissed for session)
- [ ] Mobile: floating button centered at bottom
- [ ] Header stays solid + CTA visible on all scroll positions
- [ ] Git commit: `feat: WorkWithMeSection + floating CTA system`

---

## Phase 2 Completion Gate

Before starting Phase 3:

- [ ] **2A–2D** — All 4 service pages (Buying, Selling, Investing, Relocating) complete
- [ ] **2E** — Properties hub + detail + sold portfolio complete
- [ ] **2F–2H** — Blog, Market Reports, Neighborhoods — hub + detail pages complete
- [ ] **2I–2J** — Case Studies and Testimonials — hub + detail + admin editors complete
- [ ] **2K** — FAQ and Resources hub complete
- [ ] **2L** — Gated download system wired on all service pages, email delivery working
- [ ] **2M** — All 5 collection admin editors fully operational
- [ ] **2N** — WorkWithMeSection on all service pages, floating CTA live
- [ ] All pages responsive at 375px, 768px, 1280px
- [ ] All form APIs verified (contact, valuation, showing, investor, gated download)
- [ ] `npm run build` — zero errors
- [ ] Git tag: `v0.2-phase2-complete`

---

*End of REA_PHASE_2.md*
*Next: REA_PHASE_3.md — Admin Hardening + SEO + Programmatic Pages + Schema.org + Performance*

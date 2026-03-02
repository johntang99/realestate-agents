# BAAM System G2 — REA Phase 1
# Core Pages: Home, About, Contact, Valuation, Header/Footer

> **File:** REA_PHASE_1.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Phase:** 1 of 5
> **Duration:** Week 1 (Days 4–8)
> **Goal:** Build all core pages that every visitor hits — Home (14 sections), About, Contact, Home Valuation — plus verify the global Header and Footer at production quality. Admin wire + roundtrip verify on every page.
> **Cursor context:** Attach `@REA_COMPLETE_PLAN.md` + `@REA_CONTENT_CONTRACTS_PART1.md` + `@REA_CONTENT_CONTRACTS_PART2.md` + `@REA_PHASE_1.md`
> **Prerequisite:** Phase 0 complete gate passed. All global files seeded.

---

## Prompt Index

| # | Prompt | Est. Time |
|---|---|---|
| 1A | Header + Footer — Production Quality | 60 min |
| 1B | Home Page — All 14 Sections | 120 min |
| 1C | About / My Story Page | 60 min |
| 1D | Contact / Work With Me Page | 45 min |
| 1E | Home Valuation Page | 45 min |
| 1F | Admin Wire + Roundtrip Verify (all Phase 1 pages) | 60 min |

**Rule:** Build → Wire → Verify on every page. No page is "done" until the admin roundtrip passes.

---

## Prompt 1A — Header + Footer — Production Quality

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART1.md (G2: header.json, G3: footer.json)
Reference: @REA_COMPLETE_PLAN.md (A5: Visual Design Direction)

GOAL: Produce a production-quality Header and Footer that match REA's premium editorial brand.
These components load from content_entries (header.json / footer.json) and must be 100%
data-driven — no hardcoded text, links, or phone numbers.

══════════════════════════════════════════
HEADER REQUIREMENTS
══════════════════════════════════════════

Component: components/layout/SiteHeader.tsx
Data source: header.json loaded from Supabase (key: "header")

Structure (top to bottom):
  1. Topbar (conditional: header.topbar.enabled)
     - Left: address or tagline (from site.json)
     - Center: phone (click-to-call) + SMS link + email link
     - Right: social icon links + WeChat label (zh locale only) + language switcher
     - Height: var(--topbar-height) = 40px
     - BG: var(--color-backdrop-dark), text: var(--color-text-on-dark-muted)

  2. Main nav bar
     - Left: Logo (text "Jin Pang" + optional tagline "Port Jervis & Orange County")
     - Center: Nav items from header.nav array
       - Top-level items with no children: plain link
       - Top-level items with children: dropdown trigger
       - Dropdown: appears on hover (desktop) / tap (mobile)
       - Dropdowns use var(--color-backdrop-warm) background with border
     - Right: CTA button (header.ctaButton — "Book a Consultation")
     - Height: var(--header-height) = 72px
     - BG: white (solid) OR transparent (when transparentOnHero = true AND at page top)
     - On scroll past hero: transition to white + drop shadow

  3. Announcement bar (conditional: header.announcementBar.enabled)
     - Full-width strip above topbar when enabled
     - BG: var(--color-secondary), text: var(--color-backdrop-dark)

Mobile behavior (< 768px):
  - Hamburger menu replaces nav items
  - Drawer slides in from right
  - Drawer shows: all nav items as accordion + phone + email + language switcher + CTA
  - Mobile CTA button uses header.mobileCtaButton.label ("Book Now")

Transparent hero behavior:
  - When transparentOnHero = true AND window.scrollY < 80:
    nav text is white, logo text is white, no background
  - On scroll past 80px OR on non-hero pages: solid white bar with shadow
  - Transition: smooth 200ms

Design details:
  - Logo font: var(--font-display) — Cormorant Garamond, 24px
  - Nav links: var(--font-ui) — DM Sans, 14px, font-weight 500
  - Nav hover: var(--color-primary) color (teal)
  - Active page underline: 2px var(--color-secondary) (champagne gold)
  - CTA button: var(--color-primary) bg, white text, var(--radius-button) radius

══════════════════════════════════════════
FOOTER REQUIREMENTS
══════════════════════════════════════════

Component: components/layout/SiteFooter.tsx
Data source: footer.json loaded from Supabase (key: "footer")

Structure (top to bottom):
  1. Upper footer — dark bg (var(--color-backdrop-dark))
     Row 1:
       - Col 1 (wider): Logo text + tagline + contact block
         (phone, SMS, email, address, WeChat if zh locale)
         + social icons row
         + office hours
       - Col 2–4: footer.columns link groups (heading + links list)

  2. Lower footer — very dark bg (slightly darker than upper)
     - Left: copyright text (footer.compliance.copyright)
     - Center: legal links (Privacy Policy, Terms of Service)
     - Right: Equal Housing logo + "Equal Housing Opportunity" text

  3. Compliance block — full-width, small text, centered
     - Agent name + license number + license state
     - "Affiliated with [brokerage name] | License #[brokerage license]"
     - MLS disclaimer paragraph
     - Fair housing statement (collapsed/expandable)

Design details:
  - Upper footer bg: var(--color-backdrop-dark) = #111E24
  - Link color: var(--color-text-on-dark-muted) hover → white
  - Heading color: var(--color-secondary) = champagne gold
  - Compliance text: 11px, var(--color-text-on-dark-muted), centered
  - Equal Housing logo: white version, 40px height

══════════════════════════════════════════
ADMIN WIRE — HEADER
══════════════════════════════════════════

Admin → Site Settings → Header must allow editing:
  - Logo text + optional image upload
  - Topbar enabled toggle
  - Phone, SMS href, email, WeChat label
  - Announcement bar: enabled, text, link
  - CTA button: label, href
  - Nav items: full nav editor (existing from REB — verify works)
  - transparentOnHero toggle

Admin → Site Settings → Footer must allow editing:
  - Tagline
  - All 4 link columns (add/edit/remove/reorder links)
  - Contact block fields
  - Social links
  - Compliance text fields (protected with warning)
  - Legal links
```

### Done-Gate 1A

- [ ] Header renders correctly on `/en` and `/zh`
- [ ] Topbar shows phone, email, social icons
- [ ] WeChat label appears on `/zh` topbar only
- [ ] Language switcher toggles EN ↔ ZH
- [ ] Nav dropdowns work on hover (desktop) and tap (mobile)
- [ ] Mobile drawer opens/closes, shows all nav + CTA
- [ ] Transparent header on hero pages, solid on scroll
- [ ] Footer 4-column layout renders with dark bg
- [ ] Compliance block shows individual agent license (not brokerage-only)
- [ ] Equal Housing logo visible in footer
- [ ] Admin Site Settings → Header saves and reflects in header
- [ ] Admin Site Settings → Footer saves and reflects in footer
- [ ] Git commit: `feat: header + footer production quality`

---

## Prompt 1B — Home Page — All 14 Sections

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P1: home.json)
Reference: @REA_COMPLETE_PLAN.md (A3: Page Design — Home)

GOAL: Build the Home page with all 14 sections, fully data-driven from home.json.
This is the most important page — it must be premium, personal, and high-converting.

Page file: app/[locale]/page.tsx (locale home)
Data source: content/jinpang-homes/[locale]/pages/home.json

First, create the page seed files:
  content/jinpang-homes/en/pages/home.json  ← from PART2 P1 EN seed
  content/jinpang-homes/zh/pages/home.json  ← from PART2 P1 ZH seed
Seed both into content_entries with content_key: "page:home"

══════════════════════════════════════════════
SECTION 1 — AGENT BRAND HERO (NEW component)
══════════════════════════════════════════════

Component: components/sections/AgentBrandHero.tsx
Variant driven by: hero.variant

Variant "agent-brand-full":
  - Full-viewport height (hero.heightVh — default 92vh)
  - Background: large agent photo (hero.agentPhoto) filling full viewport
    OR ambient landscape photo if agent photo not yet uploaded
  - Dark overlay: var(--hero-overlay-color) at var(--hero-overlay-opacity) = 0.42
  - Content zone: left-aligned, max-width 640px, centered vertically in left 55% of viewport
  - Agent name chip: small uppercase label "Jin Pang" in champagne gold
  - Headline: hero.headline — Cormorant Garamond, 64–72px, white, line-height 1.05
  - Sub: hero.subheadline — DM Sans, 18px, white/80%, max-width 520px
  - Bilingual badge: if hero.bilingualBadge — "English + 中文" pill badge, champagne gold bg
  - Intent micro-CTAs: hero.intentCtas — 3 small pill buttons (Buy / Sell / Invest)
    Style: translucent white bg, white text, border white/30%, gap 8px
  - Primary CTA: large button, var(--color-secondary) bg, dark text ("Book a Consultation")
  - Secondary CTA: outline button, white border + text ("See My Listings")
  - Scroll indicator: animated chevron at bottom center

Right side (desktop only):
  - Floating contact card: Jin Pang photo (thumbnail) + name + phone + "Call Now" button
  - Position: fixed right side of hero, 60% from left, vertically centered
  - Style: white card, rounded, shadow, semi-transparent

Mobile (< 768px):
  - Full-width photo background
  - Content stacked, centered
  - Intent micro-CTAs become scrollable horizontal strip
  - Floating contact card hidden

══════════════════════════════════════════════
SECTION 2 — GOAL-BASED ENTRY PATHS
══════════════════════════════════════════════

Component: components/sections/GoalEntryPaths.tsx (reuse from REB — adapt)
Data: home.goalPaths

4 cards (Buy / Sell / Relocate / Invest)
Layout: 4-column grid (desktop), 2-col (tablet), 1-col (mobile)
Each card:
  - Large icon (from goalPath.icon — Lucide icon name)
  - Label: DM Serif Display, 20px
  - Subline: Inter, 14px, secondary color
  - Full card is clickable → href
  - Hover: card lifts (translateY -4px), border color → primary
  - BG: white card on var(--color-backdrop-warm) section bg

Section bg: var(--color-backdrop-warm)
Section padding: var(--section-padding-y)

══════════════════════════════════════════════
SECTION 3 — PERSONAL INTRO
══════════════════════════════════════════════

Component: components/sections/PersonalIntroSection.tsx (NEW)
Data: home.personalIntro

Layout: 2-column (text left, photo right on desktop; stacked on mobile)
  Left col:
    - Section label chip: "About Jin" in champagne gold
    - Heading: DM Serif Display, 40px
    - Body: rich text (dangerouslySetInnerHTML) — Inter, 17px, line-height 1.65
    - Pull quote: blockquote style — italic, Cormorant Garamond, 22px, left border
      in var(--color-secondary) (champagne gold), 4px, padding-left 20px
    - CTA link: "My Full Story →" in primary color with underline hover

  Right col:
    - Agent photo — rounded (radius 12px), full column width
    - Subtle shadow: var(--shadow-lg)

Section bg: white
Section padding: var(--section-padding-y)

══════════════════════════════════════════════
SECTION 4 — STATS BAR
══════════════════════════════════════════════

Component: StatsBar (reuse from REB)
Data: home.statsBar.stats (5 stats)

BG: var(--color-primary) = #18292F (dark teal)
Stat values: Cormorant Garamond, 48px, var(--color-secondary) (champagne gold)
Stat labels: DM Sans, 13px, var(--color-text-on-dark-muted)
Dividers: 1px vertical line between stats, white/20%
Animation: count-up on scroll into view (use IntersectionObserver)
Layout: 5 equally-spaced columns (desktop), 3+2 wrap (tablet), 1-col (mobile)

══════════════════════════════════════════════
SECTION 5 — FEATURED LISTINGS
══════════════════════════════════════════════

Component: PropertyGrid (reuse from REB)
Data: home.featuredListings.listingIds — fetch these property slugs from properties table

If listingIds is empty: show placeholder cards with "Listings coming soon" state
Grid: 3-col desktop, 2-col tablet, 1-col mobile
Section heading + subheading centered above grid
CTA button centered below grid → /en/properties
Section bg: var(--color-backdrop-warm)

══════════════════════════════════════════════
SECTION 6 — WHY WORK WITH ME
══════════════════════════════════════════════

Component: components/sections/WhyWorkWithMeSection.tsx (NEW)
Data: home.whyWorkWithMe.points (4 points)

Layout: 2×2 grid (desktop), 1-col (mobile)
Each point card:
  - Icon: Lucide icon, 28px, var(--color-primary) bg circle, white icon
  - Heading: DM Serif Display, 20px
  - Body: Inter, 15px, secondary text color
  - Card bg: white, border var(--color-border), radius var(--radius-card)
  - Hover: border → var(--color-primary), shadow lift

Section bg: white
Section heading centered above grid: "Why Work With Jin Pang"

══════════════════════════════════════════════
SECTION 7 — SOLD PORTFOLIO PREVIEW
══════════════════════════════════════════════

Component: SoldGrid (reuse from REB — show latest N items)
Data: home.soldPreview.count = 3 — fetch 3 most recent sold properties

Each card shows: SOLD badge (burgundy red), price, address, "Sold X% above asking" OR "Sold in X days"
CTA below: "Full Sold Portfolio →"
Section bg: var(--color-backdrop-warm)

══════════════════════════════════════════════
SECTION 8 — CASE STUDIES PREVIEW
══════════════════════════════════════════════

Component: components/sections/CaseStudiesPreview.tsx (NEW — uses CaseStudyCard)
Data: home.caseStudiesPreview.count = 2 — fetch 2 featured case studies from collection

CaseStudyCard component (NEW):
  - Thumbnail image (left, 40% width on desktop)
  - Right: transaction type badge, outcome headline, key result stat, client quote excerpt
  - "Read Full Story →" link
  - Card border, hover lift animation

Section heading: "Transaction Stories" — centered
CTA: "All Case Studies →"
Section bg: white

══════════════════════════════════════════════
SECTION 9 — TESTIMONIAL STRIP
══════════════════════════════════════════════

Component: TestimonialDisplay variant: "rotating-strip" (reuse/adapt from REB)
Data: fetch home.testimonialStrip.displayCount testimonials from testimonials collection

Full-width section, dark bg (var(--color-backdrop-dark))
Single testimonial displayed with:
  - Stars (5 gold stars)
  - Quote text: Cormorant Garamond italic, 24px, white
  - Attribution: "— Client Name, Transaction Type, Location" — DM Sans, 13px, muted
Auto-rotates every 6 seconds with fade transition
Dot indicators at bottom
CTA: "All Reviews →" in champagne gold

══════════════════════════════════════════════
SECTION 10 — NEIGHBORHOOD SPOTLIGHT
══════════════════════════════════════════════

Component: NeighborhoodCard / NeighborhoodHub mini (reuse from REB)
Data: home.neighborhoodSpotlight.neighborhoodSlugs — fetch 3 neighborhoods

3 cards in a row (desktop), 1-col (mobile)
Each card: full-bleed photo with dark overlay + neighborhood name + city + price range
"Explore →" on hover
CTA below: "All Neighborhoods →"
Section bg: var(--color-backdrop-warm)

══════════════════════════════════════════════
SECTION 11 — MARKET REPORT TEASER
══════════════════════════════════════════════

Component: MarketReportCard (reuse from REB — single featured card)
Data: fetch most recent market report from market-reports collection

Layout: full-width card, dark bg (primary), 2-col split:
  Left: report headline + publication date + key stat highlight
  Right: brief excerpt + "Read Full Report →" button (champagne gold)
Section bg: white (card sits on white)

══════════════════════════════════════════════
SECTION 12 — BLOG PREVIEW
══════════════════════════════════════════════

Component: BlogCard grid (reuse from REB)
Data: home.blogPreview.count = 3 — fetch 3 most recent blog posts for locale

3 cards (desktop), 1-col (mobile)
Each card: category badge, title, excerpt, read time, "Read →"
CTA: "All Articles →"
Section bg: var(--color-backdrop-warm)

══════════════════════════════════════════════
SECTION 13 — BILINGUAL CTA BLOCK
══════════════════════════════════════════════

Component: components/sections/BilingualCtaBlock.tsx (NEW)
Data: home.bilingualCtaBlock

Full-width, dark bg (var(--color-backdrop-dark))
Two-column layout:
  Left (EN): headingEn + subEn + ctaEn button
  Right (ZH): headingZh + subZh + ctaZh button
Divider: vertical line, white/20%, centered
Both headings: Cormorant Garamond, 40px, white
Both CTAs: champagne gold bg, dark text
Mobile: stacked vertically

══════════════════════════════════════════════
SECTION 14 — CONTACT STRIP
══════════════════════════════════════════════

Component: components/sections/HomeContactStrip.tsx (NEW — lightweight)
Data: home.contactStrip

Layout: 2-col (form left, contact info right) or full-width form
Shows: quick contact form (name, phone, email, message) + phone/email direct links
Section bg: var(--color-backdrop-warm)
Heading: "Get in Touch" + response promise from site.json

══════════════════════════════════════════════
SEED THE PAGE
══════════════════════════════════════════════

After building all sections, create the page seed script:
  scripts/seed-page-home.ts

Upsert home.json (EN + ZH) into content_entries:
  content_key: "page:home"
  locale: "en" / "zh"

Run the seed and verify the page renders from DB, not just local file.
```

### Done-Gate 1B

- [ ] Home page renders at `/en` and `/zh` without errors
- [ ] All 14 sections render with seed content
- [ ] AgentBrandHero: transparent header, agent photo bg, bilingual badge, intent CTAs
- [ ] GoalEntryPaths: 4 cards render and link correctly
- [ ] PersonalIntro: 2-column layout, pull quote styled, CTA link works
- [ ] StatsBar: 5 stats with champagne gold values on dark teal bg
- [ ] FeaturedListings: renders (empty state acceptable if no listings seeded yet)
- [ ] WhyWorkWithMe: 2×2 grid with 4 points
- [ ] SoldPreview: renders (empty state acceptable)
- [ ] CaseStudiesPreview: renders with seed case study data (from Part 3)
- [ ] TestimonialStrip: rotating with seed testimonials
- [ ] NeighborhoodSpotlight: 3 neighborhood cards linked
- [ ] MarketReportTeaser: latest market report card renders
- [ ] BlogPreview: 3 blog post cards
- [ ] BilingualCtaBlock: EN + ZH side by side, dark bg
- [ ] ContactStrip: form + contact info visible
- [ ] `/zh` renders all sections in Chinese
- [ ] Page is fully responsive (test 375px, 768px, 1280px)
- [ ] Git commit: `feat: home page — all 14 sections`

---

## Prompt 1C — About / My Story Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P2: about.json)
Reference: @REA_COMPLETE_PLAN.md (A3: Page Design — About)

Page file: app/[locale]/about/page.tsx
Data: content_key "page:about" — seed from PART2 P2 seed data

First seed:
  content/jinpang-homes/en/pages/about.json → content_key: "page:about", locale: "en"
  content/jinpang-homes/zh/pages/about.json → content_key: "page:about", locale: "zh"
Add zh about.json with translated headings:
  myStory.heading: "我的故事"
  philosophy.heading: "我的理念"
  whyPortJervis.heading: "为什么选择波特杰维斯"
  credentials.heading: "资质与认证"
  workingWithMe.heading: "与我合作是什么体验"

BUILD ALL SECTIONS:

1. SIMPLE HERO
   Component: SiteHero variant "simple" (reuse from REB)
   Heading: "About Jin Pang" — large Cormorant Garamond
   Subheading: "Real estate agent. Local expert. Bilingual partner."
   BG: warm gradient from var(--color-backdrop-warm) — no image required
   OR use a subtle local landscape image with light overlay

2. MY STORY
   Layout: 2-col (text left, photo right)
   Body: dangerouslySetInnerHTML — renders rich text HTML from about.myStory.body
   Photo: rounded, shadow — agent photo (landscape/lifestyle shot preferred)
   Photo caption: small text below photo
   Section bg: white

3. PHILOSOPHY
   Component: PersonalPhilosophySection.tsx (NEW)
   Data: about.philosophy.beliefs (4 beliefs)
   Layout: 2×2 grid of belief cards
   Each card:
     - Icon circle (primary bg, white icon)
     - Heading: DM Serif Display, 18px (italic preferred — personal tone)
     - Body: Inter, 15px
   Section bg: var(--color-backdrop-warm)
   Section heading centered above grid

4. WHY PORT JERVIS
   Layout: full-width rich text section with optional photo
   If photo provided: 2-col (text left, photo right)
   Body text: personal voice, rendered as rich HTML
   Section bg: white

5. BILINGUAL SERVICE BLOCK
   Component: BilingualServiceSection.tsx (NEW)
   Shows: EN heading + body on left, ZH heading + body on right
   "English + 中文" large badge centered above
   If wechatQrImage provided: QR code on right side with "Add on WeChat" label
   BG: var(--color-primary) (dark teal), text white
   This section is always bilingual even on EN locale — shows both languages

6. BY THE NUMBERS
   Component: StatsBar (reuse) — 6 stats for About page
   BG: var(--color-secondary) = champagne gold, text dark
   (Different from home stats bar which uses primary/dark — this one is warm gold)

7. CREDENTIALS
   Layout: grid of credential items (2-col desktop, 1-col mobile)
   Each item: icon + label + detail text
   Styled as clean list items with left border accent
   Section bg: white

8. COMMUNITY
   Layout: rich text + optional photo
   Personal tone — "I'm involved here because..."
   Section bg: var(--color-backdrop-warm)

9. WORKING WITH ME
   Component: WorkingWithMeSteps.tsx (NEW)
   4 numbered steps in horizontal timeline (desktop), vertical (mobile)
   Each step: circle number, heading, body text
   Step circles: var(--color-primary) bg, white number
   Connector line between steps: var(--color-secondary) dashed line
   Section bg: white

10. CTA BLOCK
    Full-width dark section (var(--color-backdrop-dark))
    Heading + subheading + 2 buttons:
      Primary: "Contact Me" → /[locale]/contact
      Secondary outline: "See My Work" → /[locale]/case-studies

ADMIN WIRE:
Admin → Content → select "about" page
Verify all fields editable:
  - myStory.heading, myStory.body (rich text editor)
  - philosophy.beliefs array (add/edit/remove)
  - whyPortJervis.body (rich text)
  - bilingualService.bodyZh (editable Chinese text field)
  - credentials.items array
  - workingWithMe.steps array
  - cta heading + button labels
```

### Done-Gate 1C

- [ ] `/en/about` renders all 10 sections without errors
- [ ] `/zh/about` renders with Chinese content
- [ ] Rich text body renders as HTML (not raw tags)
- [ ] PersonalPhilosophySection: 2×2 grid of 4 beliefs
- [ ] BilingualServiceSection: shows EN + ZH side by side, dark teal bg
- [ ] StatsBar on About: champagne gold bg (different from Home's dark teal)
- [ ] WorkingWithMe: 4-step timeline with numbered circles
- [ ] CTA block at bottom with 2 buttons
- [ ] Admin → Content → about: all fields editable
- [ ] Save → reload → content reflects saved changes
- [ ] Fully responsive at 375px, 768px, 1280px
- [ ] Git commit: `feat: about page — all sections`

---

## Prompt 1D — Contact / Work With Me Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P3: contact.json)

Page file: app/[locale]/contact/page.tsx
Data: content_key "page:contact"

Seed:
  content/jinpang-homes/en/pages/contact.json → content_key: "page:contact", locale: "en"
  content/jinpang-homes/zh/pages/contact.json → content_key: "page:contact", locale: "zh"

ZH contact.json key differences:
  hero.heading: "联系我"
  hero.subheading: "无论您是否已准备好行动，我都在这里为您提供帮助。"
  form.heading: "发送消息"
  form.submitLabel: "发送"
  form.successMessage: "谢谢您！工作时间内我将在2小时内回复。"
  responsePromise.heading: "我的回复承诺"
  officeHours.heading: "工作时间"
  chineseSection.ctaLabel: "Switch to English →"
  chineseSection.ctaHref: "/en/contact"

BUILD ALL SECTIONS:

1. HERO — "Let's Talk"
   Variant: simple with agent photo
   Large warm photo of Jin Pang (portrait/outdoor)
   Heading: "Let's Talk" — Cormorant Garamond, 72px
   Subheading below
   BG: var(--color-primary) — dark teal on desktop sides, photo center
   OR: full-width photo with dark overlay

2. CONTACT METHODS ROW
   4 method cards in a row (desktop), 2-col (mobile):
     - Phone: "(845) 555-0142" with phone icon, click-to-call link, note below
     - Text: SMS link, message icon
     - Email: mailto link, mail icon
     - WeChat: WeChat ID, QR image if available (show on ZH locale; show on EN with label "For Chinese-speaking clients")
   Each card: white, border, rounded, centered content, hover: border → primary

3. CONTACT FORM
   Component: ContactForm (extend from REB)
   Fields (from contact.json form.fields):
     name (required), phone (required), email (required)
     purpose dropdown (6 options), preferred language dropdown, message textarea
   Submit button: primary bg, "Send Message"
   Success state: green checkmark + successMessage
   Form submits to: POST /api/contact
   API saves to consultation_requests table
   Sends email notification to jin@jinpanghomes.com via Resend

   Layout: form on left (60%), contact info on right (40%) — desktop
   Mobile: stacked

4. RESPONSE PROMISE
   Small section below form:
   Icon (clock) + heading "My Response Promise" + body text
   Style: var(--color-backdrop-warm) bg, left border accent var(--color-secondary)

5. MAP EMBED
   Google Maps embed showing Port Jervis, NY area
   iframe with mapsEmbedUrl from site.json address
   Rounded corners, subtle shadow
   Width: full, height: 320px

6. OFFICE HOURS
   Simple 3-row table: Weekdays / Saturday / Sunday with times
   Icon calendar beside heading
   Style: clean, minimal

7. CHINESE SERVICE SECTION
   Shown when contact.chineseSection.enabled = true
   Dark teal bg section
   Heading: "中文咨询服务" (bold, champagne gold)
   Body: Chinese text about full Chinese service
   WeChat label + QR code
   On EN locale: shows with "For Chinese-speaking clients" label
   On ZH locale: primary content in this section

FORM API REQUIREMENTS:
POST /api/contact must:
  1. Validate required fields (name, phone, email)
  2. Save to consultation_requests (Supabase)
  3. Emit to CRM sink (existing sink logic)
  4. Send notification email to CONTACT_EMAIL via Resend
  5. Return { success: true } — client shows success state
  6. Never block DB write if email/CRM fails (same pattern as REB)

ADMIN WIRE:
Admin → Content → contact
  - contactMethods: edit labels, values, notes
  - form: toggle fields, edit success message
  - responsePromise: edit heading + body
  - officeHours: edit times
  - chineseSection: enabled toggle, edit body text
```

### Done-Gate 1D

- [ ] `/en/contact` renders all 7 sections
- [ ] `/zh/contact` renders with Chinese content
- [ ] 4 contact method cards render, all links work (tel:, sms:, mailto:)
- [ ] Contact form submits and saves to `consultation_requests` in Supabase
- [ ] Notification email sent to jin@jinpanghomes.com on submit
- [ ] Form shows success message after submit
- [ ] Map embed loads (or shows graceful fallback if key not set)
- [ ] Chinese service section visible on both locales (with appropriate framing)
- [ ] Admin → Content → contact: fields editable and save correctly
- [ ] Git commit: `feat: contact page with form + API`

---

## Prompt 1E — Home Valuation Page

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART2.md (P4: home-valuation.json)

Page file: app/[locale]/home-valuation/page.tsx
Data: content_key "page:home-valuation"

Seed:
  content/jinpang-homes/en/pages/home-valuation.json → content_key: "page:home-valuation", locale: "en"
  content/jinpang-homes/zh/pages/home-valuation.json

ZH key differences:
  hero.heading: "您的房产价值几何？"
  hero.subheading: "由本地专业经纪人为您提供个性化市场分析——而非电脑自动估算。"
  form.heading: "申请免费估值"
  form.submitLabel: "申请免费估值报告"
  form.successMessage: "谢谢！我将在24小时内准备好您的个性化估值报告并与您联系。"
  intro.heading: "真实的CMA报告——非Zillow估算"

BUILD ALL SECTIONS:

1. HERO — "What's Your Home Worth?"
   Simple hero, dark teal bg
   Headline + subheading
   No CTA button in hero — the form below IS the CTA

2. INTRO BLOCK — "A Real CMA — Not a Zestimate"
   Heading + body paragraph
   4 differentiator badges in a row:
     "Prepared personally by Jin Pang" | "Delivered within 24 hours" |
     "Based on local comparable sales" | "Followed up with a personal call"
   Each badge: small icon + text, champagne gold icon, inline display
   Section bg: var(--color-backdrop-warm)

3. VALUATION FORM (primary conversion)
   Component: HomeValuationForm (extend from REB — add REA-specific fields)
   Fields:
     address (required), city (required), zip (required)
     propertyType dropdown (5 options)
     bedrooms dropdown, bathrooms dropdown
     sqft (optional), yearBuilt (optional)
     condition dropdown (4 options)
     notes textarea (optional)
     ── Contact info ──
     name (required), phone (required), email (required)
     preferred language dropdown (optional)
     timeline dropdown (5 options)
   Submit: "Request My Free Valuation" (large, full-width on mobile)
   Success: message + next steps summary

   Form layout: 2-column grid for property fields (desktop), 1-col (mobile)
   Contact info fields span full width at bottom
   Form card: white, shadow, rounded, padding 40px

   API: POST /api/valuation
     1. Validate required fields
     2. Save to valuation_requests (Supabase)
     3. CRM sink emit
     4. Email notification to CONTACT_EMAIL
     5. Confirmation email to submitter (optional — send if Resend configured)

4. WHAT HAPPENS NEXT
   4-step visual (same WorkingWithMeSteps component, configured for valuation flow)
   Steps: Review → Prepare CMA → You receive report → We talk through it
   Section bg: white

5. SELLER TESTIMONIALS (3)
   TestimonialDisplay — filter type: "seller"
   3 cards in row (desktop), 1-col (mobile)
   Source: testimonials collection, filtered by transactionType: "seller"
   Section bg: var(--color-backdrop-warm)

6. FAQ — Valuation-Specific
   Accordion component (reuse from REB)
   5 items from home-valuation.json faq.items
   Section bg: white

ADMIN WIRE:
Admin → Content → home-valuation
  - intro.heading, intro.body, intro.differentiators array
  - whatHappensNext.steps array
  - faq.items array (add/edit/remove)
  - Testimonials section: count and filter (no direct edit — testimonials managed in their own editor)
```

### Done-Gate 1E

- [ ] `/en/home-valuation` renders all 6 sections
- [ ] `/zh/home-valuation` renders with Chinese content
- [ ] Valuation form has all required fields, correct dropdowns
- [ ] Form submits → saves to `valuation_requests` in Supabase
- [ ] Email notification sent to jin@jinpanghomes.com
- [ ] Form shows success message with "What happens next" summary
- [ ] 4-step "What Happens Next" section renders
- [ ] Seller testimonials render (or empty state if none seeded yet)
- [ ] FAQ accordion opens/closes correctly
- [ ] Admin → Content → home-valuation: editable fields save correctly
- [ ] Git commit: `feat: home valuation page with form + API`

---

## Prompt 1F — Admin Wire + Roundtrip Verify (All Phase 1 Pages)

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Run a complete admin roundtrip verification on all Phase 1 pages.
This ensures every page is fully wired to the admin CMS — not just displaying
seed data, but actually reading from and writing to Supabase.

For each page (home, about, contact, home-valuation):

ROUNDTRIP TEST SEQUENCE:
  1. Open Admin → Content → [page]
  2. Identify one editable text field (heading or body)
  3. Change its value to something distinctive (e.g. "ROUNDTRIP TEST 2026")
  4. Click Save
  5. Go to the public page: /en/[page]
  6. Confirm the change is visible WITHOUT a code deploy
  7. Go back to admin, revert the change, save
  8. Confirm the original value is restored

VARIANT TEST (for pages with section variants):
  - Home hero: verify variant "agent-brand-full" is selectable and renders
  - Home sections: confirm section order matches JSON sections array

IMAGE FIELD TEST:
  - Home hero: agentPhoto field — upload a test image via media picker
  - Confirm image appears in hero background on public page
  - Contact hero: agentPhoto — same test
  - Revert to empty after test

LOCALE TEST:
  - For each page: edit the ZH locale in admin
  - Change one ZH field value
  - Verify /zh/[page] shows the change
  - Revert

IMPORT/EXPORT TEST:
  - Admin → Content → home → Export
  - Verify exported JSON matches what's in the editor
  - Admin → Content → import a previously exported file
  - Verify no data corruption

FORM SUBMISSION TEST (contact and home-valuation):
  - Submit the contact form from the public page with test data
  - Verify: new row in consultation_requests table in Supabase
  - Verify: notification email received at jin@jinpanghomes.com
  - Submit the valuation form with test data
  - Verify: new row in valuation_requests table
  - Verify: notification email received

FIX ALL ISSUES FOUND:
  - If any field doesn't save: fix the admin form field mapping
  - If any page doesn't read from DB: fix the content loading function
  - If any image field doesn't work: fix the media picker integration
  - If any form doesn't submit: fix the API route
  - Document all fixes in a comment in the relevant file
```

### Done-Gate 1F

- [ ] **Home:** Admin roundtrip passes — edit saves, public page reflects, reverts clean
- [ ] **About:** Admin roundtrip passes — rich text fields, philosophy array, steps array
- [ ] **Contact:** Admin roundtrip passes — form fields, contact methods, hours
- [ ] **Valuation:** Admin roundtrip passes — form fields, faq array, steps array
- [ ] Image upload → hero background works on home and contact pages
- [ ] ZH locale editable and reflects on public /zh/ pages
- [ ] Export/import verified on at least one page
- [ ] Contact form end-to-end: DB write + email notification confirmed
- [ ] Valuation form end-to-end: DB write + email notification confirmed
- [ ] Git commit: `test: phase 1 admin roundtrip all pass`

---

## Phase 1 Completion Gate

Before starting Phase 2:

- [ ] **1A** — Header + Footer at production quality, EN + ZH rendering correctly
- [ ] **1B** — Home page: all 14 sections built, responsive, seeded, rendering from DB
- [ ] **1C** — About page: all 10 sections built, admin wired
- [ ] **1D** — Contact page: form working end-to-end, admin wired
- [ ] **1E** — Home Valuation: form working end-to-end, admin wired
- [ ] **1F** — All admin roundtrips pass
- [ ] `npm run build` — zero errors
- [ ] All pages responsive at 375px, 768px, 1280px
- [ ] Git tag: `v0.1-phase1-complete`

---

*End of REA_PHASE_1.md*
*Next: REA_PHASE_2.md — Service Pages + Properties + Calculators + Case Studies + Testimonials + Blog + Neighborhoods + Market Reports + Admin Editors*

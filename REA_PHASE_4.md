# BAAM System G2 — REA Phase 4
# QA + Content Swap + Production Deploy + GSC + GBP Setup

> **File:** REA_PHASE_4.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Phase:** 4 of 5
> **Duration:** Week 5 (Days 24–28)
> **Goal:** Full QA pass, swap all seed data for Jin Pang's real content, deploy to production on jinpanghomes.com, submit to Google Search Console, set up Google Business Profile, and verify all live systems.
> **Cursor context:** Attach `@REA_COMPLETE_PLAN.md` + `@REA_PHASE_4.md`
> **Prerequisite:** Phase 3 completion gate passed. Production domain and hosting configured.

---

## Prompt Index

| # | Prompt | Est. Time |
|---|---|---|
| 4A | Full QA Pass — Functional + Visual + Bilingual | 90 min |
| 4B | Real Content Swap — Jin Pang's Actual Data | 60 min |
| 4C | Production Deploy — Vercel + Domain + ENV | 45 min |
| 4D | Post-Deploy Verification — Live Site Checklist | 30 min |
| 4E | Google Search Console + Google Business Profile Setup | 30 min |

---

## Prompt 4A — Full QA Pass — Functional + Visual + Bilingual

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Run a comprehensive QA pass across all pages and features before
replacing seed data with real content. Catch and fix everything now —
it is far easier before production goes live.

This prompt is a systematic checklist execution, not a build task.
For each issue found: fix it before continuing to the next item.

══════════════════════════════════════════
QA SECTION 1 — ALL PAGES: VISUAL REVIEW
══════════════════════════════════════════

For each page below, open in browser at 3 breakpoints:
  Desktop: 1440px    Tablet: 768px    Mobile: 375px

Check:
  □ No horizontal overflow / scroll on any breakpoint
  □ All text readable (no overflow, truncation, or collision)
  □ Images load (no broken image icons)
  □ Section spacing consistent — no collapsed sections or double-spacing
  □ Headings use correct fonts (Cormorant Garamond for display, DM Serif for h3/h4)
  □ Body text is Inter, 17px
  □ Primary color is teal #18292F (not Jin Pang Homes navy)
  □ No hardcoded "Lorem ipsum" or placeholder text visible to users
  □ No "TODO" or "Coming soon" text visible on public pages

Pages to review:
  EN locale: /, /about, /contact, /home-valuation
             /buying, /selling, /investing, /relocating
             /properties, /properties/[slug], /sold
             /blog, /blog/[slug]
             /market-reports, /market-reports/[slug]
             /neighborhoods, /neighborhoods/[slug]
             /case-studies, /case-studies/[slug]
             /testimonials, /faq, /resources

  ZH locale: /zh, /zh/about, /zh/contact, /zh/buying, /zh/selling

══════════════════════════════════════════
QA SECTION 2 — NAVIGATION + LINKS
══════════════════════════════════════════

  □ All nav dropdown items link to correct pages (no 404s)
  □ All footer links lead to correct destinations
  □ All CTA buttons throughout site link correctly
  □ "Book a Consultation" button → /en/contact
  □ "Get My Home's Value" → /en/home-valuation
  □ "View All Listings" → /en/properties
  □ All breadcrumbs show correct path and link back correctly
  □ Language switcher on every page: EN → /zh/[same path] and back
  □ Language switcher correctly handles pages that exist in both locales
  □ Language switcher on ZH blog post → goes to EN blog post (same slug)
  □ FloatingCtaButton does NOT appear on /contact or /home-valuation
  □ FloatingCtaButton dismiss (X) hides for session then reappears next visit

══════════════════════════════════════════
QA SECTION 3 — ALL FORMS: END-TO-END
══════════════════════════════════════════

For each form, submit with valid test data and verify:

  CONTACT FORM (/en/contact):
  □ Submit with: name, phone, email, purpose, message
  □ DB: row appears in consultation_requests table
  □ Email: notification received at jin@jinpanghomes.com
  □ UI: success message appears after submit
  □ Honeypot: submit with "website" field filled → silently returns success, NO DB row
  □ Validation: submit empty required fields → shows inline errors (no page reload)
  □ ZH locale: form labels in Chinese, submitLabel "发送"

  HOME VALUATION FORM (/en/home-valuation):
  □ Submit with: full property details + contact info
  □ DB: row in valuation_requests table
  □ Email: notification received
  □ UI: success message + "What happens next" summary shown
  □ ZH locale: all labels in Chinese

  SHOWING REQUEST (on /en/buying and /en/properties/[slug]):
  □ Submit with: name, phone, email, preferred date
  □ DB: row in showing_requests table
  □ Email: notification received
  □ Pre-fill: when triggered from property detail, property address is pre-filled

  INVESTOR INQUIRY (/en/investing — off-market gate form):
  □ Submit with: name, email, investmentType, budget
  □ DB: row in investor_inquiries table (type: "off-market-alert")
  □ Email: notification received
  □ UI: success message

  INVESTOR CONSULTATION (/en/investing — consultation form):
  □ Submit with: full form
  □ DB: row in investor_inquiries (type: "consultation")
  □ Email: notification received

  GATED DOWNLOAD (on /en/resources — one guide):
  □ Submit with: firstName, email
  □ DB: row in gated_downloads table
  □ Email: delivery email sent to submitter (or placeholder email if PDF not uploaded)
  □ CRM sink event triggered
  □ Newsletter subscription created
  □ UI: success state "Check your email!"
  □ ZH locale: form in Chinese on /zh/resources

  NEWSLETTER (/en/blog — newsletter signup):
  □ Submit with email
  □ DB: row in newsletter_subscribers
  □ UI: success message
  □ Duplicate submission: graceful (no error — "already subscribed" message OR silent)

══════════════════════════════════════════
QA SECTION 4 — CALCULATORS
══════════════════════════════════════════

  MORTGAGE CALCULATOR (/en/buying):
  □ Input: $300,000 price, 20% down, 7.0% rate, 30yr
    Expected output: ~$1,596/mo P+I (verify formula)
  □ Input: $450,000 price, 10% down, 6.5% rate, 30yr
    Expected output: ~$2,563/mo P+I
  □ Live update: change any field → output updates instantly
  □ Edge cases: 0% down → no crash; 0% rate → no NaN; empty fields → shows $0 or $--
  □ Disclaimer text visible below calculator

  CAP RATE CALCULATOR (/en/investing):
  □ Input: $300,000 price, $2,200/mo rent, 5% vacancy, $8,000/yr expenses
    Expected: NOI = ($2,200 × 12 × 0.95) - $8,000 = $17,080; CAP = 5.69%
  □ Color coding: 5.69% → neutral blue (4–6% range)
  □ Input CAP > 6%: color turns green
  □ Input CAP < 4%: color turns orange warning
  □ Disclaimer visible

  RENTAL YIELD CALCULATOR (/en/investing):
  □ Input: $300,000 price, $2,200/mo rent
    Expected: Gross yield = (2,200 × 12) / 300,000 = 8.8%
  □ Disclaimer visible

  INVESTMENT MORTGAGE CALCULATOR (/en/investing):
  □ Input: $300,000 price, 25% down, 7.5% rate, 30yr, $2,200/mo rent,
           $500/mo expenses, 5% vacancy
    Expected monthly: rent $2,090 (after vacancy) - mortgage ~$1,573 - expenses $500 = $17/mo cash flow
  □ CoC return = ($17 × 12) / $75,000 down = 0.27% (low — expected for this scenario)
  □ Input changes → all outputs update live
  □ Disclaimer visible

══════════════════════════════════════════
QA SECTION 5 — ADMIN ROUNDTRIP FINAL PASS
══════════════════════════════════════════

Run final admin roundtrip on each collection editor:

  □ Case Studies: create new draft → edit all fields → publish → verify on /case-studies hub
  □ Testimonials: create new → mark featured → verify appears at top of /testimonials
  □ Blog post: create draft → add body text → publish → verify at /blog/[slug]
  □ Market Report: create → add key stats → publish → verify on /market-reports
  □ Neighborhood: edit insiderTake field → save → verify on neighborhood detail page
  □ Gated Downloads: add new guide with pdfUrl → test gate form delivery
  □ Properties: create new listing → upload photos → publish → verify on /properties

  □ Site Settings → General: edit phone number → save → verify in header and footer
  □ Site Settings → Header: edit CTA label → save → verify in header
  □ Site Settings → Theme: change a color → save → verify visually on site
  □ Site Settings → SEO: edit meta description → save → verify in page <head>

══════════════════════════════════════════
QA SECTION 6 — BILINGUAL COMPLETENESS
══════════════════════════════════════════

  □ /zh (home): all sections render in Chinese — no EN text leaking through
  □ /zh/about: all headings and body text in Chinese
  □ /zh/contact: form labels, dropdowns, success message all in Chinese
  □ /zh/buying: all section headings and body in Chinese
  □ /zh/selling: all section headings in Chinese
  □ Testimonials: Chinese-language testimonials show in /zh/testimonials
  □ Blog: Chinese blog post (1) shows in /zh/blog
  □ Footer ZH: all columns and compliance block in Chinese
  □ Header ZH: WeChat label shows in topbar, nav items in Chinese

  □ Language switcher test matrix:
      /en → click 中文 → lands on /zh ✓
      /en/about → click 中文 → lands on /zh/about ✓
      /en/blog/[slug] → click 中文 → lands on /zh/blog/[slug] ✓
      /zh → click English → lands on /en ✓
      (Test 5 pages minimum)

══════════════════════════════════════════
QA SECTION 7 — MOBILE CRITICAL PATH
══════════════════════════════════════════

Test these flows on real mobile (or Chrome DevTools 375px + touch simulation):

  □ Home page: hero loads, intent CTA buttons tappable (minimum 44px touch target)
  □ Mobile nav: hamburger opens drawer, all links tappable, close X works
  □ Contact form: keyboard doesn't cause layout shift; submit button accessible
  □ Property cards: stack to 1 column, tap opens detail correctly
  □ Mortgage calculator: all inputs usable with mobile keyboard (numeric keyboard for numbers)
  □ Gated download form: email field triggers correct keyboard type (email)
  □ Floating CTA button: not covering form submit buttons when scrolled to form position

══════════════════════════════════════════
QA SECTION 8 — ACCESSIBILITY
══════════════════════════════════════════

Run axe DevTools or Lighthouse Accessibility on home page.
Target score: ≥ 95.

Fix the most common issues:
  □ All images have alt text (including decorative images with alt="")
  □ All form inputs have associated <label> elements
  □ Buttons have accessible names (not just icon buttons without aria-label)
  □ Color contrast: all text meets WCAG AA (4.5:1 for body, 3:1 for large text)
    Note: white text on var(--color-primary) #18292F → contrast ratio ~12:1 ✓
    Note: dark text on var(--color-secondary) #BFA880 → verify meets 4.5:1
  □ Focus visible: keyboard Tab through page shows visible focus ring
  □ Skip navigation link: "Skip to main content" visible on Tab press
  □ No keyboard traps in modals or dropdowns
  □ ARIA roles on key landmarks: <header role="banner">, <nav>, <main>, <footer>

══════════════════════════════════════════
QA SECTION 9 — ERROR STATES
══════════════════════════════════════════

  □ 404 page: visit /en/nonexistent-page → custom 404 renders (not Next.js default)
    404 page should show: "Page not found" + navigation links + search link + contact CTA
  □ 500 page: verify error.tsx exists in app/ for graceful server error handling
  □ Empty states: visit /properties with filters that return 0 results → shows "No properties found" message
  □ Loading states: all dynamic content shows skeleton/spinner while loading
  □ Offline: Service worker not required — acceptable to show browser error if offline

══════════════════════════════════════════
DOCUMENT ALL ISSUES
══════════════════════════════════════════

Create: QA_ISSUES.md (temporary file, delete after Phase 4 complete)
For each issue found: page | issue description | priority (P0/P1/P2) | status

Fix all P0 issues (broken functionality) before Phase 4B.
Fix all P1 issues (visual/UX problems) before 4C.
P2 issues (minor polish) can go into Phase 5 backlog.
```

### Done-Gate 4A

- [ ] All 23 public pages reviewed at 1440px, 768px, 375px — no layout breaks
- [ ] All 7 forms tested end-to-end: DB write + email notification confirmed for each
- [ ] All 4 calculators verified with exact numeric test cases
- [ ] Admin roundtrip passed for all 7 collection editors + Site Settings
- [ ] ZH locale: 6 key pages fully in Chinese with no EN text leaking
- [ ] Language switcher tested on 5 page pairs
- [ ] Mobile critical path: nav drawer, forms, property cards all working
- [ ] Lighthouse Accessibility ≥ 95 on home page
- [ ] Custom 404 page exists and renders correctly
- [ ] QA_ISSUES.md created, all P0 issues fixed
- [ ] Git commit: `fix: QA pass — all issues resolved`

---

## Prompt 4B — Real Content Swap — Jin Pang's Actual Data

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Replace all seed/placeholder data with Jin Pang's real content.
This is a content operation — not a code change.
Work through the admin panel to replace each item, OR seed real data
via updated JSON files and re-run seed scripts.

Jin Pang must provide the following before this prompt can be completed.
This is the CONTENT CHECKLIST — all items required before launch:

══════════════════════════════════════════
REQUIRED FROM JIN PANG — PHOTOS
══════════════════════════════════════════

□ Agent hero photo: portrait/lifestyle, high resolution, outdoor or local setting
  (Used in: home hero background, about page, contact page, WorkWithMe sections)

□ Agent headshot: professional, clean background
  (Used in: footer, testimonial strip attribution, blog post author, floating card)

□ Agent casual photo: relaxed, neighborhood setting
  (Used in: personalIntro section, about page story section)

□ Agent in community: at local event or neighborhood location
  (Used in: about.community section)

□ Port Jervis / Orange County landscape photos (3–5):
  Delaware River view, local residential street, downtown Port Jervis
  (Used in: neighborhood heroes, service page heroes, blog posts)

□ Property photos: for each listed property (minimum 8 photos per property)

All photos delivered as: high-res JPG or PNG, minimum 1800px wide.
Upload all photos via Admin → Media → Upload.

══════════════════════════════════════════
REQUIRED FROM JIN PANG — IDENTITY DATA
══════════════════════════════════════════

Confirm or correct these fields in Admin → Site Settings → General:
  □ Legal name as licensed: ________________________
  □ NY license number: ____________________________
  □ Affiliated brokerage name: ____________________
  □ Brokerage license number: _____________________
  □ Principal broker name: ________________________
  □ MLS name + member ID: _________________________
  □ Phone number (verified): _______________________
  □ Email (verified deliverable): __________________
  □ WeChat ID (if active): ________________________
  □ Social media URLs (Facebook, Instagram, LinkedIn, Zillow, Realtor.com)

══════════════════════════════════════════
REQUIRED FROM JIN PANG — VERIFIED STATS
══════════════════════════════════════════

Replace seed stats with verified numbers:
  □ Total sales volume: $__________
  □ Total transactions closed: ________
  □ Years of experience: ________
  □ Five-star review count: ________ (verify on Zillow + Google)
  □ Neighborhoods served: ________

Update in: Admin → Site Settings → General → Career Stats
Also update in: content/jinpang-homes/en/site.json (and zh)

══════════════════════════════════════════
REQUIRED FROM JIN PANG — BIO CONTENT
══════════════════════════════════════════

□ About page — My Story body text:
  Real first-person narrative, 4–6 paragraphs
  Review and approve seed text OR replace with Jin's own words
  Admin → Content → about → myStory.body (rich text editor)

□ About page — Why Port Jervis body:
  Personal connection to the area — real story
  Admin → Content → about → whyPortJervis.body

□ About page — Community section body:
  Real community involvement activities
  Admin → Content → about → community.body

□ Philosophy beliefs (4 items):
  Confirm or rewrite — must be genuine, not generic
  Admin → Content → about → philosophy.beliefs

══════════════════════════════════════════
REQUIRED FROM JIN PANG — PROPERTIES
══════════════════════════════════════════

For each active listing (minimum 3 at launch):
  □ Full address
  □ List price
  □ Property type, beds, baths, sqft, lot size, year built
  □ Description (agent's marketing description)
  □ All photos (minimum 8)
  □ Virtual tour URL (if available)
  □ MLS number

For sold portfolio (minimum 15 for credibility):
  □ Address (or partial — "Port Jervis, NY" is acceptable for privacy)
  □ Sold price
  □ Original list price
  □ Days on market
  □ Close date
  □ Property type, beds, baths
  □ Photo (optional for sold — street view acceptable)

Enter via: Admin → Properties → Create / Import

══════════════════════════════════════════
REQUIRED FROM JIN PANG — TESTIMONIALS
══════════════════════════════════════════

Minimum 15 testimonials (mix of EN + ZH). For each:
  □ Client first name (or "Anonymous Buyer" etc.)
  □ Star rating (1–5)
  □ Full testimonial text
  □ Transaction type (buyer/seller/investor/relocator)
  □ Neighborhood
  □ Source (Google / Zillow / Direct)
  □ Month/year

If already on Zillow or Google: verify source URL and copy text.
Enter via: Admin → Testimonials → Create

══════════════════════════════════════════
REQUIRED FROM JIN PANG — CASE STUDIES
══════════════════════════════════════════

Minimum 4 case studies (buyer, seller, investor, relocator). For each:
  □ Client consent obtained (must confirm before publishing)
  □ Transaction type
  □ Outcome headline
  □ Situation, strategy, outcome narratives
  □ Key result metrics (prices, DOM, ratio)
  □ Client quote + attribution
  □ Photos (thumbnail + hero)

Enter via: Admin → Case Studies → Create

══════════════════════════════════════════
REQUIRED FROM JIN PANG — BLOG POSTS
══════════════════════════════════════════

Minimum 6 posts (5 EN + 1 ZH) for launch. For each:
  □ Title
  □ Category
  □ Body text (minimum 600 words — 800–1200 ideal)
  □ Hero image
  □ SEO meta description

If using seed posts: review and edit for authenticity.
Enter via: Admin → Knowledge Center → Edit existing / Create

══════════════════════════════════════════
REQUIRED FROM JIN PANG — MARKET REPORT
══════════════════════════════════════════

□ Current Orange County market report (Q1 2026)
  □ Key stats: median price, YoY change, DOM, list-to-sale ratio
  □ Jin's narrative analysis (500–800 words)
  □ Any charts/data tables (as images)
  □ Optional: PDF version for download

Enter via: Admin → Market Reports → Edit existing seed

══════════════════════════════════════════
REQUIRED FROM JIN PANG — GATED GUIDES
══════════════════════════════════════════

Minimum 3 PDF guides ready for delivery (others can be "preparing" on launch):
  □ Complete Buyer's Guide (PDF)
  □ Seller's Guide (PDF)
  □ Relocation Guide (PDF)

Upload: Admin → Gated Downloads → Upload PDF → copy URL to pdfUrl field

══════════════════════════════════════════
AFTER ALL CONTENT IS ENTERED — VERIFY
══════════════════════════════════════════

Walk through the site with fresh eyes as a new visitor:
  □ Home hero: real agent photo, not placeholder
  □ Stats bar: verified numbers (not $45M+ seed data)
  □ Featured listings: real properties, real photos
  □ Sold portfolio: real transactions (at least 10 visible)
  □ Testimonials: real clients, real quotes, real names (or consented anonymous)
  □ Case studies: real stories (with consent noted)
  □ Blog: real posts (not filler)
  □ About page: real story (not template)
  □ Contact: correct phone, email, address, hours
  □ Footer: correct license number, brokerage name, broker name
```

### Done-Gate 4B

- [ ] Agent hero photo uploaded and appearing in home hero
- [ ] Agent headshot appearing in footer, testimonial strip, blog posts
- [ ] All identity data verified: license #, brokerage, phone, email
- [ ] Verified stats entered: volume, transactions, years, reviews
- [ ] About page My Story: real text approved by Jin Pang
- [ ] Minimum 3 active listings entered with real photos
- [ ] Minimum 15 sold properties entered
- [ ] Minimum 15 testimonials entered (real reviews)
- [ ] Minimum 4 case studies entered (with consent noted)
- [ ] Minimum 6 blog posts published
- [ ] 1 market report published
- [ ] Minimum 3 PDF guides uploaded with delivery email working
- [ ] Full site walkthrough: no seed/placeholder content visible anywhere
- [ ] Jin Pang approves site for launch
- [ ] Git commit: `content: real content swap complete — ready for launch`

---

## Prompt 4C — Production Deploy — Vercel + Domain + ENV

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Deploy the site to production on jinpanghomes.com.

══════════════════════════════════════════
STEP 1 — PRODUCTION ENVIRONMENT VARIABLES
══════════════════════════════════════════

In Vercel project → Settings → Environment Variables, set ALL of these
for the Production environment:

Required (must be set before deploy):
  NEXT_PUBLIC_SUPABASE_URL              ← Production Supabase URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY         ← Production Supabase anon key
  SUPABASE_SERVICE_ROLE_KEY             ← Production service role key
  CONTACT_EMAIL=jin@jinpanghomes.com
  NOTIFICATION_EMAIL=jin@jinpanghomes.com
  RESEND_API_KEY                        ← Resend API key for email delivery
  RESEND_FROM_EMAIL=noreply@jinpanghomes.com
  NEXT_PUBLIC_SITE_URL=https://jinpanghomes.com

Optional (add when available):
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY       ← For map embeds on property + contact
  GOOGLE_ANALYTICS_ID                   ← GA4 measurement ID
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID     ← GTM container ID
  CRM_WEBHOOK_URL                       ← CRM sink webhook URL

NEVER add to env vars:
  - Any secrets in NEXT_PUBLIC_ prefix (these are exposed to browser)
  - Production keys in development .env.local

══════════════════════════════════════════
STEP 2 — VERCEL PROJECT CONFIGURATION
══════════════════════════════════════════

In Vercel:
  Framework: Next.js (auto-detected)
  Build command: npm run build (default)
  Output directory: .next (default)
  Node version: 20.x (LTS)

Build settings:
  □ Verify NEXT_TELEMETRY_DISABLED=1 if privacy preferred
  □ Set VERCEL_FORCE_NO_BUILD_CACHE=1 for first clean build (remove after)

Regions:
  Deployment region: iad1 (US East — closest to Port Jervis, NY)

══════════════════════════════════════════
STEP 3 — DOMAIN CONFIGURATION
══════════════════════════════════════════

In Vercel → Domains:
  Add: jinpanghomes.com
  Add: www.jinpanghomes.com

DNS configuration at domain registrar:
  Type: A record
  Name: @
  Value: 76.76.21.21 (Vercel's IP — verify in Vercel dashboard)

  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com

  Propagation time: 5 min – 48 hrs (usually fast)

SSL:
  Vercel auto-provisions SSL certificate via Let's Encrypt
  Verify: https://jinpanghomes.com shows green padlock

www redirect:
  Set in Vercel dashboard: www.jinpanghomes.com → jinpanghomes.com (301)
  Verify middleware.ts also handles this redirect as a fallback

Resend email domain (for outbound email from jin@jinpanghomes.com):
  Add Resend DNS records to domain registrar:
    SPF, DKIM, DMARC records (from Resend dashboard)
  Verify in Resend: domain shows "Verified"
  Test: send test email from admin → verify delivered, not spam

══════════════════════════════════════════
STEP 4 — PRODUCTION BUILD + DEPLOY
══════════════════════════════════════════

  1. Git push to main branch → Vercel auto-deploys
  2. In Vercel, watch build logs for any errors
  3. Common build errors to watch for:
     - Missing ENV vars → build fails with "process.env.X is undefined"
     - Type errors → fix all before deploy
     - Missing imports → clean up any deleted component references

  If build fails:
    - Read error, fix in code, push again
    - Never disable TypeScript checks to bypass errors

  4. After successful build: Vercel shows deployment URL
     (e.g. https://rea-jinpang-xxx.vercel.app)
  5. Test on Vercel preview URL BEFORE pointing domain

══════════════════════════════════════════
STEP 5 — POST-DEPLOY ENV SMOKE TEST
══════════════════════════════════════════

On the live jinpanghomes.com URL, immediately test:
  □ Site loads (not blank, not 500 error)
  □ /en loads home page correctly
  □ /zh loads home page in Chinese
  □ Contact form submits → DB write + email (test with real email address)
  □ Admin login at /admin works with jin@jinpanghomes.com
  □ Admin can save content and public page reflects it (quick roundtrip)
  □ Images load from Supabase Storage (no mixed-content or CORS errors)
  □ Google Maps embed loads (if MAPS_API_KEY set)
  □ SSL padlock shown for both jinpanghomes.com and www.jinpanghomes.com
```

### Done-Gate 4C

- [ ] All production ENV vars set in Vercel
- [ ] Vercel build completes with zero errors
- [ ] jinpanghomes.com resolves to live site
- [ ] www.jinpanghomes.com redirects to jinpanghomes.com (301)
- [ ] SSL certificate active — https:// green padlock
- [ ] Resend domain verified — outbound email not going to spam
- [ ] Contact form end-to-end on production domain verified
- [ ] Admin login works on production
- [ ] Git tag: `v1.0-launch`

---

## Prompt 4D — Post-Deploy Verification — Live Site Checklist

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Run the complete post-launch verification checklist on the live
production site. This is different from QA (which was on dev/staging) —
this verifies production-specific configurations.

══════════════════════════════════════════
LIVE SITE VERIFICATION
══════════════════════════════════════════

SPEED:
□ Test jinpanghomes.com in PageSpeed Insights (https://pagespeed.web.dev)
  Mobile score target: > 85
  Desktop score target: > 90
□ Test 3 key pages: home, /properties, /blog/[post]
□ If mobile score < 80: document issues and schedule Phase 5 optimization sprint

SEO:
□ View source on home page → confirm <title>, <meta description>, og:image all correct
□ View source on /en/about → confirm hreflang alternate links present (EN + ZH)
□ View source on /en/blog/[post] → confirm Article schema.org JSON-LD present
□ Visit /sitemap.xml on live site → valid XML, all pages listed
□ Visit /robots.txt → /admin disallowed, sitemap URL listed

SECURITY:
□ Visit /admin without logging in → redirected to /admin/login (not 401 JSON)
□ Visit /api/admin/media without auth → returns 401
□ Headers: check response headers include:
    X-Frame-Options: SAMEORIGIN (prevents clickjacking)
    X-Content-Type-Options: nosniff
    Strict-Transport-Security: max-age=31536000 (HSTS)
  Add these in next.config.js headers() if not already set

ANALYTICS:
□ Open Google Analytics → Real-Time report → visit jinpanghomes.com
  Verify: pageview event appears in GA4 (confirms GA4 is firing)
□ If GTM is used: verify GTM preview mode shows tags firing correctly

EMAIL:
□ Submit contact form with your own email → verify you receive notification
□ Verify email arrives from jin@jinpanghomes.com (not noreply@vercel.app)
□ Check email is not in spam (if going to spam: check Resend domain verification)
□ Check email subject line and body match the template

MONITORING SETUP:
□ Vercel Analytics: enable in Vercel dashboard (free tier)
□ Vercel Speed Insights: enable in Vercel dashboard (free tier)
□ Uptime monitoring: set up free uptime check at uptimerobot.com or similar
    Monitor: https://jinpanghomes.com — alert to jin@jinpanghomes.com if down > 5 min
□ Supabase: verify DB is on appropriate plan for expected traffic

══════════════════════════════════════════
ANNOUNCE TO JIN PANG
══════════════════════════════════════════

Prepare a launch handoff summary for Jin Pang:

1. Site URL: https://jinpanghomes.com (+ /zh for Chinese)
2. Admin URL: https://jinpanghomes.com/admin
3. Admin login: jin@jinpanghomes.com + [password]
4. Key admin tasks:
   - Add new listings: Admin → Properties → Create
   - Add testimonials: Admin → Testimonials → Create
   - Post blog article: Admin → Knowledge Center → Create
   - View leads: Admin → Leads & Requests → Contact Requests
   - Check gated download submissions: Admin → Gated Downloads → Submissions tab
5. Monthly maintenance checklist:
   - Post 2 blog articles
   - Post 1 market report
   - Add any new testimonials
   - Update active listings
   - Review and respond to all lead forms
```

### Done-Gate 4D

- [ ] PageSpeed Insights mobile score > 85 on home page
- [ ] SEO tags confirmed on live site (view source)
- [ ] /sitemap.xml valid on production
- [ ] /admin without auth → redirects to /admin/login
- [ ] Security headers present (X-Frame-Options, HSTS)
- [ ] GA4 real-time tracking confirmed
- [ ] Contact form email arrives from jin@jinpanghomes.com, not in spam
- [ ] Uptime monitor configured (UptimeRobot or similar)
- [ ] Launch handoff summary prepared for Jin Pang
- [ ] Git commit: `docs: post-deploy verification complete — site live`

---

## Prompt 4E — Google Search Console + Google Business Profile Setup

```
You are continuing BAAM System G2 — REA for Jin Pang.

GOAL: Submit jinpanghomes.com to Google Search Console for indexing,
verify ownership, and set up/claim Google Business Profile for local SEO.

These are manual steps — not code. Document completion status.

══════════════════════════════════════════
STEP 1 — GOOGLE SEARCH CONSOLE
══════════════════════════════════════════

1. Go to: https://search.google.com/search-console
   Add property: jinpanghomes.com (Domain type — preferred)
   OR: https://jinpanghomes.com (URL prefix type)

2. Verify ownership:
   Recommended method: DNS TXT record
     - In GSC: copy the TXT verification string
     - In domain registrar DNS: add TXT record
       Type: TXT, Name: @, Value: [verification string]
     - Back in GSC: click Verify
   Alternative method: HTML file upload (upload to /public/ directory)
   
   OR use the Google Analytics method if GA4 is already active on the site
   (fastest — no DNS changes needed)

3. After verification confirmed in GSC:

   a. Submit sitemap:
      GSC → Sitemaps → Add sitemap URL:
        https://jinpanghomes.com/sitemap.xml
      Click Submit.
      Status should change to "Success" within 24–48 hours.

   b. Request indexing for key pages:
      GSC → URL Inspection tool → enter each URL → "Request Indexing"
      Priority pages to index first:
        https://jinpanghomes.com/en
        https://jinpanghomes.com/en/about
        https://jinpanghomes.com/en/buying
        https://jinpanghomes.com/en/selling
        https://jinpanghomes.com/zh
        https://jinpanghomes.com/en/home-valuation

   c. Update seo.json with verification code:
      Admin → Site Settings → SEO → googleSiteVerification: [code]
      (For alternate HTML tag verification method)

4. GSC settings to configure:
   □ Set preferred domain: jinpanghomes.com (non-www)
   □ Set geographic target: United States
   □ Enable email notifications for coverage issues

5. Bookmark GSC dashboard — check weekly during Phase 5 for:
   □ Coverage errors (pages not indexed)
   □ Manual actions (penalties)
   □ Core Web Vitals issues
   □ Rich result status (FAQ, Article)

══════════════════════════════════════════
STEP 2 — GOOGLE BUSINESS PROFILE
══════════════════════════════════════════

Google Business Profile (GBP) is critical for local search visibility.
"Real estate agent near Port Jervis" queries surface GBP listings prominently.

1. Go to: https://business.google.com
   Sign in with Jin Pang's Google account (ideally jin@jinpanghomes.com if on Gmail)

2. Check if a GBP already exists:
   Search: "Jin Pang real estate Port Jervis"
   If a GBP profile exists: claim it (follow Google's claim process)
   If no profile: create new.

3. Create / complete the GBP profile:

   Business name: Jin Pang Real Estate
   (Use real name — not a keyword-stuffed name like "Jin Pang Best Port Jervis Agent")

   Category:
     Primary: Real estate agent
     Secondary: Real estate agency

   Address:
     21 Painted Apron Ter, Port Jervis, NY 12771
     (Use this as service-area business if preferred — hide physical address)
     Service area: Orange County, NY (specify counties served)

   Phone: (845) 555-0142
   Website: https://jinpanghomes.com
   Business hours: Match site officeHours (Mon–Fri 9–6, Sat 10–4, Sun by appt)

4. Verification:
   Google will verify via postcard mailed to the address (5–14 days)
   OR video verification may be offered (faster)
   After verification: profile goes live.

5. Complete the GBP profile (do immediately — don't wait for verification):

   □ Add photos:
     Profile photo: Jin Pang headshot
     Cover photo: Port Jervis landscape or property photo
     Additional photos: 5–10 (exterior of properties, local area, agent at work)

   □ Write business description (750 char max):
     "Jin Pang is Port Jervis's bilingual real estate agent serving buyers, sellers,
     and investors across Orange County, NY. Offering full service in English and
     Mandarin Chinese 中文 — from first home to investment portfolio. Licensed in NY,
     affiliated with Jin Pang Homes. Call (845) 555-0142."

   □ Add services:
     Buyer Representation | Seller Representation | Home Valuation |
     Investment Properties | Relocation Services | Bilingual Service (English + Chinese)

   □ Add products: (optional)
     Featured listing cards (if GBP supports property listings in your category)

   □ Enable messaging: so clients can message directly from Google Search

   □ Set Q&A section: add 3 common FAQs proactively
     Q: Do you offer service in Chinese?
     A: Yes — Jin Pang offers full bilingual real estate service in English and Mandarin Chinese.

     Q: What areas do you serve?
     A: Port Jervis, Middletown, Goshen, Warwick, Newburgh, and all of Orange County, NY.

     Q: How do I book a consultation?
     A: Call (845) 555-0142, email jin@jinpanghomes.com, or book online at jinpanghomes.com/en/contact.

6. Ongoing GBP tasks (hand off to Jin Pang):
   □ Respond to all Google reviews within 48 hours
   □ Post a GBP update weekly (listing highlights, market updates, tips)
   □ Add new property photos as listings go live
   □ Track GBP Insights (calls, direction requests, website clicks from GBP)

══════════════════════════════════════════
STEP 3 — BING WEBMASTER TOOLS (optional)
══════════════════════════════════════════

1. Go to: https://www.bing.com/webmasters
2. Add site: https://jinpanghomes.com
3. Verify via XML file or DNS TXT record
4. Submit sitemap: https://jinpanghomes.com/sitemap.xml
5. Bing accounts for ~6% of searches — worthwhile 15-minute setup.

══════════════════════════════════════════
STEP 4 — ZILLOW AND REALTOR.COM PROFILES
══════════════════════════════════════════

These are not SEO setup steps per se, but they're critical trust signals for
real estate agents and feed back into SEO via domain authority links.

Zillow Agent Profile (https://www.zillow.com/agent-resources):
  □ Claim profile or verify it's up to date
  □ Photo: same professional headshot as site
  □ Bio: match About page tone — personal, specific
  □ License number: matches site
  □ Link: add jinpanghomes.com as website
  □ Enable reviews: ask satisfied clients to leave Zillow reviews

Realtor.com Agent Profile (https://www.realtor.com/realestateagents):
  □ Claim or update profile
  □ Photo + bio consistent with site
  □ Website link: jinpanghomes.com
  □ License + brokerage filled in
```

### Done-Gate 4E

- [ ] Google Search Console property verified (DNS or HTML method)
- [ ] Sitemap submitted to GSC: https://jinpanghomes.com/sitemap.xml
- [ ] 6 priority pages submitted for indexing via URL Inspection
- [ ] GSC geographic target set to United States
- [ ] GSC email notifications enabled
- [ ] Google Business Profile created or claimed
- [ ] GBP: business name, category, address, phone, website, hours all set
- [ ] GBP: 10+ photos uploaded
- [ ] GBP: business description written (750 chars)
- [ ] GBP: 3 Q&As added proactively
- [ ] GBP: messaging enabled
- [ ] GBP verification initiated (postcard or video)
- [ ] Bing Webmaster Tools: site added, sitemap submitted
- [ ] Zillow profile: claimed, photo updated, website link set
- [ ] Realtor.com profile: claimed, updated
- [ ] Git commit: `docs: GSC + GBP + Zillow setup documented`

---

## Phase 4 Completion Gate

The site is live and the foundation is complete. Before starting Phase 5:

- [ ] **4A** — Full QA pass: all P0 and P1 issues resolved
- [ ] **4B** — Real content swap: all seed data replaced, Jin Pang approves
- [ ] **4C** — Production deploy: jinpanghomes.com live on Vercel with SSL
- [ ] **4D** — Post-deploy verified: speed, security, email, analytics all confirmed
- [ ] **4E** — GSC submitted, GBP claimed/created, Zillow updated
- [ ] Site fully live at https://jinpanghomes.com
- [ ] Site fully live at https://jinpanghomes.com/zh for Chinese visitors
- [ ] Jin Pang has received admin login and training overview
- [ ] Git tag: `v1.0-launch-complete`

---

*End of REA_PHASE_4.md*
*Next: REA_PHASE_5.md — Content Velocity + Bilingual SEO + Conversion Optimization + Template Extraction*

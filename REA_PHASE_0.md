# BAAM System G2 — REA Phase 0
# Infrastructure + Clone + Theme + Global Seed

> **File:** REA_PHASE_0.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Phase:** 0 of 5
> **Duration:** Day 1–3
> **Goal:** Clone REB admin, strip brokerage features, create new Supabase project, apply REA theme, seed all global content files, verify admin is operational.
> **Cursor context:** Attach `@REA_COMPLETE_PLAN.md` + `@REA_CONTENT_CONTRACTS_PART1.md` + `@REA_PHASE_0.md`
> **Prerequisite:** Access to REB (Jin Pang Homes) codebase. New empty GitHub repo. New Supabase project credentials ready.

---

## Prompt Index

| # | Prompt | Est. Time |
|---|---|---|
| 0A | Clone REB + Strip Brokerage Features + New Database | 60 min |
| 0B | Apply REA Theme + Design Tokens | 30 min |
| 0C | Seed Global Content Files + Admin Verification | 45 min |
| 0D | RBAC Simplification + Admin Sidebar Config | 30 min |

**Rule:** Verify every done-gate before moving to the next prompt. Git commit after each.

---

## Prompt 0A — Clone REB + Strip Brokerage Features + New Database

```
You are building BAAM System G2 — Real Estate Agent (REA Premium) for Jin Pang / jinpanghomes.com.

Reference: @REA_COMPLETE_PLAN.md
Reference: @REA_CONTENT_CONTRACTS_PART1.md

START FROM: The REB (Jin Pang Homes) codebase in this workspace.

══════════════════════════════════════
STEP 1 — STRIP BROKERAGE-SPECIFIC CODE
══════════════════════════════════════

DELETE these components entirely (brokerage-only, no REA equivalent):
- AgentCard, AgentGrid, AgentProfileHero
- AgentListings, AgentTestimonials, AgentContactForm
- AgentSelfEditor (agent self-edit restricted admin)
- RecruitmentHero, BrokerWelcome, AgentSuccessStory, WhatWeOffer
- BuilderPartnerCard, DevelopmentCard, FloorPlanGallery
- Any GoalPathHero that is tightly coupled to agent roster data
- LeadRouter (multi-agent routing logic — replace with single-recipient in Step 4)

DELETE these pages:
- app/[locale]/team/           (agent roster — REA has no agent roster)
- app/[locale]/team/[slug]/    (agent profile pages)
- app/[locale]/join/           (recruitment page — REA has no join page)
- app/[locale]/new-construction/ (brokerage new construction — skip for REA)

DELETE this content:
- content/jinpanghomes/ (all REB seed content — do not carry over)
- Any content/*/agents/ collection directories

KEEP INTACT — do not modify:
- app/admin/                        (entire admin — identical to REB)
- components/admin/                 (all admin components)
- lib/admin/
- lib/content.ts + lib/contentDb.ts
- lib/media.ts + app/api/admin/media/
- lib/crmSink.ts (or equivalent CRM sink)
- app/api/admin/mls/                (MLS ingest — keep)
- app/api/admin/import/ + export/
- lib/auth.ts + app/api/auth/
- app/api/contact/
- app/api/valuation/
- app/api/showing-request/
- app/api/newsletter/
- app/api/lead-events/
- MortgageCalculator component
- PropertyCard, PropertyGrid, PropertyDetail
- SoldGrid
- NeighborhoodCard, NeighborhoodHub, NeighborhoodDetail
- TestimonialDisplay (all variants)
- MarketReportCard, MarketReportHub, MarketReportDetail
- BlogCard, BlogHub, BlogPostDetail
- ComplianceFooter
- LanguageSwitcher
- SiteHero (all variants)
- StatsBar
- NewsletterSignup
- ContactForm, HomeValuationForm, ShowingRequestForm
- scripts/qa/
- middleware.ts (domain routing)

══════════════════════════════════════════
STEP 2 — SIMPLIFY LEAD ROUTING TO SINGLE RECIPIENT
══════════════════════════════════════════

REA has one agent (Jin Pang). All form submissions route to site.email.
Update all API routes to remove multi-agent routing logic:

In /api/contact/route.ts:
- Remove agentSlug lookup
- Route to: process.env.CONTACT_EMAIL (which will be jin@jinpanghomes.com)

In /api/showing-request/route.ts:
- Remove listingAgent lookup from property record
- Route to: process.env.CONTACT_EMAIL

In /api/valuation/route.ts:
- Route to: process.env.CONTACT_EMAIL

In /api/lead-events/route.ts:
- Remove agent assignment logic
- Route to: process.env.CONTACT_EMAIL

Add to .env.local:
CONTACT_EMAIL=jin@jinpanghomes.com
NOTIFICATION_EMAIL=jin@jinpanghomes.com

All CRM sink logic stays unchanged — just the recipient is now always the site owner.

══════════════════════════════════════
STEP 3 — NEW SUPABASE PROJECT
══════════════════════════════════════

CRITICAL: Never reuse the REB Supabase project.
Create project: "BAAM-REA-JinPang" at supabase.com.

Update .env.local:
NEXT_PUBLIC_SUPABASE_URL=<new project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<new anon key>
SUPABASE_SERVICE_ROLE_KEY=<new service role key>

In the new Supabase project, run this SQL in order:

-- ─────────────────────────────────────────
-- BASE TABLES (carried from REB schema)
-- ─────────────────────────────────────────

CREATE TABLE sites (
  id text PRIMARY KEY,
  domain text,
  name text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE content_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  content_key text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, locale, content_key)
);

CREATE TABLE users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  site_id text,
  role text NOT NULL DEFAULT 'editor',
  email text,
  name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  slug text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE TABLE consultation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  purpose text,
  preferred_language text DEFAULT 'en',
  message text,
  status text DEFAULT 'new'
);

CREATE TABLE valuation_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  address text NOT NULL,
  city text,
  zip text,
  property_type text,
  bedrooms text,
  bathrooms text,
  sqft text,
  year_built text,
  condition text,
  notes text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  timeline text,
  preferred_language text DEFAULT 'en',
  status text DEFAULT 'new'
);

CREATE TABLE showing_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  property_id text,
  property_address text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_date text,
  preferred_time text,
  notes text,
  preferred_language text DEFAULT 'en',
  status text DEFAULT 'new'
);

CREATE TABLE newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  first_name text,
  locale text DEFAULT 'en',
  source text,
  active boolean DEFAULT true,
  UNIQUE(site_id, email)
);

CREATE TABLE property_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  property_slug text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  preferred_language text DEFAULT 'en',
  status text DEFAULT 'new'
);

CREATE TABLE media_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  public_url text,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE crm_sink_dead_letter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  site_id text,
  form_type text,
  payload jsonb,
  error text,
  retry_count int DEFAULT 0,
  resolved boolean DEFAULT false
);

-- ─────────────────────────────────────────
-- REA-SPECIFIC TABLES (new — not in base REB)
-- ─────────────────────────────────────────

CREATE TABLE gated_downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  first_name text,
  guide_slug text NOT NULL,
  download_sent boolean DEFAULT false,
  locale text DEFAULT 'en'
);

CREATE TABLE investor_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  investment_type text,
  budget_range text,
  timeline text,
  current_portfolio text,
  goals text,
  preferred_language text DEFAULT 'en',
  status text DEFAULT 'new'
);

-- ─────────────────────────────────────────
-- RLS POLICIES
-- ─────────────────────────────────────────

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE showing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sink_dead_letter ENABLE ROW LEVEL SECURITY;
ALTER TABLE gated_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read for content
CREATE POLICY "Public read content_entries" ON content_entries
  FOR SELECT USING (true);
CREATE POLICY "Public read properties" ON properties
  FOR SELECT USING (true);
CREATE POLICY "Public read sites" ON sites
  FOR SELECT USING (true);

-- Service role full access (used by API routes via SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "Service full access content_entries" ON content_entries
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access properties" ON properties
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access consultation_requests" ON consultation_requests
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access valuation_requests" ON valuation_requests
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access showing_requests" ON showing_requests
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access newsletter_subscribers" ON newsletter_subscribers
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access property_inquiries" ON property_inquiries
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access media_assets" ON media_assets
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access crm_sink_dead_letter" ON crm_sink_dead_letter
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access gated_downloads" ON gated_downloads
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access investor_inquiries" ON investor_inquiries
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access users" ON users
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- STORAGE BUCKET
-- ─────────────────────────────────────────

-- In Supabase dashboard → Storage → New bucket:
-- Name: "media"
-- Public: true
-- File size limit: 20MB
-- Allowed MIME types: image/*, application/pdf

-- ─────────────────────────────────────────
-- SEED: sites table
-- ─────────────────────────────────────────

INSERT INTO sites (id, domain, name, settings) VALUES (
  'jinpang-homes',
  'jinpanghomes.com',
  'Jin Pang Real Estate',
  '{"locales": ["en", "zh"], "defaultLocale": "en"}'
);
```

### Done-Gate 0A

- [ ] Repo initialized, REB code cloned and committed as baseline
- [ ] All brokerage-specific components removed (agent roster, join page, new construction)
- [ ] All REB content deleted (`content/jinpanghomes/`)
- [ ] `.env.local` updated with new Supabase credentials
- [ ] All SQL executed in new Supabase project without errors
- [ ] `sites` table has row: `jinpang-homes`
- [ ] All lead routing APIs simplified to single-recipient (`CONTACT_EMAIL`)
- [ ] `npm run dev` starts without import errors
- [ ] Git commit: `feat: clone REB, strip brokerage features, new DB`

---

## Prompt 0B — Apply REA Theme + Design Tokens

```
You are continuing work on BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART1.md (Section G6: theme.json)

GOAL: Apply the REA design system. All visual values must flow from theme.json → CSS variables.
No hardcoded hex colors or font names anywhere in page components.

STEP 1 — Create theme.json

Create file: content/jinpang-homes/en/theme.json
Populate with the exact token values from REA_CONTENT_CONTRACTS_PART1.md G6.

Key token values to verify are correct:
  colors.primary:       "#18292F"   (deep ocean teal — NOT Jin Pang Homes's navy #1A2744)
  colors.secondary:     "#BFA880"   (antique champagne gold)
  colors.accent:        "#7BA99A"   (muted sage)
  colors.backdropWarm:  "#F6F3EE"   (warm parchment — primary light background)
  colors.backdropDark:  "#111E24"   (very dark teal-black)

Key typography tokens:
  typography.displayFont:  "Cormorant Garamond"
  typography.headingFont:  "DM Serif Display"
  typography.bodyFont:     "Inter"
  typography.uiFont:       "DM Sans"
  typography.chineseFont:  "Noto Serif SC"
  typography.chineseBodyFont: "Noto Sans SC"

STEP 2 — Update app/[locale]/layout.tsx

Inject all theme tokens as CSS custom properties on the <html> element.
Use the CSS variable mapping from REA_CONTENT_CONTRACTS_PART1.md (end of G6 section).

The layout must:
1. Read theme.json from Supabase content_entries (key: "theme") OR fall back to local file
2. Build a cssVars object mapping all 50+ tokens to CSS variable names
3. Apply via style={{ cssVars }} on the <html> tag or root <div>
4. Import Google Fonts for all 5 font families:
   - Cormorant Garamond (weights: 400, 500, 600)
   - DM Serif Display (weight: 400)
   - Inter (weights: 400, 500, 600)
   - DM Sans (weights: 400, 500, 600)
   - Noto Serif SC (weights: 400, 500) — subset: chinese
   - Noto Sans SC (weights: 400, 500) — subset: chinese
   Use next/font or Google Fonts <link> in <head>

STEP 3 — Update global CSS (globals.css or equivalent)

Add base typographic styles using CSS variables:
  body {
    font-family: var(--font-body), sans-serif;
    color: var(--color-text-primary);
    background-color: var(--color-backdrop-warm);
    line-height: var(--line-height-body);
    font-size: 17px;
  }

  h1, h2 {
    font-family: var(--font-display), serif;
    font-weight: var(--typography-display-weight, 400);
    line-height: var(--line-height-heading);
  }

  h3, h4 {
    font-family: var(--font-heading), serif;
    font-weight: 400;
  }

  button, label, .ui-text {
    font-family: var(--font-ui), sans-serif;
  }

  /* Chinese locale overrides */
  [lang="zh"] body, [data-locale="zh"] body {
    font-family: var(--font-chinese-body), var(--font-body), sans-serif;
    line-height: var(--line-height-chinese);
  }

  [lang="zh"] h1, [lang="zh"] h2, [lang="zh"] h3,
  [data-locale="zh"] h1, [data-locale="zh"] h2, [data-locale="zh"] h3 {
    font-family: var(--font-chinese), serif;
  }

STEP 4 — Verify admin Theme panel

Admin → Site Settings → Theme must:
- Load theme.json for the active site
- Show color pickers for primary/secondary/accent/backdrop colors
- Show text inputs for font names
- Save updates to Supabase content_entries with key "theme"
- Live preview should update CSS variables on save (or require page refresh)

Do NOT rebuild the Theme panel — it exists from REB. Just verify it works with the new token set.
If any tokens from the new theme.json are not editable in the current panel, add the missing fields.
```

### Done-Gate 0B

- [ ] `content/jinpang-homes/en/theme.json` created with full REA token set
- [ ] `app/[locale]/layout.tsx` injects all tokens as CSS variables
- [ ] All 5 Google Fonts loading correctly (check Network tab: no 404s)
- [ ] `body` renders in Inter, `h1`/`h2` in Cormorant Garamond
- [ ] Primary color is `#18292F` (teal) — NOT `#1A2744` (Jin Pang Homes navy)
- [ ] Background is warm parchment `#F6F3EE` — NOT white
- [ ] Chinese locale (`/zh`) renders Noto Serif SC for headings
- [ ] Admin → Site Settings → Theme panel loads and saves
- [ ] Git commit: `feat: apply REA theme system — teal palette, editorial fonts`

---

## Prompt 0C — Seed Global Content Files + Admin Verification

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_CONTENT_CONTRACTS_PART1.md (sections G1–G5)

GOAL: Create all global JSON content files for jinpang-homes, seed them into
Supabase content_entries, and verify admin Site Settings panels load them correctly.

STEP 1 — CREATE LOCAL CONTENT FILES

Create these files exactly as specified in REA_CONTENT_CONTRACTS_PART1.md:

  content/jinpang-homes/en/site.json        ← G1 EN seed
  content/jinpang-homes/zh/site.json        ← G1 ZH seed
  content/jinpang-homes/en/header.json      ← G2 EN seed
  content/jinpang-homes/zh/header.json      ← G2 ZH seed
  content/jinpang-homes/en/footer.json      ← G3 EN seed
  content/jinpang-homes/zh/footer.json      ← G3 ZH seed
  content/jinpang-homes/en/navigation.json  ← G4 EN seed
  content/jinpang-homes/zh/navigation.json  ← G4 ZH seed
  content/jinpang-homes/en/seo.json         ← G5 EN seed
  content/jinpang-homes/zh/seo.json         ← G5 ZH seed
  content/jinpang-homes/en/theme.json       ← G6 (verify exists from 0B)

Key values to confirm are correct in site.json:
  id:           "jinpang-homes"
  name:         "Jin Pang"
  phone:        "(845) 555-0142"
  email:        "jin@jinpanghomes.com"
  address.full: "21 Painted Apron Ter, Port Jervis, NY 12771"
  license.licenseState: "NY"
  localesEnabled: ["en", "zh"]

STEP 2 — SEED INTO SUPABASE

Create script: scripts/seed-globals.ts

Upsert each file into content_entries:
  site_id:     "jinpang-homes"
  locale:      (en or zh)
  content_key: ("site" | "header" | "footer" | "navigation" | "seo" | "theme")
  data:        (parsed JSON)

Use Supabase service role client. Run: npx ts-node scripts/seed-globals.ts

STEP 3 — SEED _sites.json REGISTRY

Create: content/_sites.json
{
  "jinpang-homes": {
    "id": "jinpang-homes",
    "domain": "jinpanghomes.com",
    "name": "Jin Pang Real Estate",
    "defaultLocale": "en",
    "locales": ["en", "zh"]
  }
}

Update middleware.ts:
- "jinpanghomes.com" → site_id: "jinpang-homes"
- localhost:3000     → site_id: "jinpang-homes" (dev default)

STEP 4 — VERIFY HEADER AND FOOTER RENDER

Start dev server. Verify:

/en header:
- Logo: "Jin Pang" (not "JIN PANG HOMES")
- Topbar: (845) 555-0142, jin@jinpanghomes.com
- Nav: Properties, Buy, Sell, Invest, Relocate, About, Knowledge
- CTA: "Book a Consultation"
- Language switcher: EN / 中文

/zh header:
- Logo: "庞锦"
- Nav items in Chinese
- CTA: "预约咨询"
- Topbar shows WeChat label: "微信: jinpanghomes"

/en footer:
- 4 link columns with correct REA links
- Compliance: "Jin Pang | Licensed Real Estate Salesperson | License #10401300000"
- Affiliated brokerage: "Jin Pang Homes"
- Equal Housing logo visible

/zh footer:
- All columns in Chinese
- Compliance in Chinese with license numbers
```

### Done-Gate 0C

- [ ] All 11 global content files created under `content/jinpang-homes/`
- [ ] `scripts/seed-globals.ts` runs without errors
- [ ] 11 rows confirmed in Supabase `content_entries`
- [ ] `_sites.json` updated with jinpang-homes entry
- [ ] `middleware.ts` routes jinpanghomes.com → jinpang-homes
- [ ] `/en` header shows "Jin Pang" branding (not Jin Pang Homes)
- [ ] `/zh` header shows "庞锦" in Chinese
- [ ] Footer EN shows individual agent license format
- [ ] Footer ZH renders all Chinese labels
- [ ] Git commit: `feat: seed global content files for jinpang-homes`

---

## Prompt 0D — RBAC Simplification + Admin Sidebar Config

```
You are continuing BAAM System G2 — REA for Jin Pang.

Reference: @REA_COMPLETE_PLAN.md (Section: "Admin Architecture")

GOAL: Simplify RBAC to two roles. Configure admin sidebar for REA feature set.
Verify admin login and all Site Settings panels load correctly.

STEP 1 — RBAC SIMPLIFICATION

Remove the "agent" role entirely. Valid roles for REA:
  "super_admin"  — BAAM platform team, full access
  "broker_admin" — Jin Pang, full site content access

In lib/auth.ts: remove "agent" from the role type/enum.
Remove all agent-scoped access checks:
  - agentSlug session variables
  - "only edit your own profile" guards
  - agent-scoped content filtering in any admin editor

In Supabase — create Jin Pang's admin account:
  Email:   jin@jinpanghomes.com
  Role:    broker_admin
  site_id: jinpang-homes

Insert into users table:
  INSERT INTO users (id, site_id, role, email, name)
  VALUES ('<jin-auth-uid>', 'jinpang-homes', 'broker_admin',
          'jin@jinpanghomes.com', 'Jin Pang');

STEP 2 — ADMIN SIDEBAR CONFIGURATION

Configure the admin sidebar in this exact order:

  Dashboard
  ─────────────────
  Sites
  Site Settings
    ├── General
    ├── Header
    ├── Footer
    ├── Navigation
    ├── SEO
    └── Theme
  ─────────────────
  Content
  ─────────────────
  Knowledge Center
  Market Reports
  Case Studies       ← NEW (placeholder page — full editor in Phase 2)
  Testimonials       ← NEW (placeholder page — full editor in Phase 2)
  Neighborhoods
  ─────────────────
  Properties
  ─────────────────
  Gated Downloads    ← NEW (placeholder page — full editor in Phase 2)
  ─────────────────
  Leads & Requests
    ├── Contact Requests
    ├── Valuation Requests
    ├── Showing Requests
    ├── Investor Inquiries  ← NEW (placeholder)
    └── Newsletter Subscribers
  ─────────────────
  Media
  Variants
  Users
  Settings

For the 4 NEW items, add sidebar nav entries linking to:
  /admin/case-studies       → placeholder: "Case Studies editor — coming in Phase 2"
  /admin/testimonials       → placeholder: "Testimonials editor — coming in Phase 2"
  /admin/gated-downloads    → placeholder: "Gated Downloads editor — coming in Phase 2"
  /admin/investor-inquiries → placeholder: "Investor Inquiries — coming in Phase 2"

REMOVE from sidebar (brokerage-only, no longer relevant):
  - "Agents" or "Agent Roster"
  - "Join Requests"

STEP 3 — VERIFY ALL SITE SETTINGS PANELS

Login at /admin. Verify each panel:

General: Jin Pang name/phone/email/address, stats fields, wechatId field present
Header:  Logo "Jin Pang", nav 7 items, CTA "Book a Consultation"
Footer:  4 columns, individual agent compliance fields
SEO:     Title template "Jin Pang" branding, schema type "RealEstateAgent"
Theme:   Primary color #18292F visible, font names correct
```

### Done-Gate 0D

- [ ] "agent" role removed from RBAC
- [ ] Jin Pang broker_admin account created and can log into /admin
- [ ] Admin sidebar shows all REA items in correct order
- [ ] 4 new placeholder pages accessible (Case Studies, Testimonials, Gated Downloads, Investor Inquiries)
- [ ] "Agents" and "Join Requests" sidebar items removed
- [ ] Site Settings → General shows Jin Pang individual agent data
- [ ] Site Settings → Theme shows #18292F teal primary
- [ ] Content editor loads without errors
- [ ] Git commit: `feat: RBAC simplified, admin sidebar configured for REA`

---

## Phase 0 Completion Gate

Before starting Phase 1, all four prompts must be complete:

- [ ] **0A** — REB cloned, brokerage features stripped, new Supabase DB ready
- [ ] **0B** — REA theme applied: teal/champagne palette, editorial fonts, CSS variables injecting
- [ ] **0C** — All global content files seeded, header/footer rendering Jin Pang branding
- [ ] **0D** — RBAC simplified, admin sidebar configured, Jin Pang can log in
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run lint` — clean
- [ ] Git tag: `v0.0-phase0-complete`

---

*End of REA_PHASE_0.md*
*Next: REA_PHASE_1.md — Core Pages (Home, About, Contact, Valuation, Header/Footer, i18n)*

# BAAM System G — REA Premium (Real Estate Agent Template)

admin@jinpanghomes.com / admin123


> **GitHub:** https://github.com/johntang99/realestate  
> **Supabase project:** Real estate (jbbcuczsrwizbxbnhedc)  
> **Dev port:** 3050  
> **Admin:** admin@example.com / admin123 (change after first login)

## Quick start

```bash
# Kill port if in use

lsof -ti:3060 | xargs kill -9
rm -rf .next
npm run dev

# Install
npm install

# Production build
npm run build
```

git add .
git commit -m "Update: describe your changes"
git push


curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_k31xBRtgJpi9fD1s9ie6AnSaPUW5/xHICFN5yaJ







Production-ready bilingual (EN/ZH) studio website built on the BAAM platform.  
It includes public pages, admin CMS, DB-first content storage, file fallback, media tools, and site/domain-aware routing.

---

## 1) Tech Stack

- Next.js App Router (`app/`)
- TypeScript + React
- Tailwind CSS + CSS variables
- Supabase (content/site/admin data + storage)
- JSON content contracts for page and collection data

---

## 2) Quick Start

### Install and run

```bash
npm install
npm run dev
```

Default dev port from `package.json`:

- `http://localhost:3050`

### Build and run checks

```bash
npm run build
npm run lint
npm run type-check
```

### Full CI-style local check

```bash
npm run ci:check
```

---

## 3) Environment Configuration

Use `.env.local.example` as the starting template.

Key variables:

- `APP_ENV`, `NEXT_PUBLIC_APP_ENV`
- `NEXT_PUBLIC_DEFAULT_SITE`
- `SUPABASE_*` / `NEXT_PUBLIC_SUPABASE_*`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_FALLBACK_TO`, `ALERT_TO`

Important:

- DB-first mode is enabled when `SUPABASE_SERVICE_ROLE_KEY` is present.
- Without it, the app falls back to local `content/` JSON files.
- For this project, ensure the default site points to the active studio site (for example `julia-studio`) rather than legacy template IDs.

---

## 4) High-Level Architecture

### Frontend (public)

- Routes are under `app/[locale]/...`
- Locale-aware pages (`en`, `zh`)
- Shared shell in `app/[locale]/layout.tsx`
- Theme tokens injected as CSS variables from `theme.json`

### Backend (API)

- Public content APIs under `app/api/content/*`
- Admin APIs under `app/api/admin/*`
- Contact + booking APIs under `app/api/contact` and `app/api/booking/*`

### Data layer

- Content table: `content_entries` (DB-first)
- Optional revisions table: `content_revisions`
- Site/domain management via DB or fallback JSON (`content/_sites.json`, `content/_site-domains.json`)

---

## 5) Repository Structure (Core Areas)

```text
app/
  [locale]/
    page.tsx
    portfolio/
    collections/
    shop/
    journal/
    services/
  admin/
  api/
    content/
    admin/
    contact/
    booking/

components/
  layout/
  ui/
  admin/
    panels/

content/
  julia-studio/
    en/
    zh/
    theme.json
  _sites.json
  _site-domains.json

lib/
  content.ts
  contentDb.ts
  sites.ts
  ...

styles/
  globals.css
```

---

## 6) Frontend Architecture Details

### 6.1 Locale routing

- Public pages are built under `app/[locale]/...`
- Locale value controls content selection (`en` or `zh`) and text rendering.

### 6.2 Theme system

- Source of truth: `content/<siteId>/theme.json`
- Runtime mapping: `app/[locale]/layout.tsx` -> CSS variables
- Consumption: semantic classes and `var(--token)` usage in components

### 6.3 Page content model

- Page-level JSON: `content/<siteId>/<locale>/pages/*.json`
- Optional layout JSON for section ordering: `*.layout.json`
- Collection JSON folders:
  - `portfolio/`
  - `collections/`
  - `shop-products/`
  - `journal/`
  - `testimonials.json` (array-style collection file)

### 6.4 Public content loading

Used patterns:

- Server loaders (`lib/content.ts`) for DB-first fetch with file fallback
- Public API endpoints:
  - `GET /api/content/file?locale=...&path=...`
  - `GET /api/content/items?locale=...&directory=...`

Guardrail:

- Public pages must not call admin APIs (`/api/admin/*`), especially in production.

---

## 7) Backend/API Architecture

### 7.1 Public APIs

- `app/api/content/file/route.ts`
  - Reads one content file path
  - Supports host-based site inference when `siteId` is omitted
- `app/api/content/items/route.ts`
  - Reads collection directory items
  - Supports host-based site inference when `siteId` is omitted

### 7.2 Admin APIs

Main groups:

- Auth/session/logout
- Content file CRUD + import/export
- Media list/upload/import/provider search
- Site management
- User management
- Booking admin operations

All admin routes are under `app/api/admin/*` and are not for public page rendering.

### 7.3 Contact and booking APIs

- Public contact submission endpoint
- Booking endpoints for service list, slots, create/cancel/reschedule/list

---

## 8) Multi-Site + Domain Resolution

Site resolution priority (simplified):

1. Explicit `siteId` (when provided)
2. Host/domain mapping (`getSiteByHost`)
3. Default enabled site
4. `NEXT_PUBLIC_DEFAULT_SITE`

This logic is implemented through `lib/content.ts` and `lib/sites.ts`.

Operational rule:

- Do not hardcode `siteId` in public page fetches unless there is a strict one-site requirement.

---

## 9) Admin CMS Structure

### 9.1 Main admin areas

- Content editor
- Blog posts / collection management surfaces
- Media manager
- Variants library
- Site settings
- Users
- Sites
- Booking settings and bookings

### 9.2 Content editor design

- `components/admin/ContentEditor.tsx` orchestrates file loading/saving and panel routing.
- Complex forms are extracted into `components/admin/panels/*`.
- Examples include:
  - `TestimonialsPanel.tsx`
  - `ServicesPagePanel.tsx`
  - `ThemePanel.tsx`
  - `JournalItemPanel.tsx`

### 9.3 Form mode + JSON mode

- Form mode: constrained fields, image pickers, dropdowns, add/remove controls
- JSON mode: raw contract editing
- Roundtrip expectation: changes in either mode remain consistent

---

## 10) Content Sync Model (DB <-> Local Files)

Two directions are supported:

- **Import** = DB -> local files
- **Export** = local files -> DB

Recommended workflow:

1. Run check/dry-run first.
2. Review changed counts and folder breakdown.
3. Choose direction explicitly based on source of truth.

Rule of thumb:

- If DB is canonical and conflicts are safe, use Import.
- If local JSON is canonical, use Export.

---

## 11) Data Integrity Rules

- Collection `slug` must match filename stem/path.
- Duplicate/create/save should keep slug/path synchronized.
- Diff checks should include all collection folders to avoid false "no difference" results.

---

## 12) Media and Assets

- Storage target is Supabase media storage in production.
- Admin media flows support upload and provider import/search.
- Content should store media URLs in JSON/DB content entries.

Support scripts:

- `npm run media:migrate`
- `npm run content:normalize-media-urls`

---

## 13) QA and Operational Scripts

Available QA scripts:

- `npm run qa:routes`
- `npm run qa:seo`
- `npm run qa:content`
- `npm run qa:bilingual`
- `npm run qa:all`

Recommended pre-deploy sequence:

1. `npm run ci:check`
2. `npm run qa:all`
3. Manual smoke test (EN/ZH and key listing pages)
4. Content sync dry-run before import/export operations

---

## 14) Deployment Notes

- Deploy target: Vercel
- Ensure production env vars are fully configured
- Confirm domain-to-site mapping in sites/domain config
- Verify public pages load content from host-resolved site in production

Post-deploy checks:

- `/api/health` returns healthy response
- Public pages are non-empty for portfolio/collections/shop/journal
- Admin login and content save operations succeed

---

## 15) Known Platform Guardrails

- Keep public APIs and admin APIs strictly separated.
- Use theme tokens, not ad-hoc hardcoded visual values.
- Keep complex content editing in dedicated admin panels.
- Always decide content sync direction before import/export.
- Prefer host-based site resolution for multi-site safety.

---

## 16) Useful Files to Read First

- `BAAM_MASTER_PLAN_V3_COMPLETE.md`
- `JULIA_STUDIO_COMPLETE_PLAN.md`
- `JULIA_STUDIO_CONTENT_CONTRACTS.md`
- `THEME_NORMALIZATION_SOP.md`

---

## 17) Current Site Baseline

This repository currently serves as the Jin Pang implementation baseline on BAAM platform architecture.



----------------------------- REB sample site

Here’s what I'm thinking for the website:

domain: www.jinpanghomes.com
Company: Jin Pang
 Address: 21 Painted Apron Ter, Port Jervis, NY 12771

Needs:

1. Ability to have a mirror site in Chinese

2. Ability for me to easily go into the backend to edit as needed (for example, adding agents, changing text, adding client reviews, various legal language needed, like fair housing disclaimers, etc.) or add additional columns (for example, I have a site, leeshailemish.com on WordPress where I can do all these things)

3. Persistent contact CTA options:

• Chat widget or bot to capture engagement
• Chat/text option
• Sticky header phone/text button
• Floating “Schedule consultation”
• Click-to-call on mobile
 
4. Website good on mobile in general

Goals:

Focus on one primary goal per visitor, with clear entry paths
1. “I want to buy”
2. “I want to sell”
3. “I’m relocating”
4. “I’m an investor”
5. “I’m an agent considering joining”
Everything in the site revolves around: “Why should I trust you with the biggest transaction of my life?”

Structure:

1. Home
a. basic homepage design with logo
b. Bold value proposition
c. Location expertise specificity
d. Trust indicators
e. CTA (contact for free consultation)
f. Review quote next to CTA
g. Clear entry paths for the different goals, with different CTA buttons going to the specific pages:
1. “I want to buy”
2. “I want to sell”
3. “I’m relocating”
4. “I’m an investor”
5. “I want to join the team”
h. an intro paragraph about the brokerage and value proposition
i. contact form
j. Featured listings – I can upload these manually or through selection from MLS somehow.
k. MLS feed if possible, map search, with CTAs for each home, like “schedule a tour of this home today”
2. About
a. History
b. Mission
c. Leadership
d. Trust signals
e. Differentiators “Why Choose Us”
1. Unique advantages
2. Differentiators vs competitors
3. Case studies/Reviews
4. Statistics
3. Team
a. Introduce each member (vertically) with a few sentences for each person and a “more” button. The ‘more’ will take people to a dedicated page for each agent (see B2).
b. A few review quotes about Jin Pang as a whole (full names ideally)
c. Join the team (goes to a separate page for agent recruitment pitch and contact to schedule a conversation)
d. (in the future – awards, additional certifications).
 

3b. Individual agent profiles. Every agent gets a page:

a. Their photo
b. A paragraph or more about themselves
c. Contact information, social accounts
d. Reviews of that agent
 

4. Selling
• Strong headline promise. Value proposition: We sell homes faster and for more money in our area using our reliable methods and we make it easy and seamless.
• Proof/results/ (statistics, success stories)
• Process overview
• Marketing plan
• Testimonials from sellers
• “What your home could sell for” CTA
• Consultation booking
 
a. What we do for sellers (free evaluation, marketing, free photography)
b. Request a home valuation – make it personal
1. Immediate estimate + range
2. Local agent insights (“Here’s what would raise your value”)
3. Offer for a free pricing consultation
4. Follow-up email with real comps
c. Step-by-step selling guide (email capture)
d. Timing advice – should I sell now?
e. Get basic info and outlines about the home-buying process, what to expect
f. Staging tips and how to prepare your house for sale
g. Support resources (example, moving companies, vendors)
h. Free downloadable package with prep information (in exchange for email capture)
i. Seller consultation request (basically like a valuation, but a different approach)
 

5. Buying
Why us:

a. Success stories
b. Negotiation strength
c. Local expertise
d. Off-market access (if true)
e. Strategy for competitive markets
f. Protection from common mistakes
a. A timeline, step-by-step of the buying process
b. Step-by-step buying guide (email capture)
c. Mortgage calculator
d. First-time home buyer guide.
e. Newlywed home buying guide.
f. Mistakes to avoid
g. Financing education
h. New to the area guides (activities, what to do)
i. Vendor information, and other tips
j. Showing request form
6. Investing
Find high-return investment properties in Orange County.

(email capture for some reports)

a. Experience working with a range of investors.
b. Types of investment I support.
c. Rental yield info
d. CAP rate calculator (like this one: https://www.omnicalculator.com/finance/cap-rate)
e. Market trends and reports
f. Multifamily/commercial opportunities
g. Off-market deals, land subdivision, etc., ability to download PDFs (email capture)
h. 1031 exchange knowledge
i. Property management connections
7. Relocating
(/Knowledge Center/Area Guides/Local Living- the idea is that this a place people will come back to or see on their own even when not in the shopping season. Also, when I send out soft marketing emails, those posts can go here, kind of like a blog but more based on providing value. This is especially valuable for our practitioners who move to the area, typically from other states or countries.

Visitors think: They know the market and this area better than anyone.

a. New to the area
b. Quarterly market reports
c. Neighborhood guides (for specific towns in our area)
d. Guide for the international buyer
e. School info and lifestyle insights
f. Local videos and photography (future)
g. Local real estate news
h. Investment advice
i. Seasonal guides
j. Vendor information
k. Events
8. New Construction
Where I can post about new developments, cooperation

with builders, new home designs, custom homes, floor plans, virtual tours.

a. Builder partnerships
b. Custom build guidance
c. Timeline expectations
d. Financing options for new builds
 

9. Contact/Request Info
Contact page for the whole brokerage. This is also the main CTA, probably top right, or floating.

 

Footer information:
a. Licensing information
b. Equal Housing Opportunity statement
c. Fair housing disclosures
d. Privacy policy and terms
e. MLS disclaimers
 

More advanced:

a. CRM integration for lead capture
b. 3D walkthroughs or virtual tours for featured listings and new construction
 
# BAAM Master Plan — Industry Site Build (Complete)

> **Version:** 3.1 — Complete Edition (with Governance, Architecture & Operations addendum)
> **Author:** BAAM Platform Team
> **Date:** February 2026
> **Key insight:** A premium, industry-specific site requires deep DESIGN work before any IMPLEMENTATION.
> **Two stages:** Stage A (Strategy & Design) produces the blueprint. Stage B (Implementation) executes it.
> **The quality of Stage A determines the quality of the final site.**
> **V3.1 additions:** Admin collection editors, governance model, dual timelines, automation checks, rollback SOP.
> **V3.2 additions:** Platform Guardrails (Jin Pang Homes Learnings): public/admin API boundary, host-based site resolution, import/export direction rules, slug integrity, sync observability.

---

## Table of Contents

### Stage A — Strategy & Design
- [1. Why Two Stages](#1-why-two-stages)
- [2. Stage A Overview](#2-stage-a-overview)
- [3. A1: Industry Deep Dive](#3-a1-industry-deep-dive)
- [4. A2: Brand Positioning & Differentiation](#4-a2-brand-positioning--differentiation)
- [5. A3: Site Architecture & Page Design](#5-a3-site-architecture--page-design)
- [6. A4: Component Inventory & Unique Features](#6-a4-component-inventory--unique-features)
- [7. A5: Visual Design Direction](#7-a5-visual-design-direction)
- [8. A6: Content Strategy & Conversion Funnel](#8-a6-content-strategy--conversion-funnel)
- [9. Stage A Output Summary](#9-stage-a-output-summary)

### Stage B — Implementation
- [10. Stage B Overview & Methodology](#10-stage-b-overview--methodology)
- [11. Phase 0: Infrastructure + Content Contracts](#11-phase-0-infrastructure--content-contracts)
- [12. Phase 1: Core Pages — Build / Wire / Verify](#12-phase-1-core-pages--build--wire--verify)
- [13. Phase 2: Conversion + Content Pages + Polish](#13-phase-2-conversion--content-pages--polish)
- [14. Phase 3: Admin Hardening + SEO](#14-phase-3-admin-hardening--seo)
- [15. Phase 4: QA + Pre-Launch + Deploy](#15-phase-4-qa--pre-launch--deploy)

### Phase 5 — Business Growth
- [16. Phase 5: 12-Month Business Growth Plan](#16-phase-5-12-month-business-growth-plan)

### Reference
- [17. Admin Content Coverage SOP](#17-admin-content-coverage-sop)
- [18. Admin Architecture: Collection Editors](#18-admin-architecture-collection-editors)
- [19. Governance & Sign-Off](#19-governance--sign-off)
- [20. Dual Timeline: Lean vs Full Launch](#20-dual-timeline-lean-vs-full-launch)
- [21. Minimum Automation Checks](#21-minimum-automation-checks)
- [22. Rollback & Incident SOP](#22-rollback--incident-sop)
- [23. Content Creation Templates](#23-content-creation-templates)
- [24. Anti-Patterns & Lessons Learned](#24-anti-patterns--lessons-learned)
- [25. Process Summary Diagram](#25-process-summary-diagram)
- [26. Theme Token Normalization Playbook](#26-theme-token-normalization-playbook)
- [27. Platform Guardrails (Jin Pang Homes Learnings)](#27-platform-guardrails-julia-studio-learnings)
- [28. REB Admin Reuse for New Site Setup](#28-reb-admin-reuse-for-new-site-setup)
- [29. Admin Certification SOP (One-Pass Cursor Checklist)](#29-admin-certification-sop-one-pass-cursor-checklist)

---

## 1. Why Two Stages

Proload Express works because it was designed as an LTL freight authority site — not a medical site with different colors. The components (savings calculator, coverage map, testimonial wall, rate request form), the conversion funnel (visit → impressed → sign up → quote → customer), the content strategy (case studies, blog authority, price leadership messaging) — all of these were industry-specific design decisions made BEFORE implementation.

If you skip Stage A and jump to implementation, you get:

- A generic site that looks like every other template
- Missing industry-specific features that competitors have
- Content that doesn't speak to the target customer's pain points
- A conversion funnel that doesn't match how the industry buys
- Components inherited from the medical system instead of designed for the industry

**Stage A is where the site becomes special. Stage B is where it gets built.**

### Lessons from Previous Builds

| Build | What Went Right | What Could Improve |
|-------|----------------|-------------------|
| Medical (System A) | Solid admin CMS, multi-site, bilingual | Admin was built alongside — good integration |
| Epoch Press (System C) | Frontend-first proved design before backend | Admin wiring was a large Phase 3 task |
| Proload Express (System E) | Premium, industry-specific, conversion-focused | Admin deferred to late phase caused back-and-forth |

The universal fix: **design the full site before coding, integrate admin into every build step.**

---

## 2. Stage A Overview

**Duration:** 1-2 weeks
**Tool:** Claude (strategic thinking, research, design decisions)
**Output:** 6 artifacts that form the complete site blueprint

| Step | Focus | Deliverable |
|------|-------|-------------|
| A1 | Industry Deep Dive | Industry Research Brief |
| A2 | Brand Positioning | Brand Positioning Document |
| A3 | Site Architecture | Page Design Document |
| A4 | Component Inventory | Component Inventory (NEW vs REUSE) |
| A5 | Visual Design | Visual Design Brief |
| A6 | Content Strategy | Content Strategy & Conversion Funnel |

---

## 3. A1: Industry Deep Dive

**Objective:** Understand the industry so well that the site feels like it was built by an insider.

### 3.1 Competitor Analysis

Study 8-12 top competitors in the industry:

- Screenshot their home pages, key pages, forms, pricing pages
- Document: what they do well, what they do poorly, what's missing
- Note: page count, content depth, unique features, conversion methods
- Identify: what would make a visitor choose them vs others

**Competitor analysis template:**

| Competitor | URL | Strengths | Weaknesses | Unique Features | Conversion Method | Page Count |
|-----------|-----|-----------|------------|-----------------|-------------------|------------|
| [Name] | [URL] | | | | | |

### 3.2 Customer Research

Understand who visits and what they need:

- Who is the buyer? (title, company size, pain points, decision criteria)
- What are their top 3 questions when they land on a site?
- What makes them trust a company in this industry?
- What's their buying journey? (research → compare → contact → decide)
- What conversion action do they prefer? (form, phone, chat, signup, booking)

### 3.3 Industry-Specific Requirements

- Compliance/credentials that must be displayed (licenses, certifications, insurance)
- Industry terminology and jargon the site must use
- Trust signals specific to this industry
- Seasonal patterns or timing considerations
- Common objections and how to overcome them on the site

### 3.4 SEO Landscape

- Top keywords and search volume
- What types of content rank well in this industry
- Programmatic page opportunities (location, service, comparison)
- Content gap analysis: what competitors aren't covering

**Deliverable:** Industry Research Brief (3-5 pages)

---

## 4. A2: Brand Positioning & Differentiation

**Objective:** Define exactly why a visitor should choose this company over every competitor.

### 4.1 Core Positioning Statement

Format: "[Company] is the [superlative] [service] for [audience] because [reason]."

**Examples from BAAM builds:**
- Medical: "Dr. Huang Clinic is the premier Traditional Chinese Medicine practice in Flushing, combining 20+ years of expertise with personalized acupuncture care."
- Printing: "Epoch Press is the quality-first commercial printing partner for businesses nationwide, delivering newspaper, magazine, and book printing with competitive pricing."
- Logistics: "Proload Express is the most competitive LTL freight solution for US businesses because we leverage 200+ carriers to guarantee the lowest rates."

### 4.2 Five Pillars of Differentiation

Define 5 reasons someone should choose this company. For each pillar:

- What is the claim? (e.g., "Lowest prices")
- How does the site communicate it? (e.g., price comparison section, savings calculator)
- What evidence supports it? (e.g., "Average 23% savings", customer testimonials about cost)

### 4.3 Scale Perception Strategy

- What numbers communicate size? (customers, projects, years, employees, locations)
- What social proof is needed? (testimonial count, case study count, logos, awards)
- What volume of content signals authority? (blog posts, guides, resources)

### 4.4 Conversion Path

- Primary conversion: what is it? (quote request, booking, signup, phone call)
- Secondary conversion: what is it? (account creation, newsletter, download)
- What's the promise? ("Quote in 2 hours", "Free consultation", "See pricing instantly")
- What trust signals surround the conversion point?

**Deliverable:** Brand Positioning Document (2-3 pages)

---

## 5. A3: Site Architecture & Page Design

**Objective:** Design every page with its purpose, content, sections, and conversion role — before any code exists.

### 5.1 Page Design Template

For each page, define:

```
Page: [Name]
Route: /[path]
Purpose: [Why this page exists — what it does for the business]
Conversion role: [How this page drives leads — hook/educate/convince/convert/retain]
Target visitor: [Who lands on this page and what they're looking for]

Sections (in order):
1. [Section name] — [What it shows] — [Why it matters]
2. [Section name] — [What it shows] — [Why it matters]
...

Content requirements:
- [Specific content needed: stats, testimonials, case studies, etc.]
- [Media needed: photos, icons, videos, maps, etc.]

CTA strategy:
- Primary CTA: [label] → [destination]
- Secondary CTA: [label] → [destination]

SEO:
- Target keyword: [keyword]
- Title: [page title]
- Description: [meta description]
```

### 5.2 Page Tiers

**Tier 1 — Core (must-have at launch):**
- Home (the hook — first impression, scale, differentiation)
- Services / What We Do (detailed service breakdown)
- Why Us / Differentiator (the convincer — comparison, proof, calculator)
- About (trust — company story, team, credentials, scale numbers)
- Primary Conversion Page (quote/booking/contact form)
- Contact (backup conversion — phone, email, address)

**Tier 2 — Authority & Social Proof:**
- Case Studies / Portfolio / Projects (deep proof of results)
- Testimonials / Reviews (volume of social proof)
- Blog (thought leadership + SEO engine)
- Resources / Guides (educational content + SEO)
- FAQ (objection handling + SEO)

**Tier 3 — Specialized:**
- Industry-specific pages (whatever the industry demands)
- Account signup / Client portal
- Tracking / Status page
- Careers
- Partners / Vendors

**Tier 4 — Programmatic SEO:**
- Service × Location pages
- Service × Industry pages
- Route / Comparison / Guide pages

**Deliverable:** Complete Page Design Document — every page fully designed with sections, content, CTAs, and purpose.

---

## 6. A4: Component Inventory & Unique Features

**Objective:** Identify which components are industry-standard reuse and which are UNIQUE to this industry.

### 6.1 Component Classification

| Component | Industry-Specific? | Description | Comparable Medical Component |
|-----------|-------------------|-------------|------------------------------|
| Hero | Reuse (adapt) | Bold hero with CTA | Same pattern, different content |
| Service Cards | Reuse (adapt) | Service type grid | Similar to Services section |
| Stats Counter | Reuse (adapt) | Animated numbers | Similar to Stats section |
| Process Timeline | Reuse (adapt) | How-it-works steps | Similar to HowItWorks |
| CTA Banner | Reuse (adapt) | Conversion banner | Same pattern |
| FAQ Accordion | Reuse (adapt) | Expandable Q&A | Same pattern |
| Testimonials | Reuse (adapt) | Customer quotes | Similar but often different layout |
| [Industry NEW] | NEW | [Describe] | No equivalent |

### 6.2 New Component Requirements

For each NEW component, define:

- What does it do?
- Why does this industry need it?
- What data does it consume? (JSON shape)
- What are the variant options?
- What competitor sites have a good version to reference?

**Examples of industry-specific NEW components from previous builds:**

| Industry | NEW Components |
|----------|---------------|
| Printing | ProductSpecBlock, PriceTierTable, QuoteForm, FileUploadGuide, EquipmentShowcase |
| Logistics | CoverageMap, RateRequestForm, SavingsCalculator, TransitTimeTable, ComparisonTable, TrustLogoTicker, TestimonialWall, SignUpForm |
| Restaurant | MenuDisplay, OnlineOrderForm, ReservationWidget, PhotoGallery, ChefProfile |
| Legal | PracticeAreaCards, CaseResultsTicker, ConsultationForm, AttorneyProfiles |

**Deliverable:** Component Inventory with clear NEW vs REUSE classification.

---

## 7. A5: Visual Design Direction

**Objective:** Define the visual identity before any code.

### 7.1 Color Palette

- Primary color and why (industry association or brand emotion)
- Secondary/accent color and why
- Supporting colors (success, warning, neutral, dark sections, light sections)
- Color psychology rationale for this industry

**Examples from BAAM builds:**

| System | Primary | Secondary | Rationale |
|--------|---------|-----------|-----------|
| Medical | Earth green (#2D5016) | Warm gold (#8B7355) | Natural, healing, traditional |
| Printing | Deep navy (#0F1B2D) | Warm gold (#B8860B) | Premium, sophisticated, craftsmanship |
| Logistics | Deep navy (#0A2463) | Vibrant orange (#FF6B35) | Authority/trust + energy/urgency |

### 7.2 Typography

- Font family and why (modern, traditional, technical, friendly)
- Weight hierarchy (headlines, subheads, body, captions)
- Size scale (display, heading, subheading, body, small)

### 7.3 Photography & Visual Style

- What images does this industry need? (equipment, people, locations, products, processes)
- Stock photo direction (realistic, professional, diverse, action-oriented)
- Image treatment (dark overlays, bright and clean, moody, high-contrast)

### 7.4 Layout Principles

- Dense vs spacious (busy professionals need dense info; luxury brands need space)
- Dark vs light dominant (authority/premium vs clean/approachable)
- Animation level (minimal for professional, moderate for modern tech-forward)

### 7.5 Competitor Visual Comparison

- What do top competitors look like?
- How should this site feel different?
- What visual cues signal industry authority?

### 7.6 Design Reference Sites

List 3-5 sites (from any industry) that capture the right feel, with what specifically to reference from each.

**Deliverable:** Visual Design Brief

---

## 8. A6: Content Strategy & Conversion Funnel

**Objective:** Plan the content that makes the site an authority and drives conversions.

### 8.1 Launch Content Requirements

- How many testimonials at launch? (target: 20-50 for scale perception)
- How many case studies? (target: 6-12 for credibility)
- How many blog posts? (target: 6-10 for authority signal)
- What resource/guide pages? (industry-specific educational content)

### 8.2 Conversion Funnel Map

```
Awareness: Blog post / SEO page / Ad
   ↓
Interest: Home page / Services page / Why Us page
   ↓
Consideration: Case Studies / Testimonials / Comparison page
   ↓
Decision: Quote form / Pricing / Signup
   ↓
Action: Submit quote / Create account / Call
   ↓
Retention: Dashboard / Email nurture / Account manager
```

### 8.3 CTA Placement Strategy

- Which CTA appears on which pages?
- Primary vs secondary CTA per page
- "Get a Quote" always accessible? Phone number always visible?
- Sticky elements? (floating CTA, chat widget)

### 8.4 Social Proof Strategy

- Where do testimonials appear? (home, every page, dedicated page)
- Where do case studies appear? (home highlight, dedicated hub)
- Where do trust logos appear? (hero, footer, throughout)
- Where do stats/numbers appear? (hero, about, throughout)

### 8.5 Post-Launch Content Velocity

- Blog cadence (posts per week)
- Case study pipeline (per month)
- Testimonial collection method
- Programmatic page expansion timeline

**Deliverable:** Content Strategy & Conversion Funnel Document

---

## 9. Stage A Output Summary

At the end of Stage A, you have a complete blueprint:

| Artifact | Content |
|----------|---------|
| **Industry Research Brief** | Competitors, customers, requirements, SEO landscape |
| **Brand Positioning Document** | Positioning, 5 pillars, scale strategy, conversion path |
| **Page Design Document** | Every page: purpose, sections, content, CTAs, SEO |
| **Component Inventory** | NEW vs REUSE, data requirements, variant options |
| **Visual Design Brief** | Colors, typography, photography, layout, references |
| **Content Strategy & Funnel** | Launch content, funnel map, CTA strategy, post-launch plan |

**This blueprint is what makes the Cursor prompts precise and the final site premium.**

Without this blueprint, Cursor guesses. With it, Cursor executes.

**Stage A is done with Claude (strategic thinking). Stage B is done with Cursor (code execution).**

### Stage A Acceptance Gates

Stage B must NOT begin until ALL gates pass. This prevents the most common failure: starting to build before the design is complete.

| Gate | Criteria | Pass/Fail |
|------|----------|-----------|
| **A-Gate-1: Page Map** | Every launch page has: route, purpose, conversion role, section list, CTA strategy, SEO target. No TBD sections. | |
| **A-Gate-2: Conversion Funnel** | Full funnel mapped (Awareness → Action). Primary + secondary CTA defined per page. CTA placement approved. | |
| **A-Gate-3: Content Contracts** | JSON schema defined for 100% of launch pages. All section types have typed fields. No "placeholder shape" sections. | |
| **A-Gate-4: Variant Registry** | Every section that supports variants has: variant IDs, descriptions, and confirmed frontend rendering plan. | |
| **A-Gate-5: Content Minimums** | Confirmed counts: testimonials (min 20), case studies (min 6), blog posts (min 6), FAQ items (min 20). Content either exists or has creation plan with dates. | |
| **A-Gate-6: Visual Direction** | Color palette, typography, photography style, layout principles documented. At least 3 reference sites identified. | |
| **A-Gate-7: Component Inventory** | Every component classified NEW vs REUSE. NEW components have: data shape, variant options, competitor reference. | |

**Rule: If any gate is "Fail," resolve it before writing code. No exceptions.**

---

## 10. Stage B Overview & Methodology

**Duration:** 5 weeks
**Tool:** Cursor AI (Sonnet 4.6 Agent) for code execution
**Input:** Stage A blueprint (all 6 artifacts)

### 10.1 Core Methodology: Contract-First + Admin Done-Gate

Two principles govern all of Stage B:

**Contract-First:** Define JSON schema + variants + form fields BEFORE coding each page. The content contract (from Stage A's Page Design Document) is translated into a concrete JSON shape, variant registry entries, and admin form field definitions at the start of Phase 0 — not discovered during implementation.

**Admin Done-Gate:** A page is only "done" when it passes all three steps:

1. **BUILD** — Page UI coded, consuming data from DB-first content loader, variant-aware, theme-token colors only
2. **WIRE** — Admin Form mode shows correct fields, JSON mode shows full contract, variant dropdown present
3. **VERIFY** — Roundtrip test passes: edit in admin Form mode → save → check frontend updated; switch variant → save → check layout changed; edit in JSON mode → save → confirm Form mode synced

### 10.2 Architecture Principles

1. **DB-First Always:** Frontend reads from Supabase `content_entries`. Local JSON is development fallback only.
2. **Theme Tokens Only:** No hardcoded hex colors in page components. Everything through `theme.json` CSS variables.
3. **Editor Boundaries:** Content Editor for pages and site settings. Blog Posts Editor for blog entries. No overlap.
4. **Site-Scoped Isolation:** Content, media, and settings scoped by `site_id`. One codebase, clean tenant separation.
5. **Media via Supabase Storage:** All images through storage bucket with provider import (Unsplash/Pexels). No local filesystem in production.

### 10.3 Phase Overview

| Phase | Duration | Focus | Admin Integration |
|-------|----------|-------|-------------------|
| **Phase 0** | Day 1-3 | Infrastructure + Content Contracts | Define ALL contracts, variants, form fields |
| **Phase 1** | Week 1-2 | Core Pages (frontend + admin wiring) | Build → Wire → Verify per page |
| **Phase 2** | Week 3 | Conversion + Content + Polish | Same pattern for remaining pages |
| **Phase 3** | Week 4 | Admin Hardening + SEO | Gap closure + programmatic pages |
| **Phase 3.5** | 1-2 days | Admin Certification SOP | One-pass checklist + fix sweep before launch |
| **Phase 4** | Week 5 | QA + Deploy | Acceptance testing + production launch |

---

## 11. Phase 0: Infrastructure + Content Contracts

**Duration:** Day 1-3
**Input:** All 6 Stage A artifacts

### 11.1 Project Setup (Prompt 0A)

1. Duplicate medical codebase OR clean BAAM starter template
2. Strip previous industry-specific code:
   - Remove old content directories
   - Remove industry-specific section components
   - Remove booking system (if not needed for this industry)
   - Remove unused locale content (if English-only)
3. Keep intact:
   - Admin CMS (ContentEditor, SiteSettings, Media, Variants, Users, Sites)
   - Content loading system (`lib/content.ts`, `lib/contentDb.ts`)
   - Media system (upload, list, delete, provider search/import, URL normalization)
   - Theme system (`theme.json` → CSS variables)
   - Domain routing middleware
   - Import/export system
   - Auth and RBAC
4. Create new Supabase project (fully isolated — never reuse another project's DB)
5. Run schema SQL in order:
   - Admin + content tables
   - RLS policies
6. Create storage bucket (`media`)
7. Set all environment variables (Supabase, JWT, Resend, Unsplash, Pexels)
8. Configure site entry in `_sites.json`
9. Set up local domain alias

### 11.2 Theme Setup (Prompt 0B)

Implement the Visual Design Brief from Stage A:

1. Create `theme.json` with industry color palette, typography, font configuration
2. Update Tailwind config to extend with industry colors
3. Import fonts via `next/font`
4. Populate global settings files:
   - `site.json` — company info, contact, tagline
   - `header.json` — nav items, CTA button, logo config
   - `footer.json` — columns, links, compliance info
   - `seo.json` — default title template, meta description
   - `navigation.json` — full nav structure

### 11.3 Content Contracts (THE KEY STEP — Prompt 0C)

**Before writing any page code, define the complete content model.**

Translate the Page Design Document from Stage A into three concrete artifacts:

**Artifact 1 — Page Inventory & Content Contract Map**

| Page | Route | Content Path | Sections | Has Layout? | Has Collection? |
|------|-------|-------------|----------|-------------|-----------------|
| Home | / | pages/home.json | hero, valueProposition, services, testimonials, howItWorks, caseStudies, coverage, blog, cta | Yes | No |
| Services | /services | pages/services.json | hero, serviceDetails, accessorials, industries, cta | Yes | No |
| Blog Hub | /blog | pages/blog.json | hero, featured, grid, newsletter, cta | Yes | Collection: blog/*.json |
| ... | ... | ... | ... | ... | ... |

**Artifact 2 — Section Contract + Variant + Form Field Definition**

For EVERY section type used across the site:

```
## Section: hero

### Variants:
- centered: centered text, full-width background
- split-image: text left, image right
- video-bg: text overlay on video background
- animated-stats: text + animated stat counters

### JSON Contract:
{
  "hero": {
    "variant": "animated-stats",
    "headline": "string (required)",
    "subline": "string (required)",
    "stats": [{ "value": "string", "label": "string" }],
    "ctaPrimary": { "label": "string", "href": "string" },
    "ctaSecondary": { "label": "string", "href": "string" },
    "backgroundImage": "string (url, optional)"
  }
}

### Form Fields:
- headline: text, required
- subline: textarea, required
- variant: select [centered, split-image, video-bg, animated-stats]
- stats: array → { value: text, label: text }
- ctaPrimary.label: text; ctaPrimary.href: text
- backgroundImage: image picker
```

**Artifact 3 — Global Settings Contract**

Exact JSON shape for: site.json, header.json, footer.json, seo.json, theme.json, navigation.json.

Implementation note: for clone-friendly admin scaling, follow [18.7 Site-Clone Ready Method (ContentEditor Modular Pattern)](#187-site-clone-ready-method-contenteditor-modular-pattern).

### 11.4 Seed Baseline Content (Prompt 0D)

1. Create ALL JSON files with realistic placeholder content matching contracts
2. Create ALL `.layout.json` files defining section order per page
3. Seed everything into Supabase `content_entries` via seed script
4. Register all variant definitions in admin Variants panel
5. Create admin form field definitions for all sections

### 11.5 Phase 0 Done-Gate

- [ ] App boots without errors
- [ ] Admin login works
- [ ] ALL content contracts defined (Artifacts 1-3 complete)
- [ ] ALL JSON files seeded in Supabase `content_entries`
- [ ] Content Editor shows all page files with form panels
- [ ] Variant dropdowns populated for all applicable sections
- [ ] Theme variables injected into CSS
- [ ] Media upload works (Supabase Storage bucket active)
- [ ] Git committed and tagged

---

## 12. Phase 1: Core Pages — Build / Wire / Verify

**Duration:** Week 1-2
**Method:** One Cursor conversation per page. Each page follows the Build → Wire → Verify cycle.

### 12.1 Cursor Prompt Structure

Every Phase 1-2 Cursor prompt should follow this template:

```
Build the [Page Name] page at /[route].

**Content source:**
This page loads from content path: pages/[slug].json
Use loadPageContent() to fetch from Supabase (DB-first, file fallback).
Layout controlled by pages/[slug].layout.json

**Sections (in order):**
1. [Section] — [Description with all fields from contract]
2. [Section] — [Description]
...

**Design requirements:**
- Colors: use theme CSS variables (--color-primary, --color-secondary, etc.)
- Typography: use theme font variables
- NO hardcoded hex colors in any component

**Variant support:**
- [Section] supports variants: [list]
- Render using switch/conditional on section.variant field

**After building, verify (Admin Done-Gate):**
- Page renders correctly from DB content
- Edit content in admin Form mode → save → frontend updated
- Switch variant in admin → save → layout changes
- Edit in JSON mode → save → Form mode synced
- Change section order in layout.json → save → render order changes

Reference @IMPLEMENTATION_PLAN.md and @content-contracts/[page].json
```

### 12.2 Phase 1 Build Order

| # | Prompt | Page | Key Sections | Complexity |
|---|--------|------|-------------|------------|
| 1 | Home Page | / | Hero, value proposition, services, testimonials, process, case study highlight, coverage teaser, blog preview, CTA | High — most sections, sets design system |
| 2 | Header + Footer | Layout | Nav, CTA button, logo, columns, compliance info | Medium — shared components |
| 3 | Services / What We Do | /services | Hero, service details, additional services, industries served, CTA | Medium |
| 4 | Why Us / Differentiator | /why-us | Hero, value props, comparison table, calculator/interactive, testimonials, awards, CTA | High — interactive elements |
| 5 | About | /about | Hero, company story, stats, team, values, certifications, CTA | Medium |
| 6 | Coverage / Locations | /coverage | Hero, map/regions, transit/details, key items, CTA | Medium-High — map component |

### 12.3 Build → Wire → Verify Checklist (per page)

| Check | Description | Pass? |
|-------|-------------|-------|
| Frontend renders | Page loads and displays correctly from DB content | |
| Form edit | Edit a field in admin Form mode → save → frontend shows change | |
| JSON edit | Edit in JSON tab → save → Form mode synced | |
| Variant switch | Change variant in admin → save → layout visually changes | |
| Layout reorder | Change section order in .layout.json → save → page reorders | |
| Theme compliance | No hardcoded hex — all colors from theme tokens | |
| Media fields | Image picker works for hero/media fields | |

### 12.4 Phase 1 Done-Gate

- [ ] 6-8 core pages built and rendering from DB content
- [ ] ALL pages editable in admin Content Editor (Form + JSON mode)
- [ ] Variant switching works on all sections that support variants
- [ ] Layout reordering works on all pages
- [ ] Theme tokens used everywhere (no hardcoded colors)
- [ ] Header and Footer render from global settings (header.json, footer.json)
- [ ] Design system locked: colors, typography, spacing, animation patterns consistent
- [ ] **SEO baseline per page:** unique title, meta description, canonical URL, OG tags (shift-left — don't defer all SEO to Phase 3)
- [ ] Git tagged: `v0.1-core-pages`

---

## 13. Phase 2: Conversion + Content Pages + Polish

**Duration:** Week 3
**Method:** Same Build → Wire → Verify for all remaining pages.

### 13.1 Phase 2 Build Order

| # | Prompt | Page | Key Notes |
|---|--------|------|-----------|
| 7 | Primary Conversion Form | /quote or /get-started | Industry-specific form fields, trust sidebar, validation, confirmation screen |
| 8 | Secondary Conversion | /signup or /book | Account creation or booking form, benefit sidebar |
| 9 | Case Studies / Portfolio | /case-studies + /[slug] | Hub page with grid/filter + individual detail template. Collection pattern. |
| 10 | Testimonials / Reviews | /testimonials | Wall/masonry layout for volume display. 30-50 testimonials. |
| 11 | Blog System | /blog + /blog/[slug] | Hub + post template. **Blog Posts Editor (NOT Content Editor).** |
| 12 | Resources / Guides | /resources | Industry educational content, glossary, downloadable templates |
| 13 | Contact | /contact | Form, direct info, map, quick action cards |
| 14 | FAQ | /faq | Accordion with categories, 25+ questions |
| 15 | Responsive Polish | All pages | Mobile/tablet/desktop, performance, accessibility |

### 13.2 Blog Editor Boundary

This is critical to enforce correctly:

- **Blog posts** → managed in `Admin > Blog Posts` editor (create/edit/delete)
- **Blog hub page settings** (hero, featured config, CTA) → managed in `Content Editor` at `pages/blog.json`
- **No blog entries should appear in Content Editor**
- **No page settings should appear in Blog Posts Editor**

Verify: creating a blog post in Blog Posts Editor → it appears on /blog hub and /blog/[slug].

### 13.3 Form Submission Setup

For quote/contact/signup forms:

1. Form validation with inline error messages
2. Loading state on submit button
3. Submission via Supabase Edge Function → Resend email notification
4. Store submissions in Supabase table (e.g., `quote_requests`)
5. Confirmation screen with next steps and secondary CTA
6. Test: submit form → email arrives → entry stored in DB

### 13.4 Responsive Polish Checklist

- Mobile (< 768px): hamburger nav, single column, thumb-friendly CTAs (44px+), clickable phone numbers
- Tablet (768-1024px): 2-column where appropriate
- Desktop (1024px+): max-width 1280px, trust sidebars on conversion pages
- No horizontal overflow anywhere
- All interactive elements have hover/focus states
- WCAG AA color contrast verified (especially accent colors on white)
- Semantic HTML throughout

### 13.5 Phase 2 Done-Gate

- [ ] ALL pages built and admin-editable (Form + JSON mode)
- [ ] Blog posts manageable through Blog Posts Editor (create/edit/delete)
- [ ] Case studies / portfolio manageable through Content Editor
- [ ] All forms submit correctly with email notification and DB storage
- [ ] Mobile responsive on all pages (tested at 375px, 768px, 1440px)
- [ ] No editor overlap (Content Editor vs Blog Posts Editor)
- [ ] All interactive elements working (calculator, accordion, carousel, etc.)
- [ ] Git tagged: `v0.2-complete-frontend`

---

## 14. Phase 3: Admin Hardening + SEO

**Duration:** Week 4
**Note:** Phase 3 is NOT first-time admin wiring. If Phase 1-2 followed the Build → Wire → Verify pattern, this phase should be gap closure and SEO expansion — not a major rework.

### 14.1 Admin Gap Audit

Run through every public route and check:

| Route | Content in DB? | Form fields complete? | JSON synced? | Variant works? | Theme tokens? | Media fields? | Layout.json? | PASS? |
|-------|---------------|----------------------|-------------|---------------|--------------|--------------|-------------|-------|
| / | | | | | | | | |
| /services | | | | | | | | |
| ... | | | | | | | | |

Fix any gaps found. Target: 100% coverage.
When closing admin gaps, keep/extend the modular editor pattern from [18.7 Site-Clone Ready Method (ContentEditor Modular Pattern)](#187-site-clone-ready-method-contenteditor-modular-pattern).

### 14.2 Programmatic SEO Pages

Build dynamic page templates from Stage A's SEO landscape research:

**Service × Location Pages:**
- Dynamic route: `/[service]/[location]/page.tsx`
- Location data file with cities, states, regions
- Each page: unique H1, intro paragraphs, local relevance, service details, testimonial, CTA
- `generateStaticParams()` for all combinations
- ISR revalidation: 86400s (24 hours)
- Unique meta title and description per page

**Route / Industry / Comparison Pages** (if applicable):
- Separate dynamic routes for each type
- Content from data files or content_entries
- Unique content per page (not thin duplicates)

**Internal Linking:**
- Each programmatic page links to: main service page, nearby locations, related services
- Add "Serving [Region]" sections with cross-links

### 14.3 Schema.org Structured Data

Create utility at `/lib/schema.ts` with helpers:

| Page Type | Schema |
|-----------|--------|
| Site-wide | LocalBusiness, Organization |
| Service pages | Service, Offer |
| Blog posts | BlogPosting, BreadcrumbList |
| FAQ | FAQPage |
| Case studies | Article |
| Location pages | Service with areaServed |
| Testimonials | AggregateRating |

Implement via Next.js metadata API + JSON-LD script tags.

### 14.4 Technical SEO

- **Sitemap.xml** — Dynamic, includes all URLs (core + blog + case studies + programmatic)
- **Robots.txt** — Allow all public, disallow /admin/ and /api/admin/
- **IndexNow** — Integration for Bing/Yandex notification on content publish
- **Canonical URLs** — On all pages, especially programmatic
- **OG tags + Twitter cards** — Every page with appropriate images

### 14.5 Performance Optimization

- **Images:** next/image everywhere, priority on hero, lazy load below-fold, WebP
- **Fonts:** next/font, font-display: swap, subset to latin
- **JavaScript:** Server-render static content, dynamic import interactive components
- **Caching:** ISR 3600s core pages, 86400s programmatic, dynamic for forms
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1
- **Lighthouse audit:** Run on Home, Service page, Conversion page, Blog post, Location page — all scores > 90

### 14.6 Phase 3 Done-Gate

- [ ] Admin gap matrix: 100% coverage (every page editable)
- [ ] Programmatic SEO pages built and generating static paths
- [ ] Schema.org validates on key pages (Rich Results Test)
- [ ] Sitemap includes all URLs (count verified)
- [ ] Lighthouse scores > 90 on all categories
- [ ] IndexNow integration working
- [ ] Canonical URLs correct on all pages
- [ ] Git tagged: `v0.3-launch-ready`

---

## 15. Phase 4: QA + Pre-Launch + Deploy

**Duration:** Week 5

### 15.1 Full Acceptance Testing

**Admin roundtrip — every page:**

| Page | Form Edit | JSON Edit | Variant Switch | Layout Reorder | Media | Blog Create | PASS? |
|------|-----------|-----------|----------------|----------------|-------|-------------|-------|
| Home | | | | | | N/A | |
| Services | | | | | | N/A | |
| Why Us | | | | | | N/A | |
| About | | | | | | N/A | |
| Coverage | | | | | | N/A | |
| Quote | | | | | | N/A | |
| Case Studies | | | | | | N/A | |
| Testimonials | | | | | | N/A | |
| Blog Hub | | | | | | ✓ Test | |
| Resources | | | | | | N/A | |
| Contact | | | | | | N/A | |
| FAQ | | | | | | N/A | |

### 15.2 Content Quality Check

- [ ] All placeholder content replaced with real or high-quality realistic content
- [ ] All images loaded from Supabase Storage (no broken images)
- [ ] Phone, email, address correct (or clearly marked for replacement)
- [ ] Compliance/credentials accurate (licenses, certifications, MC#, DOT#, etc.)
- [ ] No lorem ipsum, "TODO", or "[placeholder]" text remaining
- [ ] Testimonials feel authentic and varied
- [ ] Case studies have realistic metrics
- [ ] Blog posts have substantial content (3+ paragraphs each)

### 15.3 Technical Check

- [ ] No console errors on any page
- [ ] No broken links (run link checker)
- [ ] All forms submit and show confirmation
- [ ] 404 page styled
- [ ] Favicon and app icons set
- [ ] Privacy Policy and Terms of Service pages exist
- [ ] SSL will be active on production domain

### 15.4 Production Deploy

1. Create new Vercel project (separate from other BAAM systems)
2. Set production environment variables
3. Deploy and verify on Vercel preview URL
4. Configure custom domain in Vercel + DNS
5. Enable SSL (automatic via Vercel)
6. Verify domain routing: production domain → correct site_id → freight frontend
7. Test admin on production
8. Run Lighthouse on production URL

### 15.5 Search Engine Submission

1. Google Search Console: verify domain, submit sitemap
2. Bing Webmaster Tools: submit sitemap
3. Trigger IndexNow for all URLs
4. Google Business Profile: create/claim if applicable

### 15.6 Content Backup

- Export full site content as JSON via admin Import/Export
- Commit as release snapshot
- Document any known limitations or manual steps

### 15.7 Phase 4 Done-Gate

- [ ] All acceptance tests pass
- [ ] Production URL live and accessible with SSL
- [ ] All pages render correctly on production
- [ ] Admin works on production
- [ ] Sitemap submitted to Google and Bing
- [ ] Content backup exported and committed
- [ ] Git tagged: `v1.0-production`

---

## 16. Phase 5: 12-Month Business Growth Plan

### 16.1 Month 1-2: Launch Foundation

**Content velocity:**
- Publish 8-10 blog posts (launch burst — signals active, authoritative site)
- Collect first 5 real testimonials from actual customers
- Create first 2 real case studies with verified metrics
- Expand programmatic pages to 100+

**Monitoring setup:**
- Vercel Analytics or GA4 enabled
- Google Search Console monitored weekly
- Track: conversions (form submissions, signups), phone calls, organic traffic, pages indexed

**Weekly rhythm:**

| Day | Action |
|-----|--------|
| Mon | Check weekend conversions, plan week's content |
| Tue | Publish blog post |
| Wed | Outreach for testimonials and case studies |
| Thu | Publish blog post |
| Fri | Weekly metrics review, publish blog post if ready |

**Monthly targets:**
- 8-10 blog posts published
- 5+ testimonials collected
- 2+ case studies published
- 100+ programmatic pages live
- Google Search Console: pages beginning to index

### 16.2 Month 3-4: Optimization

**SEO analysis:**
- Which pages are ranking? Double down with related content.
- Which aren't? Improve content, add internal links, re-submit.
- Which keywords get impressions but low clicks? Optimize titles and descriptions.
- Add 30-50 more programmatic pages based on Search Console data.

**Conversion optimization:**
- Review form completion rates — simplify if drop-off is high
- Test CTA copy variations (manual A/B: change monthly, compare results)
- Review bounce rates: Home (target <50%), Conversion page (target <40%)
- Consider: live chat widget if phone/form conversion is low

**Monthly targets:**
- 20+ blog posts total
- 10+ testimonials total
- 5+ case studies total
- 150+ programmatic pages
- Organic traffic: measurable and growing

### 16.3 Month 5-6: Scaling

**Paid acquisition (if organic is growing):**
- Google Ads: target high-intent keywords (e.g., "[industry] quotes near me")
- LinkedIn Ads: target decision-makers in relevant industries (B2B)
- Retargeting: show ads to site visitors who didn't convert
- Budget: start small ($500-1000/month), measure cost-per-lead

**Content authority:**
- Guest posts on industry publications
- Social media presence (LinkedIn primary for B2B, Instagram for visual industries)
- Consider: industry report or whitepaper for lead generation
- Consider: webinar or video content

**Operational improvements:**
- Automate quote/lead response (if volume justifies)
- CRM integration for lead tracking
- Email nurture sequence for signups who haven't converted yet

### 16.4 Month 7-9: Compounding

**By now you should have:**
- 50+ blog posts
- 20+ testimonials
- 10+ case studies
- 200+ total pages (including programmatic)
- Steady organic traffic growth
- Predictable conversion rate

**Focus on:**
- Highest-converting pages → create more similar content
- Lowest-performing pages → update, consolidate, or remove
- Customer retention: check-in emails, loyalty incentives, upsell
- Referral program: incentivize existing customers to refer new business
- Seasonal content: plan for industry-specific peaks

### 16.5 Month 10-12: BAAM Template Extraction

**Template creation:**
1. Document which components, layouts, and content patterns worked best
2. Extract reusable template: same admin backend, templatized frontend
3. Register as BAAM System [X] for this industry
4. Pricing: $20/month per client site

**New client onboarding SOP:**
1. Clone template repository
2. Create new Supabase project (isolated)
3. Run schema SQL + create storage bucket
4. Set environment variables
5. Import baseline content (with `missing` mode)
6. Customize: company info, colors, images, content through admin CMS
7. Configure domain, deploy to Vercel
8. Train client on admin CMS basics
9. Go live

### 16.6 Growth Targets by Month 12

| Metric | Target |
|--------|--------|
| Organic monthly traffic | 2,000-5,000 visits |
| Monthly conversions (quotes/signups) | 50-100 |
| Blog posts published | 80+ |
| Case studies | 15+ |
| Testimonials displayed | 50+ |
| Programmatic pages | 200+ |
| Total indexed pages | 300+ |
| BAAM template clients | 3-5 |

---

## 17. Admin Content Coverage SOP

### Quick Checklist (for any BAAM industry site)

1. Audit all routes → map to content files → identify gaps
2. Build complete page contracts + layout contracts (Phase 0)
3. Wire frontend to DB-first content loaders (Phase 1-2)
4. Enforce editor boundaries: Content Editor for pages/settings, Blog Posts Editor for blog entries
5. Complete Form mode fields per page (Phase 1-2 done-gates)
6. Activate section variants with real frontend rendering
7. Tokenize theme usage — remove all hardcoded color literals
8. Run QA matrix and sign-off (Phase 4)

### Editor Boundaries

| Editor | Manages | Does NOT Manage |
|--------|---------|-----------------|
| Content Editor | Page content (pages/*.json), page layouts (*.layout.json), site settings (site.json, header.json, footer.json, seo.json, navigation.json, theme.json) | Blog entries |
| Blog Posts Editor | Blog entries (blog/*.json) — create, edit, delete | Page content, site settings |

### Protected Files (non-deletable)

- theme.json
- site.json
- navigation.json
- header.json
- footer.json
- seo.json

---

## 18. Admin Architecture: Collection Editors

### 18.1 The Problem

As BAAM grows, the Content Editor file list becomes unwieldy. Looking at the Proload Express admin, the Content panel lists: About, About.Layout, Blog, Blog.Layout, Case Studies, Case Studies.Layout, Compare, Contact, Contact.Layout, Coverage... and continues. Every page, layout, and collection item appears in one flat list.

This is manageable with 5 pages. It's painful with 12. It's unusable with 20+ pages and dozens of case studies, testimonials, and FAQ items.

### 18.2 The Solution: Dedicated Collection Editors

Extend the Blog Posts pattern to other collection types. Each high-volume content type gets its own dedicated sidebar nav item with purpose-built UI.

**Admin sidebar navigation (target architecture):**

```
Admin Dashboard
├── Sites
├── Site Settings
├── Content              ← Page content ONLY (pages/*.json, *.layout.json, site settings)
├── Blog Posts           ← Already done. Blog entries only (blog/*.json)
├── Case Studies         ← NEW. case-studies/*.json, purpose-built form
├── Testimonials         ← NEW. Dedicated list/edit UI for testimonials array
├── FAQ                  ← NEW. Dedicated list/edit UI for FAQ items
├── [Industry-Specific]  ← Optional: Bookings, Products, Menu Items, etc.
├── Media
├── Components
├── Variants
├── Users
├── Settings
```

### 18.3 What Each Editor Manages

| Editor | Content Scope | CRUD | Purpose-Built Features |
|--------|--------------|------|----------------------|
| **Content** | pages/*.json, *.layout.json, globals (site, header, footer, seo, nav, theme) | Edit only (no create/delete for protected files) | Form + JSON tabs, variant selector, layout editor |
| **Blog Posts** | blog/*.json | Create, Edit, Duplicate, Delete | Title/slug auto-generation, category picker, publish date, featured toggle, rich text |
| **Case Studies** | case-studies/*.json | Create, Edit, Duplicate, Delete | Industry picker, metrics fields, results array, client quote, related case studies |
| **Testimonials** | testimonials.json (array items) | Add, Edit, Remove, Reorder | Star rating, industry tag, featured toggle, drag-to-reorder |
| **FAQ** | faq-items.json (array items) OR pages/faq.json subsection | Add, Edit, Remove, Reorder | Category assignment, drag-to-reorder, expand/collapse preview |

### 18.4 ContentEditor.tsx Refactoring

The current ContentEditor.tsx is too large. Refactor into:

```
components/admin/
├── ContentEditor/
│   ├── index.tsx              ← Orchestrator (file list + active editor)
│   ├── FileList.tsx           ← Left panel: filtered file list
│   ├── FormEditor.tsx         ← Form mode rendering
│   ├── JsonEditor.tsx         ← JSON mode rendering
│   ├── LayoutEditor.tsx       ← Layout section ordering
│   └── VariantSelector.tsx    ← Variant dropdown per section
├── BlogPostsEditor/
│   ├── index.tsx              ← Blog list + active post editor
│   ├── PostList.tsx           ← Left panel: post list with status/date
│   ├── PostForm.tsx           ← Blog-specific form fields
│   └── PostPreview.tsx        ← Live preview
├── CaseStudiesEditor/
│   ├── index.tsx
│   ├── StudyList.tsx
│   └── StudyForm.tsx
├── TestimonialsEditor/
│   ├── index.tsx
│   └── TestimonialForm.tsx
├── FaqEditor/
│   ├── index.tsx
│   └── FaqItemForm.tsx
```

**Key principles:**
- ContentEditor shrinks by extracting sub-components and removing collection logic
- Each collection editor is self-contained with its own list, form, and CRUD operations
- Shared utilities (save, load, media picker, variant selector) remain in common lib
- File filter in Content Editor excludes blog/*, case-studies/*, and any collection-managed paths

### 18.5 Implementation Priority

| Priority | Editor | Effort | Impact |
|----------|--------|--------|--------|
| ✅ Done | Blog Posts | — | Blog management separated |
| High | ContentEditor refactor | 2-3 days | Smaller file, better maintainability |
| High | Case Studies | 1-2 days | Frequent CRUD, industry-specific fields |
| Medium | Testimonials | 1 day | Array management with reorder |
| Medium | FAQ | 1 day | Array management with categories |
| Low | Industry-specific | As needed | Bookings (medical), Products (printing), etc. |

### 18.6 Impact on Phase Template

In the BAAM phase template, Phase 0 should now include:

- Identify which content types need dedicated editors (blog is always yes; case studies and testimonials typically yes; others vary by industry)
- Plan collection editor UI in content architecture step
- In Phase 1-2, build collection editors alongside the pages that use them
- Content Editor file list should never show collection-managed entries

### 18.7 Site-Clone Ready Method (ContentEditor Modular Pattern)

When duplicating BAAM for a new site, keep the refactored `ContentEditor` architecture and only swap site contracts/options. Do **not** return to a monolithic editor file.

**Required structure (recommended baseline):**

```
components/admin/
├── ContentEditor.tsx                    # Orchestrator only (load/save/list/routing)
└── panels/
    ├── SeoPanel.tsx
    ├── HeaderPanel.tsx
    ├── ThemePanel.tsx
    ├── BlogPostItemPanel.tsx
    ├── PortfolioItemPanel.tsx
    ├── ShopProductItemPanel.tsx
    ├── JournalItemPanel.tsx
    └── CollectionItemPanel.tsx
```

**Rules for all future site clones:**
- `ContentEditor.tsx` handles orchestration only: file list, active file, save/delete/duplicate, mode switch, shared callbacks.
- Each panel owns only its own UI fields and receives all state/actions via props.
- Site-specific differences are configured through content contracts + option sources (for example: `pages/portfolio.json`, `pages/shop.json`, `pages/journal.json`).
- Keep shared action APIs stable (`updateFormValue`, `openImagePicker`, `toggleSelection`, etc.) so panels are portable.
- Add new panel files for new collection types instead of adding large inline blocks.

**Clone workflow (fast and safe):**
1. Copy the admin panel structure as-is.
2. Update content contracts for the new industry/site.
3. Update option loaders (category/style/room sources) to new contract paths.
4. Enable/disable panel routes by file path prefix mapping.
5. Run Admin Done-Gate: create/edit/duplicate/delete + preview + JSON roundtrip for every enabled panel.

**Acceptance target for maintainability:**
- `ContentEditor.tsx` should remain an orchestrator (roughly under 1000 lines target).
- Complex forms should be extracted to `components/admin/panels/*`.
- New site customization should mostly touch panel files and contract config, not core orchestration flow.

---

## 19. Governance & Sign-Off

### 19.1 RACI Matrix

For a solo developer / small team BAAM build:

| Activity | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Stage A: Strategy & design | Developer + Claude | Founder (John) | Client (business owner) | — |
| Stage A gates: approve blueprint | — | Founder | Client | — |
| Phase 0: Infra + contracts | Developer + Cursor | Founder | — | Client |
| Phase 1-2: Build/Wire/Verify | Developer + Cursor | Founder | — | Client (preview links) |
| Phase 1-2: Per-page done-gate | Developer | Founder (spot-check) | — | — |
| Phase 3: SEO + hardening | Developer + Cursor | Founder | — | — |
| Phase 4: QA + launch | Developer | Founder | Client (UAT) | — |
| Phase 4: Go-live sign-off | — | Client + Founder | — | — |
| Phase 5: Content creation | Claude Teams + Developer | Founder | Client | — |
| Phase 5: Growth decisions | Founder | Founder | Client | — |

**For client projects (BAAM as service):**
- Client provides: business info, real content (testimonials, case studies, photos), approval
- Founder provides: strategy, technical execution, quality control
- AI provides: code generation (Cursor), content drafting (Claude), research

### 19.2 Phase Gate Sign-Off Protocol

Each phase ends with a gate review. For a solo/small team, this is a 15-30 minute self-review:

| Gate | Who Signs Off | What They Review |
|------|--------------|-----------------|
| Stage A complete | Founder | All 7 A-Gates pass (see Section 9) |
| Phase 0 complete | Founder | App boots, contracts seeded, admin shows files |
| Phase 1 complete | Founder | Core pages live, admin roundtrip works, design locked |
| Phase 2 complete | Founder + Client preview | All pages, forms work, mobile responsive |
| Phase 3 complete | Founder | Gap matrix 100%, Lighthouse >90, SEO elements in place |
| Phase 4 complete | Founder + Client | UAT pass, content swapped, production URL works |

**Rule: Don't skip gate reviews even on solo projects. A 15-minute checklist review catches issues that cost days later.**

---

## 20. Dual Timeline: Lean vs Full Launch

### 20.1 Lean Launch (Minimum Viable Site — 4 weeks)

For projects with tight deadlines or limited content availability:

| Phase | Duration | Scope |
|-------|----------|-------|
| Stage A | 3-4 days | Abbreviated: page map + contracts + visual direction only |
| Phase 0 | Day 1-2 | Infra + theme + contracts for Tier 1 pages only |
| Phase 1 | Week 1 | 5-6 core pages (Home, Services, About, Contact, Quote/Conversion) |
| Phase 2 | Week 2 | Blog hub (no posts yet), FAQ, responsive polish |
| Phase 3-4 | Week 3-4 | Admin wiring, basic SEO (sitemap, meta), deploy |

**What's deferred to post-launch:**
- Case studies (add as they come in)
- Testimonials page (build once 10+ collected)
- Programmatic SEO pages (Month 2-3)
- Blog content (publish post-launch)
- Comparison pages (Month 3+)
- Full performance optimization (Month 2)

**Lean launch content minimums:**
- 0 blog posts (hub exists, empty)
- 5-10 testimonials (embedded on Home/About only)
- 0 case studies (page exists, "Coming soon" or hidden)
- 15 FAQ items

### 20.2 Full Launch (Premium Site — 7 weeks)

The standard timeline from this plan:

| Phase | Duration | Scope |
|-------|----------|-------|
| Stage A | 1-2 weeks | Complete: all 6 artifacts, all 7 A-Gates |
| Phase 0 | Day 1-3 | Full infra + all contracts + all variants + seed |
| Phase 1 | Week 1-2 | 6-8 core pages + collection editors |
| Phase 2 | Week 3 | All remaining pages + forms + blog + polish |
| Phase 3 | Week 4 | Admin hardening + programmatic SEO + performance |
| Phase 4 | Week 5 | Full QA + content swap + production deploy |

**Full launch content minimums:**
- 6-10 blog posts published
- 20-30 testimonials displayed
- 6+ case studies with detail pages
- 25+ FAQ items
- 50+ programmatic SEO pages

### 20.3 Decision Criteria

Choose **Lean** when:
- Client needs to go live ASAP (e.g., business already operating, no web presence)
- Real content (testimonials, case studies) doesn't exist yet
- Budget is constrained
- Site is proof-of-concept for BAAM template viability

Choose **Full** when:
- The site IS the business (e.g., lead generation is primary revenue driver)
- Enough real content exists or can be created in time
- Competitive market where perceived scale matters (like LTL freight)
- This will become the BAAM template for the industry

---

## 21. Minimum Automation Checks

### 21.1 Why Automation

The QA matrix in Phase 4 is manual-heavy. For a solo developer, manual QA on 12+ pages with multiple checks per page is error-prone and tedious. Basic automated checks catch regressions early.

### 21.2 Automated Check Suite

Create `/scripts/qa-checks.ts` (or equivalent) that runs these checks:

**Schema Validation:**
- For every content JSON file, validate against its TypeScript interface
- Check: all required fields present, correct types, no unexpected keys
- Run: `npm run qa:schema`

**Route Smoke Tests:**
- For every public route, make an HTTP request and verify:
  - Response status 200
  - HTML contains expected `<h1>` text
  - HTML contains `<title>` tag (not empty)
  - HTML contains canonical URL
  - No console errors in server log
- Run: `npm run qa:routes`

**SEO Metadata Checks:**
- For every public route, verify:
  - `<title>` is unique and non-empty
  - `<meta name="description">` exists and is non-empty
  - `<link rel="canonical">` is present and correct
  - `og:title` and `og:description` present
  - `<h1>` exists and is unique on page
- Run: `npm run qa:seo`

**Link Checker:**
- Crawl all internal links, verify no 404s
- Run: `npm run qa:links`

**Content Completeness:**
- For each content JSON, check: no "[placeholder]", "TODO", "lorem ipsum" strings
- Check: all image URLs resolve (no broken images)
- Run: `npm run qa:content`

### 21.3 When to Run

| Check | When |
|-------|------|
| Schema validation | After every Phase 0 seed, after any content edit |
| Route smoke tests | End of Phase 1, end of Phase 2, before Phase 4 launch |
| SEO metadata | End of Phase 1 (core), end of Phase 3 (all pages) |
| Link checker | Before Phase 4 launch |
| Content completeness | Before Phase 4 content swap |

### 21.4 Phase 4 Integration

Add to Phase 4 done-gate:
- [ ] `npm run qa:schema` — 0 errors
- [ ] `npm run qa:routes` — all routes return 200
- [ ] `npm run qa:seo` — all pages have unique title + description + canonical
- [ ] `npm run qa:links` — 0 broken links
- [ ] `npm run qa:content` — 0 placeholder strings remaining

---

## 22. Rollback & Incident SOP

### 22.1 Deploy Rollback

**Vercel rollback (instant):**
1. Go to Vercel dashboard → Deployments
2. Find last known good deployment (green checkmark)
3. Click "..." → "Promote to Production"
4. Site rolls back within seconds

**Git rollback:**
```bash
# Identify last good tag
git tag --list 'v*'

# Roll back to last good state
git revert HEAD    # If single bad commit
git reset --hard v0.3-launch-ready   # If need full rollback

# Force deploy
git push --force-with-lease
```

**Rule: Always tag before risky operations (Phase 3 SEO changes, Phase 4 content swap, any production deploy).**

### 22.2 Content Rollback

**Bad content push (wrong data saved in admin):**
1. Go to admin → Import/Export
2. Import last known good content export (use "overwrite" mode for affected files only)
3. Verify frontend reflects restored content
4. Re-export and commit new backup

**Prevention:**
- Export content snapshot before every Phase gate
- Export before any bulk content operations
- Store exports in git as versioned JSON

### 22.3 Database Incident

**Supabase data corruption or accidental deletion:**
1. Supabase dashboard → Database → Backups (automatic daily backups)
2. Restore from most recent backup
3. Re-seed any content changes made after backup timestamp
4. Verify admin and frontend both work

**Prevention:**
- Never run raw SQL on production without a backup
- Use seed scripts with UPSERT (not DELETE + INSERT)
- Test destructive operations on local/staging first

### 22.4 Incident Response Protocol

| Severity | Symptoms | Response Time | Action |
|----------|----------|--------------|--------|
| **P0 — Site down** | Production URL returns error | Immediate | Vercel rollback to last good deploy |
| **P1 — Major feature broken** | Forms not submitting, pages crashing | Within 1 hour | Identify bad commit, revert, redeploy |
| **P2 — Content error** | Wrong text, broken images, missing sections | Within 4 hours | Fix in admin or content rollback |
| **P3 — Minor visual issue** | Spacing off, color wrong, mobile glitch | Within 24 hours | Fix in next deploy cycle |

### 22.5 Post-Incident Checklist

After any P0 or P1 incident:
- [ ] Root cause identified
- [ ] Fix deployed and verified
- [ ] Added to anti-patterns list (Section 24)
- [ ] Prevention added to QA checks or Phase done-gates

---

## 23. Content Creation Templates

### Blog Post Brief (for Claude Teams)

```
Industry: [industry]
Topic: [topic]
Target keyword: [primary keyword]
Audience: [who reads this]
Tone: Professional, authoritative, practical — not salesy
Length: 800-1200 words
Structure: H1 title, intro paragraph, 3-5 H2 sections, conclusion with CTA
Include: Actionable advice, specific data points, brief company mention (1-2 sentences)
CTA: "[Action] — get a free [quote/consultation/demo]"
```

### Case Study Brief

```
Client: [industry, size, location]
Challenge: [problem they faced]
Solution: [how we helped]
Results: [specific metrics — savings %, time improvement, satisfaction rate]
Quote: [approved client testimonial]
Format: Overview → Challenge → Solution → Results → Testimonial → CTA
Length: 400-600 words
```

### Testimonial Collection Email

```
Subject: Quick feedback? (30 seconds)
Body:
Thanks for [working with us / using our service].
Could you share 1-2 sentences about your experience?
- What made you choose us?
- How do we compare to alternatives?
- Would you recommend us?
We'd feature your quote on our site with permission.
Just reply — even a one-liner helps.
```

### Programmatic Page Content Brief

```
Page type: [location / route / industry / comparison]
Target keyword: [e.g., "LTL freight in Chicago"]
Unique content: 2-3 paragraphs specific to this [location/route/industry]
Include: Service description, local relevance, transit/details, testimonial, CTA
Avoid: Duplicate content from other programmatic pages
```

---

## 28. REB Admin Reuse for New Site Setup

### 28.1 Decision

Yes, the REB admin improvements are **highly useful** for generating and setting up future sites.  
This work should be treated as a **reusable platform baseline**, not a one-off patch set.

### 28.2 What Can Be Reused Without Rebuilding

The following capabilities are now clone-ready and should carry forward as-is:

- Full collection lifecycle actions across key content types: `New Item`, `Save`, `Duplicate`, `Delete`
- Import/export and diff operations across sidebar content types: `Check Update From DB`, `Overwrite Import`, `Export JSON`
- JSON/form parity and richer form coverage for site settings and collections
- Dedicated table syncing for collections that require DB-backed runtime pages (for example `agents`, `events`, `new-construction`)
- Slug/path synchronization behavior for create/duplicate flows
- Media sync/import foundations so Media reflects content image usage
- RBAC updates for broker-level operational workflows in admin

### 28.3 What Is Still One-Time Per New Site

You still need per-site setup, but this is configuration, not feature re-implementation:

1. New Supabase project and schema migration
2. Environment variables and storage bucket configuration
3. Site/domain records and route mapping (`siteId`, locale/domain bindings)
4. Initial content import (source-of-truth decision: DB vs files)
5. Theme/branding content update (`site.json`, `header.json`, `footer.json`, `seo.json`, `theme.json`)

### 28.4 Rule for Future Projects

For every new BAAM site, **do not rebuild admin behavior from scratch**.  
Clone this admin baseline first, then perform only:

- site-specific content contract adjustments
- option list/data mapping changes
- project-level configuration and QA verification

### 28.5 Acceptance for Clone Readiness

Before declaring a cloned site ready, run one runtime sweep on 2-3 representative sections (for example `agents`, `events`, `guides`) and confirm:

- `Create -> Save -> Duplicate -> Delete` passes
- `Check Update From DB / Overwrite Import / Export JSON` are coherent
- DB tables and file content remain in sync after operations

---

## 29. Admin Certification SOP (One-Pass Cursor Checklist)

### 29.1 Purpose

This SOP is a single-run admin verification + remediation phase so Cursor can:

1. check all critical admin behaviors end-to-end,
2. fix issues in grouped batches,
3. re-run the same checklist,
4. finish with one final pass/fail report.

Goal: avoid one-by-one issue discovery and repeated back-and-forth.

### 29.2 When To Run

Run this as **Phase 3.5** (after Phase 3 hardening, before Phase 4 launch) and also:

- after major admin refactors,
- after adding new content types to sidebar,
- after RBAC/schema changes,
- after import/export or media pipeline changes.

### 29.3 Scope (What Must Be Certified)

The certification must cover:

- all left-sidebar content sections,
- all core admin actions (`New Item`, `Save`, `Duplicate`, `Delete`, `Format`),
- all sync actions (`Check Update From DB`, `Overwrite Import`, `Export JSON`),
- JSON/Form parity and field completeness,
- DB/file sync (including dedicated tables),
- media visibility/sync behavior,
- RBAC behavior for target roles,
- no destructive side effects after test cleanup.

### 29.4 Sidebar Coverage Matrix (Required)

Cursor must test each section below and mark `PASS` or `FAIL`:

- `site settings` (`site.json`, `header.json`, `footer.json`, `seo.json`, `theme.json`)
- `pages/*`
- `blog/*` (via Blog Posts editor boundary)
- `portfolio/*`
- `shop-products/*`
- `journal/*`
- `collections/*`
- `testimonials`
- `properties/*`
- `neighborhoods/*`
- `market-reports/*`
- `agents/*`
- `knowledge-center/*`
- `new-construction/*`
- `events/*`
- `guides/*`

### 29.5 Action Checklist Per Section

For each section/content type, execute this exact checklist:

1. Open a known file/item.
2. `Format` works and keeps valid JSON.
3. `Save` succeeds (expect `PUT` success).
4. `New Item` works (use disposable slug).
5. `Duplicate` works (new slug generated correctly).
6. `Delete` works for disposable item (expect `DELETE` success).
7. JSON tab edit and Form tab edit stay in sync after save.
8. If section is non-deletable/protected, verify correct guard message.

If browser prompt flows are automation-limited, use API-driven disposable create/duplicate fallback but still validate save/delete in runtime UI.

### 29.6 Sync Integrity Checklist (Global)

Run these once per locale/site combination:

1. `Check Update From DB` dry-run shows clear diff counts and changed paths.
2. `Overwrite Import` applies source-of-truth correctly (DB -> files).
3. `Export JSON` applies source-of-truth correctly (files -> DB).
4. Re-run `Check Update From DB` to verify no unexpected residual diffs.
5. Verify collection dirs are included in diff (`agents`, `knowledge-center`, `new-construction`, `events`, `guides`, etc.).
6. Verify slug-path consistency after create/duplicate across collection folders.

### 29.7 Dedicated Table + Content Entry Consistency

For relevant types (`agents`, `new-construction`, `events`):

- create/update/delete from admin must reflect in both:
  - `content_entries` path row
  - dedicated table row (`site_id + slug`)
- duplicate must write correct slug in both stores
- delete must remove from both stores

Record result as `PASS` only if both layers are consistent.

### 29.8 Media Checklist

Verify:

1. Media panel lists content-used images after sync/import.
2. URL normalization works for bucket and external-origin paths per policy.
3. Image picker updates content JSON and persists after save.
4. No broken media references in sampled pages/collections.

### 29.9 RBAC Checklist

At minimum test these roles on target site:

- `super_admin`
- `broker_admin`
- `site_admin` (if used)
- `editor` (write scope only where intended)

For each role validate visibility + action permission on:

- users, sites/domains, content actions, media actions, import/export actions.

### 29.10 Cursor One-Pass Execution Flow

Use this execution order in one Cursor run:

1. **Discover**: collect all sidebar sections and action handlers.
2. **Baseline**: run quick pass/fail matrix without edits.
3. **Batch Fix A**: action wiring bugs (`New/Save/Duplicate/Delete/Format`).
4. **Batch Fix B**: sync pipeline bugs (`check/import/export`, diff observability).
5. **Batch Fix C**: DB schema compatibility + dedicated table sync.
6. **Batch Fix D**: JSON/Form parity and panel completeness.
7. **Batch Fix E**: media sync/listing/normalization.
8. **Re-test Full Matrix**: same checklist, fresh pass.
9. **Cleanup**: remove disposable QA items.
10. **Report**: final pass/fail matrix + residual risks.

### 29.11 Required Deliverables

After this SOP run, Cursor must provide:

1. **Admin Certification Matrix** (section x action pass/fail).
2. **Sync Matrix** (`check/import/export` pass/fail with notes).
3. **RBAC Matrix** (role x capability pass/fail).
4. **Fix Log** (files changed + what issue each fixed).
5. **Residual Risk List** (if any) with owner and next action.

### 29.12 Exit Criteria (Phase 3.5 Complete)

Phase 3.5 is complete only when:

- all targeted sections pass action checklist,
- sync actions pass with no unexplained diffs,
- dedicated table/content consistency passes,
- JSON/Form parity passes for key settings and collections,
- media checks pass,
- disposable QA artifacts are cleaned up,
- final report contains zero P0/P1 admin defects.

---

## 26. Theme Token Normalization Playbook

Quick link: see `THEME_NORMALIZATION_SOP.md` for the daily execution checklist used in Cursor prompts and QA passes.

This section defines how to normalize `theme.json` and related styling work across every new BAAM site so design decisions are centralized, predictable, and admin-safe.

### 26.1 Goal

Create **one source of truth** for visual decisions:

- `theme.json` stores tokens (color, typography, radius, spacing rhythm, effects, detail layout)
- `[locale]/layout.tsx` maps tokens to CSS variables
- `styles/globals.css` provides defaults + utility/semantic classes consuming CSS vars
- page/components consume only utilities/CSS vars (no hardcoded visual literals)

If a style value appears more than once, it should become a token candidate.

### 26.2 Token Layers (Required)

For each site, keep these layers in `theme.json`:

1. **Foundation tokens**
   - `colors`, `typography`, `borderRadius`
2. **Behavior/effect tokens**
   - `opacity`, `effects` (hero overlays, media dim, card overlays, text shadows)
3. **Layout tokens**
   - global + section spacing, sticky offsets, detail-page structure
4. **Component tokens**
   - buttons, chips, media badges, card widths, recurring block patterns

Rule: foundation is generic, behavior/layout/component are allowed to be site-specific.

### 26.3 Naming Rules

- Use lowercase camelCase in JSON keys.
- Use semantic names first (`heroContentBottom`, `relatedGridLarge`) not implementation names (`gap7`).
- CSS variables use kebab-case with clear prefix:
  - `--detail-*` for detail-page tokens
  - `--hero-*` for hero/effect tokens
  - `--on-dark-*` for dark-surface text system
- Keep fallback values in CSS var mapping, not in page JSX.

### 26.4 Required Mapping Flow

Every tokenized value must follow this pipeline:

1. Add token in `theme.json`
2. Inject CSS variable in `app/[locale]/layout.tsx`
3. Add default fallback in `styles/globals.css`
4. Consume through:
   - semantic utility class preferred (`detail-section-title`, `detail-card-meta`)
   - direct `style={{ ...var(...) }}` only when utility is not appropriate

Never skip step 2 or 3.

### 26.5 Page Implementation Rules

- No hardcoded color hex in page components.
- No raw `rgba(...)` in page components when an effect token exists.
- Repeated spacing/gap/rhythm classes should be converted into semantic utility classes.
- Prefer semantic classes over long class chains:
  - `detail-back-link` instead of repeated `inline-flex items-center ...`
  - `detail-section-title` instead of repeated heading size/weight/margin/color bundles
  - `detail-card-title` and `detail-card-price` for repeated card metadata

### 26.6 Admin + Content Editor Compatibility

- `theme.json` remains editable from Content Editor (`site settings` scope).
- Any new token group added must:
  - preserve backward fallback behavior
  - not break existing pages if the token is missing
- Protected files list should continue to include `theme.json`.

### 26.7 Normalization Workflow (for each new build)

Run this in Phase 0 and continue during Phase 1-3:

1. **Audit**
   - scan target pages for hardcoded visual values (color, opacity, spacing, radius, shadows)
2. **Cluster**
   - group repeated values into candidate tokens
3. **Promote**
   - add tokens to `theme.json` using semantic naming
4. **Map**
   - wire into `layout.tsx` CSS variable injection
5. **Apply**
   - replace page literals with semantic utility classes
6. **Consolidate**
   - remove redundant micro utility classes when semantic class exists
7. **Verify**
   - lint, visual spot-check, admin roundtrip edit test

### 26.8 Done-Gate: Theme Normalization

Before Phase 3 is marked complete:

- [ ] Top pages + detail pages have no hardcoded visual literals that are already tokenized
- [ ] `theme.json` covers colors, typography, radii, effects, layout spacing, and key component sizing
- [ ] `layout.tsx` injects all active token groups with safe fallbacks
- [ ] `globals.css` contains semantic utilities for repeated patterns
- [ ] No duplicate utility classes for the same purpose
- [ ] Lint passes, and core pages visually match pre-normalization intent

### 26.9 Anti-Drift Rule

Any PR that introduces new hardcoded visual values must either:

1. justify why it is intentionally one-off, or
2. add/update tokens and utilities in the same PR.

This keeps BAAM sites maintainable and prevents style drift over time.

---

## 27. Platform Guardrails (Jin Pang Homes Learnings)

This addendum captures implementation-level rules derived from Jin Pang Homes production work. Keep these as non-optional guardrails for future BAAM builds.

### 27.1 Public vs Admin Data Access

- Public pages must never depend on `/api/admin/*` routes.
- Visitor-facing content should use public content loaders/endpoints only.
- Reason: admin auth/rbac behavior in production can return empty responses and make public pages appear blank.

### 27.2 Site Resolution in Multi-Site Environments

- Do not hardcode `siteId` in public client fetches.
- Resolve site context from host/domain by default, with explicit override only when required.
- Public APIs should accept optional `siteId` and safely infer from request host when absent.

### 27.3 Content Sync Direction (Import vs Export)

- **Import (overwrite):** DB -> local files.
- **Export:** local files -> DB.
- Before running either action, require an explicit source-of-truth decision for this operation.
- If `DB newer conflicts = 0` and DB is authoritative, import is the default safe path.

### 27.4 Slug Integrity Contract

- For collection entries, `slug` must always equal filename stem (path-derived slug).
- Create, save, and duplicate flows must enforce slug/path synchronization automatically.
- Diff tooling must include collection directories so slug mismatches are always detected.

### 27.5 Diff Observability Standard

- "Check Update From DB" outputs must include:
  - total changed file counts (`create`, `update`, `conflicts`)
  - folder-level breakdown (`portfolio`, `journal`, `shop-products`, etc.)
  - sample changed paths for rapid diagnosis
- Goal: make operator decisions obvious before any overwrite action.

### 27.6 Theme Token Governance

- Visual changes (font, color, radius, shadow, overlay, spacing rhythm) must be token-first:
  1. define in `theme.json`
  2. map to CSS variables in layout
  3. consume via semantic classes/utilities
- Avoid one-off visual literals in page components when a tokenized equivalent exists.

### 27.7 Admin Form Completeness Rule

- Complex content contracts (for example testimonials/services) require dedicated panel components, not monolithic inline editors.
- Required capabilities: add/remove/reorder, constrained options (dropdowns), media field support, and JSON/Form roundtrip parity.

### 27.8 Pre-Deploy Operational Checklist (Minimum)

- Run production build (`npm run build`) and ensure zero type/lint failures.
- Smoke test core listing pages (`portfolio`, `collections`, `shop`, `journal`) on target domain and both locales.
- Run sync dry-run and resolve direction (`import` vs `export`) before content operations.
- Spot-check at least one collection file for slug/path consistency after duplicate/create flows.

---

## 24. Anti-Patterns & Lessons Learned

| Anti-Pattern | Why It Hurts | Prevention |
|---|---|---|
| Skip Stage A (design) | Generic site, missing industry features, poor conversion | Always complete all 6 Stage A artifacts + 7 A-Gates before coding |
| Defer admin to late phase | Massive rework, content shape mismatches | Build → Wire → Verify per page in Phase 1-2 |
| Hardcode colors in components | Theme changes don't propagate | Theme tokens only, audit in Phase 0 |
| Manage blog in Content Editor | Editor confusion, filter bugs | Strict editor boundaries from Phase 0 |
| One giant ContentEditor.tsx | Hard to maintain, slow to add features | Refactor into sub-components, extract collection editors |
| All collections in Content Editor | Overwhelming file list, no purpose-built UI | Dedicated editors for blog, case studies, testimonials, FAQ |
| Build page without content contract | Frontend and admin shapes diverge | Contract-first: define JSON before coding UI |
| Placeholder JSON stubs in production | Admin shows empty/broken forms | Full realistic content in all JSON files |
| Skip roundtrip testing | "Works in JSON but not Form mode" | Done-gate requires Form → JSON → Save → Preview |
| Mix Supabase + local JSON sources | Inconsistent data, stale content | DB-first always, filesystem fallback only |
| Defer ALL SEO to Phase 3 | Core pages launch without meta/canonical | Shift-left: basic SEO metadata in Phase 1 for core pages |
| Programmatic pages before core works | SEO pages inherit bugs from templates | Core pages first (Phase 1-2), programmatic in Phase 3 |
| Skip performance audit | Slow site, poor Core Web Vitals | Lighthouse audit mandatory in Phase 3 |
| Launch with placeholder content | Looks fake, destroys trust | Content swap checklist + automated content check in Phase 4 |
| Reuse Supabase project across systems | Cross-client data leakage | Always create new Supabase project per system |
| Copy medical structure to new industry | Loses industry-specific features | Stage A designs industry-native architecture |
| No deploy rollback plan | Bad deploy stays live for hours | Tag before every deploy, know Vercel rollback steps |
| Manual-only QA | Regressions slip through | Minimum automated checks (schema, routes, SEO, links) |
| No content backup before changes | Lost work, no recovery | Export content snapshot at every Phase gate |

---

## 25. Process Summary Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  STAGE A: Strategy & Design (1-2 weeks) — with Claude        │
│                                                              │
│  A1: Industry Deep Dive (competitors, customers, SEO)        │
│  A2: Brand Positioning (differentiation, 5 pillars)          │
│  A3: Page Design (every page, every section, every CTA)      │
│  A4: Component Inventory (NEW vs REUSE)                      │
│  A5: Visual Design Direction (colors, type, photos)          │
│  A6: Content Strategy & Funnel (conversion map, content plan)│
│                                                              │
│  ► 7 Acceptance Gates must pass before Stage B begins        │
│                                                              │
│  Output: 6 artifacts = Complete site blueprint                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  STAGE B: Implementation (5 weeks) — with Cursor             │
│                                                              │
│  Phase 0: Infra + Content Contracts (Day 1-3)                │
│           └── Supabase, theme, contracts, seed, variants     │
│           └── Collection editor plan (which types get own UI)│
│                                                              │
│  Phase 1: Core Pages — Build/Wire/Verify (Week 1-2)          │
│           └── 6-8 core pages, all admin-editable             │
│           └── SEO baseline: meta + canonical + OG per page   │
│                                                              │
│  Phase 2: All Pages + Conversion + Polish (Week 3)           │
│           └── Forms, blog, case studies, testimonials, mobile │
│           └── Collection editors built (case studies, etc.)   │
│                                                              │
│  Phase 3: Admin Hardening + SEO (Week 4)                     │
│           └── Gap audit, programmatic pages, schema, sitemap │
│           └── Automated QA checks created and passing        │
│                                                              │
│  Phase 4: QA + Launch (Week 5)                               │
│           └── Acceptance tests (manual + automated)          │
│           └── Content swap, deploy, submit, rollback plan    │
│                                                              │
│  Output: Live production site                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 5: Business Growth (12 months)                        │
│                                                              │
│  Month 1-2:   Launch burst + monitoring setup                │
│  Month 3-4:   SEO optimization + conversion improvement      │
│  Month 5-6:   Scale (paid acquisition + authority content)   │
│  Month 7-9:   Compound growth + retention                    │
│  Month 10-12: BAAM template extraction + first clients       │
│                                                              │
│  Output: Revenue-generating site + reusable industry template│
│                                                              │
└──────────────────────────────────────────────────────────────┘

Lean launch: Stage A (3-4 days) + Stage B (3 weeks) = 4 weeks
Full launch: Stage A (1-2 wk) + Stage B (5 wk) = 7 weeks
Phase 5: 12 months to mature BAAM template
```Target keyword: [primary keyword]
Audience: [who reads this]
Tone: Professional, authoritative, practical — not salesy
Length: 800-1200 words
Structure: H1 title, intro paragraph, 3-5 H2 sections, conclusion with CTA
Include: Actionable advice, specific data points, brief company mention (1-2 sentences)
CTA: "[Action] — get a free [quote/consultation/demo]"
```

### Case Study Brief

```
Client: [industry, size, location]
Challenge: [problem they faced]
Solution: [how we helped]
Results: [specific metrics — savings %, time improvement, satisfaction rate]
Quote: [approved client testimonial]
Format: Overview → Challenge → Solution → Results → Testimonial → CTA
Length: 400-600 words
```

### Testimonial Collection Email

```
Subject: Quick feedback? (30 seconds)
Body:
Thanks for [working with us / using our service].
Could you share 1-2 sentences about your experience?
- What made you choose us?
- How do we compare to alternatives?
- Would you recommend us?
We'd feature your quote on our site with permission.
Just reply — even a one-liner helps.
```

### Programmatic Page Content Brief

```
Page type: [location / route / industry / comparison]
Target keyword: [e.g., "LTL freight in Chicago"]
Unique content: 2-3 paragraphs specific to this [location/route/industry]
Include: Service description, local relevance, transit/details, testimonial, CTA
Avoid: Duplicate content from other programmatic pages
```

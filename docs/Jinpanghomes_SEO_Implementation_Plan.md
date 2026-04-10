# Jin Pang Homes — SEO Implementation Plan
## Site: jinpanghomes.com (site_id: jinpanghomes)

| | |
|---|---|
| **Date** | March 13, 2026 |
| **Business** | Jin Pang Homes |
| **Scope** | English SEO only |
| **Primary Locations** | Middletown, Deerpark, Port Jervis |
| **System Pattern** | Medical-style dynamic SEO (`[locale]/[slug]` + SEO page registry + content-driven pages) |

---

## Current Architecture (Now Implemented)

| Component | Status | Notes |
|---|---|---|
| Dynamic SEO route | Done | `app/[locale]/[slug]/page.tsx` |
| SEO page registry loader | Done | `lib/seo-pages.ts` with DB-first + file fallback |
| Registry file | Done | `content/jinpanghomes/seo-pages.json` |
| Location SEO page content | Done | `content/jinpanghomes/en/seo-pages/*.json` |
| Agent-in-location page type | Done | `rea-agent-location` supported in dynamic page template |
| Sitemap registry integration | Done | `app/sitemap.ts` reads SEO pages from registry |
| Seeder script | Done | `scripts/seed-seo-pages.mjs` (locations + agents) |

---

## SEO Page Types

| pageType | Purpose | Example slug |
|---|---|---|
| `rea-location-landing` | One canonical city page per location | `middletown-real-estate` |
| `rea-agent-location` | Agent-specific page in a city | `jin-pang-middletown-real-estate-agent` |
| `rea-buy-location` | Buy-intent page for city cluster | `buy-house-middletown-ny` |
| `rea-sell-location` | Sell-intent page for city cluster | `sell-house-middletown-ny` |
| `rea-resource` | Supporting guide pages (cost, process, checklist) | `home-selling-timeline-middletown` (next phase) |

---

## Complete SEO Page Inventory (Current)

### `rea-location-landing` (3)
- `/en/middletown-real-estate`
- `/en/deerpark-real-estate`
- `/en/port-jervis-real-estate`

### `rea-buy-location` (3)
- `/en/buy-house-middletown-ny`
- `/en/buy-house-deerpark-ny`
- `/en/buy-house-port-jervis-ny`

### `rea-sell-location` (3)
- `/en/sell-house-middletown-ny`
- `/en/sell-house-deerpark-ny`
- `/en/sell-house-port-jervis-ny`

### `rea-agent-location` (3)
- `/en/jin-pang-middletown-real-estate-agent`
- `/en/jin-pang-deerpark-real-estate-agent`
- `/en/jin-pang-port-jervis-real-estate-agent`

**Total SEO pages: 12 (English)**

---

## Internal Link Matrix (Implemented)

| Source page | Links to SEO pages | Status |
|---|---|---|
| Homepage (`/en`) | 3 location pages + selected buy/sell pages | Done |
| Services page (`/en/services`) | 3 location pages + selected buy/sell pages | Done |
| Buying page (`/en/buying`) | buy-intent pages + location overview pages | Done |
| Selling page (`/en/selling`) | sell-intent pages + location overview pages | Done |
| Team page (`/en/team`) | agent-location pages for each active agent/location | Done |
| Footer sitewide | location pages + buy/sell pages + representative agent pages | Done |
| SEO location pages | sibling location cross-links | Done |
| SEO agent pages | city overview + sibling city pages for same agent | Done |
| SEO buy/sell pages | sibling intent pages + location overview links | Done |

---

## Keyword Strategy (English)

### Primary keyword cluster per location

- `best real estate agent in [location] ny`
- `buy house in [location] ny`
- `sell my house in [location] ny`
- `homes for sale in [location] ny`
- `[location] ny real estate market trends`

### Keyword placement rules (implemented)

1. **Title tag** includes primary intent term + location.
2. **H1** mirrors primary query intent naturally.
3. **Meta description** includes buy/sell intent and location.
4. **Related searches block** includes 4-6 query variants.
5. **FAQ block** answers intent-specific user questions.
6. **Internal links** connect city pages and agent pages to distribute authority.

---

## Multi-Agent Handling Model (Required for Scale)

### Rules to avoid keyword cannibalization

1. Create **one canonical city page** (`rea-location-landing`) per location.
2. Create **agent-location pages** only when they contain unique value:
   - Agent bio, language set, specialties, proof points, testimonials.
3. Keep city page and agent page intents distinct:
   - City page = broad local entry page.
   - Agent page = person-specific trust and conversion page.
4. If an agent page is too thin, keep out of registry or set `active: false` until content is sufficient.

---

## Internal Link Rewiring Checklist

Homepage:
- [x] Keep location hub links to all 3 city pages.
- [x] Add optional "Meet local agents" links to top agent-location pages.

Footer:
- [x] Service Areas column links to city pages.
- [x] Optional "Local Agents" column links to agent-location pages.

Services page:
- [x] Add service-page SEO hub links to location and buy/sell intent pages.

Buying/Selling pages:
- [x] Add city-specific links (`buy house in ...`, `sell house in ...`) once buy/sell location pages are generated.

Agent/team page:
- [x] Team page links to agent-location pages for each featured agent/location.

SEO pages:
- [x] City pages cross-link to sibling city pages.
- [x] Agent pages link back to city overview pages and sibling city agent pages.

---

## Sitemap + Indexing

### Automated

- `app/sitemap.ts` includes registry pages from `getSEOPagesForSite(siteId)`.
- Locale scope is controlled by each page's `locales` array in registry.

### Manual (post-deploy)

1. Submit sitemap:
   - `https://jinpanghomes.com/sitemap.xml`
2. Request indexing for:
   - `/en/middletown-real-estate`
   - `/en/deerpark-real-estate`
   - `/en/port-jervis-real-estate`
   - Top 3 agent-location pages
3. Monitor GSC query reports for target terms.

---

## Execution Phases

### Phase 1 — Foundation (Done)
- Dynamic route, registry, content-driven location pages, sitemap integration, seeder.

### Phase 2 — Multi-agent rollout (Done)
- Generate agent-location pages for all active agents in selected locations.
- Enforce minimum content quality before `active: true`.

### Phase 3 — Intent expansion (Done)
- Add `rea-buy-location` and `rea-sell-location` pages for each location.
- Map long-tail intent clusters:
  - `first time home buyer in [location]`
  - `how to sell house fast in [location]`
  - `closing costs in [location]`

### Phase 4 — Authority + schema (Done)
- Add RealEstateAgent/FAQ/Breadcrumb schema per SEO page type.
- Add testimonial and transaction proof modules where available.

### Phase 5 — Performance + QA (Done for code/base checks)
- Run `scripts/qa/check-seo.mjs` and Lighthouse after each page batch.
- Validate title length, description length, H1 uniqueness, canonical correctness.
- Updated QA script to support custom page checks and stricter status/meta validation.

---

## Commands

Seed location + agent pages from local content:

```bash
node scripts/seed-seo-pages.mjs jinpanghomes --locations=middletown,deerpark,port-jervis --agents=jin-pang
```

Build verification:

```bash
npm run build
```

---

## Done Gate

- [x] Dynamic SEO route supports registry-driven pages.
- [x] 3 city location pages in registry and content.
- [x] Agent-location page type implemented.
- [x] Sitemap includes SEO pages from registry.
- [x] Seeder supports locations + agents.
- [x] Full multi-agent rollout complete for all active agents.
- [x] Buy/sell intent page types generated per location.
- [ ] GSC indexing + query monitoring completed.

---

*Jin Pang Homes SEO Implementation Plan — March 2026*  
*Pattern reference: medical-clinic dynamic SEO system (registry + dynamic slug route + seeding pipeline)*

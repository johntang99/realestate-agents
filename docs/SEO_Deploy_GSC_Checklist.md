# SEO Deploy + GSC Checklist
## Site: jinpanghomes.com

This checklist is for final deploy and search indexing after the dynamic SEO rollout.

---

## 1) Pre-Deploy (Code)

- [ ] `npm run build` passes locally.
- [ ] `content/jinpanghomes/seo-pages.json` includes all active SEO slugs.
- [ ] `content/jinpanghomes/en/seo-pages/` includes matching JSON for each slug.
- [ ] `app/sitemap.ts` includes registry-driven SEO pages.
- [ ] `app/[locale]/[slug]/page.tsx` returns 200 for target SEO pages.
- [ ] Footer/homepage internal links point to location, buy/sell, and agent pages.

---

## 2) Pre-Deploy (QA Script)

Run:

```bash
node scripts/qa/check-seo.mjs http://localhost:3000 --path=/en/middletown-real-estate --path=/en/deerpark-real-estate --path=/en/port-jervis-real-estate --path=/en/buy-house-middletown-ny --path=/en/sell-house-middletown-ny
```

- [ ] Title found on all checked pages.
- [ ] Meta description found on all checked pages.
- [ ] Canonical present and correct.
- [ ] hreflang alternate links present.

---

## 3) Deploy

- [ ] Deploy latest `rea2` build to production.
- [ ] Verify production homepage loads and navigation works.
- [ ] Verify sample SEO pages return HTTP 200:
  - [ ] `/en/middletown-real-estate`
  - [ ] `/en/deerpark-real-estate`
  - [ ] `/en/port-jervis-real-estate`
  - [ ] `/en/jin-pang-middletown-real-estate-agent`
  - [ ] `/en/buy-house-middletown-ny`
  - [ ] `/en/sell-house-middletown-ny`

---

## 4) Sitemap + Robots

- [ ] Open `https://jinpanghomes.com/sitemap.xml` and confirm SEO slugs are present.
- [ ] Open `https://jinpanghomes.com/robots.txt` and confirm sitemap is declared.

---

## 5) Google Search Console (Manual)

- [ ] Verify/confirm domain property in GSC (`jinpanghomes.com`).
- [ ] Submit sitemap: `https://jinpanghomes.com/sitemap.xml`.
- [ ] Request indexing for priority URLs:
  - [ ] `/en/middletown-real-estate`
  - [ ] `/en/deerpark-real-estate`
  - [ ] `/en/port-jervis-real-estate`
  - [ ] `/en/buy-house-middletown-ny`
  - [ ] `/en/sell-house-middletown-ny`
  - [ ] Top 3 agent-location pages

---

## 6) First 30 Days Monitoring

- [ ] Weekly: check GSC impressions/clicks for:
  - `best real estate agent in middletown ny`
  - `best real estate agent in deerpark ny`
  - `best real estate agent in port jervis ny`
  - `buy house in middletown ny`
  - `sell my house in middletown ny`
- [ ] Identify cannibalization between city pages and agent pages.
- [ ] Deactivate thin/underperforming agent pages in registry if needed.
- [ ] Add one new high-intent FAQ update per location page each month.

---

## 7) Rollback Safety

- [ ] Keep previous deploy artifact available.
- [ ] If any critical SEO route fails, temporarily set affected slug to inactive in registry and redeploy.
- [ ] Re-run sitemap and GSC URL inspection after rollback/fix.

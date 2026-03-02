# New Site Duplication Checklist

Use this checklist for the current multi-site medical platform where many sites share one codebase and one production deployment.

This is the default path for launching a new clinic site (for example, `acupuncture-flushing`) without breaking existing sites.

Reference:
- `DRHUANG_CLINIC_REPRODUCTION_GUIDE.md` -> multi-site sections
- `STAGING_PROMOTION_RUNBOOK.md`

---

## A) Pre-flight (shared platform)

- [ ] Confirm app is deployed with latest schema-compatible code.
- [ ] Confirm required DB schema has been applied:
  - [ ] `supabase/admin-schema.sql`
  - [ ] `supabase/rls.sql`
- [ ] Confirm source site ID (for cloning), e.g. `dr-huang-clinic`.
- [ ] Confirm new site ID (kebab-case), e.g. `new-site-id`.
- [ ] Confirm production domain, e.g. `newsite.com`.
- [ ] Confirm local dev domain, e.g. `newsite.local`.
- [ ] Confirm existing sites/domains backup/export is available.

---

## B) Create new site from Admin (no SQL clone needed)

- [ ] Open `/admin/sites/new`.
- [ ] Set:
  - [ ] `Site ID` = `new-site-id`
  - [ ] `Clone from` = source site
  - [ ] `Site Name`
  - [ ] legacy `Domain` (prod domain for backward compatibility)
  - [ ] `Default Locale`
  - [ ] `Supported Locales`
- [ ] Save.

Expected clone behavior:
- [ ] Clones content entries (DB mode).
- [ ] Clones booking settings/services.
- [ ] Clones fallback content/uploads folders when present.
- [ ] Clones media DB rows for new `site_id` (latest behavior).

---

## C) Configure domain aliases in Admin Site Settings

- [ ] Open `/admin/sites/<new-site-id>`.
- [ ] In `Domain Aliases`, add:
  - [ ] `newsite.com` with environment `prod`, enabled
  - [ ] `newsite.local` with environment `dev`, enabled
- [ ] Save.
- [ ] Verify aliases appear in DB table `site_domains`.

Notes:
- `Domain` field is legacy fallback.
- `Domain Aliases` is the preferred multi-domain mapping.

---

## D) Local routing setup (`.local`)

alias is shi.local, local routing setup is simple.

1) Add hosts entry on your Mac

sudo nano /etc/hosts

Add this line (and keep your other local aliases too if needed):

127.0.0.1 shi.local

Save and exit:
Ctrl + O, Enter
Ctrl + X

2) Flush DNS cache

sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

3) Start local app

From project root:
npm run dev

4) Test in browser

Open:
http://shi.local:3003/en
http://shi.local:3003/zh

If alias mapping is correct in DB (site_domains has shi.local enabled for shi-acupuncture), it should load that site.

---

## E) Production domain setup

- [ ] Add `newsite.com` (and optional `www`) in Vercel Domains.
- [ ] Configure DNS records per Vercel instructions.
- [ ] Confirm Vercel env has:
  - [ ] `APP_ENV=prod`
  - [ ] `NEXT_PUBLIC_APP_ENV=prod`
  - [ ] Supabase + auth + email keys
- [ ] Redeploy latest build if needed.

---

## F) Update site settings content (NAP first)

- [ ] Update `site.json` values (business name, address, phone, email) for `en` and `zh`.
- [ ] Update NAP-related values in:
  - [ ] `header.json` (`menu.logo.text`, `topbar.phone/address/hrefs`)
  - [ ] `footer.json` (`brand.name`, `contact` block, copyright if needed)
  - [ ] `seo.json` titles/descriptions with new location/name
- [ ] Keep menu items untouched if content team will update later.

---

## G) Import updated JSON to DB (site-scoped, safe)

- [ ] In admin import, set `siteId = new-site-id` only.
- [ ] Run dry-run first.
- [ ] Import locale `en` (use overwrite only when intended).
- [ ] Import locale `zh`.
- [ ] Confirm no imports were run against `dr-huang-clinic`.

Safety:
- [ ] Export backup before overwrite import.
- [ ] Default mode should be `missing` unless deliberately syncing updates.

---

## H) Verification (do not break existing sites)

- [ ] New prod domain routes to new site.
- [ ] Existing `drhuangclinic.com` unchanged.
- [ ] `/en` and `/zh` work on both sites.
- [ ] Admin login works.
- [ ] `Site Settings` save persists.
- [ ] Contact + booking flows work for new site.
- [ ] `/api/health` returns OK after latest deployment.
- [ ] `admin_audit_logs` captures site update/import actions.

---

## I) Known issues and guardrails

- [ ] If login intermittently fails, check app logs for Supabase network timeout (`ETIMEDOUT`), not just credentials.
- [ ] If `/api/health` is 404 in prod, redeploy latest code (route not in old deployment).
- [ ] Do not map real production domains to `127.0.0.1` unless temporary.
- [ ] Prefer `.local` hosts for local testing.
- [ ] Do not run overwrite import on the wrong `siteId`.

---

## J) Optional: Fully isolated clone path (separate codebase/DB)

If a client requires full isolation:
- follow `SITE_REPRODUCTION_TEMPLATE.md`
- create separate repository/deployment/Supabase project
- do not share runtime env or data with existing tenants

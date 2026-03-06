# Site Onboarding SOP

**System:** BAAM Real Estate Agent (REA2)
**Access Required:** super_admin
**Estimated Time:** ~30–50 seconds (with AI), ~15 seconds (skip AI)

> **Pipeline B** clones a master template site and customizes it for a new real estate brokerage in 7 automated steps (O1–O7). The result is a fully functional client site with unique content, branding, and SEO.

---

## Prerequisites

Before onboarding a new client, confirm ALL of the following:

- [ ] Master template site (`jinpanghomes`) is fully synced to Supabase (content, media, storage)
- [ ] You have the client's business information ready (brokerage name, principal broker, agents, license info)
- [ ] The dev server is running (`npm run dev` on port 3070)
- [ ] You have super_admin access to the Admin dashboard

### Required Environment Variables (`.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` | Supabase REST API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key for DB + Storage operations |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for media files |
| `ANTHROPIC_API_KEY` | Claude API key (required for AI content; skippable) |

### Required Supabase Tables

| Table | Purpose |
|-------|---------|
| `sites` | Site registry (id, name, domain, enabled, locales) |
| `content_entries` | All CMS content (site_id, locale, path, data) |
| `media_assets` | Media file records (site_id, path, url) |
| `site_domains` | Domain-to-site mapping (site_id, domain, environment) |

---

## Admin Onboarding UI

### Step 1 — Open Onboarding Wizard

1. Navigate to `/admin/onboarding` in the browser
2. You must be logged in as a **super_admin** — regular admins will see an access denied message

### Step 2 — Fill in the Intake Form

The form has 12 sections. **Sections 1–8 are required** (expanded by default). **Sections 9–12 are optional** (collapsed by default).

#### Section 1: Identity & Template
| Field | Notes |
|-------|-------|
| **Business Name** | Required. Auto-generates Site ID, domain, and email fields |
| **Site ID** | Auto-derived slug (e.g., "Hudson Valley Realty" → `hudson-valley-realty`). Editable. |
| **Clone From** | Template to clone from. Default: `jinpanghomes` |

**Confirm:** "Is the Site ID correct? It becomes the permanent identifier for this client across DB, storage, and filesystem."

#### Section 2: Principal Broker
| Field | Notes |
|-------|-------|
| Principal Broker Name | e.g., "Michael Chen" |
| Title | e.g., "Licensed Real Estate Broker" |
| License State | e.g., "NY" |
| Broker License # | State broker license number |
| Principal Broker License # | If different from broker license |
| Languages | Checkboxes: English, Chinese, Spanish, Korean |
| Specialties | Comma-separated (e.g., "Luxury Homes, Investment Properties") |
| Years Experience | Numeric |
| Transaction Count | e.g., "500+" |

#### Section 3: Team Agents
Repeatable list — add/remove agents dynamically:
| Field | Notes |
|-------|-------|
| Name | Agent's full name |
| Title | e.g., "Licensed Real Estate Salesperson" |
| Role | e.g., "Buyer's Agent", "Listing Specialist" |
| Email | Agent's email |
| Phone | Agent's direct line |
| Languages | Checkboxes per agent |
| Specialties | Comma-separated |
| License # | State license number |

#### Section 4: Location & Contact
| Field | Notes |
|-------|-------|
| Address | Office street address |
| City / State / Zip | State is 2-char (e.g., "NY") |
| County | e.g., "Orange County" — used in SEO and content |
| Phone | Office main line |
| Email | Auto-generated as `hello@{slug}.com` |

#### Section 5: Office Hours
| Field | Default |
|-------|---------|
| Weekdays | `9:00 AM - 6:00 PM` |
| Saturday | `10:00 AM - 4:00 PM` |
| Sunday | `By Appointment` |

#### Section 6: Business Verticals (Services)
Checkbox grid with Select All / Deselect All per category. All 6 selected by default:

| Category | Verticals |
|----------|----------|
| Core Services | Buy a Home, Sell Your Home, Home Valuation |
| Specialty Services | Investment Properties, Relocation Services, New Construction |

**Confirm:** "Are the correct verticals selected? Unchecked verticals will be removed from all pages."

#### Section 7: Brand
5 preset variants with color swatches:

| Variant | Primary | Secondary | Display Font |
|---------|---------|-----------|-------------|
| Navy & Gold | `#1A2744` | `#C9A96E` | Cormorant Garamond |
| Slate & Sage | `#374151` | `#6B8E6B` | Montserrat |
| Midnight & Copper | `#1E293B` | `#B87333` | DM Serif Display |
| Charcoal & Emerald | `#2D3748` | `#2E6B4F` | Lora |
| Burgundy & Cream | `#4A1942` | `#DDA15E` | Playfair Display |

Optional: Primary color hex override (auto-generates dark/light/50/100 shades).

#### Section 8: Locales & Domain
| Field | Notes |
|-------|-------|
| Supported Locales | English (always enabled), Chinese (zh) toggle |
| Default Locale | Dropdown of selected locales |
| Production Domain | e.g., `hudsonvalleyrealty.com` (auto-derived) |
| Dev Domain | e.g., `hudson-valley.local` (auto-derived) |

#### Sections 9–12 (Optional)

| Section | Key Fields |
|---------|-----------|
| **Content Tone** | Voice (Professional/Warm/Luxury), target demographic, USPs |
| **Social Media** | Facebook, Instagram, YouTube, LinkedIn, Twitter/X, TikTok, WeChat |
| **License & Compliance** | Brokerage type, MLS disclaimer, equal housing text, fair housing statement |
| **Brokerage Stats** | Agent count, total volume, years in business, transactions, reviews, sale-to-list ratio, avg days on market |

### Step 3 — Review & Generate

1. Review all filled fields
2. **Optional:** Check "Skip AI content generation" for faster processing
3. Click **"Generate Site"**

### Step 4 — Monitor Pipeline Progress

| Step | Name | What Happens | Duration |
|------|------|-------------|----------|
| O1 | Clone | Creates site record, clones content + media + storage + local files | ~15s |
| O2 | Brand | Applies color palette + font pairing from selected variant | <1s |
| O3 | Prune Verticals | Removes disabled verticals from nav, footer, homepage | ~3s |
| O4 | Replace | Deep string replacement (NAP) + structural file updates + agent profiles | ~5s |
| O5 | AI Content | Claude generates hero, about, broker bio, testimonials, SEO | ~15–25s |
| O6 | Cleanup | Deletes entries for unsupported locales | <1s |
| O7 | Verify | Checks required paths, contamination, agent count, domains | <1s |

### Step 5 — Review Results

On success, the Done panel displays:
- Green success banner with brokerage name
- Stats grid: **Entries**, **Verticals**, **Locales**, **Domains**
- **Errors** (red) and **Warnings** (amber)

Action buttons:
- **View in Content Editor** → `/admin/content?siteId={id}&locale=en`
- **Preview Site** → `http://{devDomain}:3070/en`
- **Onboard Another Client** → resets the form

---

## Post-Onboarding Steps

### Step 6 — Set Up Local Dev Domain

```bash
sudo sh -c 'echo "127.0.0.1 {alias}.local" >> /etc/hosts'
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder
open http://{alias}.local:3070/en
```

### Step 7 — Run Verification Script

```bash
node scripts/verify-site.mjs {site-id}
```

### Step 8 — Visual Spot-Check

- [ ] Homepage loads with correct brokerage name and hero
- [ ] About page shows correct principal broker bio and credentials
- [ ] Contact page shows correct phone, address, hours
- [ ] Footer shows correct hours, social links, compliance text
- [ ] Only enabled verticals appear in navigation and pages
- [ ] Agent profiles show real team (not template agents)
- [ ] SEO titles are client-specific (view page source)
- [ ] No template brokerage name ("Jin Pang") visible anywhere
- [ ] Language switcher works for enabled locales

---

## Pipeline Details

### O4 Template Replacement Pairs

| Template String | Replaced With |
|----------------|--------------|
| `JIN PANG HOMES` | Business name (uppercase) |
| `Jin Pang Homes` | Business name |
| `Jin Pang` | Business name (short) |
| `jinpanghomes.com` | Production domain |
| `hello@jinpanghomes.com` | Client email |
| `(845) 555-0190` | Client phone |
| `21 Painted Apron Ter, Port Jervis, NY 12771` | Full address |
| `Port Jervis` | Client city |
| `Orange County` | Client county |
| `jinpanghomes` | New site ID (storage paths, handles) |
| `Jin Pang Leadership Team` | Principal broker name |

Template agent slugs deleted: `jin-pang`, `jane-smith`, `marcus-johnson`, `sarah-rodriguez`

### O7 Contamination Check Terms

`Jin Pang`, `jinpanghomes.com`, `jinpanghomes`, `(845) 555-0190`, `21 Painted Apron`

---

## Troubleshooting

### Pipeline fails at O1 with Supabase error
- Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Verify template site `jinpanghomes` exists in the `sites` table

### Template brokerage name still visible
- O7 reports contamination as warnings
- Check replacement pairs — template string may need updating

### Dev domain doesn't resolve
- Check `/etc/hosts` entry, flush DNS cache
- Verify `site_domains` table has the dev domain row

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [SITE_DELETION_SOP.md](SITE_DELETION_SOP.md) | How to delete a client site |
| `scripts/verify-site.mjs` | Automated post-onboarding verification |
| `scripts/delete-site.mjs` | Interactive site deletion with confirmations |

---

## Notes

- **Template sites** (e.g., `jinpanghomes`) must NEVER be modified by the onboarding pipeline.
- Real estate onboarding uses **verticals** (not services) — buying, selling, home-valuation, investing, relocating, new-construction.
- The form includes **License & Compliance** fields unique to real estate (MLS disclaimer, equal housing, fair housing).
- Each onboarding costs approximately **$0.13** in Claude API usage (when AI is enabled).

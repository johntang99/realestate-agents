# REB Admin SOP Checklist (Non-AI)

This checklist is for one-pass setup QA on new real-estate sites using the REB admin stack.

## 1) Preflight

- Confirm environment is DB-enabled (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` present).
- Confirm `siteId` is correct in admin site selector.
- Confirm locale(s) expected for launch are available.
- Confirm `zh` appears in locale dropdown when bilingual launch is expected.
- Run `npm run type-check` before and after change batch.

## 2) Content Action Reliability (Per Sidebar Section)

Run this sequence for each representative section:

- Pages (`pages/home.json`)
- Agents (`agents/*.json`)
- Events (`events/*.json`)
- Guides (`guides/*.json`)
- One additional collection used by project (`knowledge-center`, `new-construction`, etc.)

For each section:

1. **New Item/Page**
   - Create a disposable item with unique slug (`qa-<timestamp>`).
   - Verify it appears in the list immediately.
2. **Save**
   - Edit a visible field and save.
   - Reload and verify persisted value.
3. **Duplicate**
   - Duplicate to `qa-<timestamp>-copy`.
   - Verify both items exist and slugs are unique.
4. **Format**
   - Apply format and ensure no structural damage in JSON view.
5. **Delete**
   - Delete both disposable items and confirm removal.
6. **Import JSON / Check Update From DB / Overwrite Import / Export JSON**
   - Run `Check Update From DB` and confirm meaningful diff summary.
   - Run dry-run overwrite first, then overwrite only if expected.
   - Run export and verify file write under `content/<siteId>/<locale>/`.

Pass criteria:

- No silent failures.
- No false "no differences" when files are actually diverged.
- No accidental overwrite when duplicate target slug already exists.

## 3) Public Conversion Flow Sweep

Validate these routes on desktop + mobile viewport:

- `/[locale]` (home)
- `/[locale]/buying`
- `/[locale]/selling`
- `/[locale]/investing`
- `/[locale]/relocating`
- `/[locale]/contact`

Checks:

- Hero readability and CTA visibility.
- For pages using hero variants, verify selected variant/image render correctly (especially `photo-background`).
- Where configured, verify hero height follows JSON (`hero.heightVh`) and Form mode edits apply after save.
- No overflow/clip issues.
- Buttons are tappable on mobile.
- Persistent CTA stack (call/text/schedule) is visible and non-blocking.

## 4) Legal/Compliance Sweep

Validate footer + site compliance fields render and are editable:

- License number and principal broker license.
- Equal housing text.
- Fair housing statement.
- MLS disclaimer.
- Privacy and terms links.
- If bilingual, verify `header.json` and `footer.json` render correctly on both `/en` and `/zh`.

Pass criteria:

- Editing in admin updates frontend rendering.
- No missing legal fields at launch locale.

## 5) Deployment Go/No-Go (Non-AI Scope)

## GO when all are true:

- Type-check passes.
- Content action matrix passes for pages + 3 collection sections.
- Mobile conversion pages pass visual/tap checks.
- Persistent CTA stack works (call/text/contact).
- Legal/footer compliance content is present and editable.

## NO-GO if any are true:

- Any admin action silently fails or mismatches DB/local state.
- Import/export/check-update behavior is inconsistent.
- Footer legal statements are missing.
- Mobile CTAs overlap critical form actions.

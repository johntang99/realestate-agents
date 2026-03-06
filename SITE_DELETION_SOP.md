# Site Deletion SOP

**System:** BAAM Real Estate Agent (REA2)
**Access Required:** super_admin
**Estimated Time:** 2–5 minutes (manual), <30 seconds (script)

> **WARNING:** Site deletion is irreversible. There is no undo. All content, media, and configuration for the site will be permanently removed from the database, storage bucket, and local filesystem.

---

## Pre-Deletion Checklist

- [ ] The site is no longer serving production traffic (domain DNS removed or redirected)
- [ ] The site owner has been notified and has approved deletion
- [ ] You have exported/backed up any content you want to preserve
- [ ] You have noted the site ID (e.g., `hudson-valley-realty`)

---

## Deletion Order

**Children first, parent last.** Foreign key dependencies require this order.

| Step | Layer | Table / Path | Why |
|------|-------|-------------|-----|
| 1 | DB | `content_entries` | Most rows — bulk content |
| 2 | DB | `media_assets` | Media URL records |
| 3 | DB | `site_domains` | Domain alias mappings |
| 4 | DB | `sites` | Parent record (delete last) |
| 5 | Storage | `{bucket}/{site-id}/` | Actual image files in Supabase Storage |
| 6 | Local | `public/uploads/{site-id}/` | Local image cache |
| 7 | Local | `content/{site-id}/` | Local content fallback files |
| 8 | JSON | `content/_sites.json` | Local site registry |
| 9 | JSON | `content/_site-domains.json` | Local domain registry |

---

## Method: Script Deletion (Recommended)

```bash
node scripts/delete-site.mjs {site-id}

# Dry run (shows what would be deleted, changes nothing)
node scripts/delete-site.mjs {site-id} --dry-run
```

The script:
1. Looks up the site in DB — shows inventory of all data
2. Requires explicit `y` confirmation before each destructive step
3. Deletes in the correct FK-safe order
4. Runs a verification pass to confirm everything is gone

---

## Post-Deletion Verification

```bash
node scripts/verify-site.mjs {site-id}
# Expected: all checks show ✗, confirming complete removal
```

---

## Emergency Recovery

- **DB** — Supabase PITR backup (if enabled)
- **Storage** — No automatic backup, permanently deleted
- **Local files** — Restore from git history or Time Machine
- **Fastest path** — Re-run onboarding from template (loses customizations)

> **Template sites (e.g., `jinpanghomes`) must NEVER be deleted.**

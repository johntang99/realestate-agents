# Image Media System Guide (Medical Template)

This guide documents the standardized image handling model used in the medical system, and serves as the baseline for other projects (for example: Epoch Press, future client systems).

## 1) Target Architecture

Use **Supabase Storage** as the single source of truth for media files.

- Bucket (recommended unified name): `media`
  - Current medical project bucket: `chinesemedicine-media`
- DB table: `public.media_assets`
  - Tracks `site_id`, `path`, `url` for each media item
- Content JSON (`content_entries.data`) image fields should store **public URL**, not legacy `/uploads/...` paths

## 2) Why This Model

- Works reliably on Vercel/serverless (no writable local filesystem requirement)
- Avoids broken images from mixed path styles
- Gives clear site isolation in multi-site systems
- Enables library management, delete consistency, and migrations

## 3) Naming and Path Convention

- Bucket object path format: `<siteId>/<folder>/<filename>`
  - Example: `acupuncture-flushing/about/1730000000000-doctor.jpg`
- `media_assets.path` stores relative path under site:
  - Example: `about/1730000000000-doctor.jpg`
- `media_assets.url` stores absolute public URL:
  - Example: `https://<project>.supabase.co/storage/v1/object/public/<bucket>/<siteId>/about/173...jpg`

## 4) Environment Variables

Required (server):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` (recommended unified name: `media`)

Optional public/runtime:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`

Provider search/import:

- `UNSPLASH_ACCESS_KEY`
- `PEXELS_API_KEY`

## 5) Media Sources in Admin

The new ImagePicker supports:

1. **Library**: existing media from storage/DB for selected site
2. **Unsplash**: search provider, then import selected image into your bucket
3. **Pexels**: search provider, then import selected image into your bucket
4. **Upload**: upload local file directly to bucket

Important:

- Even for Unsplash/Pexels selection, we import into your bucket first.
- Content fields receive your own bucket URL, not third-party hotlink URLs.

## 6) Core API Behavior

### Upload

- `POST /api/admin/media/upload`
- Uploads image to bucket path `<siteId>/<folder>/<filename>`
- Upserts row into `media_assets`
- Returns `{ url, path, filename }`

### List

- `GET /api/admin/media/list?siteId=...`
- In bucket mode (`SUPABASE_STORAGE_BUCKET` set), list prioritizes storage/DB media
- Legacy filesystem inclusion is disabled by default in bucket mode

### Delete

- `DELETE /api/admin/media/file?siteId=...&path=...`
- In bucket mode:
  1) delete object from Supabase Storage
  2) delete row from `media_assets`

### Provider Search / Import

- `GET /api/admin/media/provider/search` (Unsplash/Pexels)
- `POST /api/admin/media/provider/import`
  - fetches selected provider image
  - uploads to your bucket
  - upserts `media_assets`
  - returns your bucket URL

## 7) Content URL Normalization Strategy

There are two parts:

1. **Save-time normalization** (ongoing protection)
   - Admin content save normalizes `/uploads/...` to bucket public URL before DB write.

2. **One-time backfill** (migration)
   - Existing `content_entries` legacy image paths are rewritten to public bucket URLs.
   - Revisions are saved into `content_revisions` before update.

## 8) Migration Scripts (Implemented)

### A) Migrate local media files to bucket + media_assets

- Script: `scripts/migrate-media-to-supabase.mjs`
- Command:
  - Dry run:
    - `npm run media:migrate -- --sites dr-huang-clinic,shi-acupuncture,acupuncture-flushing --dry-run`
  - Execute:
    - `npm run media:migrate -- --sites dr-huang-clinic,shi-acupuncture,acupuncture-flushing`

### B) Normalize content image values to bucket URLs

- Script: `scripts/normalize-content-media-urls.mjs`
- Command:
  - Dry run:
    - `npm run content:normalize-media-urls -- --sites dr-huang-clinic,shi-acupuncture,acupuncture-flushing --dry-run`
  - Execute:
    - `npm run content:normalize-media-urls -- --sites dr-huang-clinic,shi-acupuncture,acupuncture-flushing`

## 9) Multi-Site Isolation Rules

Media must remain isolated per `site_id`.

- Storage prefix is site-scoped: `<siteId>/...`
- `media_assets` rows are site-scoped by `site_id`
- Admin list/edit/delete always pass selected `siteId`

This allows one shared codebase with clean tenant separation.

## 10) Validation SQL

Check whether any legacy `/uploads/...` strings remain:

```sql
select site_id, locale, path
from public.content_entries
where site_id in ('dr-huang-clinic', 'shi-acupuncture', 'acupuncture-flushing')
  and data::text like '%"/uploads/%'
order by site_id, locale, path;
```

Check media row counts by site:

```sql
select site_id, count(*) as total
from public.media_assets
group by site_id
order by site_id;
```

## 11) Rollout Template for Other Projects (Epoch Press, etc.)

For each project:

1. Create/confirm bucket (recommended name: `media`)
2. Set env vars in Vercel + local
3. Deploy code with:
   - storage upload/list/delete support
   - provider search/import
   - save-time URL normalization
4. Run media migration script (dry-run, then execute)
5. Run content URL normalization script (dry-run, then execute)
6. Verify in admin:
   - Upload
   - Pick from Library/Unsplash/Pexels
   - Delete
7. Verify frontend pages render with bucket URLs

## 12) Operational Notes

- In production, do not rely on local `/public/uploads` as primary storage.
- Keep provider keys server-side only.
- If you ever need to show filesystem items in bucket mode for debugging:
  - `MEDIA_INCLUDE_FILESYSTEM=true` (temporary only)

---

If this guide is adopted globally, keep the same API contracts and scripts across projects so migrations and operations remain predictable.

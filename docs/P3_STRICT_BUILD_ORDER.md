# P3 Strict Build Order (Quick Wins First)

Scope: remaining P3 items only (MLS/IDX + Schedule Tour flow, CRM sink, 3D walkthroughs).

## Order of execution

### B1 (Quick Win, High Impact): Property conversion completion

- [x] Render `virtualTourUrl` on property detail pages (YouTube/Vimeo/Matterport support).
- [x] Add property-level "Schedule a Showing" request flow (frontend form + API + DB write + audit).
- [x] Add admin visibility block for showing requests in dashboard.

### B2 (Quick Win, Cross-cutting): CRM sink normalization

- [x] Create shared server lead sink helper.
- [x] Route existing lead surfaces through CRM sink:
  - [x] `/api/contact`
  - [x] `/api/valuation`
  - [x] `/api/lead-events`
  - [x] `/api/showing-request`
- [x] Add retry/backoff + dead-letter logging for failed CRM deliveries.

### B3 (Medium): IDX/MLS ingestion foundation

- [x] Add provider-agnostic feed adapter interface (`lib/mls/providers/*`).
- [x] Add ingest endpoint/script to normalize remote feed -> `content_entries` + property collection JSON.
- [x] Add ingest safety checks (dedupe by listing id, status transitions, stale listing archive policy).

### B4 (Medium): Map/search parity with MLS fields

- [x] Expand property schema usage in listing/detail pages for geo + listing metadata parity.
- [x] Add map marker/listing linkage and filter compatibility with incoming MLS fields.

### B5 (Hardening): Production readiness

- [x] Add smoke tests for property detail virtual tour + showing submit + CRM sink event.
- [x] Add env checklist for provider keys and CRM sink endpoints.
- [x] Run browser verification pass and cleanup test artifacts.

## Current sprint focus

Start with B1+B2, then proceed to B3 immediately after verification.

## B3 API (implemented)

`POST /api/admin/mls/ingest`

Payload:

```json
{
  "siteId": "reb-template",
  "locale": "en",
  "provider": "generic-json",
  "archiveMissing": true,
  "records": [
    {
      "listingId": "H6299912",
      "address": "123 Main St",
      "city": "Port Jervis",
      "state": "NY",
      "zip": "10583",
      "price": 1495000,
      "beds": 4,
      "baths": 3,
      "sqft": 3200,
      "status": "active",
      "description": "..."
    }
  ]
}
```

## Post-P3 completion notes (implemented)

- [x] Showing requests admin status update flow verified end-to-end (submit -> list -> status update -> audit).
- [x] Buyer confirmation email enabled for showing requests and localized by request locale (`en`/`zh`).
- [x] Chinese parity improvements shipped for key global assets:
  - [x] `zh` locale availability in admin selector
  - [x] `zh/header.json` + `zh/footer.json` aligned to REB schema and synced to DB
- [x] Buyer page hero controls improved:
  - [x] `photo-background` variant now renders selected hero image
  - [x] `hero.heightVh` supported in runtime and exposed in Form mode
  - [x] hero text alignment moved to middle-below pattern

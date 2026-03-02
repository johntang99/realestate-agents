# P3 Smoke Runbook (Provider-Agnostic)

Use this after P3 implementation batches to validate MLS/showing/CRM plumbing before live provider credentials arrive.

## 1) Environment checklist

Required for baseline checks:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_DEFAULT_SITE_ID` (or `NEXT_PUBLIC_DEFAULT_SITE`)
- `SUPABASE_SERVICE_ROLE_KEY` (for DB-backed behavior)

Optional for CRM sink checks:

- `CRM_SINK_ENABLED=true`
- `CRM_SINK_URL=https://...` (or legacy `LEAD_WEBHOOK_URL`)
- `CRM_SINK_MAX_RETRIES` (optional, default `2`)
- `CRM_SINK_RETRY_BASE_MS` (optional, default `250`)

Optional for email notification checks:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_FALLBACK_TO`

## 2) Start app

```bash
npm run dev
```

Default local URL is `http://localhost:3060`.

## 3) Run non-destructive smoke checks

```bash
npm run qa:p3
```

This validates:

- `/en/properties` renders map panel and map-ready indicator
- Property detail page renders schedule showing UI
- `/api/admin/mls/ingest` is guard-safe (returns auth/input error, not 500)

## 4) Run write-path smoke checks

```bash
npm run qa:p3:writes
```

Adds runtime write checks:

- `POST /api/lead-events`
- `POST /api/showing-request`

## 5) Manual spot checks

- Open `/en/properties`
  - click map marker -> listing card scroll/highlight
  - hover listing card -> marker highlight
- Open one property detail page
  - submit showing form once with disposable email
- In admin audit logs, verify:
  - `lead_event`
  - `lead_capture` for showing request

## 6) Exit criteria

- Smoke scripts pass
- No 500s on MLS ingest endpoint guards
- Map/list linkage works
- Showing request reaches DB + audit logs
- (If CRM sink enabled) outbound sink endpoint receives payloads
- If CRM sink endpoint is unavailable, dead-letter record appears in `admin_audit_logs` with action `crm_sink_dead_letter`

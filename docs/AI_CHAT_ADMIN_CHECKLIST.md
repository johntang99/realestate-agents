# AI Chat Admin Checklist

Use this checklist after every AI chat update.

## 1) Config + Access

- `AI_CHAT_ENABLED=true` is set.
- One provider key exists:
  - `ANTHROPIC_API_KEY` for Sonnet, or
  - `OPENAI_API_KEY` for GPT.
- Optional overrides:
- Required:
  - `AI_CHAT_PROVIDER=anthropic|openai`
  - `AI_CHAT_MODEL=...`
- Optional:
  - `AI_CHAT_MAX_TOKENS=...`
- Admin user role has content write access.

## 2) Runtime Smoke Tests

- Open admin dashboard and confirm `AI Chat` button is visible in top bar.
- Enable `Stream mode`, send a read-only prompt: "list pages".
- Enable `Dry-run preview`, send update prompt: "update about page seo title".
- Confirm preview panel shows proposed tool changes without persisting writes.
- Disable `Dry-run preview`, send same update prompt.
- Verify edit appears in admin content editor.
- Verify no unrelated JSON fields changed.

## 3) Self-Test Endpoint

- Call: `/api/admin/ai-chat/self-test?siteId=<id>&locale=en`
- Require:
  - `path-utils.set/get` pass
  - `list_pages` pass
  - `get_site_settings` pass
  - `list_entities` pass (agents/events/guides)
  - `list_media` pass

## 3.5) Telemetry Report

- Call: `/api/admin/ai-chat/report?siteId=<id>&days=7`
- Review:
  - `topFailurePatterns` for recurring tool/path errors
  - `perTool` failure rates
  - `recentTrace` for prompt -> resolvedPath -> success/failure

## 4) Safety Checks

- Deletion requires explicit confirm in tool arguments.
- Failed tool calls return clear error to chat.
- Audit log receives `ai_chat_turn` entries.
- Stream mode emits status/tool/final events without hanging.

## 5) Performance + Memory

- Keep AI modules split by domain (`providers`, `executors`, `api`, `ui`).
- Avoid large monolithic files and large in-memory payloads.
- Keep self-test read-only (no write-heavy loops).
- Verify `ai_chat_preferences` table exists and memory tools work:
  - `set_preference`
  - `get_preferences`

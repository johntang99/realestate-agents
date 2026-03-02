# Theme Normalization SOP (Daily Use)

> Purpose: keep visual styling centralized, maintainable, and consistent across BAAM builds.
> Scope: `theme.json`, `app/[locale]/layout.tsx`, `styles/globals.css`, page/components.

---

## 1) Core Rule

If a visual value appears more than once (or is likely to evolve), it must be tokenized.

Tokenization pipeline is mandatory:

1. Add token to `theme.json`
2. Map to CSS var in `app/[locale]/layout.tsx`
3. Add fallback/default in `styles/globals.css`
4. Consume via semantic utility class (preferred) or CSS var style

Never do page-level hardcoded visual literals when an equivalent token exists.

---

## 2) Token Layers

Use these layers consistently:

- `colors`, `typography`, `borderRadius` (foundation)
- `opacity`, `effects` (overlays, shadows, dimming)
- `layout` (sticky offsets, hero/detail spacing, rhythm, gaps)
- `components` (buttons, chips, badges, card sizing, repeated patterns)

Naming:

- JSON keys: semantic camelCase (example: `heroContentBottom`)
- CSS vars: prefixed kebab-case (example: `--detail-hero-content-pb`)
- Prefer semantic names over implementation names (`relatedGridLarge` not `gap7`)

---

## 3) Page/Component Rules

- No hardcoded hex colors in page components.
- No raw `rgba(...)` if a tokenized effect exists.
- Replace repeated class bundles with semantic utility classes.
- Prefer:
  - `detail-back-link`
  - `detail-section-title`
  - `detail-card-title`
  - `detail-card-price`
  over repeating long class strings.

---

## 4) Cursor Prompt Snippet (Copy/Paste)

Use this in implementation prompts:

```md
Theme normalization requirements:
- No hardcoded visual literals when tokenizable.
- Add new visual values to theme.json first.
- Map all new tokens into layout.tsx CSS variables with fallbacks.
- Add/update semantic utilities in globals.css (prefer semantic over micro classes).
- Replace repeated page classes with semantic token utilities.
- After edits: run lint and verify no regressions.
```

---

## 5) Fast Migration Workflow

1. Audit target files for hardcoded values (color/opacity/shadow/radius/spacing/gap/rhythm)
2. Cluster repeated values into token candidates
3. Promote candidates into `theme.json`
4. Wire in `layout.tsx`
5. Add/extend semantic utilities in `globals.css`
6. Refactor pages/components to consume utilities
7. Remove now-unused micro classes from `globals.css`
8. Lint + visual check + admin roundtrip check

---

## 6) QA Checklist (Must Pass)

- [ ] No new hardcoded visual literals in updated pages
- [ ] New tokens mapped in `layout.tsx` with safe fallbacks
- [ ] `globals.css` has semantic utility coverage for repeated patterns
- [ ] No redundant micro classes left behind
- [ ] Lint passes
- [ ] Frontend visual parity preserved
- [ ] Admin edits to `theme.json` still safely render (fallbacks intact)

---

## 7) Anti-Drift Policy

Any PR introducing new visual values must do one of:

1. Tokenize in the same PR, or
2. Explicitly mark as intentional one-off with rationale.

Default is tokenize.

---

## 8) Suggested QA Commands

Use project-standard checks after tokenization:

- lint check (recently edited files or full project)
- route smoke check (if available)
- content/theme QA scripts (if available)

If no script exists, at minimum run lint + key page visual verification.


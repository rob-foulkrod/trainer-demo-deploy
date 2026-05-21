# Test plan

## Tiers

| Tier         | Tool                              | Run when                          | Blocks merge?       |
| ------------ | --------------------------------- | --------------------------------- | ------------------- |
| Type-check    | `tsc --noEmit`                    | every push/PR                     | yes                  |
| Schema lint   | `npm run validate:opx`             | every push/PR                     | yes                  |
| Unit         | Vitest                            | every push/PR                     | yes                  |
| Integration  | Playwright (Astro `npm run build` + `npm run preview`) | every PR    | yes                  |
| Link check   | `lychee` or custom grep            | every PR + nightly                | yes (PR), no (cron)  |
| Visual       | Playwright + `toHaveScreenshot()`  | every PR (changed pages only)     | yes                  |
| Lighthouse   | `treosh/lighthouse-ci-action`      | every PR + main                   | warn (PR), yes (main)|

## Required checks

### `validate-opx`

Runs `npm run validate:opx`. Fails on any schema or cross-field
violation (see [`opx-dsl/validation.md`](../opx-dsl/validation.md)).

### `tsc`

`tsc --noEmit -p tsconfig.json`. Strict mode.

### `unit`

Vitest tests under `src/**/*.test.ts`. Required coverage:

- `src/lib/opx.ts` schema and loader.
- `src/lib/markdown.ts` (the inline markdown renderer).
- `src/lib/templates.ts` (sort/filter helpers).
- OPX runtime scheduler (counter ticking, `applyAdvances`, cancel).

### `integration`

Playwright suite that boots `npm run preview` and exercises:

#### Catalog

- Render all templates from `templates.json`.
- Filter by a tag → count of cards updates.
- Filter by an author → count updates.
- Search "azd" → only matching cards remain.
- Open card panel → title matches.
- Click "Copy `azd init`" → clipboard contains the right string.
- Deep link `?id=<template-id>` → that panel is open on load.

#### OPX carousel

- Renders one transcript per `.opx.yaml` in `src/scripts/`.
- After ~25s the active script changes (cross-fade observed via class).
- Pip click activates the target script.
- Reduced-motion media-query disables cross-fade.

#### Pages

- `/` renders without console errors.
- `/gallery` renders without console errors.
- `/byod-azure` and `/byod-copilot-studio` render without console errors.

### `link-check`

`lychee --no-progress --offline dist/` finds broken internal links.
External links (out to GitHub repos, Microsoft Learn) are checked nightly
to avoid PR flakiness.

Also: a custom grep step against `dist/**/*.html`:

```powershell
Get-ChildItem dist -Filter *.html -Recurse | ForEach-Object {
  Select-String -Path $_.FullName -Pattern '(href|src)="/(?!trainer-demo-deploy/)[^"/?#][^"]*' -AllMatches
}
```

If the search returns any matches, fail. This catches unprefixed
absolute paths that would 404 on Pages.

### `visual`

Playwright screenshots for:

- Home (light + dark, mobile + desktop).
- Gallery empty state.
- Gallery with filters applied.
- Card panel open.
- BYOD pages (light + dark).

Diff threshold: 0.1% pixel diff. Baselines stored under
`tests/visual/__snapshots__/`.

### `lighthouse`

Lighthouse CI runs against `npm run preview` for `/`, `/gallery`, and
one BYOD page. Targets:

| Metric           | Threshold (mobile, 4G profile) |
| ---------------- | ------------------------------ |
| Performance      | ≥ 85                            |
| Accessibility    | ≥ 95                            |
| Best practices   | ≥ 90                            |
| SEO              | ≥ 95                            |
| LCP              | ≤ 2.5s                          |
| CLS              | ≤ 0.1                           |
| Total JS         | ≤ 180KB gzipped                 |

PR runs warn on regression; `main` runs fail on regression.

## What we don't test

- Cross-browser visual parity beyond Chromium (Playwright default). Add
  Safari/Firefox runs after v2 launch if budget allows.
- Mobile network throttling beyond Lighthouse's profiles.
- IE11 — not supported.

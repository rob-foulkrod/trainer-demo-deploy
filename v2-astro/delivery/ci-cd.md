# CI / CD

## Workflows in v2

| File                                  | Trigger              | Purpose                                                                  |
| ------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `.github/workflows/deploy.yml`        | `workflow_dispatch`  | Build + deploy to GitHub Pages (replaces today's `test-deploy.yml`)       |
| `.github/workflows/pages-preview.yml` | `pull_request`       | Build + deploy PR previews (rewritten from the existing Docusaurus version) |
| `.github/workflows/validate-opx.yml`  | `push`, `pull_request` | Fast OPX-only validation job                                            |
| `.github/workflows/test.yml`          | `push`, `pull_request` | Unit + integration tests, link-check, accessibility lint                |

## `deploy.yml` outline

```yaml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    # During v2 development this guard prevents accidental cutover.
    # REMOVE THIS LINE in the cutover PR.
    if: github.repository != 'MicrosoftLearning/trainer-demo-deploy'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20         # update at v2 start; pin matching engines
          cache: npm
      - name: Install dependencies
        # Use `npm install` not `npm ci` — see delivery/npm-policy.md
        run: npm install --no-audit --no-fund
      - name: Validate OPX scripts
        run: npm run validate:opx
      - name: Build
        env:
          BASE_PATH: /${{ github.event.repository.name }}/
          SITE_URL:  https://${{ github.repository_owner }}.github.io
        run: npm run build
      - name: Check generated links
        run: npm run check:links     # greps dist/ for unprefixed absolute paths
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    if: github.repository != 'MicrosoftLearning/trainer-demo-deploy'
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Repo guard

While v2 is in development, both `build` and `deploy` jobs in
`deploy.yml` carry:

```yaml
if: github.repository != 'MicrosoftLearning/trainer-demo-deploy'
```

This makes the workflow a no-op on the canonical upstream repo so a
mis-dispatched run can't clobber the live Docusaurus site. Contributors
deploy preview builds from their forks (same workflow file, no edits).

**The cutover PR removes both guards.** It's the only edit to this file
that should be needed at cutover.

## Pages source

GitHub Pages source must be set to **"GitHub Actions"** (not "Branch").
This is a repo setting, not a workflow setting; document it in
[`pages-setup.md`](./pages-setup.md).

## Caching

- `actions/setup-node` with `cache: npm` is enough. We don't need a
  separate `actions/cache` step.
- `cache-dependency-path` not needed unless we switch to a monorepo
  layout with a non-root `package-lock.json`.

## PR previews

`pages-preview.yml` deploys to a preview environment. Two viable shapes:

1. **GitHub Pages PR preview** via `actions/deploy-pages` to a preview
   environment (preferred — matches today's setup).
2. **Cloudflare Pages / Vercel preview** (avoid — adds a vendor and a
   secret).

Use option 1.

## Notifications

- A failed `deploy.yml` posts to the repo's GitHub Discussions
  "Releases" category. (Wire up later if needed.)
- A failed `validate-opx.yml` blocks PR merge via branch protection.

## Future validation jobs (backlog)

Not blocking v2 launch. Each is small, fail-fast, and runs on
`pull_request` to catch data and content drift before merge.

- **`validate:catalog`** — Lint `static/templates.json` against the
  `TagType` union in `src/data/tags.tsx`. Fail on any tag that isn't a
  key in `Tags` (catches casing typos like `AZ-204` vs `az-204`, the
  bug fixed in May 2026). Also flag duplicate tag IDs, missing
  required fields (`title`, `source`, `tags`, `cost`, `deploytime`),
  and tag arrays that don't include at least one ILT-course tag per
  `templates-json.instructions.md`.
- **`validate:opx`** — Zod-based YAML validator for OPX scenarios.
  Already referenced in workflow table; needs the script at
  `site/scripts/validate-opx.mjs`.
- **`check:links`** — Post-build internal-link checker over
  `site/dist/`. Fails on broken `<a href="/...">` and missing image
  paths.
- **`test:unit`** — Vitest suite for `lib/templates.ts`
  (`azdInitCommand`, `filterTemplates`, `tagSection`) and `lib/opx.ts`
  schema.
- **`a11y:lint`** — Axe or `pa11y-ci` smoke run against the six built
  pages on every PR.

When wiring these up, prefer one composite workflow (`test.yml`) that
runs all checks in parallel jobs over many small workflows — keeps the
PR checks list readable.

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

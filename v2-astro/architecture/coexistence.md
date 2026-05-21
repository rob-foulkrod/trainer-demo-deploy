# Coexistence with the current Docusaurus site

## Decision

v2 **replaces** the Docusaurus site at the same URL. There is no
side-by-side period in production. The current Docusaurus build is the
fallback only — see [`rollout/rollback.md`](../rollout/rollback.md).

## Implications

- A single repo, a single default branch, a single GitHub Pages deploy.
  No subpaths like `/v2/` in production.
- The Docusaurus source (`docs/`, `docusaurus.config.js`, `sidebars.js`,
  Docusaurus-specific React components under `src/`) is **removed** in
  the v2 cutover PR. Until cutover, the v2 work lives behind a feature
  branch.
- The catalog's data file (`static/templates.json`) is shared between v1
  and v2 — both read it. Don't rename or restructure it before cutover.
- The existing `test-deploy.yml` workflow is replaced (not co-existing)
  by the new v2 `deploy.yml`. PR previews (`pages-preview.yml`) need to
  be rewritten to build the Astro project.

## Pre-cutover staging

While v2 is in development, the spike demonstrated that personal forks
can host preview builds at `https://<owner>.github.io/<repo>/` without
touching production. Treat that as the staging story:

- Each contributor with push access to a fork can publish via
  `gh workflow run deploy.yml --repo <owner>/<repo>`.
- The workflow has a repo guard that **prevents** it from accidentally
  deploying from `MicrosoftLearning/trainer-demo-deploy` while v2 is
  still in development. The guard is removed (or inverted) on cutover.

See [`delivery/ci-cd.md`](../delivery/ci-cd.md) for the guard pattern.

## Why not run both behind a flag

We considered: keep Docusaurus at `/` and add v2 at `/v2/`, then flip the
default later. Rejected because:

- It doubles the build matrix and CI surface.
- GitHub Pages only deploys one artifact per repo — implementing the
  split would require a third "router" site.
- The v2 surface is small enough (4 main routes + catalog) that a clean
  cutover is lower risk than a long coexistence.

Recorded in [ADR-0001](./adr/0001-use-astro.md) §"Migration shape".

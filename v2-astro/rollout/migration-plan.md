# Migration plan

## Cutover shape

A single PR replaces Docusaurus with Astro at the same URL. There is no
side-by-side period.

## Phases

### Phase 0 — Spec done

- This `spec/v2-astro/` folder reviewed and marked Stable where
  applicable.
- Open questions resolved or formally deferred.

### Phase 1 — v2 implementation behind a guard

- Branch: `v2/astro` (long-lived feature branch).
- New `.github/workflows/deploy.yml` with the
  `if: github.repository != 'MicrosoftLearning/trainer-demo-deploy'`
  guard on both jobs.
- All v2 code under `src/` (the existing Docusaurus `src/` is untouched).
  We accept temporary structural ugliness during the branch's life.
- Contributors deploy preview builds from forks.
- The Docusaurus production site stays the way it is.

### Phase 2 — Catalog port

- Port catalog functionality. Match the spec in
  [`../product/catalog.md`](../product/catalog.md) item-by-item.
- Visual + integration tests for every capability.
- A trainer signs off that they can do their day-job on the v2 catalog
  in a preview build.

### Phase 3 — OPX in place

- OPX schema + runtime + carousel ship in v2.
- At least 3 OPX scripts authored and live in the carousel.
- Visual regression baselines captured.

### Phase 4 — Inbound link audit

- Generate a list of every URL the Docusaurus site currently serves
  (sitemap, link-check on the live site).
- Confirm every URL has either:
  - An identical v2 equivalent, or
  - An HTML redirect in `src/pages/` (Astro outputs static redirects).
- See [Redirect map](#redirect-map) below.

### Phase 5 — Cutover PR

A single PR that:

1. Removes Docusaurus: `docs/`, `docusaurus.config.js`, `sidebars.js`,
   Docusaurus dependencies from `package.json`, Docusaurus-specific
   files under `src/` (gallery components, etc.).
2. Removes `.github/workflows/test-deploy.yml` and the old
   `pages-preview.yml` (replaced by v2 versions).
3. Removes the **repo guard** from `.github/workflows/deploy.yml`
   (the `if: github.repository != …` line).
4. Updates `README.md`, `CONTRIBUTING` notes, and any docs that point
   at Docusaurus paths.

Approval: at least one repo admin + one trainer-team reviewer.

### Phase 6 — Deploy

- Merge cutover PR to `main`.
- Dispatch `deploy.yml` manually.
- Verify <https://microsoftlearning.github.io/trainer-demo-deploy/> shows
  v2.
- Run a 24h watchful period: monitor analytics for unusual drops in
  the `azd init` copy event count or page-view shape.

### Phase 7 — Cleanup

- Delete the `v2/astro` branch.
- Archive the `spike/astro` branch (don't delete — useful reference).
- Update internal links and external announcements.

## Redirect map

Authoritative list of Docusaurus URLs and their v2 destination. Filled
in during Phase 4 audit; here's the initial draft:

| Docusaurus URL                          | v2 destination          | Type     |
| --------------------------------------- | ----------------------- | -------- |
| `/`                                     | `/`                     | identical |
| `/docs/contribute`                      | `/contribute`           | redirect  |
| `/docs/1-faq/1-what-is-azd`             | `/faq/what-is-azd`      | redirect  |
| `/docs/1-faq/2-what-is-an-azd-template` | `/faq/what-is-an-azd-template` | redirect |
| `/docs/1-faq/3-how-to-use-azd-templates`| `/faq/how-to-use-azd-templates`| redirect |
| `/docs/1-faq/4-discover-azd`            | `/faq/discover-azd`     | redirect  |
| `/docs/1-faq/5-create-template`         | `/faq/create-template`  | redirect  |
| `/docs/1-faq/6-contribute-template`     | `/faq/contribute-template` | redirect |
| `/docs/1-faq/7-rate-template`           | `/faq/rate-template`    | redirect  |
| `/docs/1-faq/8-request-a-template`      | `/faq/request-a-template` | redirect |
| `/getting-started`                      | `/getting-started`      | identical |
| (Docusaurus gallery — confirm path)     | `/gallery`              | redirect  |
| `/showcase` (if exists)                 | `/gallery`              | redirect  |

Each `redirect` row ships as a small HTML file at the old path with a
`<meta http-equiv="refresh">` plus a `<link rel="canonical">` to the
new path.

Confirm the actual Docusaurus URLs in Phase 4 by checking the live
sitemap, not by inferring from `docs/` folder structure.

## Communication

Before cutover:

- Post in the Microsoft Learning trainer channels: "we're rebuilding
  the home page and BYOD; catalog functionality stays the same".
- Update `README.md` to mention the v2 work.

At cutover:

- A pinned issue / discussion announcing the change.
- Mention any visual changes that might surprise repeat visitors.

# Performance budgets

## Targets

| Metric                | Budget                      | Notes                                          |
| --------------------- | --------------------------- | ---------------------------------------------- |
| First Contentful Paint | ≤ 1.2s                      | Cold CDN hit, 4G profile                       |
| Largest Contentful Paint | ≤ 2.5s                    | Lighthouse mobile                              |
| Cumulative Layout Shift | ≤ 0.1                       | Lighthouse mobile                              |
| Total Blocking Time    | ≤ 200ms                     | Lighthouse mobile                              |
| JS bundle (initial)    | ≤ 60KB gzipped              | Home page only                                 |
| JS bundle (per page)   | ≤ 180KB gzipped             | All pages, summed across hydrated islands      |
| OPX runtime            | ≤ 25KB gzipped              | Includes step components + tiny highlighter    |
| HTML per page          | ≤ 80KB                      | Pre-compression                                |
| Hero LCP image         | ≤ 80KB AVIF / WebP          | If any; spike has none                         |

## Strategy

- **Static output, no SSR.** Every page is a pre-built HTML file.
- **Islands, not SPA.** Hydrate only what's interactive (OPX, theme
  toggle, catalog filters). The rest is HTML+CSS.
- **No web fonts.** System font stack.
- **No icon font.** Inline SVG.
- **No external script tags** at the document level (analytics goes
  via deferred islands if at all).
- **No external CSS** (Tailwind compiled to one stylesheet per route).
- **Tree-shaken JS.** Avoid pulling in `lodash`, `date-fns`, Fluent
  unless necessary.

## Monitoring

- Lighthouse CI on every PR for `/`, `/gallery`, and one BYOD page.
- Bundle size check via `astro build --analyze` artifact attached to
  PR comments (via a small workflow step).
- Set up `web-vitals` reporting in production (deferred, optional —
  tracks LCP/CLS/INP from real users). Out of scope for v2 launch.

## Catalog page caveat

The catalog hydrates an interactive filter island. With ~hundreds of
templates and Fluent UI dependencies in v1, the bundle could exceed
budget. Mitigations:

- Prefer a vanilla TS island over the React+Fluent port if bundle
  budget is tight.
- Code-split: load the card-panel implementation only on first card
  click.
- Lazy-load template preview images (`loading="lazy"`).

The decision lives in [`open-questions.md`](../open-questions.md) #C-1.

# Browser support

## Tier 1 (must work, tested every PR)

- Chrome (latest stable & latest-1)
- Edge (latest stable)
- Safari (latest stable)
- Firefox (latest stable)

## Tier 2 (best-effort, tested at release)

- Safari iOS (latest)
- Chrome Android (latest)

## Not supported

- Internet Explorer 11
- Pre-Chromium Edge
- Any browser without `prefers-color-scheme`, `prefers-reduced-motion`,
  CSS custom properties, or `<dialog>` (we'll lightly polyfill `<dialog>`
  if needed).

## Mobile

- Tier 1 testing in Playwright includes a mobile viewport profile.
- Touch interactions: card hover effects are pointer-only via
  `@media (hover: hover)`.
- Layout: the catalog grid collapses to one column < 768px; the
  OPX panel and feature cards stack on `< md` breakpoints.

## What we explicitly check

- Site loads with JS disabled (Tier 1 only): home + gallery render
  static content. Filters/search don't work; that's fine. Catalog
  cards still link to source.
- Site loads under "reduce motion" preference (see
  [`accessibility.md`](./accessibility.md)).
- Site loads in print preview without disaster (acceptable degradation).

# ADR-0001: Use Astro for v2

- **Status:** Accepted
- **Date:** v2 kickoff
- **Supersedes:** —
- **Superseded by:** —

## Context

The current site is built with Docusaurus. Docusaurus is excellent at
versioned documentation; the v2 surface is primarily marketing landing
pages, a scripted-demo hero (OPX), and a single React-heavy catalog.
Docusaurus' opinions about routing, theme, and React-tree composition
make the hero and BYOD landing pages awkward.

The `spike/astro` spike validated:

- Static-output Astro with islands gives clean isolation for the OPX
  runtime (heavy DOM + timers) without polluting other pages.
- Tailwind v4 integrates cleanly via `@tailwindcss/vite`.
- Existing `static/templates.json` can be loaded directly by Astro pages
  with no shape change.

## Decision

v2 is an Astro 5 static site. No SSR adapter. No SPA framework
dependency. Islands are written in vanilla TS or `.astro` components
unless a React island is unavoidable (e.g. the catalog filter UI port).

## Migration shape

A single cutover PR removes Docusaurus and ships Astro at the same URL.
No `/v2/` coexistence period. Justification: small surface area + Pages'
single-artifact model + Docusaurus removal is mechanically simple once
the catalog component is ported.

## Consequences

- Lose Docusaurus' built-in docs surface (sidebars, versioning, search
  plugin). Acceptable — we are not a docs site.
- Gain per-page bundle isolation (Astro islands).
- Catalog filter UI must be ported to either an Astro+vanilla island or
  a small React-on-Astro island. Either way, the data shape stays.
- Existing `.md` content under `docs/` either ports to `src/pages/**.md`
  (Astro renders Markdown natively) or is dropped if no longer relevant.

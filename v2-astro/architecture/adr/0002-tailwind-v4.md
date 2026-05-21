# ADR-0002: Tailwind CSS v4

- **Status:** Accepted
- **Date:** v2 kickoff

## Context

The spike used Tailwind v4 with `@tailwindcss/vite` and the new
`@custom-variant dark` syntax. It worked cleanly.

## Decision

Tailwind v4, configured via Vite plugin (not the legacy CLI/PostCSS
plugin). Dark mode via `@custom-variant dark (&:where(.dark, .dark *));`
plus a JS toggle that adds/removes `.dark` on `<html>`.

## Why not Tailwind v3

- v4 has first-class CSS-driven config (no `tailwind.config.js` for
  basics), faster builds, and the variant syntax we want.
- The spike already proves v4 is stable enough for this use case.

## Why not a CSS framework / vanilla CSS

- Catalog + landing pages benefit from a utility system; we'd reinvent
  one otherwise.
- The team is already used to Tailwind from the spike.

## Consequences

- No `tailwind.config.js` to hold custom tokens; brand colors are CSS
  custom properties in `src/styles/globals.css`.
- Tailwind v4 ships a Lightning CSS-based pipeline → see
  [`delivery/npm-policy.md`](../../delivery/npm-policy.md) for the
  platform-specific binary footgun this introduces in CI.

# Visual design

> Visual references (advisory, not normative) live in
> [`../reference/`](../reference/). The prose here is authoritative.

## Brand tokens

Use Microsoft's brand palette where it serves us, with two violet
accents borrowed from Copilot brand:

| Token                 | Hex       | Usage                                         |
| --------------------- | --------- | --------------------------------------------- |
| `--brand-violet`      | `#8661C5` | Primary CTA, links, hero gradient anchor       |
| `--brand-magenta`     | `#C03BC4` | Secondary accent, hover, hero gradient anchor  |
| `--brand-violet-tint` | `#C5B4E3` | Dark-mode hover/link color                     |
| `--azure-blue`        | `#0078D4` | "BYOD — Azure" accents                         |
| `--azure-teal`        | `#49C5B1` | "BYOD — Azure" gradient companion              |
| `--neutral-50…900`    | …         | Tailwind defaults                              |

Tokens live in `src/styles/globals.css` as CSS custom properties. Tailwind
classes reference them via arbitrary value syntax (`bg-[#8661C5]` for
quick use, or define utility classes once the palette stabilizes).

## Typography

- System font stack via Tailwind's default `font-sans`. No custom web
  fonts. (FCP budget is tight.)
- Type scale: `text-sm` (14) / `base` (16) / `xl` (20) / `3xl` (30) /
  `5xl` (48). Headlines `font-bold tracking-tight`.

## Motion

- Default transition: `transition-colors duration-150 ease-out`.
- Card hover lift: `hover:-translate-y-1 hover:shadow-xl` over 200ms.
- OPX runtime motion is driven by `timing.appearAfter / holdFor` in the
  YAML scripts; the runtime applies a single 250ms opacity-translate
  fade per beat.
- Respect `prefers-reduced-motion`: OPX runtime pauses, hero gradient
  freezes, card hover lifts disabled.

## Spacing & layout

- Container: `max-w-7xl mx-auto px-6`.
- Vertical rhythm: `py-16 md:py-24` for full sections; `py-10` for
  footers.
- Grid: prefer CSS grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) over
  flex for card grids.

## Dark mode

- `.dark` class on `<html>`, set by a tiny inline script in `Base.astro`
  before paint to avoid flash.
- Theme toggle button in header writes `localStorage.theme` and the
  class.
- Tailwind v4 variant: `@custom-variant dark (&:where(.dark, .dark *));`
- Every brand utility class needs a `dark:` counterpart. Test in both
  modes.

## Iconography

- SVG inline (no icon font, no external sprite). Stroke-based icons
  match the existing aesthetic.
- For the catalog's tag icons (Azure resource icons), reuse today's
  `static/img/tags/*.svg` paths — `tags.ts` already references them.

## Accessibility hooks (visual)

- Focus rings: never remove. `focus-visible:ring-2 focus-visible:ring-[#8661C5]`.
- Color contrast: WCAG AA on body text in both modes (≥4.5:1).
- Don't rely on color alone for status (OPX status pill uses dot + text).

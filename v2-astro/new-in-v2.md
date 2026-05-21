# New in v2

Decisions and definitions for things that genuinely have no equivalent
in the current Docusaurus codebase. If it's not listed here and not in
[`sources-of-truth.md`](./sources-of-truth.md), it's probably implicit
and should be added to one or the other.

## 1. Tailwind v4 `@theme` block

The current site uses Infima + custom CSS variables in
[`src/css/custom.css`](../src/css/custom.css). v2 maps those
variables forward into a Tailwind v4 `@theme` so utilities like
`bg-brand-violet` work.

Target shape for `src/styles/globals.css` (or equivalent):

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Microsoft brand accents — preserve hexes from src/css/custom.css */
  --color-brand-violet:        #8661C5;
  --color-brand-magenta:       #C03BC4;
  --color-brand-violet-tint:   #C5B4E3;
  --color-brand-teal-expanded: #389A91;
  --color-brand-teal:          #49C5B1;
  --color-brand-blue:          #0078D4;
  --color-brand-ink:           #242424;

  /* Type scale, spacing, radii — defaults from Tailwind are fine.
     Override only if v2 needs to diverge from Tailwind defaults. */

  /* Hero gradient as a custom property (used in CSS, not as a utility) */
  --gradient-hero: linear-gradient(90deg, #8661C5 0%, #C03BC4 100%);
  --gradient-cool: linear-gradient(135deg, #0078D4 0%, #389A91 100%);
  --gradient-warm: linear-gradient(135deg, #8661C5 0%, #0078D4 100%);
}

/* Dark-mode overrides */
.dark {
  --color-brand-violet: #C5B4E3; /* preserves the dark-mode swap from custom.css */
}
```

**Discrepancies with current `custom.css`** require an ADR. The
intent is *map forward, don't redesign*.

## 2. OPX runtime constants

The spike runtime ships these constants implicitly. Pin them in v2:

| Constant            | Value     | Used by                                       |
| ------------------- | --------- | --------------------------------------------- |
| `TYPING_CHARS_PER_SEC` | 22       | User-step composer animation                  |
| `CURSOR_BLINK_MS`    | 700       | Composer cursor                                |
| `COUNTER_TICK_MS`    | 60        | Per-tick advance interval for `meta` counters |
| `CROSSFADE_MS`       | 600       | Carousel cross-fade between scripts           |
| `PIP_DEBOUNCE_MS`    | 150       | Pip-click rate limiter                         |
| `MIN_HOLD_MS`        | 800       | Minimum `timing.holdFor` for any step          |

Lives in `src/components/orchestrator-preview/runtime.ts` as
`const`s. Treat as part of the runtime contract; changes require a
visual regression review.

## 3. OPX inline-markdown subset

The `markdown.ts` renderer supports exactly these features in step
`body:` fields and similar string slots. Anything else renders as
literal text.

| Syntax                     | Example                          | Output                              |
| -------------------------- | -------------------------------- | ----------------------------------- |
| Inline code                | `` `azd init` ``                  | `<code>azd init</code>`             |
| Bold                       | `**bold**`                        | `<strong>bold</strong>`             |
| Italic                     | `*italic*`                        | `<em>italic</em>`                   |
| Inline link                 | `[label](https://example.com)`    | `<a href="...">label</a>`           |
| Mention                     | `@workspace` `@terminal`          | `<span class="mention">@workspace</span>` |
| Line break (explicit)       | `  \n` (two spaces + newline)     | `<br>`                              |

Block-level features (headings, lists, code fences, blockquotes) are
**not** supported in inline slots. Code fences live in the
`code:` step kind, not in `body:`.

Implementation note: keep `markdown.ts` ≤ 2KB minified. Don't pull in
`marked` or `markdown-it`.

## 4. Code highlighter

The `code:` block in OPX yaml uses:

- **Library:** none. v2 ships a small custom highlighter that
  handles **only** the languages used in current scripts:
  `bash`, `powershell`, `typescript`, `javascript`, `yaml`,
  `bicep`, `csharp`. Each language is a ~30-line regex map.
- **Output:** `<pre class="opx-code language-<lang>"><code>...</code></pre>`
  with `<span class="opx-tok-<kind>">` tokens for `keyword`, `string`,
  `comment`, `number`, `punctuation`.
- **Styling:** Tailwind classes on `.opx-tok-*` in `globals.css`.

**Why not Shiki/Prism:**
- Shiki: 1MB+ of grammar JSON; not justifiable for ≤5 languages in OPX scripts.
- Prism: smaller but still 30-50KB per language, and we'd need a
  build step to subset.
- Custom: 5-10KB total, no build step, fits the bundle budget in
  [`quality/performance-budgets.md`](./quality/performance-budgets.md).

If the language set grows past ~10, revisit. Track in
[`open-questions.md`](./open-questions.md) — promote to an open
question if needed.

## 5. Target `package.json` scripts

v2 replaces the current Docusaurus scripts. Target shape:

```json
{
  "scripts": {
    "dev": "astro dev --port 4321",
    "build": "astro build",
    "preview": "astro preview --port 4321",
    "check": "astro check",
    "validate:opx": "node ./scripts/validate-opx.mjs",
    "check:links": "node ./scripts/check-links.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write ."
  }
}
```

Deleted scripts (Docusaurus-era): `start`, `swizzle`, `deploy`,
`clear`, `serve`, `write-translations`, `write-heading-ids`.

## 6. `Base.astro` layout shape

v2's single base layout replaces all of `src/theme/*`. Shape:

```astro
---
// src/layouts/Base.astro
import "../styles/globals.css";
import Header from "../components/shared/Header.astro";
import Footer from "../components/shared/Footer.astro";

interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
const siteTitle = "Microsoft Trainer Demo Deploy";
const fullTitle = title === siteTitle ? title : `${title} · ${siteTitle}`;
---
<!doctype html>
<html lang="en" class="">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" href={`${import.meta.env.BASE_URL}img/favicon.ico`} />
    <!-- Theme application before paint (no FOUC) -->
    <script is:inline>
      (function () {
        try {
          const stored = localStorage.getItem("theme");
          const dark = stored
            ? stored === "dark"
            : window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (dark) document.documentElement.classList.add("dark");
        } catch (e) {}
      })();
    </script>
    <!-- Analytics scripts (port from docusaurus.config.js `scripts`) -->
    <script async src="https://js.monitor.azure.com/scripts/c/ms.analytics-web-4.min.js"></script>
    <script async src="https://wcpstatic.microsoft.com/mscc/lib/v2/wcp-consent.js"></script>
  </head>
  <body class="min-h-screen bg-white text-[#242424] dark:bg-neutral-950 dark:text-neutral-100">
    <Header />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

The inline theme script runs before paint to avoid flash. The
analytics script tags port forward from the current
`docusaurus.config.js` `scripts` array verbatim.

## 7. Build environment variables

| Env var       | Purpose                                  | Default (unset)            |
| ------------- | ---------------------------------------- | -------------------------- |
| `BASE_PATH`   | Astro `base` config                      | `/`                        |
| `SITE_URL`    | Astro `site` config (for canonical URLs) | unset (no canonical URLs)  |
| `DEPLOY_ENV`  | "production" toggles real analytics      | unset (analytics inert)    |

These are set by `.github/workflows/deploy.yml`. Locally they're
unset; `npm run dev` is dev mode.

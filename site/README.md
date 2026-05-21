# Site (v2 — Astro)

This folder is the v2 implementation of
<https://microsoftlearning.github.io/trainer-demo-deploy/>, built per the
specification in [`../v2-astro/`](../v2-astro/).

It lives in parallel to the legacy Docusaurus tree (repo root + `src/`)
during Phase 1. At cutover, Docusaurus is removed and this folder either
becomes the repo root or its contents move up one level.

## Quick start

```powershell
cd site
npm install
npm run dev
```

The dev server runs on <http://localhost:4321>. The shared assets
(`static/templates.json`, `static/img/`, `static/templates/images/`,
`static/arch/`) are served as if they sat at the public root.

## Useful scripts

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Astro dev server with HMR                                 |
| `npm run build`        | Static build to `site/dist/`                              |
| `npm run preview`      | Serve the built `dist/` locally                           |
| `npm run validate:opx` | Validate every `*.opx.yaml` script                        |
| `npm run check:links`  | Grep built HTML for unprefixed absolute paths             |
| `npm run test`         | Run Vitest unit tests                                     |
| `npm run check`        | Run `astro check` (TS + Astro diagnostics)                |

## Prod-like local preview (with the production base path)

```powershell
$env:BASE_PATH = "/trainer-demo-deploy/"
$env:SITE_URL  = "https://microsoftlearning.github.io"
npm run build
npm run preview
Remove-Item Env:BASE_PATH
Remove-Item Env:SITE_URL
```

## Layout

```
site/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── scripts/
│   ├── validate-opx.mjs
│   └── check-links.mjs
└── src/
    ├── components/
    │   ├── catalog/                 # Card grid, panel, filters, search
    │   ├── orchestrator-preview/    # OPX runtime + step components + carousel
    │   └── shared/                  # Header, Footer, ThemeToggle, FeatureCard
    ├── data/
    │   └── tags.ts                  # TagType + Tag metadata
    ├── layouts/
    │   └── Base.astro
    ├── lib/
    │   ├── markdown.ts              # Tiny inline-only markdown renderer
    │   ├── opx.ts                   # Zod schema + script loader
    │   ├── opx-yaml.ts              # Vite glob loader for *.opx.yaml
    │   ├── templates.ts             # Catalog data: templates + author helpers
    │   └── url.ts                   # `withBase(path)` helper
    ├── pages/
    │   ├── index.astro
    │   ├── gallery.astro
    │   ├── byod-azure.astro
    │   ├── byod-copilot-studio.astro
    │   ├── contribute.md
    │   ├── faq/
    │   └── getting-started.md
    ├── scripts/                     # *.opx.yaml carousel scripts
    └── styles/
        └── globals.css              # Tailwind v4 entry + @theme tokens
```

See the spec under [`../v2-astro/`](../v2-astro/) for normative
behavior. Things to be aware of:

- **Never** hard-code absolute paths starting with `/`. Use
  `withBase(path)` from `src/lib/url.ts` or `import.meta.env.BASE_URL`.
- **OPX counter math is enforced.** `sum(advances.*) === meta.*`.
  Validation fails CI.
- **Use `npm install`, not `npm ci`.** See
  [`../v2-astro/delivery/npm-policy.md`](../v2-astro/delivery/npm-policy.md).

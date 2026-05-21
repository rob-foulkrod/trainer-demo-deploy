# Stack

## Choices

| Concern                  | Choice                              | ADR                                                                       |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------- |
| Framework                | Astro 5 (static output)             | [ADR-0001](./adr/0001-use-astro.md)                                       |
| Styling                  | Tailwind CSS v4 (`@custom-variant`) | [ADR-0002](./adr/0002-tailwind-v4.md)                                     |
| Interactivity            | Astro islands + vanilla TS          | (no SPA framework dependency)                                             |
| Demo scripting           | OPX YAML DSL (in-repo)              | [ADR-0003](./adr/0003-opx-dsl-vs-jsx.md)                                  |
| Build/Pages base path    | `/${repo-name}/`, derived in CI     | [ADR-0004](./adr/0004-base-path-from-repo-name.md)                        |
| Schema validation        | Zod                                 | Same library as the spike — already proven                                |
| Deploy target            | GitHub Pages (Actions source)       | Same as today                                                             |
| CI install command       | `npm install --no-audit --no-fund`  | [`delivery/npm-policy.md`](../delivery/npm-policy.md)                      |
| Node version             | LTS — current major at start of v2  | Pin in `actions/setup-node` + `engines` in `package.json`                 |
| Package manager          | npm                                 | Match the existing repo. No pnpm/yarn migration in v2.                    |
| Search (catalog filter)  | Client-side (current behavior)      | Server-side search is out of scope                                        |

## Repo layout (target)

```
trainer-demo-deploy/
├── .github/workflows/
│   ├── deploy.yml                ← v2 Pages deploy (replaces test-deploy.yml)
│   └── pages-preview.yml         ← PR previews (kept or rewritten)
├── public/                       ← static assets passed straight through
├── src/
│   ├── components/
│   │   ├── orchestrator-preview/  ← OPX runtime (see components/transcript-player.md)
│   │   ├── catalog/               ← gallery / card / panel / filters
│   │   └── shared/                ← header, footer, theme toggle
│   ├── data/
│   │   └── tags.ts                ← TagType + Tag metadata (ported from src/data/tags.tsx)
│   ├── layouts/
│   │   └── Base.astro
│   ├── lib/
│   │   ├── opx.ts                 ← schema + loader for OPX scripts
│   │   ├── markdown.ts            ← tiny inline-only markdown renderer for OPX bodies
│   │   └── templates.ts           ← reads static/templates.json, sort + filter helpers
│   ├── pages/
│   │   ├── index.astro            ← home (OPX hero + feature cards)
│   │   ├── gallery.astro          ← catalog
│   │   ├── byod-azure.astro
│   │   ├── byod-copilot-studio.astro
│   │   └── …redirects             ← see rollout/migration-plan.md
│   ├── scripts/
│   │   ├── *.opx.yaml             ← OPX scripts (one per scenario)
│   │   └── README.md              ← copy of opx-dsl/schema.md (or a link to it)
│   └── styles/
│       └── globals.css            ← Tailwind v4 entry, brand tokens
├── static/
│   ├── templates.json             ← unchanged (sole source for catalog data)
│   └── img/                       ← unchanged
├── spec/v2-astro/                 ← this folder
└── package.json
```

## Why not keep Docusaurus

- Docusaurus excels at versioned docs. The v2 site is primarily marketing
  + catalog + scripted demos — not docs.
- The hero needs Astro-islands-style isolation, not React-trees.
- Tailwind v4 plus the OPX runtime is friction-heavy under Docusaurus'
  CSS pipeline.

The minimum docs we *do* still need (contribute, FAQ) can be authored as
MDX pages in Astro, or kept in the repo as plain Markdown linked from the
nav. See [`product/information-architecture.md`](../product/information-architecture.md).

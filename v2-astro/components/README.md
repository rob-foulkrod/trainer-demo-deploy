# Components

This folder describes the non-OPX components that ship in v2. The OPX
component is specified separately under [`../opx-dsl/`](../opx-dsl/).

## Inventory

| Component                | File                                            | Purpose                                     |
| ------------------------ | ----------------------------------------------- | ------------------------------------------- |
| Header / nav             | `src/components/shared/Header.astro`             | Sticky top bar, theme toggle, nav links     |
| Footer                   | `src/components/shared/Footer.astro`             | Resources + legal + brand                   |
| Theme toggle             | `src/components/shared/ThemeToggle.astro`        | Light/dark, persists to localStorage        |
| Base layout              | `src/layouts/Base.astro`                          | Wraps every page with header + footer       |
| Hero CTA                 | inline in `pages/index.astro`                    | Headline + buttons                           |
| Feature cards            | `src/components/shared/FeatureCard.astro`         | The three home-page cards                   |
| Catalog grid             | `src/components/catalog/Grid.astro`               | The card grid on `/gallery`                 |
| Catalog card             | `src/components/catalog/Card.astro`               | One template card                           |
| Catalog filters          | `src/components/catalog/Filters.astro`            | Left rail: tag + author filters             |
| Catalog search           | `src/components/catalog/Search.astro`             | Search input                                |
| Card panel               | `src/components/catalog/CardPanel.astro`          | Side sheet with template detail             |

## Contracts

### `Header.astro`

Props: none. Reads `import.meta.env.BASE_URL` for link prefixes. Renders
the nav from a hard-coded list (no config file). The theme toggle is a
child island.

### `Footer.astro`

Props:
- `version?: string` — optional build version tag, shown in fine print.

Renders three columns from a hard-coded list. Add new resource links by
editing the component, not via config.

### `ThemeToggle.astro`

Vanilla TS island. On mount:
1. Reads `localStorage.theme` (`'light' | 'dark' | undefined`).
2. If undefined, reads `prefers-color-scheme` and stores the result.
3. Applies `.dark` to `<html>` if dark.
4. Wires the button to toggle and persist.

Must run **before paint** to avoid flash. Implement as an inline
`<script>` in `Base.astro` for the initial class application, plus a
deferred island for the button.

### `Catalog components`

See [`product/catalog.md`](../product/catalog.md) for the data shape and
required capabilities. The components here are an implementation of
that spec.

The catalog island choice (vanilla TS vs React with Fluent) is deferred
to [`open-questions.md`](../open-questions.md) #C-1.

## Naming conventions

- `*.astro` — server-rendered components.
- `*.client.ts` — vanilla TS islands.
- `*.tsx` — React islands (only when porting Fluent components).
- One folder per "feature area" (`shared/`, `catalog/`,
  `orchestrator-preview/`).

## Out of scope here

- The OPX runtime and carousel — see [`../opx-dsl/runtime.md`](../opx-dsl/runtime.md)
  and [`../opx-dsl/carousel.md`](../opx-dsl/carousel.md).
- Page-level layouts — see [`../product/information-architecture.md`](../product/information-architecture.md).

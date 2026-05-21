# Overview

## Problem

The current production site at
<https://microsoftlearning.github.io/trainer-demo-deploy/> is built on
Docusaurus. It works, but:

- The hero is static text. There's no way to *show* what the orchestrator
  agent actually does for a trainer.
- Adding marketing/landing surfaces (BYOD walkthroughs, demos of the
  agentic flow) means fighting Docusaurus' content model.
- The gallery (the only piece trainers actually depend on) is a single
  React island in an otherwise documentation-shaped site.

The `spike/astro` spike demonstrated a cleaner separation: an Astro site
optimized for landing/marketing surfaces with a powerful scripted-demo
component (OPX), with the gallery as one route among many.

## Goals (v2)

1. **Replace** the Docusaurus build with an Astro build at the **same
   public URL**.
2. **Preserve the catalog** (gallery) — same template data, same filter
   model, same trainer flows.
3. **Ship the OPX-driven hero** — the looping, scripted "Copilot building
   a demo" carousel from the spike, as a first-class component.
4. **Add the BYOD landing pages** (Azure, Copilot Studio) as standalone
   routes.
5. **Keep authoring painless.** Templates remain in `static/templates.json`;
   OPX scripts live next to the component and are auto-discovered.

## Non-goals (v2)

- A documentation system. v2 does not need to host long-form docs
  (FAQ, contribution guide, etc.). Those can stay where they are or be
  ported in v2.1.
- A CMS. Content stays in the repo as JSON/YAML/MDX.
- An SPA. v2 is static-output Astro; islands are isolated.
- A redesign of the catalog's information architecture. v2 ports the
  current behavior. UX redesigns are v2.x.

## Success criteria

| # | Criterion                                                                 | How we verify                  |
| - | ------------------------------------------------------------------------- | ------------------------------ |
| 1 | Site URL unchanged                                                        | DNS / Pages settings unchanged |
| 2 | `templates.json` → gallery is fully functional (search, filters, panel)    | Manual + automated checks      |
| 3 | All inbound deep links to `/showcase`-style routes resolve (or 301)       | Link-check CI job              |
| 4 | OPX hero loops cleanly through ≥3 scripts, counters match meta             | Visual regression + manual     |
| 5 | First contentful paint ≤ 1.2s on a cold CDN hit (4G profile)              | Lighthouse CI                  |
| 6 | Lighthouse a11y ≥ 95 on home, gallery, BYOD pages                          | Lighthouse CI                  |
| 7 | A trainer can land on `/`, click into a template, copy `azd init`, leave   | Manual scripted run            |

## Out-of-scope rollback story

If v2 misses a success criterion we cannot fix in-flight, the rollback is
the last green Docusaurus deployment, redeployed via the existing
`test-deploy.yml` workflow. See [`rollout/rollback.md`](./rollout/rollback.md).

## Glossary

- **OPX** — Orchestrator Preview eXperience. The scripted Copilot-chat
  panel + its YAML DSL. See [`opx-dsl/`](./opx-dsl/).
- **Catalog / Gallery** — the searchable list of `azd`-deployable demo
  templates currently driven by `static/templates.json`.
- **BYOD** — Bring Your Own Demo. The two landing pages explaining the
  agentic demo builders for Azure and Copilot Studio.
- **Carousel** — the hero rotation through multiple OPX scripts.
- **Marquee mode / Player mode** — two runtime modes of the OPX component.
  See [`opx-dsl/schema.md`](./opx-dsl/schema.md#mode).

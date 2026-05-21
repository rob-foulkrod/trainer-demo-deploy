# Information Architecture

## Routes (v2)

| Path                        | Page                          | Purpose                                                          |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `/`                         | `src/pages/index.astro`        | Home — OPX hero carousel, feature cards, value prop              |
| `/gallery`                  | `src/pages/gallery.astro`      | Catalog of `azd` templates (the must-preserve surface)           |
| `/byod-azure`               | `src/pages/byod-azure.astro`   | Bring Your Own Demo — Azure agentic builder                      |
| `/byod-copilot-studio`      | `src/pages/byod-copilot-studio.astro` | Bring Your Own Demo — Copilot Studio agentic builder      |
| `/contribute`               | `src/pages/contribute.md`      | Contribution guide (ported from `docs/contribute.md`)             |
| `/faq`                      | `src/pages/faq/*.md`           | FAQ pages (ported from `docs/1-faq/`)                            |
| `/getting-started`          | `src/pages/getting-started.md` | Trainer onboarding                                                |

## Nav (header)

- Logo + "Trainer Demo Deploy" → `/`
- "Catalog" → `/gallery`
- "BYOD · Azure" → `/byod-azure`
- "BYOD · Copilot Studio" → `/byod-copilot-studio`
- Theme toggle (right-aligned)

The spike's nav already matches this. Don't add docs/FAQ to the header
nav by default — link them from the footer.

## Footer

- Column 1: tagline + brand mark
- Column 2: Resources (Contribute, FAQ, GitHub)
- Column 3: Microsoft Learn links
- Bottom row: copyright + privacy + cookie management + "Built with Astro"

## Inbound link compatibility (Docusaurus → v2)

| Old Docusaurus route               | v2 equivalent                       | Strategy                |
| ---------------------------------- | ----------------------------------- | ----------------------- |
| `/`                                | `/`                                 | Same                    |
| `/docs/contribute`                 | `/contribute`                       | HTML redirect           |
| `/docs/1-faq/*`                    | `/faq/*`                            | HTML redirect           |
| `/getting-started`                 | `/getting-started`                  | Same                    |
| (Docusaurus-generated gallery URL) | `/gallery`                          | HTML redirect           |

Authoritative map lives in [`rollout/migration-plan.md`](../rollout/migration-plan.md).
The cutover PR ships a static redirect HTML for every old URL that
doesn't have an identical v2 counterpart.

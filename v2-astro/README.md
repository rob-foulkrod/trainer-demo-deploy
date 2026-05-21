# Trainer Demo Deploy v2 (Astro) — Specification

This folder is the **canonical specification** for replacing the current
Docusaurus implementation of <https://microsoftlearning.github.io/trainer-demo-deploy/>
with an Astro + Tailwind v4 site, while preserving the catalog (gallery)
functionality that the community depends on.

The reference prototype is the `spike/astro` branch (folder `spike-astro/`).
It is a successful spike — **do not port its code verbatim**. Re-derive from
this spec; if something can't be re-derived from the spec, the spec is
incomplete and should be amended first.

## Hard constraints (do not negotiate without an ADR)

1. **Endpoint is preserved:** the site continues to live at
   <https://microsoftlearning.github.io/trainer-demo-deploy/>. No domain
   change, no path change, no broken inbound links.
2. **Catalog functionality is preserved.** Every capability of the current
   gallery (search, tag filters, author filter, card panel, prereqs,
   demo-guide modal, `azd init` copy, share link, favorites/stars) must be
   matched or explicitly retired with an ADR. See [`product/catalog.md`](./product/catalog.md).
3. **CI uses `npm install`, not `npm ci`.** Multi-platform development
   (Windows authors, Linux CI) means committed lockfiles drift on platform-
   specific optional deps. See [`delivery/npm-policy.md`](./delivery/npm-policy.md).
4. **The OPX component is a first-class deliverable.** Its YAML DSL,
   runtime, and authoring story are specified in full under
   [`opx-dsl/`](./opx-dsl/) and must ship in v2.

## Index

- [`overview.md`](./overview.md) — problem, goals, non-goals, success criteria
- [`architecture/`](./architecture/) — stack, routing, coexistence, ADRs
- [`product/`](./product/) — information architecture, catalog spec, visual design
- [`components/`](./components/) — Transcript player, Orchestrator carousel, shared UI
- [`opx-dsl/`](./opx-dsl/) — the OPX YAML DSL, runtime contracts, authoring guide
- [`delivery/`](./delivery/) — CI/CD, npm policy, Pages setup, environments
- [`quality/`](./quality/) — test plan, accessibility, performance budgets, browsers
- [`operations/`](./operations/) — content workflow, ownership, observability
- [`rollout/`](./rollout/) — migration plan, risks, rollback
- [`open-questions.md`](./open-questions.md) — deferred decisions with owners
- [`sources-of-truth.md`](./sources-of-truth.md) — which existing files govern which surfaces
- [`new-in-v2.md`](./new-in-v2.md) — the 7 decisions that have no equivalent in the current codebase
- [`reference/`](./reference/) — advisory screenshots from the `spike/astro` branch

## Status

| Section          | Status     | Owner |
| ---------------- | ---------- | ----- |
| Overview         | Draft      | —     |
| Architecture     | Draft      | —     |
| Product          | Draft      | —     |
| Components       | Draft      | —     |
| OPX DSL          | **Stable** | —     |
| Delivery         | Draft      | —     |
| Quality          | Draft      | —     |
| Operations       | Draft      | —     |
| Rollout          | Draft      | —     |
| Sources of truth | Draft      | —     |
| New in v2        | Draft      | —     |

Mark a section **Stable** only after at least one reviewer outside the
original author has signed off in PR.

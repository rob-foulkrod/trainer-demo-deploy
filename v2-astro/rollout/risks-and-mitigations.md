# Risks & mitigations

| Risk                                                                    | Likelihood | Impact | Mitigation                                                                                                            |
| ----------------------------------------------------------------------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| Catalog feature regression (a capability quietly drops in the port)     | Medium     | High   | The catalog spec ([`../product/catalog.md`](../product/catalog.md)) is an explicit checklist; a trainer signs off in Phase 2. |
| Inbound link breakage from Docusaurus URLs                               | Medium     | Medium | Redirect map ([`migration-plan.md`](./migration-plan.md#redirect-map)) generated from live sitemap, not from `docs/`. |
| Analytics event for `azd init` copy changes shape and dashboards break  | Low        | High   | Event name + properties pinned in spec ([`../product/catalog.md`](../product/catalog.md) §Analytics). Pre-cutover test verifies the event fires identically. |
| Cross-platform lockfile issue surfaces in production deploy             | Already mitigated | — | `npm install` in CI, documented in [`../delivery/npm-policy.md`](../delivery/npm-policy.md). |
| Repo guard accidentally left in place after cutover                      | Low        | High   | Cutover PR explicitly checks for the `if: github.repository != …` line and the reviewer confirms its removal.       |
| OPX runtime regresses (e.g. counters mismatch, animation stutters)      | Medium     | Medium | Visual + counter regression test using a fixed `one-of-each.opx.yaml` fixture. CI fails on any visual diff > 0.1%.     |
| Tailwind v4 breaks on a future major bump                                | Medium     | Medium | Pin a `^4.x` range, not `*`. Test major bumps in a preview branch before merge.                                       |
| Astro breaks on a future major bump                                      | Medium     | Medium | Same — pin minor, test major bumps separately.                                                                        |
| Pages deploy succeeds but the URL serves an empty/old artifact          | Low        | High   | Smoke test as the last step of `deploy.yml`: curl the live URL and grep for a known v2-only marker (e.g. `data-app="v2-astro"` on the body). |
| BYOD pages don't fit a trainer's mental model and drop traffic           | Medium     | Low    | Out-of-scope to optimize pre-launch. Track analytics post-launch; iterate.                                            |
| Lighthouse score drops below targets                                     | Medium     | Medium | Performance budget enforced in CI ([`../quality/performance-budgets.md`](../quality/performance-budgets.md)). PR can't merge if budget exceeded. |
| Fluent UI bundle bloats catalog above budget                             | Medium     | Medium | Decision in [`../open-questions.md`](../open-questions.md) #C-1; if Fluent stays, code-split aggressively.            |
| Loss of Docusaurus search                                                | Low        | Low    | We're not a docs site; remaining docs (FAQ, contribute) are few enough to navigate without search.                    |
| Cutover happens during a high-traffic moment (course launch)             | Low        | Medium | Coordinate cutover with trainer team calendar. Don't ship on a Friday.                                                |

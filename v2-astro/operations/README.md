# Operations

## Content workflow

### Adding a template to the catalog

Unchanged from today. Author opens an issue using the existing template-
submission template, repo maintainers update `static/templates.json`.

`static/templates.json` remains the single source of truth. The v2 site
reads it directly. See the existing [`.github/instructions/templates-json.instructions.md`](../../.github/instructions/templates-json.instructions.md)
in the repo.

### Adding an OPX script

1. Copy [`opx-dsl/examples/minimal.opx.yaml`](../opx-dsl/examples/minimal.opx.yaml)
   to `src/scripts/<your-id>.opx.yaml`.
2. Fill in `meta` + `steps` per [`opx-dsl/authoring-guide.md`](../opx-dsl/authoring-guide.md).
3. `npm run validate:opx` locally.
4. `npm run dev`, watch the carousel, confirm counters land.
5. Open a PR. CI runs `validate-opx` + integration tests.
6. After merge, the next `deploy.yml` dispatch picks it up.

Anyone with PR access can add a script. No special role required.

### Updating brand / visual design

Visual tokens live in `src/styles/globals.css`. Changes go through a
normal PR; reviewer should sanity-check both light and dark modes.

### Updating routes / nav

`src/components/shared/Header.astro` and `Footer.astro` are hard-coded.
Changes go through a normal PR. If a route is added/removed, also
update [`product/information-architecture.md`](../product/information-architecture.md)
in the same PR.

## Ownership

| Area                      | Owner role             | Approval required for                  |
| ------------------------- | ---------------------- | -------------------------------------- |
| OPX schema                | OPX maintainer team    | Any change to `opx-dsl/schema.md`      |
| OPX runtime               | OPX maintainer team    | Anything in `components/orchestrator-preview/` |
| Catalog                   | Catalog maintainers    | Anything under `src/components/catalog/`, `static/templates.json` |
| Brand / visual            | Design owner            | `src/styles/globals.css`               |
| CI / CD                   | Release engineer        | `.github/workflows/*`                  |
| Pages config              | Repo admin              | Settings → Pages, Settings → Environments |
| ADRs                      | TL + ADR-specific owner | New ADRs, any "Accepted" → "Superseded" transition |

Define actual people in `CODEOWNERS` after v2 kickoff. Don't put names
in this spec.

## Observability

### What we collect today (Docusaurus)

- Adobe Analytics (page views, the `azd init` copy event).
- Application Insights custom events (the `azd init` copy event).

### v2 must preserve

The `azd init` copy event in both Adobe Analytics and App Insights.
Event names and properties must match exactly so existing dashboards
keep working. See [`product/catalog.md`](../product/catalog.md) §Analytics.

### v2 nice-to-have (deferred)

- `web-vitals` reporting to App Insights for real-user LCP/CLS/INP.
- OPX engagement: `opx:done` events with `iteration` and `id` to
  measure carousel watch-through.

Track in [`open-questions.md`](../open-questions.md) #O-1.

## On-call

The site is read-only and statically hosted. There is no on-call. The
failure modes are:

| Failure                              | Detection                          | Response                                   |
| ------------------------------------ | ---------------------------------- | ------------------------------------------ |
| Pages deploy job failed              | GitHub email / Actions tab          | Rerun, or roll back to last green          |
| Site shows wrong content (wrong base) | Manual or visual regression test    | Roll back deploy, fix base-path, redeploy  |
| `templates.json` typo broke catalog  | Visual + integration tests          | Hotfix PR, redeploy                        |
| OPX script broken                    | `validate-opx` would have caught   | Should never reach prod; if it does, revert |

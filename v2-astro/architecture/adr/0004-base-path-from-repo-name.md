# ADR-0004: Base path is derived from the repo name in CI

- **Status:** Accepted
- **Date:** v2 kickoff

## Context

GitHub Pages serves a project repo at `https://<owner>.github.io/<repo-name>/`.
Astro needs `base: '/<repo-name>/'` at build time, or generated links
break. Hard-coding the base path in `astro.config.mjs` is the obvious
approach but means every fork must edit config to deploy.

## Decision

`astro.config.mjs` reads `BASE_PATH` and `SITE_URL` from env. The
deploy workflow sets them from workflow context:

```yaml
env:
  BASE_PATH: /${{ github.event.repository.name }}/
  SITE_URL:  https://${{ github.repository_owner }}.github.io
```

Local `npm run dev` sets neither — serves at `/`.

## Consequences

- The same workflow file works in any fork without modification — useful
  during v2 development, where contributors deploy preview builds to
  their forks.
- All in-source links **must** go through `import.meta.env.BASE_URL`.
  A CI grep guards this (see `quality/test-plan.md`).
- If someone forks the repo and renames it (e.g. to `demo-site`), they
  must also rename their committed `templates.json` paths if those use
  absolute URLs. Most don't — `useBaseUrl` / `BASE_URL` handles it.
- The Pages workflow includes a repo guard
  `if: github.repository != 'MicrosoftLearning/trainer-demo-deploy'`
  **while v2 is in development**, to prevent accidental cutover. The
  guard is removed in the cutover PR.

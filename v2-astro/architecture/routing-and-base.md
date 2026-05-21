# Routing & base path

## Production base path

The production site is served at
`https://microsoftlearning.github.io/trainer-demo-deploy/`, so the Astro
build **must** set `base: /trainer-demo-deploy/`. The repo name *is* the
base path segment — keep them aligned.

## How the build picks it up

`astro.config.mjs` reads env vars:

```js
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL  || undefined;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // …
});
```

CI sets them from the workflow context (see [ADR-0004](./adr/0004-base-path-from-repo-name.md)):

```yaml
env:
  BASE_PATH: /${{ github.event.repository.name }}/
  SITE_URL:  https://${{ github.repository_owner }}.github.io
```

This means the same workflow file works in:

| Repo                                          | Pages URL                                                 | BASE_PATH                |
| --------------------------------------------- | --------------------------------------------------------- | ------------------------ |
| `MicrosoftLearning/trainer-demo-deploy`       | `https://microsoftlearning.github.io/trainer-demo-deploy/`| `/trainer-demo-deploy/`  |
| Any fork (e.g. `<owner>/trainer-demo-deploy`) | `https://<owner>.github.io/trainer-demo-deploy/`           | `/trainer-demo-deploy/`  |
| Fork renamed to `<owner>/demo`                 | `https://<owner>.github.io/demo/`                          | `/demo/`                 |

Dev (`npm run dev`) sets neither — site serves at `/`.

## Authoring links (the only rule)

**Never hard-code an absolute path that starts with `/`.** Always go
through one of:

```astro
---
const base = import.meta.env.BASE_URL; // trailing-slashed in Astro 4+
---
<a href={base}>Home</a>
<a href={`${base}gallery`}>Catalog</a>
<a href={`${base}byod-azure`}>BYOD · Azure</a>
```

A CI step (see [`quality/test-plan.md`](../quality/test-plan.md)) greps
the built `dist/**/*.html` for any `(href|src)="/(?!trainer-demo-deploy/)"`
match and fails the build if one appears. This is the regression that
killed the spike's first deploy.

## Inbound link compatibility

The current Docusaurus site exposes routes like:

- `/` (home)
- `/showcase`-style gallery URL (Docusaurus-generated)
- `/docs/contribute`
- `/getting-started`
- `/docs/1-faq/*`

For v2 to launch without breaking inbound links, see
[`rollout/migration-plan.md`](../rollout/migration-plan.md) for the
redirect map. Astro's static output ships a small `*.html` redirect per
old URL.

## Trailing slashes

`trailingSlash: 'ignore'` matches GitHub Pages' tolerant behavior. Author
links *without* trailing slashes (`/gallery`, not `/gallery/`) — Pages
serves either correctly.

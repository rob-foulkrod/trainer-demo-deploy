# GitHub Pages setup

A one-time configuration in the repo settings. Document so it's not
lost on the next migration / fresh fork.

## Steps

1. **Settings → Pages**
   - Build and deployment → **Source: GitHub Actions** (NOT "Deploy from
     a branch").
2. **Settings → Environments → `github-pages`**
   - Deployment branches and tags: `main` (production).
   - Add `pull_request` events for the preview workflow if used.
3. **Settings → Actions → General**
   - Workflow permissions: **Read and write**.
   - Allow GitHub Actions to create and approve pull requests:
     leave default unless using a bot.
4. **Settings → Branches → Branch protection rules** (recommended)
   - Protect `main`.
   - Require status checks: `validate-opx`, `test`, `build`.

## DNS / custom domain

None. The site is served at the default
`<owner>.github.io/<repo>/` URL. Do NOT add a custom domain in v2 — it
would change the inbound URL and break the "URL unchanged" success
criterion.

If a custom domain is added later, it requires a separate ADR and a
plan for the existing `microsoftlearning.github.io/trainer-demo-deploy/`
URL to redirect.

## After enabling

Run `deploy.yml` once manually from the Actions tab to confirm:

1. The build job completes.
2. `actions/upload-pages-artifact@v3` uploads `dist/`.
3. The `deploy` job's `actions/deploy-pages@v4` step links to the
   live URL.
4. The URL loads the v2 site (not a Docusaurus "site failed to load"
   page).

## Troubleshooting

| Symptom                                                  | Likely cause                                                   |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| 404 at the Pages URL                                     | Pages source is set to "Branch" not "GitHub Actions"           |
| "Site failed to load" with wrong baseUrl                 | Wrong workflow ran (e.g. old `test-deploy.yml` from Docusaurus)|
| `deploy-pages` step errors with "no artifact found"      | `upload-pages-artifact` path was wrong (e.g. `dist/` vs `spike-astro/dist/`) |
| Workflow appears to run but Actions tab is empty         | Workflow file isn't on the **default branch**. Push to default or change default. |
| `permission_denied` on `deploy-pages`                     | Workflow `permissions:` block missing `pages: write` or `id-token: write` |

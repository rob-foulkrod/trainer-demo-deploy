# Environments

## Production

| Property            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| URL                 | <https://microsoftlearning.github.io/trainer-demo-deploy/>     |
| Source              | `main` branch of `MicrosoftLearning/trainer-demo-deploy`        |
| Build               | `.github/workflows/deploy.yml` (workflow_dispatch only)        |
| `BASE_PATH`         | `/trainer-demo-deploy/`                                        |
| `SITE_URL`          | `https://microsoftlearning.github.io`                          |
| Pages source        | GitHub Actions                                                 |

## PR previews

| Property            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| URL                 | (provided by `actions/deploy-pages` preview environment)        |
| Source              | The PR head ref                                                |
| Build               | `.github/workflows/pages-preview.yml` (pull_request trigger)   |
| `BASE_PATH`         | `/trainer-demo-deploy/` (same as prod — preview routes mirror) |
| `SITE_URL`          | Pages-assigned preview origin                                  |

## Personal fork previews

Contributors can run the same `deploy.yml` from their own fork. The
workflow's repo-name-derived `BASE_PATH` ensures `https://<owner>.github.io/<repo-name>/`
works without edits.

| Property            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| URL                 | `https://<owner>.github.io/<repo-name>/`                       |
| Source              | Any branch on the fork                                         |
| Build               | `.github/workflows/deploy.yml` (workflow_dispatch)             |
| `BASE_PATH`         | `/<repo-name>/` — derived from `github.event.repository.name`  |
| `SITE_URL`          | `https://<owner>.github.io`                                    |

## Local dev

| Property            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| URL                 | <http://localhost:4321>                                        |
| Build               | `npm run dev`                                                  |
| `BASE_PATH`         | unset → `/`                                                    |
| `SITE_URL`          | unset                                                          |

## Local "prod-like" preview

```powershell
$env:BASE_PATH = "/trainer-demo-deploy/"
$env:SITE_URL  = "https://microsoftlearning.github.io"
npm run build
npm run preview     # http://localhost:4321/trainer-demo-deploy/
Remove-Item Env:BASE_PATH
Remove-Item Env:SITE_URL
```

Use this before opening a PR if you're touching any routing/link code.

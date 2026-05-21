# npm policy

## Decision

CI runs `npm install --no-audit --no-fund`, **not** `npm ci`.

## Why

The v2 team develops across both Windows and Linux. npm's lockfile
records platform-specific optional dependencies (notably the
`@emnapi/runtime` / `@emnapi/core` chain pulled in by Tailwind v4's
Lightning CSS Linux binary, and similar entries for `sharp`).

When a Windows author commits a regenerated lockfile, the Linux-only
optional entries are missing. CI runs on Linux. `npm ci` treats those
omissions as a sync mismatch and fails with:

```
npm error `npm ci` can only install packages when your package.json and
package-lock.json or npm-shrinkwrap.json are in sync.
…
npm error Missing: @emnapi/runtime@1.10.0 from lock file
npm error Missing: @emnapi/core@1.10.0 from lock file
```

This was hit on the spike's first deploy and consumed enough time that
we're codifying the resolution.

## Alternatives considered

| Option                                                      | Verdict                                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Force lockfile regeneration on Linux only** (WSL/devcontainer) | Adds a developer-environment requirement we don't want to enforce on contributors. |
| **Commit a Linux-generated lockfile**                       | Same problem in reverse for Windows authors when they edit deps.                   |
| **Use `npm ci --omit=optional`**                            | Tailwind v4 actually *needs* the Linux Lightning CSS optional binary.              |
| **Pin all optional deps explicitly in `package.json`**      | Brittle; transitive optionals churn upstream.                                      |
| **Switch to pnpm / yarn**                                   | Out of scope for v2. Future ADR if it becomes warranted.                           |
| **`npm install` in CI** (chosen)                            | Slightly slower (~10–20s), tolerant of cross-platform lockfile drift.              |

## Consequences

- CI installs **may** diverge from local installs by a patch/minor on
  some transitive deps. Acceptable for a static site; not acceptable
  for security-sensitive backend code.
- Reproducibility relies on `package.json` ranges. Keep top-level
  ranges tight (`^x.y.z`, not `*`).
- Renovate/Dependabot PRs should be merged and the lockfile committed
  by the bot itself; CI's `npm install` will tolerate any residual
  platform drift.
- We **do** commit the lockfile. It's still useful for local installs
  and for security advisories tooling.

## If this becomes painful

Two escape hatches:

1. **Add a `lockfile-bot` job** that regenerates the lockfile on
   Ubuntu and commits it on `main`. Once that's running, switch CI
   back to `npm ci`.
2. **Move to pnpm** (better cross-platform lockfile story via
   `pnpm-lock.yaml`'s platform-aware resolution).

Both are tracked in [`open-questions.md`](../open-questions.md) #D-1.

## Local development

Contributors should use `npm install` (not `npm ci`) too. Add to
`README.md` setup section. CI matches local behavior, which is what
we want.

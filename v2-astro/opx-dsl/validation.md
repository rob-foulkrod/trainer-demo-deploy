# OPX Validation

The OPX schema is enforced strictly at build time and in CI. A malformed
script must never reach production.

## Tooling

- **Library:** Zod. The schema lives in `src/lib/opx.ts` and is the
  single source of truth.
- **Runner:** `npm run validate:opx` — globs `src/scripts/*.opx.yaml`,
  parses each, validates against the Zod schema, prints line-aware
  errors, and exits non-zero on any failure.
- **Hooks:**
  - Astro's build (`npm run build`) imports the schema and runs
    validation as part of loading scripts. A bad script fails the build.
  - CI runs `npm run validate:opx` as a dedicated job for fast
    feedback before the slower full build.
  - A pre-commit hook (optional, opt-in) runs validation on changed
    `.opx.yaml` files.

## What is validated

Everything in [`schema.md`](./schema.md), plus the cross-field rules:

### Cross-field rules (hard errors)

1. `meta.id` equals the filename stem.
2. `meta.id` is unique across the folder.
3. `meta.task.progress[0] ≤ meta.task.progress[1]`.
4. `sum(steps[*].advances.task)    === meta.task.progress[0]`
5. `sum(steps[*].advances.files)   === meta.diff.files`
6. `sum(steps[*].advances.added)   === meta.diff.added`
7. `sum(steps[*].advances.removed) === meta.diff.removed`
8. Every step has **exactly one** of the six kind keys.
9. `files` array length ≥ 1 wherever it appears.
10. `avatar.initials` length in [1, 3].
11. `agent.code` requires both `lang` and `source` when present.

### Cross-field rules (warnings, not errors)

1. Total script wall-clock at `speed: 1.0` outside [15s, 35s] — warns.
2. `loopPause < 2000` — warns.
3. `meta.mode: marquee` but file is in `src/scripts/` (the carousel
   folder) — warns. (Use `mode: player` for carousel scripts.)
4. `agent` step has no `code` block in the entire script — warns
   (visual variety recommendation).

Warnings print but don't fail CI.

## Error format

Validation errors must be line-aware enough that an author can fix
quickly:

```
✗ src/scripts/my-scenario.opx.yaml

  - meta.task.progress: Expected tuple [done, total], received array of length 3
    at line 7, column 5

  - steps[3].files[0].op: Invalid enum value. Expected 'add' | 'edit' | 'delete' | 'rename', received 'created'
    at line 42, column 21

  - cross-field: sum(advances.added) is 460 but meta.diff.added is 481 (missing 21)
```

Implementation: Zod's `error.format()` plus a small YAML line-mapper
based on the parsed YAML's source-position metadata.

## CI job

```yaml
- name: Validate OPX scripts
  run: npm run validate:opx
```

This runs **before** the full Astro build so authors get the schema
error in <10s instead of waiting for the build to fail.

## Schema versioning

The schema version is exposed as a constant in `src/lib/opx.ts`:

```ts
export const OPX_SCHEMA_VERSION = '1.0.0';
```

A breaking change bumps major (semantic versioning):

1. Add new schema version alongside old.
2. Runtime accepts both; emits a deprecation warning for the old one.
3. After ≥1 release window, remove the old schema. Scripts on the old
   schema fail with a clear "OPX vX.Y is no longer supported" message.

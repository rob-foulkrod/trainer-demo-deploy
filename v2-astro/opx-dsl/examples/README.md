# OPX Example Scripts

These are **freshly authored** minimal examples meant to illustrate the
schema in isolation. They are NOT the spike's scripts.

Production scripts live in `src/scripts/` once the v2 implementation
lands. The spike's reference scripts are at
`spike-astro/src/scripts/*.opx.yaml` — use them as content inspiration,
not as a structural template.

## Files

- [`minimal.opx.yaml`](./minimal.opx.yaml) — the shortest valid script:
  one user prompt, one agent reply, one status. Used as the copy-paste
  starter in the authoring guide.
- [`one-of-each.opx.yaml`](./one-of-each.opx.yaml) — exercises every
  step kind exactly once. Used as a smoke-test fixture in CI.

Add more examples here only if they teach something the schema doc and
authoring guide cannot.

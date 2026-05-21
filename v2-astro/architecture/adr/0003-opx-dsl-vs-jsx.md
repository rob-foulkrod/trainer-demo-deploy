# ADR-0003: OPX is a YAML DSL, not inline JSX/Astro

- **Status:** Accepted
- **Date:** v2 kickoff

## Context

The hero scripted-demo experience plays a sequence of "Copilot does X"
beats: a user prompt typed into the composer, an agent reply, a tool
call, a list of files being created, a final summary. There are 3+
scripts visible in the carousel and we expect more.

Implementation options considered:

1. **Inline JSX/Astro per scenario** — each scenario is its own
   component, hard-coding the beats.
2. **JSON config files** — each scenario is a JSON document the runtime
   interprets.
3. **YAML DSL with a Zod schema and a small set of step kinds**.

## Decision

Option 3 — YAML DSL. The DSL is fully specified in
[`opx-dsl/schema.md`](../../opx-dsl/schema.md). The runtime contract is
in [`components/transcript-player.md`](../../components/transcript-player.md).

## Why

- **Authoring ergonomics.** Non-engineers can add or tweak a scenario
  with `git add my-new-thing.opx.yaml`. No TS knowledge required.
- **Validation.** Zod gives precise, line-aware errors at build time.
  A typo in a step kind fails CI loudly.
- **Inspectability.** Each scenario is one file you can diff; carousel
  inclusion is "exists in the folder" with no extra registry.
- **Auto-discovery.** `loadAllScripts()` globs the folder; adding a
  scenario means *only* dropping in a file.

## Why not just JSON

- YAML's multiline `|` literals make agent/user prose much easier to
  author than escaping in JSON.
- Comments matter for non-engineer authoring; JSON has none.

## Consequences

- A custom DSL means a maintenance burden: schema, runtime, docs all
  need to evolve together. Mitigation: the schema is small (6 step
  kinds), changes go through ADRs, and the runtime is a single file.
- The DSL is **not** general-purpose. It's tightly tuned to this hero
  component. Resist the temptation to add general scripting features.

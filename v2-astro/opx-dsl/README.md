# OPX — Orchestrator Preview eXperience

The OPX component is the **headline interactive surface** of v2. It plays
a scripted "Copilot building a demo" transcript on the home page, looping
through multiple scenarios in a carousel. The spike proved the concept;
v2 ships it as a first-class, fully-specified deliverable.

This folder is the canonical spec for the OPX component. The implementation
in `spike-astro/src/components/orchestrator-preview/` and
`spike-astro/src/scripts/` is the reference, but v2 should re-derive from
this spec, not port verbatim.

## What it is, in one paragraph

OPX renders a Copilot-shaped chat panel — header with agent/model
metadata, a transcript stream (user prompts, agent replies, tool calls,
file diffs, summaries, status pills), and a composer with task progress
and diff counters. The content is driven by a **YAML DSL** (`*.opx.yaml`).
Each YAML file describes one scenario. A homepage carousel rotates
through every scenario in the folder, with the active script running in
**player mode** (steps revealed over time, composer typing animation,
counters ticking up) and pausing briefly between iterations.

## Index

- [`schema.md`](./schema.md) — the YAML DSL: `meta`, `steps`, all step
  kinds, timing/advances semantics. **Authoritative.**
- [`runtime.md`](./runtime.md) — how the player executes a script
  (modes, lifecycle, events, accessibility).
- [`carousel.md`](./carousel.md) — multi-script orchestration: rotation,
  pip indicators, pause/resume rules.
- [`authoring-guide.md`](./authoring-guide.md) — how a content author
  writes a new script (step-by-step, checklist).
- [`validation.md`](./validation.md) — Zod schema requirements, CI
  validation job, common errors.
- [`events.md`](./events.md) — the `opx:play` / `opx:done` DOM event
  contract between the carousel and the transcript player.
- [`examples/`](./examples/) — minimal and reference scripts. Not the
  spike's scripts; freshly authored from this spec.

## Why specify it this deeply

Because nothing else in v2 is as easy to get subtly wrong. The DSL,
runtime, and carousel are interlocking; an undocumented invariant (e.g.
the rule that step `advances` counters must sum to the `meta` totals)
will silently produce a broken-feeling demo if rediscovered by accident.

## Hard rules

1. **One step = one kind.** Step objects with two top-level kind keys
   are invalid.
2. **The YAML schema is the contract.** Any change to step kinds, fields,
   or semantics requires an ADR and a version bump (see `validation.md`).
3. **`advances` sums must match `meta`.** Counter mismatches are the #1
   authoring bug; CI rejects mismatched scripts.
4. **Markdown in bodies is a tiny safe subset.** No HTML, no headings,
   no fenced code (use `agent.code` for code). See `schema.md`.
5. **Carousel is auto-discover.** Putting `foo.opx.yaml` in the scripts
   folder is the *only* mechanism to add it to rotation. No registry,
   no opt-in flag.

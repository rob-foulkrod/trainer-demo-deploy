# OPX Authoring Guide

This is the practical, step-by-step guide for content authors writing a
new OPX script. The reference for what's allowed is
[`schema.md`](./schema.md); this doc gets you from blank file to
working script.

## Quick start

```bash
cd src/scripts/
cp examples/minimal.opx.yaml my-new-scenario.opx.yaml
# edit meta + steps
npm run dev    # the homepage carousel will pick it up
```

That's it. The carousel auto-discovers any `*.opx.yaml` in the folder
(alphabetical order).

## Anatomy

```yaml
meta:
  id: my-new-scenario            # MUST match filename stem
  title: "Trainer Demo Deploy — My scenario"
  task:
    label: "Build my thing"
    progress: [12, 12]            # [done, total] — done MUST equal sum of advances.task
  diff:
    files:   12                   # MUST equal sum of advances.files
    added:   481                  # MUST equal sum of advances.added
    removed: 12                   # MUST equal sum of advances.removed
  mode: player                    # use "player" for the carousel
  loop: true
  startDelay: 500
  loopPause: 2600

steps:
  - user:
      handle: jsmith
      avatar: { initials: js, gradient: ["#0078D4", "#8661C5"] }
      body: |
        @workspace Build me an Azure Container Apps demo with KEDA + Service Bus.
    timing: { typing: 3200, holdFor: 1600 }

  - agent:
      body: |
        Got it — I'll scaffold an azd template that uses Container Apps
        with the KEDA Service Bus scaler.
    timing: { appearAfter: 300, typing: 600, holdFor: 2400 }

  # …more steps…

  - status:
      kind: done
      text: "Agent finished · 12 files · 1 search · 0 errors"
    timing: { appearAfter: 200, holdFor: 2000 }
```

## Step kinds — when to use each

| Kind      | Use for                                                                       |
| --------- | ----------------------------------------------------------------------------- |
| `user`    | The trainer's prompt at the start of the scenario. Usually one per script.    |
| `agent`   | Copilot's explanatory reply. Use sparingly — 2–4 per script feels right.       |
| `tool`    | "Copilot searched the catalog" / "ran a script". Atmospheric.                  |
| `files`   | The visible work — what files are created/edited. Drives the counters.        |
| `summary` | A recap card near the end. One per script (optional).                         |
| `status`  | The final "done" pill. Always last step of a happy-path script.               |

## Pacing

Beats land best at these rough timings (at `speed: 1.0`):

| Beat type                    | `typing`   | `holdFor`  |
| ---------------------------- | ---------- | ---------- |
| User prompt (1 short sentence) | 2400ms   | 1600ms     |
| User prompt (2 sentences)    | 3600ms     | 1800ms     |
| Agent reply (no code)        | 600–900ms  | 2200–2600ms |
| Agent reply (with code)      | 600ms      | 3400ms     |
| Tool card                    | (n/a)      | 1700ms     |
| Files batch                  | (n/a)      | 1800ms     |
| Summary                      | (n/a)      | 2200ms     |
| Status                       | (n/a)      | 2000ms     |

A full script: 8–14 steps, total wall-clock ≈18–25 seconds. Scripts
much shorter than that feel hurried; much longer and viewers tab away.

## Counter math (the rule everyone forgets)

The composer counters start at 0 and tick up as each step's `advances`
fires. By the end of the script they MUST equal the `meta` totals.

```yaml
meta:
  task:    { label: "X", progress: [12, 12] }
  diff:    { files: 12, added: 481, removed: 12 }

# sum(advances.task)    must = 12
# sum(advances.files)   must = 12
# sum(advances.added)   must = 481
# sum(advances.removed) must = 12
```

Easiest pattern: put all the counter advances on the `files:` steps,
spread across 2–4 batches. Validation will fail your script in CI if the
sums don't match.

## Authoring checklist

Before you commit:

- [ ] Filename ends in `.opx.yaml`. `meta.id` equals the stem.
- [ ] `meta.mode: player` (otherwise it won't work in the carousel).
- [ ] `meta.task.progress[1]` is the final files count.
- [ ] `sum(advances.*)` matches each `meta` total.
- [ ] First step is a `user` step with realistic `typing` (≈30–50ms/char).
- [ ] At least one `agent` step has a `code:` block (visual variety).
- [ ] Last step is a `status` step (`done` for happy path).
- [ ] `loopPause` ≥2000ms (the carousel adds its own 900ms; don't make
      the gap too short).
- [ ] You watched a full pass locally and the counters land exactly on
      the meta totals.
- [ ] `npm run validate:opx` passes.
- [ ] You added a screenshot of the working panel to the PR.

## Local development

```powershell
cd src
npm run dev
# Open http://localhost:4321 — your script appears in the carousel.

# Lint/validate only:
npm run validate:opx
```

## Common gotchas

| Symptom                                            | Cause / fix                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| "Expected tuple, received array" on `task.progress` | Must be exactly `[done, total]` — two integers.                                              |
| "Step object must have exactly one kind"           | You wrote `agent:` AND `tool:` on the same step. Split into two steps.                       |
| Counter overshoots / undershoots                   | `sum(advances)` doesn't match `meta`. Fix one or the other.                                  |
| Carousel doesn't pick up the new file              | Wrong filename suffix or wrong folder. Must be `src/scripts/*.opx.yaml`.                     |
| Agent reply has weird `<br>` everywhere            | You used `>` (folded) where you wanted `|` (literal). Use `|` for multi-paragraph bodies.    |
| "Avatar initials must be 1-3 chars"                | An emoji counts as ≥2 characters in this rule. Use letters.                                  |
| `code` block looks like plain text                 | `lang` isn't one of the supported languages — see [`schema.md`](./schema.md#supported-code-highlighter-languages). |

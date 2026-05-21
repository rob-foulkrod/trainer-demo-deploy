# OPX Runtime

How the player executes a script. The runtime is a small TS module
mounted by the `Transcript.astro` island. v2 should re-implement
from this spec, not port the spike code verbatim.

> For a visual feel of what the runtime produces, see
> [`../reference/`](../reference/) — the `home-*-start/mid/end.png`
> series shows each step kind in motion.

## Module layout

```
src/components/orchestrator-preview/
├── Transcript.astro         ← top-level island; reads meta, renders shell, owns lifecycle
├── steps/                    ← one component per step kind
│   ├── UserStep.astro
│   ├── AgentStep.astro
│   ├── ToolStep.astro
│   ├── FilesStep.astro
│   ├── SummaryStep.astro
│   └── StatusStep.astro
├── runtime.ts                ← scheduler: state machine, timers, counter ticker
└── markdown.ts               ← inline markdown renderer (see opx-dsl/schema.md §Markdown)

src/lib/opx.ts                ← schema (Zod), loadScript, loadAllScripts
```

## Lifecycle

1. `Transcript.astro` is rendered for a single script. It receives the
   parsed OPX object as a prop or loads it via `loadScript(id)`.
2. The island renders the chat shell (header, composer with counters,
   transcript scroll area) using `meta` values.
3. The runtime starts in one of two modes:
   - `marquee`: render all steps statically, no scheduler.
   - `player`: scheduler runs the [Player loop](#player-loop).
4. When the carousel manages the transcript, the runtime additionally
   listens for `opx:play` events and dispatches `opx:done` on iteration
   completion. See [`events.md`](./events.md).

## Player loop

Pseudocode:

```ts
async function play() {
  do {
    resetCountersToZero();
    await wait(meta.startDelay);
    for (const step of steps) {
      await wait(step.timing.appearAfter / meta.speed);
      await runStep(step);                          // typing/etc, then reveal
      applyAdvances(step.advances);                 // tick counters
      await wait(step.timing.holdFor / meta.speed);
    }
    dispatchEvent('opx:done');
    if (meta.loop) await wait(meta.loopPause);
  } while (meta.loop && !cancelled);
}
```

### Per-step runners

| Step kind   | `runStep` behavior                                                            |
| ----------- | ------------------------------------------------------------------------------ |
| `user`      | If `typing > 0`: type `body` into the composer at `body.length / typing` rate (clamped ≥14ms/char). Then move bubble to the transcript. |
| `agent`     | If `typing > 0`: show "…" indicator for `typing` ms. Then fade body in. If `code` is set, render the highlighted block under the body. |
| `tool`      | Fade card in. No animation beyond opacity-translate.                          |
| `files`     | Fade card in with rows already populated. (Do not animate row-by-row in v1.)  |
| `summary`   | Fade card in.                                                                 |
| `status`    | Fade pill in; if `kind ∈ {done, running}`, start dot pulse animation.         |

### Counter ticking

`applyAdvances` adds to four numeric counters and updates the DOM:

- Task progress: `done` of `total` (total comes from `meta.task.progress[1]`).
- `diff.files`, `diff.added`, `diff.removed`.

The total task value never changes; only `done` ticks up. Counters
animate to their new values over 250ms (CSS transition or
`requestAnimationFrame`-driven number).

## Cancellation

The runtime exposes a `cancel()` method that:

- Aborts any in-flight `wait()`.
- Clears all pending timers.
- Leaves the transcript in its current visual state (does not reset).

Used when the carousel switches to a different script.

## Reset

`reset()` returns the transcript to t=0:

- Counters → 0.
- Transcript scroll area → empty.
- Composer placeholder restored.

Used at the start of each `play()` iteration and when the carousel
re-activates a script.

## Accessibility

- The transcript is an `aria-live="polite"` region so screen readers
  announce new beats. The composer is **not** live (it just looks like
  typing happens).
- `prefers-reduced-motion`:
  - Skip typing animation (reveal body immediately).
  - Skip dot pulses.
  - Counters jump to value with no transition.
  - The carousel still rotates but with no cross-fade.
- Tab order: skip over the OPX panel by default (it's decorative). Mark
  the wrapper `role="region" aria-label="Orchestrator preview"` and let
  power users focus into it. Inside, focusable elements (if any) follow
  visual order.

## Error handling

- A schema validation failure during build: hard error. CI fails.
- A runtime exception during playback: log, dispatch `opx:done`, let the
  carousel move on. Never block the page.

## Performance budget

- Initial bundle for the runtime + step components: **≤25KB gzipped**.
- No external runtime dependencies (no marked, no shiki). The tiny
  highlighter and markdown renderer ship with the runtime.
- A full script (~20 steps) must execute one iteration in <30s wall
  clock at `speed: 1.0`.

# OPX Carousel

The carousel is the homepage hero. It rotates through every OPX script
in `src/scripts/` (alphabetical), playing each in player mode and
cross-fading to the next on completion.

> Reference frames: [`../reference/home-azure-*`](../reference/),
> [`home-cps-*`](../reference/), [`home-stress-*`](../reference/)
> capture the three spike scripts at start/mid/end.

## Component

```
src/components/orchestrator-preview/
└── OrchestratorCarousel.astro
```

Renders all scripts as overlaid slides (same DOM, opacity-stacked) and
controls which is "active" via a small JS controller.

## Rotation rules

1. On mount, the carousel calls `loadAllScripts()` and renders one
   `Transcript` island per script. All but the first are visually
   hidden (`opacity-0 pointer-events-none`).
2. The active script's runtime begins playback. The carousel listens
   for the `opx:done` event from it.
3. On `opx:done`:
   - Wait `carousel.pauseBetween` ms (default **900ms** — gives a
     breath between scenarios).
   - Cross-fade to the next script (400ms fade-out + 400ms fade-in, no
     overlap to avoid double-motion).
   - Dispatch `opx:play` to the newly active transcript, which resets
     and starts playback.
4. When the last script finishes, wrap to the first (no special case).

## Pip indicators

Below the panel, render one pip per script. The active pip is solid,
others are outlined. Clicking a pip:

- Immediately cancels the current playback (no fade).
- Cross-fades to the clicked script.
- Dispatches `opx:play` to that transcript.

Pip accessibility:

- Each pip is a `<button>` with `aria-label="Scenario N of M"`.
- Active pip has `aria-current="true"`.
- Keyboard focus visible. Arrow keys move between pips.

## Pause / resume

- Hovering the panel does **not** pause playback (would disrupt the
  scripted timing).
- Tab-blurring the page (Page Visibility API) pauses the active script
  until the tab is visible again. On resume, the script picks up at the
  next beat (it does not restart).
- `prefers-reduced-motion`: rotation still happens, but with no
  cross-fade and runtime motion suppressed per
  [`runtime.md`](./runtime.md#accessibility).

## Configuration

Props on `OrchestratorCarousel.astro`:

| Prop           | Type            | Default | Notes                                                |
| -------------- | --------------- | ------- | ---------------------------------------------------- |
| `pauseBetween` | `number` (ms)   | `900`   | Pause after `opx:done` before cross-fade.            |
| `fadeMs`       | `number` (ms)   | `400`   | Each fade leg (out then in).                         |
| `scriptIds`    | `string[]?`     | (all)   | Override discovery; render only these scripts.       |
| `startIndex`   | `number`        | `0`     | Which script is initially active.                    |

## Empty / single-script behavior

- Zero scripts in folder: render a static placeholder card with the
  text "No OPX scripts found." (developer-facing; should never appear
  in production).
- One script in folder: render normally but hide pips. The single script
  loops (carousel never advances).

## Build-time discovery

`loadAllScripts()` uses Vite's `import.meta.glob('/src/scripts/*.opx.yaml', { eager: true, as: 'raw' })`
(or equivalent) so all scripts are bundled and parsed at build time.
There is no runtime fetch.

## Tests

See [`quality/test-plan.md`](../quality/test-plan.md) §Carousel. Highest
priority:

- Renders one transcript per script in the folder.
- `opx:done` causes advance to next within `pauseBetween + 2 × fadeMs + 50ms`.
- Pip click cancels the active script and starts the target.
- Reduced-motion preference disables cross-fade and dot pulses.

# OPX DOM Event Contract

The carousel and the transcript player communicate via two DOM events.
This is the **only** documented coupling between them; do not bypass it
with imports or shared globals.

## Events

### `opx:play`

| Field             | Value                                       |
| ----------------- | ------------------------------------------- |
| `type`            | `"opx:play"`                                |
| `detail`          | `{ id: string }` — the script id to start  |
| `target`          | The transcript element (`[data-opx-id]`)    |
| `bubbles`         | `false`                                     |
| `composed`        | `false`                                     |

Emitted by: the carousel (or test harness).
Handled by: the matching transcript runtime.

Effect: the transcript calls `reset()` then `play()`.

### `opx:done`

| Field             | Value                                       |
| ----------------- | ------------------------------------------- |
| `type`            | `"opx:done"`                                |
| `detail`          | `{ id: string, iteration: number }`         |
| `target`          | The transcript element (`[data-opx-id]`)    |
| `bubbles`         | `true`                                      |
| `composed`        | `false`                                     |

Emitted by: a transcript runtime, after each completed iteration.
Handled by: the carousel (to advance to next script).

Effect on the carousel: wait `pauseBetween` ms, cross-fade to next.

## Sequence diagram

```
Carousel                   Transcript A             Transcript B
   │ render all islands        │                         │
   │──── opx:play(A) ────────▶│                         │
   │                           │ reset(), play()         │
   │                           │ …playback…              │
   │◀─── opx:done(A, 1) ──────│                         │
   │ wait pauseBetween         │                         │
   │ cross-fade A → B          │                         │
   │──── opx:play(B) ───────────────────────────────────▶│
   │                                                     │ reset(), play()
   │                                                     │ …playback…
   │◀──── opx:done(B, 1) ───────────────────────────────│
   │ wait pauseBetween                                   │
   │ cross-fade B → A                                    │
   │──── opx:play(A) ────────▶│                         │
   │                           │ reset(), play()         │
```

## DOM convention

Each transcript is a single element with a `data-opx-id` attribute equal
to the script's `meta.id`. The carousel uses
`querySelector('[data-opx-id="…"]')` to dispatch `opx:play`.

```html
<div data-opx-id="byod-azure-aca" class="opx-transcript …">
  <!-- shell, transcript stream, composer -->
</div>
```

## Why a DOM event contract (not a JS API)

- Survives Astro island hydration boundaries — the carousel and
  transcript can be separately-hydrated islands without sharing a
  module instance.
- Easy to drive from devtools / tests (`el.dispatchEvent(new CustomEvent('opx:play', …))`).
- Loose coupling: a transcript can be used standalone (no carousel) by
  just calling its `play()` method directly, or by dispatching
  `opx:play` from any source.

## Rules

1. **Only the carousel listens for `opx:done`.** A standalone transcript
   ignores its own emitted `opx:done` (it just loops via `meta.loop`).
2. **A transcript never listens for `opx:done`.** That would create a
   self-reentry race.
3. **`opx:play` always resets** before playing. There is no "resume"
   variant; pause/resume is handled internally via Page Visibility.
4. **Event detail is required.** Don't dispatch with `null` detail.
   Tests should fail closed.

# OPX YAML Schema (v1)

This is the **authoritative** specification of the OPX DSL. The runtime
must enforce exactly this schema; the authoring guide describes how to
author within it; the validation doc covers CI enforcement.

The spike's [`spike-astro/src/scripts/README.md`](../../../spike-astro/src/scripts/README.md)
is the same content in a tutorial voice. This file is the normative
reference.

## File discovery

| Field                | Value                                                               |
| -------------------- | ------------------------------------------------------------------- |
| Location             | `src/scripts/` (relative to the Astro app root)                     |
| Filename pattern     | `*.opx.yaml` or `*.opx.yml`                                         |
| Encoding             | UTF-8                                                               |
| Auto-load function   | `loadAllScripts()` (alphabetical by filename)                        |
| Single-load function | `loadScript("<id>")` — load one by id                                |
| Carousel inclusion   | Every file in the folder                                            |
| Exclusion mechanism  | None — to exclude, move the file out of the folder                  |
| Validation           | Strict Zod. Malformed files fail the build with line-aware errors.  |

## Top-level shape

```yaml
meta:    { … }    # required
steps:   [ … ]    # required, min length 1
```

No other top-level keys are allowed. Unknown keys are an error.

## `meta` block

| Field             | Type                    | Required | Default          | Notes                                                                 |
| ----------------- | ----------------------- | -------- | ---------------- | --------------------------------------------------------------------- |
| `id`              | `string`                | yes      | —                | Must equal the filename stem. Unique across the folder.                |
| `title`           | `string`                | yes      | —                | Shown in the chat panel header.                                       |
| `agent`           | `string`                | no       | `"orchestrator"` | Sub-header label.                                                     |
| `model`           | `string`                | no       | `"Claude Opus 4.7"` | Sub-header label.                                                  |
| `context`         | `string`                | no       | `""`             | Italic chip above the composer.                                       |
| `task.label`      | `string`                | yes      | —                | Composer task label.                                                  |
| `task.progress`   | `[done:int, total:int]` | yes      | —                | 2-tuple. `done ≤ total`, `total ≥ 1`.                                  |
| `diff.files`      | `int ≥ 0`               | yes      | —                | Final files-changed total.                                            |
| `diff.added`      | `int ≥ 0`               | yes      | —                | Final lines added.                                                    |
| `diff.removed`    | `int ≥ 0`               | yes      | —                | Final lines removed.                                                  |
| `speed`           | `number > 0`            | no       | `1.0`            | Global runtime speed multiplier. `2.0` = twice as fast.                |
| `mode`            | `"marquee" \| "player"` | no       | `"marquee"`      | See [Modes](#modes) below. Use `player` for anything in the carousel. |
| `loop`            | `boolean`               | no       | `true`           | Only relevant in `player` mode.                                       |
| `startDelay`      | `int ≥ 0` (ms)          | no       | `400`            | Pause before the first step. Player mode only.                        |
| `loopPause`       | `int ≥ 0` (ms)          | no       | `2200`           | Gap between loop iterations. Player mode only.                        |

## `steps` block

`steps` is an ordered array. Each entry has:

- **Exactly one** of the six step-kind keys: `user`, `agent`, `tool`,
  `files`, `summary`, `status`.
- Optional `timing` sibling (see [Timing](#timing)).
- Optional `advances` sibling (see [Advances](#advances)).

No other sibling keys are allowed.

### Step kinds

#### `user`

| Field               | Type                        | Required | Default     | Notes                                                  |
| ------------------- | --------------------------- | -------- | ----------- | ------------------------------------------------------ |
| `handle`            | `string`                    | yes      | —           | Display handle (e.g. `jsmith`).                        |
| `avatar.initials`   | `string` (length 1–3)       | yes      | —           | Emoji counts as >1 character; use letters.             |
| `avatar.gradient`   | `[hex, hex]`                | no       | brand pair  | `[start, end]` for the avatar background.              |
| `body`              | `string` (markdown subset)  | yes      | —           | In player mode, typed into the composer char-by-char.  |
| `when`              | `"now" \| string`           | no       | `"now"`     | Reserved for future timestamp display.                 |

#### `agent`

| Field         | Type                       | Required | Default | Notes                                                    |
| ------------- | -------------------------- | -------- | ------- | -------------------------------------------------------- |
| `body`        | `string` (markdown subset) | yes      | —       | The reply body.                                           |
| `code.lang`   | `string`                   | no       | —       | One of the highlighter languages (see below).             |
| `code.source` | `string`                   | no       | —       | The code block contents (newlines preserved).             |

#### `tool`

| Field    | Type                                       | Required | Default    | Notes                                                                 |
| -------- | ------------------------------------------ | -------- | ---------- | --------------------------------------------------------------------- |
| `kind`   | `"search" \| "run" \| "read" \| "edit"`    | no       | `"search"` | Icon selector only.                                                   |
| `title`  | `string`                                   | yes      | —          | Tool card title.                                                      |
| `detail` | `string` (markdown subset)                 | no       | —          | Below-title detail line.                                              |
| `result` | `string` (markdown subset)                 | no       | —          | "Result" line. Optional.                                              |

#### `files`

`files` is an array of file rows. The array must have **≥1 entry**.

Each row:

| Field   | Type                                                  | Required | Default | Notes                                                            |
| ------- | ----------------------------------------------------- | -------- | ------- | ---------------------------------------------------------------- |
| `path`  | `string`                                              | yes      | —       | Display path. Not validated against the filesystem.              |
| `op`    | `"add" \| "edit" \| "delete" \| "rename"`             | no       | `"add"` | Row glyph (`+ ~ − →`) and color.                                  |
| `lines` | `int ≥ 0`                                             | no       | `0`     | Decorative. `0` hides the count. Does NOT drive counters.         |

> Counter rule: the composer's "+N / −N / files" counters are driven by
> the step's [`advances`](#advances) block, **not** by summing `lines`.

#### `summary`

| Field      | Type                          | Required | Default | Notes                                          |
| ---------- | ----------------------------- | -------- | ------- | ---------------------------------------------- |
| `title`    | `string`                      | yes      | —       | Card title.                                    |
| `lead`     | `string` (markdown subset)    | no       | —       | One-liner under the title.                     |
| `bullets`  | `string[]` (markdown subset)  | no       | `[]`    | List items.                                    |

#### `status`

| Field   | Type                                  | Required | Default  | Notes                                  |
| ------- | ------------------------------------- | -------- | -------- | -------------------------------------- |
| `kind`  | `"done" \| "running" \| "error"`      | no       | `"done"` | Dot color + pulse behavior.            |
| `text`  | `string` (markdown subset)            | yes      | —        | Status line text.                      |

Status dot behavior:

| `kind`    | Color  | Pulses? |
| --------- | ------ | ------- |
| `done`    | green  | yes     |
| `running` | amber  | yes     |
| `error`   | red    | no      |

### Timing

```yaml
timing:
  appearAfter: 250    # ms after previous step finishes (default 0)
  holdFor:     1400   # ms this step stays current     (default 1400)
  typing:      0      # ms of typing animation          (default 0)
```

All three are scaled by `meta.speed` at runtime
(`actual_ms = configured_ms / meta.speed`).

`typing` semantics by step kind:

| Step kind     | `typing > 0` effect                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| `user`        | `body` is typed into the composer over `typing` ms (chars/sec derived).         |
| `agent`       | The "…" typing indicator pulses for `typing` ms before `body` appears.          |
| anything else | Ignored.                                                                        |

The typing char rate is clamped to **≥14 ms/char** so short prompts
still feel human-paced.

### Advances

```yaml
advances:
  task:    4    # add to task.progress[0]
  files:   4    # add to diff.files counter
  added:   225  # add to diff.added counter
  removed: 12   # add to diff.removed counter
```

In `player` mode, all counters start at **0** and tick up as each step
with `advances` becomes the current beat. By the end of one pass:

- `sum(advances.task)`    **must equal** `meta.task.progress[0]`
- `sum(advances.files)`   **must equal** `meta.diff.files`
- `sum(advances.added)`   **must equal** `meta.diff.added`
- `sum(advances.removed)` **must equal** `meta.diff.removed`

These sums **are enforced by validation** (see
[`validation.md`](./validation.md)). Mismatched scripts fail CI.

(Note: the spike validates these as soft rules; v2 promotes them to
hard errors.)

## Modes

### `mode: marquee`

- All steps render statically; CSS scrolls them.
- `task`/`diff` counters show their final meta values immediately.
- The composer placeholder is static text.
- `loop`, `startDelay`, `loopPause` are ignored.
- Intended for ambient background eye-candy (non-hero pages).

### `mode: player`

- Steps revealed one at a time, driven by `timing`.
- Counters start at 0 and tick up via `advances`.
- The composer is interactive-looking: user prompts type into it.
- `loop` / `startDelay` / `loopPause` are honored.
- This is what the homepage carousel uses.

## Markdown subset

`user.body`, `agent.body`, `tool.detail`, `tool.result`, `summary.lead`,
`summary.bullets[*]`, and `status.text` accept a tiny inline-only
markdown subset:

| Syntax           | Renders as                            |
| ---------------- | ------------------------------------- |
| `` `code` ``     | inline code chip                      |
| `**bold**`       | bold                                  |
| `_italic_`       | italic (single underscores)           |
| `[text](url)`    | underlined link                       |
| `@mention`       | blue mention chip (e.g. `@workspace`) |
| blank line       | new paragraph                         |
| single newline   | `<br/>`                               |

**Not supported (escaped/stripped):**
- Headings (`#`, `##`, …)
- Lists (`-`, `*`, `1.`)
- Fenced code (use `agent.code` instead)
- Images
- Tables
- Raw HTML

## Supported code highlighter languages

`agent.code.lang` values the built-in highlighter recognizes:

| `lang`   | Highlighting |
| -------- | ------------ |
| `csharp` | keywords + PascalCase types + strings + `//` `#` comments |
| `bicep`  | keywords + types + strings + comments |
| `json`   | `true/false/null` + strings |
| `yaml`   | `true/false/null` + strings + `#` comments |
| `bash`   | common keywords + strings + `#` comments |
| (other)  | plain monospace, safely escaped |

## Versioning

This schema is **OPX v1**. Any breaking change (rename, removal, semantic
shift) requires:

1. An ADR documenting the change.
2. A schema version bump to v2.
3. The runtime accepts both versions during the deprecation window
   (≥1 release).

Non-breaking additions (new optional field, new step kind) do not bump
the version.

# Reference screenshots

Baseline visuals captured from the `spike/astro` branch on May 21, 2026
(commit `f0b3812`).

## Status

**Advisory, not normative.** The prose under [`../product/`](../product/),
[`../components/`](../components/), and [`../opx-dsl/`](../opx-dsl/) is
authoritative. If a screenshot conflicts with spec text, the spec text
wins; the screenshot is stale.

These shots exist to:

1. Give designers and reviewers a fast visual anchor for what the spec
   describes in words.
2. Communicate the OPX runtime's animation density and step-kind
   variety — things that don't compress well into prose.
3. Serve as input for visual regression baselines in
   [`../quality/test-plan.md`](../quality/test-plan.md), without
   *being* those baselines (those live under `tests/visual/` once v2
   is in flight).

## Inventory

| File                                              | What it shows                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`home-azure-start.png`](./home-azure-start.png)   | Home page, OPX carousel on the Azure script, near the beginning              |
| [`home-azure-mid.png`](./home-azure-mid.png)       | Same script, middle (files step active, counters mid-advance)                |
| [`home-azure-end.png`](./home-azure-end.png)       | Same script, end (status "done")                                              |
| [`home-cps-start.png`](./home-cps-start.png)       | Carousel cross-faded to the Copilot Studio script                            |
| [`home-cps-mid.png`](./home-cps-mid.png)           | Mid CPS script                                                                |
| [`home-cps-end.png`](./home-cps-end.png)           | End CPS script                                                                |
| [`home-stress-start.png`](./home-stress-start.png) | Carousel on the stress / coverage script                                     |
| [`home-stress-mid.png`](./home-stress-mid.png)     | Mid stress script (every step kind exercised)                                |
| [`home-stress-end.png`](./home-stress-end.png)     | End stress script                                                             |
| [`home-full.png`](./home-full.png)                 | Full-page home capture (tall viewport) — shows hero, OPX panel, feature cards |
| [`home-dark.png`](./home-dark.png)                 | Home page with `.dark` mode active                                            |
| [`gallery.png`](./gallery.png)                     | The current spike `/gallery` placeholder                                     |
| [`byod-azure.png`](./byod-azure.png)               | `/byod-azure` page, full-height                                              |
| [`byod-copilot-studio.png`](./byod-copilot-studio.png) | `/byod-copilot-studio` page, full-height                                  |

> **Note on the gallery:** the spike does not implement the full
> catalog. The screenshot here represents *the spike's placeholder*,
> not the v2 target. The v2 catalog must implement the 19 capabilities
> in [`../product/catalog.md`](../product/catalog.md). For a visual
> reference of the actual target capabilities, see the live Docusaurus
> site at <https://microsoftlearning.github.io/trainer-demo-deploy/>.

## How they were captured

[`_capture.cjs`](./_capture.cjs) — Playwright script. Run it with the
spike's dev server live on port 4321:

```powershell
cd C:\class\TDDSync\us\spike-astro
npm run dev
# in another terminal:
node ..\spec\v2-astro\reference\_capture.cjs
```

Viewport: 990×800 for OPX frames (matches the home layout's "comfy"
breakpoint), 1280×900 for the catalog/BYOD pages, 990×1200 for the
tall home capture. Carousel cross-fades happen on a ~25s rotation;
timings in the script are tuned to that.

## When to recapture

- Visual design changes that affect the home, OPX, or BYOD pages.
- A new OPX script is added to the carousel (extend the `frames`
  array in `_capture.cjs`).
- Before submitting the v2 cutover PR (so reviewers see the final
  state, not stale spike visuals).

After recapturing, eyeball the diff and update the prose in
[`../product/visual-design.md`](../product/visual-design.md) if
intent changed.

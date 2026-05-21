# Sources of truth

v2 is built **on top of the existing codebase**, not from scratch. For
each surface below, the listed existing file(s) are authoritative. The
v2 implementation must consume or port them unchanged unless a spec
section explicitly overrides.

If a spec doc and a source-of-truth file disagree on **data shape or
content text**, the source file wins. If they disagree on
**architecture or framework choice**, the spec wins (that's the whole
point of the rewrite).

## Catalog

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Template data (the catalog rows) | [`static/templates.json`](../static/templates.json)             |
| Schema rules / validation        | [`.github/instructions/templates-json.instructions.md`](../.github/instructions/templates-json.instructions.md) |
| Author list & metadata           | [`src/data/users.tsx`](../src/data/users.tsx)                   |
| Tag list & display names         | [`src/data/tags.tsx`](../src/data/tags.tsx)                     |
| Existing UI behavior (every "must-preserve" capability listed in [`product/catalog.md`](./product/catalog.md)) | [`src/components/gallery/*`](../src/components/gallery/) |
| Template detail panel layout     | [`src/components/gallery/ShowcaseCardPanel/`](../src/components/gallery/ShowcaseCardPanel/) |
| Search behavior                  | [`src/components/gallery/ShowcaseTemplateSearch/`](../src/components/gallery/ShowcaseTemplateSearch/) |
| Filters (tags + authors)          | [`src/components/gallery/ShowcaseLeftFilters/`](../src/components/gallery/ShowcaseLeftFilters/), [`ShowcaseTagSelect/`](../src/components/gallery/ShowcaseTagSelect/), [`ShowcaseAuthorSelect/`](../src/components/gallery/ShowcaseAuthorSelect/) |
| Prereqs UI                        | [`src/components/gallery/ShowcasePrereqs/`](../src/components/gallery/ShowcasePrereqs/) |
| Demo-guide modal                  | [`src/components/gallery/ShowcaseDemoGuide/`](../src/components/gallery/ShowcaseDemoGuide/) |
| Empty-result state                | [`src/components/gallery/ShowcaseEmptyResult/`](../src/components/gallery/ShowcaseEmptyResult/) |
| GitHub stars badge               | [`src/components/gallery/ShowcaseGitHubStars/`](../src/components/gallery/ShowcaseGitHubStars/) |
| Multiple-author rendering        | [`src/components/gallery/ShowcaseMultipleAuthors/`](../src/components/gallery/ShowcaseMultipleAuthors/) |
| Survey card                       | [`src/components/gallery/ShowcaseSurveyCard/`](../src/components/gallery/ShowcaseSurveyCard/) |
| Tag pill rendering                | [`src/components/gallery/ShowcaseTag/`](../src/components/gallery/ShowcaseTag/) |
| Catalog page composition          | [`src/pages/ShowcaseCards.tsx`](../src/pages/ShowcaseCards.tsx), [`src/pages/ShowcaseCardPage.tsx`](../src/pages/ShowcaseCardPage.tsx) |

**Port rule:** v2 may rewrite the components in Astro/Tailwind, but
must produce identical *observable* behavior. The catalog spec
checklist in [`product/catalog.md`](./product/catalog.md) is the
contract; these files are the answer key.

## Content (text & copy)

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Home hero, taglines              | [`src/pages/index.tsx`](../src/pages/index.tsx), [`src/components/HomepageFeatures.js`](../src/components/HomepageFeatures.js), [`src/components/Feature.js`](../src/components/Feature.js) |
| FAQ pages                        | [`docs/1-faq/*.md`](../docs/1-faq/)                            |
| Contribute page                  | [`docs/contribute.md`](../docs/contribute.md)                  |
| Getting Started page             | [`src/pages/getting-started/index.js`](../src/pages/getting-started/index.js) |
| Site title / description / tagline | [`docusaurus.config.js`](../docusaurus.config.js) (`title`, `tagline`, `customFields.description`) |
| Cookie manage label              | [`constants.js`](../constants.js)                              |

**Port rule:** copy text verbatim during the port. Editorial changes
go in follow-up PRs, not the cutover PR.

## Navigation

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Top nav inventory                 | [`docusaurus.config.js`](../docusaurus.config.js) → `themeConfig.navbar.items` |
| Footer link list                  | [`docusaurus.config.js`](../docusaurus.config.js) → `themeConfig.footer.links` |
| Logo asset                        | [`static/img/`](../static/img/) (currently `logo.png`)         |

**Current top-nav items** (extracted from `docusaurus.config.js` at the time of
spec drafting):

- Home (logo link to `/`)
- Getting Started → `/getting-started`
- Contribute → doc `contribute`
- AZD Docs → <https://aka.ms/azd> (external)
- Awesome AZD → <https://azure.github.io/awesome-azd> (external)
- "Share your feedback!" → GitHub new-issue link (right-aligned, button style)

**Current footer items:**

- MCT Lounge → <https://aka.ms/mctlounge>
- Microsoft Learn → <https://learn.microsoft.com>
- Privacy Statement → <https://privacy.microsoft.com/privacystatement>
- Manage cookies label (text from `constants.js`)
- "Built With Docusaurus" → <https://docusaurus.io> — **REPLACE in v2** with "Built with Astro" or remove
- Copyright © `<year>` Microsoft → <https://microsoft.com>
- Inspired by Awesome AZD → <https://azure.github.io/awesome-azd>

v2 may reorganize but should retain semantic equivalents for every
non-Docusaurus item.

## Visual tokens

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Brand palette + gradients         | [`src/css/custom.css`](../src/css/custom.css) (`:root` and `[data-theme="dark"]`) |
| Logo & favicon                    | [`static/img/`](../static/img/)                                |

The Tailwind v4 `@theme` block in v2 must map the
`--ms-accent-*` and `--ms-gradient-*` custom properties forward
**unchanged**. See [`new-in-v2.md`](./new-in-v2.md) §Tailwind theme for
the exact `@theme` shape v2 should produce.

## Analytics

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Site-wide analytics scripts       | [`docusaurus.config.js`](../docusaurus.config.js) → `scripts` array (Microsoft analytics + WCP consent) |
| `azd init` copy event call site   | inside the gallery card panel — search for the copy-to-clipboard handler in [`src/components/gallery/ShowcaseCard/`](../src/components/gallery/ShowcaseCard/) and [`ShowcaseCardPanel/`](../src/components/gallery/ShowcaseCardPanel/) |
| Cookie consent integration        | [`constants.js`](../constants.js) (`manageCookieLabel`), plus WCP script in `docusaurus.config.js` `scripts` |
| Root analytics init               | [`src/theme/Root.js`](../src/theme/Root.js)                    |

**Port rule:** in v2, the analytics initialization moves from
`src/theme/Root.js` to an early-loaded script in `Base.astro`. The
`<script>` tags from `docusaurus.config.js` `scripts` array port
forward verbatim. **The `azd init` copy event name and properties must
not change** — dashboards depend on them.

## Templates / images

| Surface                          | Authoritative source                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| Template preview images          | [`static/templates/images/`](../static/templates/images/)      |
| Architecture diagrams            | [`static/arch/`](../static/arch/)                              |
| Site images                       | [`static/img/`](../static/img/)                                |

**Port rule:** Astro serves these from `public/` in v2. The directory
*layout* moves; the *filenames* stay. URLs continue to resolve at
`/trainer-demo-deploy/templates/images/<name>`,
`/trainer-demo-deploy/arch/<name>`, `/trainer-demo-deploy/img/<name>`.

## What is **NOT** a source of truth

The following must NOT be carried forward unchanged. v2 replaces them
outright:

- `docusaurus.config.js` — Astro has its own config; only the *data*
  it contains (nav, footer, scripts) ports forward.
- `sidebars.js` — Astro doesn't use Docusaurus sidebars.
- `src/theme/*` — Docusaurus theme overrides; v2 has its own layout.
- `src/components/Feature.js`, `HomepageFeatures.js` — port the *copy*
  per the Content table above; rewrite the components in Astro.
- `babel.config.js`, `tsconfig.json` (root) — replaced by Astro's.
- `package.json` scripts — replaced (see [`new-in-v2.md`](./new-in-v2.md)
  §package.json).

## Use this doc when…

- An ADR is being drafted and you're not sure whether a thing is
  "data we keep" or "design we redo."
- An agent (or fresh contributor) needs to know what to read first.
- A reviewer wants to verify a v2 PR didn't lose something.

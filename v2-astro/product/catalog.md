# Catalog (Gallery) spec

The catalog is the **non-negotiable** surface. Trainers use it daily;
losing functionality breaks the product.

## Data source

- **Single source of truth:** [`static/templates.json`](../../../static/templates.json).
- v2 reads it directly. No shape change, no rename, no migration.
- Type definitions in `src/data/tags.ts` (ported from the current
  `src/data/tags.tsx`). Keep field names identical.

`templates.json` entry shape (subset — see `tags.ts` for the full `User`
type):

```ts
type User = {
  title: string;
  description: string;
  preview: string;          // screenshot path
  website: string;          // azd template repo URL
  author: string;           // "Name" or "Name, Name"
  source: string | null;    // GitHub repo URL
  demoguide: string | null; // optional demo-guide URL
  courseblueprint: string | null;
  tags: TagType[];
  cost: string;
  deploytime: string;
  prereqs: string;
};
```

## Required capabilities (must-preserve)

Every capability below exists today and is non-negotiable for v2 launch.

| # | Capability                                                                 | Today's component                              |
| - | -------------------------------------------------------------------------- | ---------------------------------------------- |
| 1 | Show all templates as cards (title, description, preview image, tags)       | `ShowcaseCard`                                 |
| 2 | Filter by tag (multi-select)                                               | `ShowcaseLeftFilters`                          |
| 3 | Filter by author (multi-select)                                            | `ShowcaseAuthorSelect`                         |
| 4 | Full-text search across title + description                                | `ShowcaseTemplateSearch`                       |
| 5 | Empty-state when filters return zero results                                | `ShowcaseEmptyResult`                          |
| 6 | Click card → side panel with full template detail                          | `ShowcaseCardPanel`                            |
| 7 | One-click "Copy `azd init -t <repo>`" with toast                           | `ShowcaseCard` (Fluent Popover)                 |
| 8 | Show prereqs (cost, deploy time, prereqs prose) in panel                   | `ShowcasePrereqs`                              |
| 9 | Show demo-guide link/embed when `demoguide` is set                         | `ShowcaseDemoGuide`                            |
| 10 | Show GitHub stars badge from `source`                                      | `ShowcaseGitHubStars`                          |
| 11 | "MCT Authored" badge for MCT-tagged templates                              | inline in `ShowcaseCard`                       |
| 12 | "New" / "Hot" decorations for tagged templates                             | inline in `ShowcaseCard`                       |
| 13 | Multi-author rendering ("Jane Doe, John Smith")                            | `ShowcaseMultipleAuthors`                      |
| 14 | Direct deep-link to a single card (`?id=…` or `/#…`)                       | `pages/ShowcaseCardPage.tsx`                   |
| 15 | Light/dark theme support                                                   | `useColorMode` + Fluent themes                 |
| 16 | Share to Twitter/LinkedIn from the card panel                              | check current `ShowcaseCardPanel` for buttons  |
| 17 | Survey card / feedback link                                                | `ShowcaseSurveyCard`                           |
| 18 | Per-card "favorite" star (if currently implemented)                         | `FavoriteIcon`                                 |
| 19 | Adobe Analytics + App Insights event on `azd init` copy                    | `data-m="…"` attributes on the copy button     |

If a capability is intentionally retired in v2, write an ADR. Default is
to keep it.

## Implementation approach (v2)

- The catalog page renders the card grid server-side at build time
  (full `templates.json` is small enough — currently a few hundred KB).
- Filtering and search are client-side, hydrated by a single island
  (vanilla TS preferred, React island acceptable if porting the Fluent
  components is cheaper than rewriting).
- The card panel is a route-less side sheet driven by URL hash (`#id`),
  so deep-linking falls out for free.
- Fluent UI dependency: TBD. Options:
  - Keep `@fluentui/react-components` for the panel only.
  - Replace with Tailwind + headless dialog (cheaper deps, more uniform
    visual language).
  - Decision deferred to [`open-questions.md`](../open-questions.md) #C-1.

## Search behavior

- Case-insensitive substring match against title + description.
- Tag/author filters are AND across categories, OR within a category.
  (Same as today's `ShowcaseLeftFilters`.)
- Filter state is reflected in the URL query string so it's
  shareable/bookmarkable. Reset link clears all.

## Analytics events

- `azd init` copy click: emit the same Adobe Analytics + App Insights
  events that today's `ShowcaseCard` does. Don't change event shape.
- Tag/author filter changes: optional, deferred to v2.x.

## Tests

See [`quality/test-plan.md`](../quality/test-plan.md) §Catalog. Highest
priority: smoke test that every template renders, the copy button works,
and the panel opens.

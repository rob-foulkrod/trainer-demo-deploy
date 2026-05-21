# Open questions

Decisions deferred during spec drafting. Each has an ID, a question, a
proposed resolution, and an owner. Resolve before the relevant phase
begins.

## C — Catalog

### C-1: Fluent UI vs Tailwind-native catalog port

**Question:** Do we keep the `@fluentui/react-components` and
`@fluentui/react` dependencies for the card panel + inputs, or rewrite
in Tailwind + headless components?

**Options:**

1. Keep Fluent: faster port, larger bundle, two design systems on one
   page.
2. Replace with Tailwind + Radix (or `@headlessui/react`, or `<dialog>`):
   slower port, tighter bundle, single design system.

**Proposed resolution:** Option 2. The home + BYOD pages are
Tailwind-native; having Fluent show up only on the catalog is jarring.
But the answer depends on the trainer team's tolerance for a tiny visual
change to the panel.

**Owner:** Design + catalog maintainers.
**Decide by:** Start of Phase 2.

## D — Delivery

### D-1: Stick with `npm install` in CI, or solve cross-platform lockfile differently

**Question:** Is `npm install --no-audit --no-fund` in CI the long-term
answer, or do we switch to pnpm / add a lockfile bot?

**Options:**

1. **Stay with `npm install`** — chosen for v2 launch.
2. **Add a lockfile-bot** that regenerates `package-lock.json` on
   Linux nightly and on dependency-change PRs.
3. **Switch to pnpm** — `pnpm-lock.yaml` has better cross-platform
   resolution semantics.

**Proposed resolution:** Option 1 for v2; revisit at v2.x if the
lockfile drift causes a real incident.

**Owner:** Release engineer.
**Decide by:** v2.x planning.

## O — Observability

### O-1: Real-user web-vitals reporting

**Question:** Do we ship a small RUM (real-user-monitoring) script in
v2, or wait?

**Options:**

1. **Ship now**: `web-vitals` library → App Insights, gated by user
   consent / cookie banner state.
2. **Defer to v2.x**: Lighthouse CI is enough for v2 launch.

**Proposed resolution:** Defer. Adds JS weight and a privacy review
we don't have time for. Track in v2.x.

**Owner:** Catalog maintainers + privacy review.
**Decide by:** v2.x planning.

### O-2: OPX engagement metrics

**Question:** Do we instrument `opx:done` events to measure carousel
watch-through?

**Options:**

1. **Yes**: dispatch each `opx:done` to App Insights with `id` and
   `iteration`.
2. **No**: trust that the homepage retention metric is enough.

**Proposed resolution:** Yes, but only after launch. Out of scope for
v2 launch.

**Owner:** Catalog maintainers.
**Decide by:** v2.x planning.

## P — Product

### P-1: FAQ port

**Question:** Do we port the existing `docs/1-faq/*` content as-is, or
trim it during the port?

**Proposed resolution:** Port as-is to keep the cutover surgical.
Trim in a follow-up PR.

**Owner:** TL.
**Decide by:** Phase 4.

### P-2: Contribute page port

**Question:** The existing `docs/contribute.md` references Docusaurus-
specific paths. Do we update during port?

**Proposed resolution:** Yes — update text to reference v2 paths and
authoring flows during the port. Don't ship outdated paths.

**Owner:** TL.
**Decide by:** Phase 4.

## R — Rollout

### R-1: Coordination with course launches

**Question:** When can we safely cut over without conflicting with a
high-traffic course launch?

**Proposed resolution:** Coordinate with the trainer team calendar
before scheduling the cutover PR merge. Avoid Mondays (Microsoft Build
period) and the AI-103 launch window.

**Owner:** TL + trainer-team lead.
**Decide by:** Start of Phase 5.

---

When resolving an open question:

1. Update the entry above with the chosen option and a brief rationale.
2. If the resolution warrants an ADR (e.g. C-1, D-1), open one in
   `architecture/adr/`.
3. Update any other spec docs that referenced the open question.

---

## Also see

Decisions that have *already* been made and locked into the spec live
in [`new-in-v2.md`](./new-in-v2.md) (the 7 v2-only decisions) and the
ADRs under [`architecture/adr/`](./architecture/adr/). The list above
is only for things still open.

For anything where you're tempted to add a new open question, first
check [`sources-of-truth.md`](./sources-of-truth.md) — the answer may
already exist in the current codebase.

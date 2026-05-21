# Accessibility

## Target

**WCAG 2.2 Level AA** on every public page. Lighthouse a11y score ≥ 95.

## Per-surface notes

### Header / nav

- Logo link has `aria-label="Trainer Demo Deploy — home"`.
- Theme toggle is a `<button>` with `aria-label="Toggle color theme"`
  and an `aria-pressed` reflecting the current mode.
- Focus order matches visual order.

### Home page

- The OPX panel is `role="region" aria-label="Orchestrator preview"`.
- The transcript stream is `aria-live="polite"` so screen readers
  announce new beats — but with a debounce / queue so they don't fire
  five times in a row on counter ticks.
- The composer's typing animation is presentational; the typed text is
  not announced (use `aria-hidden="true"` on the typing display).
- The feature cards are normal `<a>` elements with descriptive text;
  no extra ARIA needed.

### Gallery

- The search input has a visible label.
- Filter checkboxes are real `<input type="checkbox">` with `<label>`,
  not divs.
- The card panel is a `<dialog>` (or polyfilled equivalent) with focus
  trap, ESC to close, and focus restoration to the originating card on
  close.
- Card "Copy azd init" buttons announce the success state via a polite
  live region.

### BYOD pages

- Standard prose pages. No special considerations.

## Motion

Respect `prefers-reduced-motion: reduce`:

- OPX typing animation: skipped (body appears immediately).
- OPX status dot pulse: disabled.
- Carousel cross-fade: replaced with instant swap.
- Card hover lift: disabled.
- Hero gradient: static (no animated movement, if any).

Implementation: CSS `@media (prefers-reduced-motion: reduce)` plus a JS
check in the OPX runtime.

## Color contrast

- Body text on background: ≥ 4.5:1 in both themes.
- Large text and UI components: ≥ 3:1.
- Tested via Lighthouse a11y audit per page.
- Brand violet on white is borderline; use the `text-[#8661C5]` only on
  ≥18px text or non-text elements.

## Keyboard

- Every interactive element is reachable via Tab.
- Visible focus ring on every focusable element. Never `outline: none`
  without a replacement.
- ESC closes the card panel and any other modal.
- Arrow keys move between carousel pips.

## Screen reader smoke tests

Required before v2 launch:

- NVDA + Firefox on Windows
- VoiceOver + Safari on macOS

Test scripts:

1. Land on `/`, tab through, hear the nav, hear the hero CTAs.
2. Land on `/gallery`, hear the count of templates, filter to "ai-102",
   hear the updated count.
3. Open a card panel via keyboard, hear the template title and tags,
   close with ESC, focus returns to the card.

Document findings; file issues for anything below "fully understandable".

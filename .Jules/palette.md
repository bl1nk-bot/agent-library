## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2024-05-18 - Proper State Conveyance & Focus for Custom Controls

**Learning:** Custom toggle buttons (like "On/Off" switches) require `aria-pressed={boolean}` to correctly announce their current state to screen readers. Furthermore, `<input type="range">` elements need an explicit `aria-label` when their visual label is not formally linked via `htmlFor`. Finally, elements that rely on `focus-visible` for keyboard accessibility must explicitly declare `focus-visible:outline-none` when applying custom focus rings to avoid double-rendering browser default outlines.
**Action:** When implementing custom toggles, always apply `aria-pressed`. Ensure range inputs have accessible names via `aria-label`. Always pair `focus-visible:ring-*` with `focus-visible:outline-none`.

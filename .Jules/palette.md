## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2024-06-21 - Add aria-pressed and focus-visible states to custom toggle buttons

**Learning:** Custom interactive elements (like language selectors and music toggles) often act like switches or radios, but lack built-in state announcements and focus visibility. Keyboard users struggle to see which item is focused without explicit `focus-visible` styles, and screen reader users can't hear which option is active without `aria-pressed`.
**Action:** When implementing custom toggle buttons or selectable grid options (like language pickers), apply `aria-pressed={isActive}` to communicate state, and include `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2` (using brand colors) to guarantee keyboard accessibility.

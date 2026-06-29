## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-04-27 - Add aria-pressed and focus styles to standard toggle buttons
**Learning:** Custom toggle buttons and language selection groups built with standard HTML `<button>` elements in this app frequently lack the `aria-pressed` attribute to indicate active state to assistive technology, and miss explicit focus styling for keyboard navigation.
**Action:** Always apply `aria-pressed={boolean}` to single switch toggles or grouped selectable buttons, and pair them with explicit focus visibility (e.g., `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-offset-2`).

## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2025-05-18 - Hover states need focus states

**Learning:** Using `group-hover:opacity-100` to reveal visually hidden controls (like the history delete button) hides the element from keyboard users since the element is not visible during focus navigation.
**Action:** Always pair `group-hover` with `:focus-visible` states (e.g., `group-focus-visible:opacity-100 focus-visible:opacity-100`) to ensure visibility during keyboard navigation.

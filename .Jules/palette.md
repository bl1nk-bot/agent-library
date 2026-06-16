## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2025-02-23 - Accessibility for Toggle Button Groups and Emojis

**Learning:** Custom UI toggle buttons acting as a group (like language selectors) or single switches (like music toggle) need `aria-pressed` to correctly convey their active state to screen readers. In addition, when decorative emojis are used alongside text labels within interactive elements, they need to be wrapped in a `<span aria-hidden="true">` to prevent assistive tech from reading them out loud and causing confusion.
**Action:** Always apply `aria-pressed={boolean}` on standard HTML `<button>` elements that behave like toggles or selections. Whenever placing decorative emojis inside interactive components that already have text labels, enclose the emojis in a `span` with `aria-hidden="true"`.

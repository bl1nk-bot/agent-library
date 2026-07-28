## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-30 - Add ARIA pressed state and hide decorative emojis in custom toggle buttons

**Learning:** For custom toggle buttons or selectable elements acting as a group (like language selection) that use standard HTML `<button>` tags, `aria-pressed={boolean}` should be applied to convey the active state to assistive technology. Furthermore, when decorative emojis are used alongside text labels, wrapping the emoji in a `<span>` with `aria-hidden="true"` prevents redundant or confusing screen reader announcements.
**Action:** Always apply `aria-pressed` to custom toggle buttons and add `aria-hidden="true"` to wrapper spans around decorative emojis.

## 2026-07-28 - Ensure hover-only actions remain keyboard accessible

**Learning:** When actions within lists or cards (like a delete button) are hidden by default and only shown on hover (`opacity-0 group-hover:opacity-100`), keyboard-only users will not see them when navigating via tab, hiding critical functionality.
**Action:** Always append focus visibility styles (e.g., `focus-visible:opacity-100`) to elements that rely on hover state for visibility, so they appear when a keyboard user focuses on them.

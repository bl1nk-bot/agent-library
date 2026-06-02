## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-04-27 - Add aria-pressed to toggle buttons

**Learning:** For toggle buttons and selection groups (like language pickers) implemented using standard `<button>` tags, `aria-pressed` must be applied and bound to the active state boolean to properly convey their selection state to assistive technologies, avoiding ambiguity compared to native radio buttons.
**Action:** Always apply the `aria-pressed={boolean}` attribute to custom toggle buttons or buttons acting as a selectable group.

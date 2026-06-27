## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2024-03-24 - Accessible Input Volume Controls

**Learning:** React range inputs often miss `aria-label` which breaks accessibility context. Moreover, toggle buttons switching emojis natively announce redundantly, so wrapping them in a screen-reader hidden span improves UX.
**Action:** Next time when implementing input type range, ensure there is an aria-label attached unless there is an associated HTML label. Wrap decorative emojis toggled dynamically inside `span aria-hidden="true"`.

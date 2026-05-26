## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-26 - Hide decorative inner components inside accessible parents

**Learning:** When using composite parent components like `Link` or `button` that have an `aria-label`, any inner decorative icons (like Lucide icons or custom components like `Terminal` and `Globe`) need `aria-hidden="true"` to prevent redundant screen reader announcements, especially in mapping functions that render multiple navigation items.
**Action:** When adding accessible navigation items, ensure the child icons inside the labeled `Link` or `button` elements have `aria-hidden="true"`.

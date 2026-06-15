## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.
## 2024-05-18 - Tooltip ARIA and `aria-hidden` attributes
**Learning:** Using `useTranslations` for setting ARIA labels inside common shared components like `CopyButton` works perfectly since translations are available through next-intl.
**Action:** When creating new components that require small text elements like `aria-label` or `title`, always ensure translations are configured appropriately. For icon-only buttons, applying `aria-hidden="true"` to the internal SVG (like Lucide React components) prevents redundant announcements.

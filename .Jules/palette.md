## 2026-04-26 - Accessible Icon-Only Buttons
**Learning:** When using purely decorative icons from libraries like `lucide-react` within an icon-only button that has a descriptive `aria-label`, the icon elements themselves must explicitly include `aria-hidden="true"`.
**Action:** Always combine `aria-label` on the interactive element (e.g., `<button>`) with `aria-hidden="true"` on its internal decorative elements to prevent screen readers from making redundant or confusing announcements.

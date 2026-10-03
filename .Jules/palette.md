## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-30 - Add ARIA pressed state and hide decorative emojis in custom toggle buttons

**Learning:** For custom toggle buttons or selectable elements acting as a group (like language selection) that use standard HTML `<button>` tags, `aria-pressed={boolean}` should be applied to convey the active state to assistive technology. Furthermore, when decorative emojis are used alongside text labels, wrapping the emoji in a `<span>` with `aria-hidden="true"` prevents redundant or confusing screen reader announcements.
**Action:** Always apply `aria-pressed` to custom toggle buttons and add `aria-hidden="true"` to wrapper spans around decorative emojis.
## 2024-11-20 - Adding Accessible Focus and Labels to Custom Media Controls
**Learning:** In the kids section of the application, custom media controls like play toggles and volume sliders lacked keyboard focus rings (`focus-visible:ring-2`) and screen reader properties (`aria-pressed`, `aria-label`). Next.js UI components need explicit focus styling since default browser outlines are often suppressed by reset styles or custom backgrounds.
**Action:** Always verify custom range inputs (`type="range"`) and toggle buttons have explicit `aria-label` or `aria-pressed` properties respectively, and add `focus-visible:ring-[#8B4513]` (or appropriate theme color) for keyboard users when building interactive controls.

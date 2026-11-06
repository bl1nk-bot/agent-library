## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-30 - Add ARIA pressed state and hide decorative emojis in custom toggle buttons

**Learning:** For custom toggle buttons or selectable elements acting as a group (like language selection) that use standard HTML `<button>` tags, `aria-pressed={boolean}` should be applied to convey the active state to assistive technology. Furthermore, when decorative emojis are used alongside text labels, wrapping the emoji in a `<span>` with `aria-hidden="true"` prevents redundant or confusing screen reader announcements.
**Action:** Always apply `aria-pressed` to custom toggle buttons and add `aria-hidden="true"` to wrapper spans around decorative emojis.

## 2026-11-06 - Add focus states and aria-current to custom pixel-art pagination/steppers

**Learning:** When building custom pagination or stepper controls (like the dot indicators in the kids section) using `<button>` elements, it is critical to apply `aria-current="step"` to the active item to convey the current state to assistive technology. Additionally, when elements use complex CSS `clip-path` for pixel-art styling, default focus rings may be clipped or obscured unless `focus-visible:ring-inset` or `focus-visible:ring-offset-2` is carefully applied to ensure keyboard navigability remains visible.
**Action:** Always apply `aria-current="step"` (or similar) to the active item in custom pagination/stepper controls. When using `clip-path`, explicitly test keyboard focus states and apply `focus-visible` utility classes with appropriate offsets or insets to guarantee visibility.

## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-30 - Add ARIA pressed state and hide decorative emojis in custom toggle buttons

**Learning:** For custom toggle buttons or selectable elements acting as a group (like language selection) that use standard HTML `<button>` tags, `aria-pressed={boolean}` should be applied to convey the active state to assistive technology. Furthermore, when decorative emojis are used alongside text labels, wrapping the emoji in a `<span>` with `aria-hidden="true"` prevents redundant or confusing screen reader announcements.
**Action:** Always apply `aria-pressed` to custom toggle buttons and add `aria-hidden="true"` to wrapper spans around decorative emojis.

## 2026-06-15 - Add focus-visible rings to custom interactive elements for keyboard accessibility

**Learning:** When creating custom interactive elements (like `pixel-btn` instances) that eschew standard browser focus outlines, failing to provide explicit focus indicators breaks keyboard accessibility. Using the `focus-visible:` variant (e.g., `focus-visible:ring-2 focus-visible:outline-none`) ensures that users navigating via keyboard can clearly see their focus state, while preventing the focus ring from appearing when mouse users click the elements.
**Action:** Always verify that custom buttons and links have explicit `focus-visible:ring-2` styles applied to maintain keyboard accessibility without sacrificing visual aesthetics for pointing devices.

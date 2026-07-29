## 2026-04-27 - Add ARIA labels and hide decorative icons in icon-only buttons

**Learning:** For icon-only buttons, applying `aria-label` to the button is necessary for screen readers, but the inner SVG icon must also include `aria-hidden="true"` to prevent redundant or confusing announcements.
**Action:** Always pair an `aria-label` on an icon-only `<button>` with an `aria-hidden="true"` attribute on its inner `<svg>` or `<LucideIcon>`.

## 2026-05-30 - Add ARIA pressed state and hide decorative emojis in custom toggle buttons

**Learning:** For custom toggle buttons or selectable elements acting as a group (like language selection) that use standard HTML `<button>` tags, `aria-pressed={boolean}` should be applied to convey the active state to assistive technology. Furthermore, when decorative emojis are used alongside text labels, wrapping the emoji in a `<span>` with `aria-hidden="true"` prevents redundant or confusing screen reader announcements.
**Action:** Always apply `aria-pressed` to custom toggle buttons and add `aria-hidden="true"` to wrapper spans around decorative emojis.

## 2026-07-24 - Restore keyboard accessibility to custom buttons

**Learning:** When styling custom interactive UI elements that remove native browser focus outlines (e.g., pixel-btn components or custom toggles), keyboard accessibility is lost for tab-navigation users.
**Action:** Always restore keyboard accessibility by adding explicit focus-visible: utility classes (like focus-visible:ring-agent-cyan focus-visible:ring-2 focus-visible:outline-none) to custom buttons. This ensures keyboard users can see their focus state without applying persistent focus outlines for mouse users.

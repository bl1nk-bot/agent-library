## 2024-05-08 - Icon Button Accessibility Pattern

**Learning:** Found that `<Button size="icon">` in this app is often used with child SVG/icons and an inner `<span className="sr-only">`. However, the app memory indicates: "For icon-only buttons, always apply an `aria-label` and `title` (using localized strings via next-intl) to the `<button>` element, add `aria-hidden="true"` to the inner SVG or LucideIcon, and remove any redundant inner `<span className="sr-only">` elements to prevent duplicate screen reader announcements."
**Action:** Applied this accessibility pattern to the layout header toggle buttons (e.g., developers link, create prompt, Chrome extension, theme toggle, language selector).

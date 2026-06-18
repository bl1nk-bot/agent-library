## 2024-04-26 - Combining aria-label and aria-hidden on icon buttons
**Learning:** When using `<span className="sr-only">` inside a button, if the button also contains an SVG icon that lacks `aria-hidden="true"`, screen readers may redundantly announce both the hidden text and potentially cryptic information about the SVG itself.
**Action:** The preferred approach for icon-only buttons is to place the `aria-label` directly on the `<button>` element and apply `aria-hidden="true"` to any decorative SVG components inside it. This provides a single, clear announcement.

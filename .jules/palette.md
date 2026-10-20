## 2026-06-15 - Improve volume slider accessibility

**Learning:** When using standard HTML `<input type="range">` elements, they require an `aria-label` or an associated `<label>` for screen readers to understand what the slider controls. Additionally, interactive elements without default focus styles must receive custom `focus-visible` styles to remain keyboard-accessible.
**Action:** Always provide an `aria-label` for range sliders that lack a visible label, and ensure `focus-visible` utility classes are consistently applied to custom UI inputs and buttons to support keyboard navigation.

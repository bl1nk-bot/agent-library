## 2024-05-24 - Interactive Elements Missing Keyboard Focus Styles

**Learning:** Native `<button>` elements in custom UI components (like modal dialogs and settings panes) often lack explicit `focus-visible` styling when they rely on background hover states. This is especially prevalent in customized "kids" components.
**Action:** Always append `focus-visible:ring-2 focus-visible:ring-[#8B4513] focus-visible:outline-none` (using the context-appropriate theme color) to all interactive elements to ensure clear keyboard accessibility.

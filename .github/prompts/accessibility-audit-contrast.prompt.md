---
description: "Audit color contrast ratios across the repository against WCAG AA standards"
argument-hint: "[file path or file pattern]"
agent: "accessibility"
---

Conduct a color contrast audit focusing on WCAG compliance.

**Audit Standards:**
- Normal text: minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18pt+): minimum 3:1 contrast ratio
- Interactive elements: sufficient contrast for visibility
- No color as sole means of conveying information

**Detection:**
- Scan CSS and inline styles for low-contrast text
- Identify text on background color combinations
- Flag interactive elements (buttons, links) with insufficient contrast
- Check for color-dependency patterns in UI components

**Reporting:**
- Display current contrast ratios with WCAG compliance status
- Provide suggested color adjustments to meet AA or AAA standards
- List all affected files and specific lines
- Include tools for manual verification (WebAIM Contrast Checker reference)

**Output Format:**
- Severity: Critical/High (failing WCAG AA)
- File locations with contrast-failing elements
- Recommended color values to achieve compliance

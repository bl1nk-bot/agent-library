---
description: "Fix accessibility issues in form components with auto-remediation"
argument-hint: "file path or directory (e.g., src/components/forms)"
agent: "accessibility"
---

Scan and fix accessibility issues in form components within the specified path.

**Focus Areas:**
- Missing `<label>` associations with form inputs
- Form validation errors not announced to screen readers
- Missing `aria-required` and `aria-invalid` attributes
- Placeholder text used without proper labels
- Missing `<fieldset>` and `<legend>` for grouped inputs
- Inaccessible error messages

**Automation:**
- Automatically inject missing label attributes and ARIA properties
- Wrap related inputs in semantic `<fieldset>` elements
- Add `aria-live="polite"` for validation messages
- Comment remaining issues requiring manual intervention

**Output:**
- List of auto-fixed form components
- Number of fields remediated
- Any manual fixes needed and their locations

---
description: "Run a comprehensive accessibility scan across the entire repository to identify WCAG violations"
argument-hint: "[optional scope: all files, or specific path]"
agent: "accessibility"
---

Run a comprehensive accessibility audit across the entire repository.

**Scanning Scope:**
- All HTML, JSX, TSX, and template files
- Check for all 10 accessibility violation categories (alt text, keyboard navigation, forms, color contrast, semantic HTML, ARIA, media, dynamic content, mobile, skip links)

**Processing:**
1. Identify all accessibility issues and classify by WCAG level (A/AA/AAA) and severity (Critical/High/Medium/Low)
2. Automatically fix detectable issues with direct code modifications
3. Mark unfixable issues with HTML comment markers
4. Generate or append findings to `a11y-audit-report.md`

**Output:**
- Summary of total issues found, auto-fixed, and pending review
- List of all modified files with exact changes
- Report location: `a11y-audit-report.md` (repository root)

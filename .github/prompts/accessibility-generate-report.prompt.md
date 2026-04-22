---
description: "Generate or update the comprehensive accessibility audit report"
argument-hint: "[optional: include auto-fixes in report]"
agent: "accessibility"
---

Create or update the bundled accessibility audit report (`a11y-audit-report.md`).

**Report Contents:**
1. **Summary Section**
   - Total issues found (by category)
   - Issues auto-fixed vs. pending review
   - Timestamp and scan scope

2. **Applied Auto-Fixes Section**
   - List of files modified
   - Exact changes made with code snippets
   - Commit-ready format

3. **Pending Review Section**
   - Issues requiring human judgment
   - Code snippets with HTML comment markers
   - Impact assessment and remediation guidance
   - WCAG level and severity classification

4. **Issue Categorization**
   - Grouped by WCAG level (A, AA, AAA)
   - Sorted by severity (Critical → Low)
   - Organized by violation category

**Format:**
- Markdown with clear navigation
- Code blocks with language hints
- Actionable remediation steps for each issue

**Output:**
- Repository root: `a11y-audit-report.md`
- Ready for developer review and inline fixes

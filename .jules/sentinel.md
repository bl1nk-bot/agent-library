## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2026-04-16 - [XSS via inline dangerouslySetInnerHTML]

**Vulnerability:** `dangerouslySetInnerHTML` was used in `src/app/embed/page.tsx` with a custom text escaping and regex replacement method to add syntax highlighting to mentions. This approach is prone to XSS if escaping logic is flawed or misses specific edge cases.
**Learning:** React is fundamentally designed to prevent XSS. Manual escaping with `dangerouslySetInnerHTML` defeats the purpose of React's built-in protections and should be avoided for inline formatting.
**Prevention:** Instead of using regex with string replacements to inject HTML, parse the string with a capturing regex into an array and map the segments directly to an array of React components.

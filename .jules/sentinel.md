## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2025-06-25 - XSS Vulnerability in Embed Designer via Custom escapeHtml

**Vulnerability:** The `src/app/embed/page.tsx` file used `dangerouslySetInnerHTML` combined with a manually written `escapeHtml` function to process and display prompt inputs, creating an XSS risk.
**Learning:** The previous implementation failed to leverage React's built-in XSS protections (which safely encode text nodes by default). Relying on custom regex-based HTML escaping in modern frontend frameworks is often unnecessary and error-prone.
**Prevention:** Avoid `dangerouslySetInnerHTML` for basic text manipulation or inline string highlighting (like @mentions). Instead, use `String.prototype.split` with regex capture groups to map text segments into safe React node arrays directly within JSX.

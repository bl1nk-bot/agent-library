## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2024-09-24 - Prevent SSRF via Redirects

**Vulnerability:** External fetch calls configured with user-controlled URLs (such as webhooks and API testing) were vulnerable to SSRF attacks if the initial requested URL redirected to a restricted internal network address, bypassing the initial URL validation.
**Learning:** Always use `{ redirect: "error" }` (or `"manual"`) on fetch requests to user-provided URLs when validating against SSRF, even if the initial URL string is validated, to prevent redirect bypasses.
**Prevention:** Require `redirect: "error"` on all server-side fetch calls in the codebase where the destination URL is user-controlled or dynamically generated.

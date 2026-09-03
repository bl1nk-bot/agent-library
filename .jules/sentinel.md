## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2026-09-03 - SSRF Redirect Vulnerability Prevention

**Vulnerability:** Fetch requests used for webhook/API testing did not prevent redirects, allowing attackers to potentially bypass URL validation (which blocks private IPs) by redirecting a public URL to an internal one.
**Learning:** Even if `validateUrl` / `isPrivateUrl` checks the initial hostname before a fetch, an SSRF vulnerability can still exist if the endpoint responds with an HTTP redirect (e.g. 301, 302) pointing to a restricted internal network address, and the `fetch` API follows it by default.
**Prevention:** Always set `redirect: "error"` (or `"manual"`) on outgoing `fetch` requests when calling user-provided URLs to prevent unexpected server-side redirects to private/internal networks after initial URL validation.

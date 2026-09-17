## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2024-09-17 - SSRF Vulnerability in URL Fetching

**Vulnerability:** User-provided URLs (like `inputImageUrl` in Wiro media generator) were being fetched without validation, allowing Server-Side Request Forgery (SSRF). Additionally, redirects were not disabled in subsequent fetch calls.
**Learning:** Even if a URL looks external, attackers can provide URLs that resolve to internal IPs (e.g. `127.0.0.1` or `169.254.169.254`) or use DNS rebinding. They can also use external URLs that redirect to internal IPs if redirects are followed automatically by `fetch`.
**Prevention:** Always validate user-provided URLs using `validateUrl` from `@/lib/security` before fetching. Furthermore, explicitly set `{ redirect: "error" }` in the `fetch` options to prevent redirect bypasses to internal networks.

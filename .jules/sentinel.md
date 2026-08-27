## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2026-08-27 - Fix Server-Side Request Forgery vulnerabilities

**Vulnerability:** Found `fetch()` endpoints executing calls with webhook URLs and configurations without enforcing a DNS IP validation. Additionally, HTTP requests did not have `redirect: "error"` set to prevent attacker bypasses via HTTP 301/302 redirects.
**Learning:** Using regex or basic strings like `isPrivateUrl` to validate URLs is not sufficient for SSRF mitigation, because DNS names could point to local addresses like `127.0.0.1` after resolution, or public endpoints could redirect to internal IPs.
**Prevention:** Always validate user-provided URLs using `validateUrl` which performs DNS lookup and checks if the resolved IP is private. Crucially, append `redirect: "error"` to the `fetch()` calls to prevent bypass via redirects.

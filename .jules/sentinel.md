## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2026-04-16 - [XSS via dangerouslySetInnerHTML for Inline Formatting]

**Vulnerability:** Using `dangerouslySetInnerHTML` for inline text formatting (like highlighting user mentions) allows XSS if the input content contains malicious HTML/JavaScript and is not fully sanitized (or simply escaped manually before injection, which can be error-prone).
**Learning:** `dangerouslySetInnerHTML` should never be used for simple text parsing or formatting because it overrides React's default behavior of escaping string values.
**Prevention:** Avoid `dangerouslySetInnerHTML` for inline text formatting. Instead, parse the string using a capturing regex and map the resulting array segments directly into an array of React nodes.

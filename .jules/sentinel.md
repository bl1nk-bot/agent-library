## 2026-04-16 - [XSS via JSON-LD Structured Data]

**Vulnerability:** JSON-LD structured data serialized with `JSON.stringify` directly into `<script>` tags can be exploited for XSS if user-controlled input contains unescaped `<` characters.
**Learning:** `JSON.stringify` alone does not escape HTML characters. Malicious user input (e.g. in prompt descriptions) could cause early script termination (e.g. `</script><script>alert(1)</script>`).
**Prevention:** Use the `safeJsonLd` utility function which serializes the data and escapes `<` characters as `\u003c` to safely prevent script tag termination.

## 2026-04-16 - [GitHub Actions Secrets in PRs]

**Vulnerability:** GitHub Actions workflows that depend on secrets (like `ADD_TO_PROJECT_PAT`) can fail with "Bad credentials" if run from forks, where secrets are not exposed to the runner.
**Learning:** Hard failures in workflows due to missing secrets create noisy CI environments and can potentially leak the absence of specific tokens.
**Prevention:** Always check for the existence of required secrets in the job's `if` condition (e.g., `if: secrets.ADD_TO_PROJECT_PAT != ''`) before executing steps that require them.

## 2026-04-16 - [XSS via dangerouslySetInnerHTML for Inline Formatting]

**Vulnerability:** The application used `dangerouslySetInnerHTML` to render text where mentions (like `@user`) were dynamically replaced with HTML tags (e.g., `<span class="mention">@user</span>`). If the user input contained malicious HTML or script tags, they would be executed in the user's browser, leading to XSS.
**Learning:** `dangerouslySetInnerHTML` is extremely risky when combined with unstructured user input, even if partial escaping mechanisms are attempted.
**Prevention:** Avoid `dangerouslySetInnerHTML` for inline text formatting. Instead, parse the string into tokens using a capturing regex (e.g., `text.split(/(@\w+)/g)`) and map the resulting array segments directly into an array of React nodes (e.g., using a `<span>`). This allows React to natively and safely handle escaping for all other text segments.

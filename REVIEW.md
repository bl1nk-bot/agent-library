# Code Security Review

Perform a comprehensive security audit of pull request changes. This review covers the OWASP Top 10 vulnerability categories, authentication and authorization issues, and common security anti-patterns found in code changes.

## Workflow

### 1. Analyze the Pull Request

Examine the diff of the PR and identify security-relevant files. Pay special attention to authentication flows, database queries, API endpoints, input handlers, and configuration files. Read the full context of each changed file before forming conclusions.

### 2. Scan for Vulnerabilities

Check the changes against the following vulnerability categories:

#### Broken Access Control (A01)

- Missing authentication checks on sensitive endpoints
- Insecure Direct Object References (IDOR) that allow users to access other users' data
- Privilege escalation through missing authorization logic
- Path traversal in file access or URL routing

#### Cryptographic Failures (A02)

- Hardcoded secrets such as API keys, passwords, or tokens in source code
- Weak or outdated encryption algorithms
- Insecure random number generation for security-sensitive values
- Sensitive data logged in plaintext or exposed through error messages
- Missing encryption for data at rest or in transit

#### Injection (A03)

- SQL injection via string concatenation in database queries
- Command injection through unsanitized input passed to system commands
- NoSQL, LDAP, XPath, or template injection

#### Insecure Design (A04)

- Missing rate limiting on authentication or API endpoints
- Insecure default configurations
- Missing security headers
- Insufficient anti-automation (CAPTCHA) measures

#### Security Misconfiguration (A05)

- Debug mode enabled in production environments
- Verbose error messages that expose internal system details
- Default credentials left in place
- Unnecessary features or endpoints enabled
- Missing security patches

#### Vulnerable and Outdated Components (A06)

- Dependencies with known CVEs
- Unmaintained or abandoned libraries
- Missing security updates in the dependency tree

#### Identification and Authentication Failures (A07)

- Weak password policies
- Missing multi-factor authentication
- Insecure session management (predictable session IDs, missing expiration)
- Missing account lockout mechanisms
- Improper credential storage

#### Software and Data Integrity Failures (A08)

- Missing integrity checks on data or updates
- Insecure deserialization of untrusted data
- Unsigned or unverified software updates
- Missing CI/CD security pipelines

#### Security Logging and Monitoring Failures (A09)

- Insufficient logging of security-relevant events
- Sensitive data written to logs
- Missing audit trails for administrative actions
- No alerting on suspicious activity

#### Server-Side Request Forgery (A10)

- Unvalidated URLs fetched server-side
- Missing URL allowlisting for outbound requests
- Internal network exposure through SSRF

#### Additional Patterns

**Cross-Site Scripting (XSS)** — Look for unescaped output in templates, `innerHTML` or `dangerouslySetInnerHTML` with user input, and missing Content-Security-Policy headers.

**Cross-Site Request Forgery (CSRF)** — Look for missing CSRF tokens on state-changing operations, missing `SameSite` cookie attributes, and incorrect token validation logic.

**Security Headers** — Check for missing `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and weak Content-Security-Policy configurations.

**Input Validation** — Check for missing input validation, insufficient sanitization, type coercion vulnerabilities, and regex denial-of-service (ReDoS) patterns.

**Cookie Security** — Check for missing `HttpOnly`, `Secure`, and `SameSite` flags, as well as overly permissive cookie scope.

### 3. Classify Severity

Assign a severity level to each finding:

| Severity | Criteria |
|----------|----------|
| **Critical** 🔴 | SQL injection, XSS in sensitive contexts, hardcoded secrets, authentication bypass, remote code execution |
| **High** 🟠 | Missing input validation on sensitive operations, weak cryptography, authorization issues, insecure defaults, command injection |
| **Medium** 🟡 | Missing CSRF protection, insecure cookie configuration, excessive logging of sensitive data, missing rate limiting, outdated dependencies |
| **Low** 🟢 | Best practice violations, code quality issues with security implications, missing non-critical security headers, weak password policies |

### 4. Implement Automatic Fixes

For **Critical** and **High** severity issues, apply fixes directly:

- **SQL Injection**: Replace string concatenation with parameterized queries or ORM methods.
- **XSS**: Replace `innerHTML` with `textContent` or use a proper sanitization library.
- **Hardcoded Secrets**: Move secrets to environment variables and add a `.env.example` placeholder.
- **Missing Authentication**: Add authentication and authorization middleware to unprotected endpoints.
- **Input Validation**: Validate and sanitize all user input before use, with appropriate error responses.

### 5. Post a PR Comment

Update or create a PR comment using the HTML comment marker `<!-- security-audit-bot -->` to identify the comment for future updates. Include a summary of findings, automatic fixes applied, and manual review items by severity.

## Detection Patterns

### SQL Injection

| Vulnerable | Safe |
|------------|------|
| `db.query(\`SELECT * FROM users WHERE id = ${id}\`)` | `db.query("SELECT * FROM users WHERE id = ?", [id])` |
| `db.query("SELECT * FROM users WHERE id = " + id)` | `db.query("SELECT * FROM users WHERE id = $1", [id])` |
| String interpolation in table/column names | ORM methods like `User.findById(id)` |

### XSS

| Vulnerable | Safe |
|------------|------|
| `element.innerHTML = userInput` | `element.textContent = userInput` |
| `dangerouslySetInnerHTML` with user data | Proper sanitization libraries |
| Unescaped variables in templates | Auto-escaped template output |
| `eval(userInput)` or `document.write(userInput)` | Avoid eval entirely; use safe APIs |

### Hardcoded Secrets

Look for patterns like `password = "..."`, `api_key = "sk-..."`, `secret = "..."`, `token = "ghp_..."`, `apiKey: "..."`, and private keys embedded in code. Acceptable exceptions include example/placeholder values with `test_`, `example_`, `fake_` prefixes and documentation.

### Authentication Bypass

Look for routes without authentication middleware, `isAdmin` checks without proper validation, direct database queries without user context, and missing ownership checks on resource access.

## Best Practices

1. Fix critical issues immediately — do not wait for manual review.
2. Be specific in recommendations — provide exact code snippets with file paths and line numbers.
3. Update existing comments rather than duplicating — use the `<!-- security-audit-bot -->` marker.
4. Prioritize by severity — address Critical and High findings first.
5. Validate findings before reporting — consider false positives.
6. Ensure fixes do not break existing functionality — check for regressions.
7. Run tests after implementing fixes when possible.
8. Apply appropriate labels to PRs based on the title and nature of changes.

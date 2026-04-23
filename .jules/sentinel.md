
## 2025-05-27 - Cross-Site Scripting (XSS) in JSON-LD rendering
**Vulnerability:** XSS vulnerability through unsafe JSON.stringify in JSON-LD structured data rendering via dangerouslySetInnerHTML.
**Learning:** React's dangerouslySetInnerHTML combined with JSON.stringify for JSON-LD scripts can allow execution of malicious scripts if user input contains a closing </script> tag and a new <script> tag.
**Prevention:** Always escape `<` characters to `\u003c` when serializing JSON data inside script tags using a utility like safeJsonLd.

## 2024-05-07 - Prevent XSS in inline text formatting

**Vulnerability:** Using `dangerouslySetInnerHTML` for inline text formatting (like highlighting user mentions) creates an XSS risk, even when attempting to manually escape HTML characters.
**Learning:** React's built-in escaping is robust and should be preferred. When using a capturing group regex with `String.prototype.split`, matched groups appear at odd indices, and non-matching text appears at even indices, which maps cleanly to React nodes.
**Prevention:** Avoid `dangerouslySetInnerHTML` for text formatting. Parse strings with a capturing regex and map the resulting array segments directly into an array of React nodes, letting React handle the escaping automatically.

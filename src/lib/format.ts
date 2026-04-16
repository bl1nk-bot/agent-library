/**
 * Prettify JSON content with proper indentation
 * Returns the original content if parsing fails
 */
export function prettifyJson(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return content;
  }
}

/**
 * Check if content is valid JSON
 */
export function isValidJson(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely serialize JSON-LD structured data for use in script tags.
 * Escapes `<` as `\u003c` to prevent XSS via early script termination.
 */
export function safeJsonLd(data: unknown): string {
  const str = JSON.stringify(data);
  return str ? str.replace(/</g, '\\u003c') : '{}';
}

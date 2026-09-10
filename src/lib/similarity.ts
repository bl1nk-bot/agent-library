/**
 * Content similarity utilities for duplicate detection
 */

/**
 * Normalize content for comparison by:
 * - Removing variables (${...} patterns)
 * - Converting to lowercase
 * - Removing extra whitespace
 * - Removing punctuation
 */
export function normalizeContent(content: string): string {
  return (
    content
      // Remove variables like ${variable} or ${variable:default}
      .replace(/\$\{[^}]+\}/g, "")
      // Remove common placeholder patterns like [placeholder] or <placeholder>
      .replace(/\[[^\]]+\]/g, "")
      .replace(/<[^>]+>/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Remove punctuation
      .replace(/[^\w\s]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Calculate Jaccard similarity between two strings
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function jaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.split(" ").filter(Boolean));
  const set2 = new Set(str2.split(" ").filter(Boolean));

  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;

  let intersectionSize = 0;
  // Determine which set is smaller for faster iteration
  const [smallerSet, largerSet] = set1.size < set2.size ? [set1, set2] : [set2, set1];

  for (const item of smallerSet) {
    if (largerSet.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = set1.size + set2.size - intersectionSize;

  return intersectionSize / unionSize;
}

/**
 * Calculate n-gram similarity for better sequence matching
 * Uses trigrams (3-character sequences) by default
 */
function ngramSimilarity(str1: string, str2: string, n: number = 3): number {
  const getNgrams = (str: string): Set<string> => {
    const ngrams = new Set<string>();
    const padded = " ".repeat(n - 1) + str + " ".repeat(n - 1);
    for (let i = 0; i <= padded.length - n; i++) {
      ngrams.add(padded.slice(i, i + n));
    }
    return ngrams;
  };

  const ngrams1 = getNgrams(str1);
  const ngrams2 = getNgrams(str2);

  if (ngrams1.size === 0 && ngrams2.size === 0) return 1;
  if (ngrams1.size === 0 || ngrams2.size === 0) return 0;

  let intersectionSize = 0;
  // Determine which set is smaller for faster iteration
  const [smallerSet, largerSet] =
    ngrams1.size < ngrams2.size ? [ngrams1, ngrams2] : [ngrams2, ngrams1];

  for (const item of smallerSet) {
    if (largerSet.has(item)) {
      intersectionSize++;
    }
  }

  const unionSize = ngrams1.size + ngrams2.size - intersectionSize;

  return intersectionSize / unionSize;
}

/**
 * Combined similarity score using multiple algorithms
 * Returns a value between 0 (completely different) and 1 (identical)
 */
export function calculateSimilarity(content1: string, content2: string): number {
  const normalized1 = normalizeContent(content1);
  const normalized2 = normalizeContent(content2);

  // Exact match after normalization
  if (normalized1 === normalized2) return 1;

  // Empty content edge case
  if (!normalized1 || !normalized2) return 0;

  // Combine Jaccard (word-level) and n-gram (character-level) similarities
  const jaccard = jaccardSimilarity(normalized1, normalized2);
  const ngram = ngramSimilarity(normalized1, normalized2);

  // Weighted average: 60% Jaccard (word overlap), 40% n-gram (sequence similarity)
  return jaccard * 0.6 + ngram * 0.4;
}

/**
 * Check if two contents are similar enough to be considered duplicates
 * Default threshold is 0.85 (85% similar)
 */
export function isSimilarContent(
  content1: string,
  content2: string,
  threshold: number = 0.85
): boolean {
  return calculateSimilarity(content1, content2) >= threshold;
}

/**
 * Get normalized content hash for database indexing/comparison
 * This is a simple hash for quick lookups before full similarity check
 */
export function getContentFingerprint(content: string): string {
  const normalized = normalizeContent(content);
  // Take first 500 chars of normalized content as fingerprint
  return normalized.slice(0, 500);
}

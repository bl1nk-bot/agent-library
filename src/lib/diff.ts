export interface WordDiff {
  type: "unchanged" | "added" | "removed";
  text: string;
}

// Word-by-word diff using LCS algorithm
export function computeWordDiff(original: string, modified: string): WordDiff[] {
  // Tokenize into words while preserving whitespace/newlines
  const tokenize = (str: string): string[] => {
    const tokens: string[] = [];
    let current = "";

    for (const char of str) {
      if (/\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
        tokens.push(char);
      } else {
        current += char;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  };

  const originalTokens = tokenize(original);
  const modifiedTokens = tokenize(modified);

  // Compute LCS
  const m = originalTokens.length;
  const n = modifiedTokens.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (originalTokens[i - 1] === modifiedTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: WordDiff[] = [];
  let i = m,
    j = n;
  const temp: WordDiff[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalTokens[i - 1] === modifiedTokens[j - 1]) {
      temp.push({ type: "unchanged", text: originalTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: "added", text: modifiedTokens[j - 1] });
      j--;
    } else if (i > 0) {
      temp.push({ type: "removed", text: originalTokens[i - 1] });
      i--;
    }
  }

  // Reverse and merge consecutive same-type diffs
  for (let k = temp.length - 1; k >= 0; k--) {
    const item = temp[k];
    const last = result[result.length - 1];
    if (last && last.type === item.type) {
      last.text += item.text;
    } else {
      result.push({ ...item });
    }
  }

  return result;
}

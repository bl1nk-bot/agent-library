// 🛡️ Guardian: Consolidated from src/components/book/elements/diff-view.tsx (deleted)
// Merged computeDiff and VersionDiff into canonical component. Added backward-compatible DiffView wrapper.
// JULES Check: Verified no Autonomous task conflicts via .Jules/task-log.md
// Impact: 2 → 1 file. All MDX usages preserved.
// Date: 2026-05-14
"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface UIDiffViewProps {
  original?: string;
  modified?: string;
  className?: string;
  mode?: "line" | "word" | "inline";
  language?: "json" | "yaml" | null;
}

interface WordDiff {
  type: "unchanged" | "added" | "removed";
  text: string;
}

// Simple word-level diff algorithm (used by VersionDiff)
function computeDiff(
  before: string,
  after: string
): { type: "same" | "added" | "removed"; text: string }[] {
  const beforeWords = before.split(/(\s+)/);
  const afterWords = after.split(/(\s+)/);

  const result: { type: "same" | "added" | "removed"; text: string }[] = [];

  // LCS-based diff
  const m = beforeWords.length;
  const n = afterWords.length;

  // Build LCS table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (beforeWords[i - 1] === afterWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  let i = m,
    j = n;
  const diff: { type: "same" | "added" | "removed"; text: string }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beforeWords[i - 1] === afterWords[j - 1]) {
      diff.unshift({ type: "same", text: beforeWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: "added", text: afterWords[j - 1] });
      j--;
    } else {
      diff.unshift({ type: "removed", text: beforeWords[i - 1] });
      i--;
    }
  }

  // Merge consecutive same-type segments
  for (const segment of diff) {
    if (result.length > 0 && result[result.length - 1].type === segment.type) {
      result[result.length - 1].text += segment.text;
    } else {
      result.push({ ...segment });
    }
  }

  return result;
}

// Word-by-word diff using LCS algorithm
function computeWordDiff(original: string, modified: string): WordDiff[] {
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

export function UIDiffView({
  original = "",
  modified = "",
  className,
  mode = "word",
  language,
}: UIDiffViewProps) {
  const t = useTranslations("diff");
  const isCode = !!language;
  const wordDiff = useMemo(() => computeWordDiff(original, modified), [original, modified]);

  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    // Estimate tokens: ~4 characters per token (common approximation for LLM tokenizers)
    const estimateTokens = (text: string) => Math.ceil(text.replace(/\s/g, "").length / 4);
    wordDiff.forEach((item) => {
      if (item.type === "added") additions += estimateTokens(item.text);
      if (item.type === "removed") deletions += estimateTokens(item.text);
    });
    return { additions, deletions };
  }, [wordDiff]);

  const hasChanges = stats.additions > 0 || stats.deletions > 0;

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      {/* Stats header */}
      <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-1.5 text-xs">
        <div className="flex items-center gap-3">
          {hasChanges ? (
            <>
              <span className="font-medium text-green-600 dark:text-green-400">
                ≈+{stats.additions} {t("tokens")}
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                ≈-{stats.deletions} {t("tokens")}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{t("noChanges")}</span>
          )}
        </div>
      </div>

      {/* Diff content - inline word diff */}
      {isCode ? (
        <CodeDiffContent wordDiff={wordDiff} language={language} />
      ) : (
        <div className="max-h-[calc(100vh-300px)] overflow-auto p-3 font-mono text-sm break-words whitespace-pre-wrap">
          {wordDiff.map((item, idx) => (
            <span
              key={idx}
              className={cn(
                item.type === "added" && "bg-green-500/20 text-green-700 dark:text-green-300",
                item.type === "removed" &&
                  "bg-red-500/20 text-red-700 line-through dark:text-red-300"
              )}
            >
              {item.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Code diff content with line numbers
function CodeDiffContent({
  wordDiff,
  language,
}: {
  wordDiff: WordDiff[];
  language: "json" | "yaml";
}) {
  // Build combined text with diff markers
  const lines = useMemo(() => {
    const combined = wordDiff.map((d) => d.text).join("");
    const lineTexts = combined.split("\n");

    // Track which lines have changes
    let charIndex = 0;
    const lineInfo: Array<{ text: string; hasAddition: boolean; hasDeletion: boolean }> = [];

    for (const lineText of lineTexts) {
      let hasAddition = false;
      let hasDeletion = false;

      // Check what diffs overlap with this line
      const lineStart = charIndex;
      const lineEnd = charIndex + lineText.length;

      let pos = 0;
      for (const diff of wordDiff) {
        const diffStart = pos;
        const diffEnd = pos + diff.text.length;

        // Check if diff overlaps with this line
        if (diffEnd > lineStart && diffStart < lineEnd + 1) {
          if (diff.type === "added") hasAddition = true;
          if (diff.type === "removed") hasDeletion = true;
        }
        pos = diffEnd;
      }

      lineInfo.push({ text: lineText, hasAddition, hasDeletion });
      charIndex = lineEnd + 1; // +1 for newline
    }

    return lineInfo;
  }, [wordDiff]);

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-auto font-mono text-xs">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            "flex",
            line.hasAddition && !line.hasDeletion && "bg-green-500/10",
            line.hasDeletion && !line.hasAddition && "bg-red-500/10",
            line.hasAddition && line.hasDeletion && "bg-yellow-500/10"
          )}
        >
          <span className="text-muted-foreground/50 bg-muted/30 w-8 shrink-0 border-r py-0.5 pr-2 text-right select-none">
            {i + 1}
          </span>
          <span
            className={cn(
              "w-4 shrink-0 py-0.5 text-center",
              line.hasAddition && "text-green-600 dark:text-green-400",
              line.hasDeletion && "text-red-600 dark:text-red-400"
            )}
          >
            {line.hasAddition && line.hasDeletion
              ? "~"
              : line.hasAddition
                ? "+"
                : line.hasDeletion
                  ? "-"
                  : " "}
          </span>
          <pre className="flex-1 px-2 py-0.5 break-all whitespace-pre-wrap">{line.text || " "}</pre>
        </div>
      ))}
    </div>
  );
}

export interface SideBySideDiffProps extends Omit<UIDiffViewProps, "mode"> {
  beforeLabel?: string;
  afterLabel?: string;
}

// Side by side diff view
export function SideBySideDiff({ original = "", modified = "", className, beforeLabel = "Original", afterLabel = "Modified" }: SideBySideDiffProps) {
  const diff = useMemo(() => computeDiff(original, modified), [original, modified]);

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {beforeLabel}
        </div>
        <div className="max-h-[calc(100vh-300px)] overflow-auto p-3 font-mono text-sm break-words whitespace-pre-wrap">
          {diff.map((segment, i) => {
            if (segment.type === "removed") {
              return (
                <span
                  key={i}
                  className="bg-red-500/20 text-red-700 line-through dark:text-red-300"
                >
                  {segment.text}
                </span>
              );
            } else if (segment.type === "same") {
              return <span key={i}>{segment.text}</span>;
            }
            return null;
          })}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
          {afterLabel}
        </div>
        <div className="max-h-[calc(100vh-300px)] overflow-auto p-3 font-mono text-sm break-words whitespace-pre-wrap">
          {diff.map((segment, i) => {
            if (segment.type === "added") {
              return (
                <span
                  key={i}
                  className="bg-green-500/20 text-green-700 dark:text-green-300"
                >
                  {segment.text}
                </span>
              );
            } else if (segment.type === "same") {
              return <span key={i}>{segment.text}</span>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export type DiffViewWrapperProps = UIDiffViewProps & {
  before?: string;
  after?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

// Wrapper that supports both UIDiffView props and book MDX props
export function DiffView(props: DiffViewWrapperProps) {
  // If MDX props are present or side-by-side labels are given, show SideBySideDiff
  if (props.before !== undefined || props.after !== undefined || props.beforeLabel || props.afterLabel) {
    return (
      <SideBySideDiff
        original={props.before ?? props.original ?? ""}
        modified={props.after ?? props.modified ?? ""}
        className={props.className}
        beforeLabel={props.beforeLabel ?? "Before"}
        afterLabel={props.afterLabel ?? "After"}
      />
    );
  }

  // Otherwise default to the UI Diff View behavior
  return <UIDiffView {...props} />;
}

interface VersionDiffProps {
  versions: {
    label: string;
    content: string;
    note?: string;
  }[];
}

export function VersionDiff({ versions }: VersionDiffProps) {
  if (versions.length < 1) return null;

  return (
    <div className="my-4 space-y-4">
      {versions.map((version, index) => {
        // First version: show without diff
        if (index === 0) {
          return (
            <div key={index} className="overflow-hidden rounded-lg border">
              <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
                <span className="text-sm font-semibold">{version.label}</span>
                {version.note && (
                  <span className="text-muted-foreground text-xs">{version.note}</span>
                )}
              </div>
              <div className="p-4 font-mono text-sm whitespace-pre-wrap">{version.content}</div>
            </div>
          );
        }

        const prev = versions[index - 1];
        const diff = computeDiff(prev.content, version.content);

        return (
          <div key={index} className="overflow-hidden rounded-lg border">
            <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">{prev.label}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm font-semibold">{version.label}</span>
              </div>
              {version.note && (
                <span className="text-muted-foreground text-xs">{version.note}</span>
              )}
            </div>
            <div className="grid divide-x md:grid-cols-2">
              <div className="p-3">
                <div className="mb-2 text-xs font-medium text-red-600 dark:text-red-400">
                  {prev.label}
                </div>
                <div className="font-mono text-sm whitespace-pre-wrap">
                  {diff.map((segment, i) => {
                    if (segment.type === "removed") {
                      return (
                        <span
                          key={i}
                          className="bg-red-200 text-red-800 line-through decoration-red-500 dark:bg-red-900/50 dark:text-red-200"
                        >
                          {segment.text}
                        </span>
                      );
                    } else if (segment.type === "same") {
                      return <span key={i}>{segment.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="p-3">
                <div className="mb-2 text-xs font-medium text-green-600 dark:text-green-400">
                  {version.label}
                </div>
                <div className="font-mono text-sm whitespace-pre-wrap">
                  {diff.map((segment, i) => {
                    if (segment.type === "added") {
                      return (
                        <span
                          key={i}
                          className="bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                        >
                          {segment.text}
                        </span>
                      );
                    } else if (segment.type === "same") {
                      return <span key={i}>{segment.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DiffViewProps {
  original: string;
  modified: string;
  className?: string;
  mode?: "line" | "word" | "inline";
  language?: "json" | "yaml" | null;
}

import { type WordDiff, computeWordDiff } from "@/lib/diff";

export function DiffView({
  original,
  modified,
  className,
  mode = "word",
  language,
}: DiffViewProps) {
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

// Side by side diff view
export function SideBySideDiff({ original, modified, className }: Omit<DiffViewProps, "mode">) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          Original
        </div>
        <div className="max-h-[calc(100vh-300px)] overflow-auto p-3 font-mono text-sm break-words whitespace-pre-wrap">
          {original}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
          Modified
        </div>
        <div className="max-h-[calc(100vh-300px)] overflow-auto p-3 font-mono text-sm break-words whitespace-pre-wrap">
          {modified}
        </div>
      </div>
    </div>
  );
}

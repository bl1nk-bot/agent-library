"use client";

import { cn } from "@/lib/utils";

interface DiffViewProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

import { computeWordDiff } from "@/lib/diff";

export function DiffView({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: DiffViewProps) {
  const diff = computeWordDiff(before, after);

  return (
    <div className="my-4 grid gap-3 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border">
        <div className="border-b border-red-200 bg-red-50 px-3 py-2 dark:border-red-800 dark:bg-red-950/30">
          <span className="text-sm font-medium text-red-700 dark:text-red-300">{beforeLabel}</span>
        </div>
        <div className="bg-muted/20 p-3 font-mono text-sm whitespace-pre-wrap">
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
            } else if (segment.type === "unchanged") {
              return <span key={i}>{segment.text}</span>;
            }
            return null;
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="border-b border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-950/30">
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {afterLabel}
          </span>
        </div>
        <div className="bg-muted/20 p-3 font-mono text-sm whitespace-pre-wrap">
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
            } else if (segment.type === "unchanged") {
              return <span key={i}>{segment.text}</span>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
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
        const diff = computeWordDiff(prev.content, version.content);

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
                    } else if (segment.type === "unchanged") {
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
                    } else if (segment.type === "unchanged") {
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

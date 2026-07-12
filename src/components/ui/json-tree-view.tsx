"use client";

import { useState, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import type React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonNode {
  key: string | null;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  path: string;
}

export interface JsonTreeViewHandle {
  expandAll: () => void;
  collapseAll: () => void;
}

interface JsonTreeViewProps {
  data: unknown;
  className?: string;
  fontSize?: "xs" | "sm" | "base";
  maxDepth?: number;
}

const getNodeType = (value: unknown): JsonNode["type"] => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  return typeof value as "string" | "number" | "boolean";
};

const collectPathsRecursive = (
  value: unknown,
  path: string,
  maxDepth: number,
  depth: number = 0,
  acc: string[] = []
): string[] => {
  const type = getNodeType(value);

  if ((type === "object" || type === "array") && depth < maxDepth) {
    acc.push(path);

    if (type === "array") {
      (value as unknown[]).forEach((item, index) => {
        collectPathsRecursive(item, `${path}.${index}`, maxDepth, depth + 1, acc);
      });
    } else {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        collectPathsRecursive(v, `${path}.${k}`, maxDepth, depth + 1, acc);
      });
    }
  }

  return acc;
};

const JsonTreeView = forwardRef<JsonTreeViewHandle, JsonTreeViewProps>(
  ({ data, className, fontSize = "xs", maxDepth = 10 }, ref) => {
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["root"]));

    const togglePath = (path: string) => {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
        }
        return next;
      });
    };

    const allExpandablePaths = useMemo(() => {
      return collectPathsRecursive(data, "root", maxDepth);
    }, [data, maxDepth]);

    const expandAll = useCallback(() => {
      setExpandedPaths(new Set(allExpandablePaths));
    }, [allExpandablePaths]);

    const collapseAll = useCallback(() => {
      setExpandedPaths(new Set(["root"]));
    }, []);

    useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
    }));

    const renderValue = (value: unknown, type: JsonNode["type"]): React.ReactNode => {
      switch (type) {
        case "string":
          return <span className="text-green-600 dark:text-green-400">{String(value)}</span>;
        case "number":
          return <span className="text-orange-600 dark:text-orange-400">{String(value)}</span>;
        case "boolean":
          return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
        case "null":
          return <span className="text-red-600 dark:text-red-400">null</span>;
        default:
          return null;
      }
    };

    const renderNode = (
      node: JsonNode,
      depth: number = 0,
      isLast: boolean = true
    ): React.ReactNode => {
      const { key, value, type, path } = node;
      const isExpanded = expandedPaths.has(path);
      const isComplex = type === "object" || type === "array";
      const canExpand = isComplex && depth < maxDepth;

      if (!isComplex) {
        return (
          <div className="hover:bg-muted-foreground/10 group -mx-2 flex items-center gap-2 rounded px-2 py-1 transition-colors">
            {key !== null && (
              <>
                <span className="font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                  {key}
                </span>
                <span className="text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors">
                  →
                </span>
              </>
            )}
            <span className="transition-opacity group-hover:opacity-90">
              {renderValue(value, type)}
            </span>
          </div>
        );
      }

      const entries =
        type === "array"
          ? (value as unknown[]).map((item, index) => ({
              key: String(index),
              value: item,
              type: getNodeType(item),
              path: `${path}.${index}`,
            }))
          : Object.entries(value as Record<string, unknown>).map(([k, v]) => ({
              key: k,
              value: v,
              type: getNodeType(v),
              path: `${path}.${k}`,
            }));

      const itemCount = entries.length;
      const isEmpty = itemCount === 0;

      return (
        <div>
          {/* Node header */}
          <div className="hover:bg-muted-foreground/10 group -mx-2 flex items-center gap-2 rounded px-2 py-1 transition-colors">
            {canExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePath(path);
                }}
                className="hover:bg-muted-foreground/30 active:bg-muted-foreground/40 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDown className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                ) : (
                  <ChevronRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                )}
              </button>
            )}
            {!canExpand && <span className="w-4 shrink-0" />}

            {key !== null && (
              <>
                <span className="font-medium text-blue-600 transition-colors group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                  {key}
                </span>
                {type === "array" && (
                  <span className="text-muted-foreground/50 group-hover:text-muted-foreground/70 text-xs transition-colors">
                    [{itemCount}]
                  </span>
                )}
              </>
            )}

            {!isExpanded && !isEmpty && (
              <span className="text-muted-foreground/50 group-hover:text-muted-foreground/70 text-xs transition-colors">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}

            {isEmpty && (
              <span className="text-muted-foreground/50 group-hover:text-muted-foreground/70 text-xs italic transition-colors">
                empty
              </span>
            )}
          </div>

          {/* Expanded content */}
          {isExpanded && canExpand && (
            <div className="mt-1 ml-6 space-y-0.5">
              {entries.map((entry, index) => {
                const isLastEntry = index === entries.length - 1;
                return (
                  <div key={entry.path} className="relative">
                    {/* Tree connector line */}
                    <div
                      className="bg-border/30 absolute top-0 bottom-0 left-0 w-px"
                      style={{ marginLeft: "-1.25rem" }}
                    />
                    {!isLastEntry && (
                      <div
                        className="bg-border/30 absolute left-0 w-px"
                        style={{
                          marginLeft: "-1.25rem",
                          top: "1.5rem",
                          bottom: "-0.5rem",
                        }}
                      />
                    )}

                    <div className="flex items-start">
                      {/* Horizontal connector */}
                      <div
                        className="bg-border/30 absolute top-3 left-0 h-px w-3"
                        style={{ marginLeft: "-1.25rem" }}
                      />

                      <div className="flex-1">{renderNode(entry, depth + 1, isLastEntry)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    const rootNode: JsonNode = {
      key: null,
      value: data,
      type: getNodeType(data),
      path: "root",
    };

    return (
      <div
        className={cn(
          "bg-muted overflow-auto rounded-lg p-4 font-mono",
          {
            "text-xs": fontSize === "xs",
            "text-sm": fontSize === "sm",
            "text-base": fontSize === "base",
          },
          className
        )}
      >
        {renderNode(rootNode)}
      </div>
    );
  }
);

JsonTreeView.displayName = "JsonTreeView";

export const JsonTreeViewWrapper = forwardRef<
  JsonTreeViewHandle,
  {
    content: string;
    className?: string;
    fontSize?: "xs" | "sm" | "base";
  }
>(({ content, className, fontSize = "xs" }, ref) => {
  const parsedData = useMemo(() => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }, [content]);

  if (parsedData === null) {
    return (
      <div
        className={cn(
          "bg-muted border-destructive/50 text-destructive rounded-lg border p-4 font-mono text-sm",
          className
        )}
      >
        Invalid JSON
      </div>
    );
  }

  return <JsonTreeView ref={ref} data={parsedData} className={className} fontSize={fontSize} />;
});

JsonTreeViewWrapper.displayName = "JsonTreeViewWrapper";

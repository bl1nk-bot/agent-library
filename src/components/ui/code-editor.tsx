// 🛡️ Guardian: Consolidated from src/components/book/elements/code-editor.tsx (deleted)
// This component now handles both standard UI editing and MDX read-only block display.
// JULES Check: Verified no Autonomous task conflicts via .Jules/task-log.md
// Impact: 2 → 1 file. Features preserved for backward compatibility.
// Date: 2026-05-14
"use client";

import { useTheme } from "next-themes";
import Editor, { type OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useRef,
  useEffect,
  memo,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { applyMonacoTheme, getMobileEditorOptions } from "@/lib/monaco-config";
import { CopyButton } from "@/components/prompts/copy-button";

export interface CodeEditorHandle {
  insertAtCursor: (text: string) => void;
}

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  debounceMs?: number;
  readOnly?: boolean;
  filename?: string;
  code?: string; // For backward compatibility with MDX
}

const CodeEditorInner = forwardRef<CodeEditorHandle, CodeEditorProps>(function CodeEditorInner(
  {
    value,
    onChange,
    language,
    placeholder,
    className,
    minHeight = "300px",
    debounceMs = 0,
    readOnly = false,
    filename,
    code,
  },
  ref
) {
  const { resolvedTheme } = useTheme();

  // Support mapping from 'code' prop for MDX backward compatibility
  const actualValue = value !== undefined ? value : code || "";

  const isMobile = useIsMobile();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const onChangeRef = useRef(onChange);
  const internalValueRef = useRef(value);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Keep onChange ref updated without triggering re-renders
  useEffect(() => {
    if (onChange) {
      onChangeRef.current = onChange;
    }
  }, [onChange]);

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      setIsEditorReady(true);

      // Apply enhanced theme
      const theme = resolvedTheme === "dark" ? "dark" : "light";
      applyMonacoTheme(monaco, theme);

      // Mobile-specific optimizations
      if (isMobile) {
        // Improve mobile touch handling
        editor.updateOptions({
          mouseWheelZoom: false,
          fastScrollSensitivity: 2,
        });
      }
    },
    [isMobile, resolvedTheme]
  );

  useImperativeHandle(
    ref,
    () => ({
      insertAtCursor: (text: string) => {
        const editor = editorRef.current;
        if (editor) {
          const selection = editor.getSelection();
          if (selection) {
            editor.executeEdits("insert", [
              {
                range: selection,
                text,
                forceMoveMarkers: true,
              },
            ]);
            editor.focus();
          }
        }
      },
    }),
    []
  );

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      const val = newValue || "";
      // Track internal value to avoid external updates overriding typing
      internalValueRef.current = val;

      if (debounceMs > 0) {
        // Clear existing timer
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        // Set new timer
        debounceTimer.current = setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(val);
        }, debounceMs);
      } else {
        if (onChangeRef.current) onChangeRef.current(val);
      }
    },
    [debounceMs]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Only update editor value if it changed externally (not from typing)
  const displayValue = actualValue || placeholder;

  // Calculate dynamic height if readOnly and we have code
  const isDark = resolvedTheme === "dark";
  const lineCount = displayValue ? displayValue.split("\n").length : 0;
  const computedMinHeight =
    readOnly && code ? `${Math.min(lineCount * 19 + 20, 400)}px` : minHeight;

  // Mobile-optimized editor options
  const baseOptions = getMobileEditorOptions(isMobile);
  const editorOptions = {
    ...baseOptions,
    readOnly: readOnly,
    domReadOnly: readOnly,
    renderLineHighlight: (readOnly ? "none" : baseOptions.renderLineHighlight) as
      | "none"
      | "line"
      | "all"
      | "gutter",
  };

  return (
    <div
      dir="ltr"
      className={cn(
        "overflow-hidden rounded-md border text-left transition-opacity",
        !isEditorReady && "opacity-0",
        isEditorReady && "opacity-100 duration-180",
        filename || code ? (isDark ? "bg-[#1e1e1e]" : "bg-[#ffffff]") : undefined,
        className
      )}
      style={{
        minHeight: computedMinHeight,
        // Prevent iOS Safari zoom on focus
        WebkitTouchCallout: "none",
      }}
    >
      {(filename || code) && (
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 py-2",
            isDark ? "border-[#3c3c3c] bg-[#252526]" : "border-[#e0e0e0] bg-[#f3f3f3]"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            {filename && (
              <span
                className={cn(
                  "ml-2 font-mono text-xs",
                  isDark ? "text-[#cccccc]" : "text-[#333333]"
                )}
              >
                {filename}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs uppercase", isDark ? "text-[#6e6e6e]" : "text-[#999999]")}>
              {language}
            </span>
            <CopyButton content={displayValue || ""} />
          </div>
        </div>
      )}
      <Editor
        height={computedMinHeight}
        language={language}
        value={displayValue}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={resolvedTheme === "dark" ? "enhanced-dark" : "enhanced-light"}
        options={editorOptions}
        loading={
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            Loading editor...
          </div>
        }
      />
    </div>
  );
});

// Memoize to prevent re-renders when parent state changes
// Only re-render when value, language, placeholder, className, minHeight, or debounceMs change
export const CodeEditor = memo(CodeEditorInner, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.code === nextProps.code &&
    prevProps.language === nextProps.language &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className &&
    prevProps.minHeight === nextProps.minHeight &&
    prevProps.debounceMs === nextProps.debounceMs &&
    prevProps.readOnly === nextProps.readOnly &&
    prevProps.filename === nextProps.filename
  );
});

"use client";

import { useTheme } from "next-themes";
import Editor, { type OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useEffect, memo, forwardRef, useImperativeHandle, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { applyMonacoTheme, getMobileEditorOptions } from "@/lib/monaco-config";

export interface CodeEditorHandle {
  insertAtCursor: (text: string) => void;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "json" | "yaml" | "markdown";
  placeholder?: string;
  className?: string;
  minHeight?: string;
  debounceMs?: number;
  readOnly?: boolean;
}

const CodeEditorInner = forwardRef<CodeEditorHandle, CodeEditorProps>(function CodeEditorInner({
  value,
  onChange,
  language,
  placeholder,
  className,
  minHeight = "300px",
  debounceMs = 0,
  readOnly = false,
}, ref) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const onChangeRef = useRef(onChange);
  const internalValueRef = useRef(value);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Keep onChange ref updated without triggering re-renders
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
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
  }, [isMobile, resolvedTheme]);

  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      const editor = editorRef.current;
      if (editor) {
        const selection = editor.getSelection();
        if (selection) {
          editor.executeEdits("insert", [{
            range: selection,
            text,
            forceMoveMarkers: true,
          }]);
          editor.focus();
        }
      }
    },
  }), []);

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
          onChangeRef.current(val);
        }, debounceMs);
      } else {
        onChangeRef.current(val);
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
  const displayValue = value || placeholder;

  // Mobile-optimized editor options
  const baseOptions = getMobileEditorOptions(isMobile);
  const editorOptions = {
    ...baseOptions,
    readOnly: readOnly,
    domReadOnly: readOnly,
    renderLineHighlight: readOnly ? "none" : baseOptions.renderLineHighlight,
  };

  return (
    <div
      dir="ltr"
      className={cn(
        "border rounded-md overflow-hidden text-left transition-opacity",
        !isEditorReady && "opacity-0",
        isEditorReady && "opacity-100 duration-180",
        className
      )}
      style={{ 
        minHeight,
        // Prevent iOS Safari zoom on focus
        WebkitTouchCallout: 'none',
      }}
    >
      <Editor
        height={minHeight}
        language={language}
        value={displayValue}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={resolvedTheme === "dark" ? "enhanced-dark" : "enhanced-light"}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
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
    prevProps.language === nextProps.language &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.className === nextProps.className &&
    prevProps.minHeight === nextProps.minHeight &&
    prevProps.debounceMs === nextProps.debounceMs &&
    prevProps.readOnly === nextProps.readOnly
  );
});

/**
 * Monaco Editor Configuration for Enhanced Mobile Experience
 * Optimized syntax highlighting, performance, and mobile touch handling
 */

export interface MonacoThemeConfig {
  base: "vs" | "vs-dark" | "hc-black" | "hc-light";
  inherit: boolean;
  rules: Array<{
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
  }>;
  colors: Record<string, string>;
}

/**
 * Enhanced Dark Theme with Better Syntax Highlighting
 */
export const ENHANCED_DARK_THEME: MonacoThemeConfig = {
  base: "vs-dark",
  inherit: true,
  rules: [
    // Keywords
    { token: "keyword", foreground: "00e5ff", fontStyle: "bold" },
    { token: "keyword.control", foreground: "00e5ff" },
    { token: "keyword.operator", foreground: "00e5ff" },
    
    // Strings
    { token: "string", foreground: "a6e22e" },
    { token: "string.key", foreground: "66d9ef" },
    { token: "string.value", foreground: "a6e22e" },
    
    // Numbers
    { token: "number", foreground: "ae81ff" },
    
    // Comments
    { token: "comment", foreground: "6e6e6e", fontStyle: "italic" },
    
    // Functions
    { token: "function", foreground: "ffd700" },
    { token: "identifier.function", foreground: "ffd700" },
    
    // Types
    { token: "type", foreground: "66d9ef" },
    { token: "type.identifier", foreground: "66d9ef" },
    
    // Variables
    { token: "variable", foreground: "f0f0f0" },
    { token: "variable.parameter", foreground: "fd971f" },
    
    // Properties
    { token: "property", foreground: "a6e22e" },
    
    // Markdown specific
    { token: "heading", foreground: "00e5ff", fontStyle: "bold" },
    { token: "emphasis", fontStyle: "italic" },
    { token: "strong", fontStyle: "bold" },
    
    // JSON/YAML specific
    { token: "key", foreground: "66d9ef" },
    { token: "delimiter", foreground: "888888" },
  ],
  colors: {
    "editor.background": "#050505",
    "editor.foreground": "#f0f0f0",
    "editor.lineHighlightBackground": "rgba(255, 255, 255, 0.03)",
    "editor.selectionBackground": "rgba(0, 229, 255, 0.2)",
    "editor.selectionHighlightBackground": "rgba(0, 229, 255, 0.1)",
    "editorCursor.foreground": "#00e5ff",
    "editorWhitespace.foreground": "rgba(255, 255, 255, 0.05)",
    "editorIndentGuide.background": "rgba(255, 255, 255, 0.05)",
    "editorIndentGuide.activeBackground": "rgba(255, 255, 255, 0.1)",
    "editorBracketMatch.background": "rgba(0, 229, 255, 0.15)",
    "editorBracketMatch.border": "#00e5ff",
  },
};

/**
 * Enhanced Light Theme with Better Syntax Highlighting
 */
export const ENHANCED_LIGHT_THEME: MonacoThemeConfig = {
  base: "vs",
  inherit: true,
  rules: [
    // Keywords
    { token: "keyword", foreground: "0066cc", fontStyle: "bold" },
    { token: "keyword.control", foreground: "0066cc" },
    { token: "keyword.operator", foreground: "0066cc" },
    
    // Strings
    { token: "string", foreground: "22863a" },
    { token: "string.key", foreground: "005cc5" },
    { token: "string.value", foreground: "22863a" },
    
    // Numbers
    { token: "number", foreground: "a31515" },
    
    // Comments
    { token: "comment", foreground: "6a737d", fontStyle: "italic" },
    
    // Functions
    { token: "function", foreground: "6f42c1" },
    { token: "identifier.function", foreground: "6f42c1" },
    
    // Types
    { token: "type", foreground: "005cc5" },
    { token: "type.identifier", foreground: "005cc5" },
    
    // Variables
    { token: "variable", foreground: "24292e" },
    { token: "variable.parameter", foreground: "e36209" },
    
    // Properties
    { token: "property", foreground: "22863a" },
    
    // Markdown specific
    { token: "heading", foreground: "005cc5", fontStyle: "bold" },
    { token: "emphasis", fontStyle: "italic" },
    { token: "strong", fontStyle: "bold" },
    
    // JSON/YAML specific
    { token: "key", foreground: "005cc5" },
    { token: "delimiter", foreground: "666666" },
  ],
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#24292e",
    "editor.lineHighlightBackground": "rgba(0, 0, 0, 0.03)",
    "editor.selectionBackground": "rgba(0, 102, 204, 0.2)",
    "editor.selectionHighlightBackground": "rgba(0, 102, 204, 0.1)",
    "editorCursor.foreground": "#0066cc",
    "editorWhitespace.foreground": "rgba(0, 0, 0, 0.05)",
    "editorIndentGuide.background": "rgba(0, 0, 0, 0.05)",
    "editorIndentGuide.activeBackground": "rgba(0, 0, 0, 0.1)",
    "editorBracketMatch.background": "rgba(0, 102, 204, 0.15)",
    "editorBracketMatch.border": "#0066cc",
  },
};

/**
 * Mobile-Optimized Editor Options
 */
export function getMobileEditorOptions(isMobile: boolean) {
  return {
    // Font settings
    fontSize: isMobile ? 14 : 13,
    lineHeight: isMobile ? 24 : 20,
    letterSpacing: isMobile ? 0.2 : 0,
    
    // Line numbers
    lineNumbers: isMobile ? "off" : "on",
    lineNumbersMinChars: isMobile ? 0 : 3,
    
    // Padding
    padding: {
      top: isMobile ? 12 : 8,
      bottom: isMobile ? 12 : 8,
    },
    
    // Scrollbar
    scrollbar: {
      vertical: "auto",
      horizontal: "auto",
      verticalScrollbarSize: isMobile ? 10 : 8,
      horizontalScrollbarSize: isMobile ? 10 : 8,
      useShadows: false,
    },
    
    // Performance optimizations for mobile
    ...(isMobile && {
      quickSuggestions: false,
      parameterHints: { enabled: false },
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: "off",
      hover: { enabled: false },
      folding: false,
      glyphMargin: false,
      lineDecorationsWidth: 0,
      renderLineHighlight: "line",
      mouseWheelZoom: false,
      fastScrollSensitivity: 2,
      
      // Smooth animations
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
    }),
    
    // Common settings
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on",
    wrappingIndent: "indent",
    automaticLayout: true,
    tabSize: 2,
    renderLineHighlight: "line",
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    
    // Bracket colorization
    bracketPairColorization: {
      enabled: true,
    },
    
    // Whitespace rendering
    renderWhitespace: "selection",
  };
}

/**
 * Apply custom theme to Monaco editor
 */
export function applyMonacoTheme(
  monaco: any,
  theme: "dark" | "light"
): void {
  const themeConfig = theme === "dark" ? ENHANCED_DARK_THEME : ENHANCED_LIGHT_THEME;
  const themeName = theme === "dark" ? "enhanced-dark" : "enhanced-light";
  
  try {
    monaco.editor?.defineTheme?.(themeName, themeConfig);
    monaco.editor?.setTheme?.(themeName);
  } catch (error) {
    console.error("[v0] Failed to apply Monaco theme:", error);
  }
}

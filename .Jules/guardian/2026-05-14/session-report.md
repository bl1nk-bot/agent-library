## 2026-05-14 - Consolidate CodeEditor and DiffView Components
**Target:** src/components/ui/code-editor.tsx, src/components/ui/diff-view.tsx, src/components/book/elements/code-editor.tsx, src/components/book/elements/diff-view.tsx
**Learning:** Found duplicates caused by branching features (book features vs standard UI). Consolidating these requires preserving specific props like MDX standard naming (`code`, `filename`) while adopting more capable UI component logic (`Monaco` abstractions, debouncing). Using a wrapper component (`DiffView` over `UIDiffView`) effectively bridges old prop interfaces to new implementation logic without needing to run expensive regex migrations across unstructured content files (MDX).
**Action:** When merging components that are widely used in markdown/MDX, add alias props and thin wrapper components to ensure runtime API compatibility instead of risking breaking changes in untyped content files.
**JULES Check:** Verified no active Autonomous task file conflicts in `.Jules/task-log.md` before proceeding.
**Conflicts Avoided:** None explicitly found in log, checked successfully.

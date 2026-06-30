## 2026-06-18 - DiffView Consolidation

**Target:** src/components/ui/diff-view.tsx, src/components/book/elements/diff-view.tsx
**Learning:** Found two highly similar implementations of a string diff component (one in book UI, one in core UI), both relying on their own LCS sequence matchers.
**Action:** Consolidated into a single source of truth in core UI, implementing a robust fallback for legacy MDX `before`/`after` props via aliases.
**JULES Check:** Verified no autonomous tasks active in .Jules/task-log.md
**Conflicts Avoided:** None (No active tasks found)

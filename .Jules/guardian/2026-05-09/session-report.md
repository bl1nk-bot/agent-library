## 2026-05-09 - Consolidate DiffView Components
**Target:** src/components/book/elements/diff-view.tsx, src/components/ui/diff-view.tsx
**Learning:** The codebase had two distinct DiffView components, each implementing its own LCS algorithm for diffing text. This duplication creates maintenance overhead and inconsistencies in UI/UX across the application.
**Action:** Merged the book-specific VersionDiff into the global ui/diff-view.tsx, deleting the book's diff-view.tsx and standardizing the diff algorithm used.
**JULES Check:** Verified no Autonomous task conflicts in task-log.md.
**Conflicts Avoided:** None.

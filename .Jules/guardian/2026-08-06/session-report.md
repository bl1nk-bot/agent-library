## 2026-08-06 - Consolidated DiffView components

**Target:** src/components/book/elements/diff-view.tsx, src/components/ui/diff-view.tsx
**Learning:** Duplicate implementations of diffing logic existed across the book elements and UI library, which complicated maintenance and created inconsistent behavior.
**Action:** Merged the side-by-side inline highlighting feature and VersionDiff from the book component into the core UI DiffView component, creating a single source of truth for all diff views.
**JULES Check:** Verified no Autonomous task conflicts in .jules/task-log.md
**Conflicts Avoided:** None

## 2026-10-01 - Consolidate Word Diff Algorithms

**Target:** src/components/ui/diff-view.tsx, src/components/book/elements/diff-view.tsx
**Learning:** The DP-based LCS algorithm for computing word diffs was duplicated identically across two distinct UI components. This creates a maintenance burden, as enhancements (like preserving whitespace or tracking token counts) would need to be applied in both places.
**Action:** Extracted the core `computeWordDiff` function into `src/lib/diff.ts` and refactored both components to consume the shared utility.
**JULES Check:** No Autonomous task conflicts detected in task-log.md.
**Conflicts Avoided:** None.

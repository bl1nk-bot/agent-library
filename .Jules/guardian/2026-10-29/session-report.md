## $(date '+%Y-%m-%d') - Consolidate DiffView components

**Target:** src/components/book/elements/diff-view.tsx, src/components/ui/diff-view.tsx
**Learning:** Found an architectural smell where DiffView logic (specifically the LCS algorithm and side-by-side vs inline rendering) was duplicated across the 'book' and 'ui' components directories. Merging these centralizes diffing UI in the canonical components/ui path.
**Action:** Merged \`DiffView\` and \`VersionDiff\` from \`book/elements/diff-view.tsx\` into \`ui/diff-view.tsx\` as \`SplitDiffView\` and \`VersionDiff\`, respectively, and updated all imports.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md.
**Conflicts Avoided:** None.

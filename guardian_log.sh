TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
SESSION_DIR=".Jules/guardian/$(date '+%Y-%m-%d')"
mkdir -p "$SESSION_DIR"

echo "## $TIMESTAMP - [GUARDIAN] Session started" >> ".Jules/task-log.md"
echo "- Directory: $SESSION_DIR" >> ".Jules/task-log.md"
echo "- Phase: OPTIMIZE" >> ".Jules/task-log.md"
echo "- JULES Check: COMPLETE" >> ".Jules/task-log.md"

cat << 'INNER_EOF' > "$SESSION_DIR/session-report.md"
## $(date '+%Y-%m-%d') - Consolidate DiffView components
**Target:** src/components/book/elements/diff-view.tsx, src/components/ui/diff-view.tsx
**Learning:** Found an architectural smell where DiffView logic (specifically the LCS algorithm and side-by-side vs inline rendering) was duplicated across the 'book' and 'ui' components directories. Merging these centralizes diffing UI in the canonical components/ui path.
**Action:** Merged \`DiffView\` and \`VersionDiff\` from \`book/elements/diff-view.tsx\` into \`ui/diff-view.tsx\` as \`SplitDiffView\` and \`VersionDiff\`, respectively, and updated all imports.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md.
**Conflicts Avoided:** None.
INNER_EOF

echo "## $TIMESTAMP - [GUARDIAN] Refactoring complete" >> ".Jules/task-log.md"
echo "- Consolidated DiffView components" >> ".Jules/task-log.md"
echo "- Deleted src/components/book/elements/diff-view.tsx" >> ".Jules/task-log.md"
echo "- Updated imports in src/components/book/interactive.tsx and src/components/book/elements/index.ts" >> ".Jules/task-log.md"

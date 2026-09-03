## 2026-09-03 - Consolidate duplicate functions in mcp.ts

**Target:** src/pages/api/mcp.ts, src/lib/slug.ts
**Learning:** Duplicate helper function `slugify` was present in `mcp.ts`. It was consolidated with its canonical version in `src/lib/slug.ts`. (extractVariables was reverted due to functionality mismatches).
**Action:** Replaced inline helpers with canonical imports.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md
**Conflicts Avoided:** No conflicts avoided.

## 2026-07-09 - Clean up architecture in MCP API (remove local slugify/extractVariables)
**Target:** src/pages/api/mcp.ts, src/lib/variable-detection.ts
**Learning:** Duplicate definitions of slugify and extractVariables exist in the MCP API route, leading to maintenance burden and violating DRY principles. The `slugify` logic can be imported from `src/lib/slug.ts` and `extractVariables`/`ExtractedVariable` can be centralized in `src/lib/variable-detection.ts`.
**Action:** Centralize the extraction logic to `src/lib/variable-detection.ts` and remove the duplicate utility functions from the MCP API route.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md
**Conflicts Avoided:** None

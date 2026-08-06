## 2026-08-06 - Standardize Variable Detection

**Target:** src/pages/api/mcp.ts
**Learning:** The canonical location for detectVariables is src/lib/variable-detection.ts. Do not duplicate this logic inline (e.g. extractVariables).
**Action:** Removed inline extractVariables and imported detectVariables.
**JULES Check:** Verified no autonomous tasks in task-log.md.
**Conflicts Avoided:** None.

## 2026-08-13 - Consolidate date utilities into format.ts
**Target:** src/lib/date.ts, src/lib/format.ts
**Learning:** Date formatting is a type of string formatting and belongs in the central format utility module to avoid architectural scattering.
**Action:** Merged src/lib/date.ts into src/lib/format.ts and updated all imports.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md.
**Conflicts Avoided:** None.

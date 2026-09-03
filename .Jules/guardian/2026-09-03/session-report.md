## 2026-09-03 - Consolidate date utilities into format.ts

**Target:** src/lib/date.ts, src/lib/format.ts, src/**tests**/lib/date.test.ts, src/**tests**/lib/format.test.ts
**Learning:** Formatting functions were scattered across multiple files, increasing maintenance burden.
**Action:** Centralized all formatting utilities into src/lib/format.ts to maintain a single source of truth.
**JULES Check:** Verified no Autonomous task conflicts in task-log.md
**Conflicts Avoided:** None

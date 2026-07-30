## 2026-07-30 - Consolidate date utility functions

**Target:** src/lib/date.ts, src/lib/format.ts
**Learning:** Similar formatting utility functions were scattered across multiple files, causing architectural scattering and maintenance burden.
**Action:** Centralized all date and time formatting utilities into the canonical src/lib/format.ts file to ensure one true place for formatting logic.
**JULES Check:** Verified .Jules/task-log.md and confirmed no Autonomous tasks are working on the affected files.
**Conflicts Avoided:** None.

## 2026-08-27 - Consolidated date formatting utilities
**Target:** src/lib/date.ts
**Learning:** Centralizing date and time formatting utilities into src/lib/format.ts prevents architectural scattering across utility directories and ensures a single source of truth for formatting functions.
**Action:** Merged src/lib/date.ts into src/lib/format.ts and updated all imports across the codebase.
**JULES Check:** Verified no Autonomous task conflicts in task-log.md
**Conflicts Avoided:** None found

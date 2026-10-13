## 2026-08-27 - Consolidate format utilities

**Target:** src/lib/date.ts, src/lib/format.ts
**Learning:** Formatting logic (dates vs strings/JSON) should not be arbitrarily split across multiple files, as it creates unnecessary imports and architectural scattering.
**Action:** Centralized all date and string formatting functions into a single format.ts utility file.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md before modifying.
**Conflicts Avoided:** None. No active Autonomous tasks were targeting these files.

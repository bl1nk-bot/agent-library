## 2026-07-23 - Merge date.ts into format.ts

**Target:** src/lib/date.ts, src/lib/format.ts
**Learning:** The architectural insight discovered is that single-responsibility utilities often split related functionality (e.g. content formatting vs date formatting) across files, increasing the import surface area and splitting tests.
**Action:** Consolidate related domain utilities (like formatters) to reduce imports and keep tests closer.
**JULES Check:** Verified no active Autonomous tasks working on src/lib/date.ts or src/lib/format.ts.
**Conflicts Avoided:** None found.

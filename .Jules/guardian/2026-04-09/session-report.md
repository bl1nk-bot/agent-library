## 2026-04-09 - Consolidate toYaml formatting utility
**Target:** src/components/ide/utils.ts, src/lib/format.ts, src/components/ide/prompt-ide.tsx
**Learning:** Found a duplicate or out-of-place formatting function scattered in a components subdirectory (`src/components/ide/utils.ts`) instead of the central formatting library (`src/lib/format.ts`).
**Action:** Relocated `toYaml` to `src/lib/format.ts`, updated all its imports, and deleted `src/components/ide/utils.ts`. This ensures we prevent architectural scattering across component directories.
**JULES Check:** Verified `.Jules/task-log.md` and confirmed no ongoing or recent Autonomous task conflicts regarding these files.
**Conflicts Avoided:** None.

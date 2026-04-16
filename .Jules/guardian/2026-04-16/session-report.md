## 2026-04-16 - Consolidate toYaml formatting utility
**Target:** src/components/ide/utils.ts, src/lib/format.ts
**Learning:** Found a formatting utility `toYaml` in `src/components/ide/utils.ts`. Per architectural constraint in memory: "Formatting utilities (like `toYaml`, `prettifyJson`, `isValidJson`) should be centralized in `src/lib/format.ts` and imported using the `@/lib/format` alias to prevent architectural scattering across component directories."
**Action:** Move `toYaml` from `src/components/ide/utils.ts` to `src/lib/format.ts` and update imports.
**JULES Check:** Checked task-log.md, no Autonomous conflicts.
**Conflicts Avoided:** None.

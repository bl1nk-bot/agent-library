## 2026-04-16 - Centralize Formatting Utility

**Target:** `src/components/ide/utils.ts` and `src/lib/format.ts`
**Learning:** Formatting utilities (like `toYaml`, `prettifyJson`, `isValidJson`) should be centralized in `src/lib/format.ts` and imported using the `@/lib/format` alias to prevent architectural scattering across component directories.
**Action:** Centralized `toYaml` from `src/components/ide/utils.ts` to `src/lib/format.ts` and updated imports. Removed empty utils file.
**JULES Check:** Verified no Autonomous task conflicts in `task-log.md`.
**Conflicts Avoided:** None.

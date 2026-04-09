## 2024-04-09 - Consolidate formatting utilities
**Target:** src/components/ide/utils.ts, src/lib/format.ts
**Learning:** Found an isolated `toYaml` utility function in `src/components/ide/utils.ts`. Consolidating formatting functions into `src/lib/format.ts` reduces architectural scattering and prevents potential duplicate implementations.
**Action:** When finding isolated utility functions, check for a centralized module (like `src/lib/format.ts`) and merge it there if it fits the module's scope.
**JULES Check:** Verified no active Autonomous task conflicts on these files.
**Conflicts Avoided:** N/A

// 🛡️ Guardian Impact Report (JULES Compliant)
// - Files consolidated: 2 → 1
// - Imports simplified: 1 file updated
// - JULES Check: No Autonomous conflicts
// - Session: .Jules/guardian/2024-04-09/

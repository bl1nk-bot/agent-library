## 2026-04-23 - Consolidated formatting utilities
**Target:** src/components/ide/utils.ts, src/lib/format.ts
**Learning:** Utilities shared by multiple domains are commonly duplicated when new domains are introduced. We must centralize them.
**Action:** Remove duplicated `toYaml` function in `src/components/ide/utils.ts` and ensure everyone uses `src/lib/format.ts`.
**JULES Check:** Verified no Autonomous task conflicts
**Conflicts Avoided:** None

// 🛡️ Guardian Impact Report (JULES Compliant)
// - Files consolidated: 2 → 1
// - Lines of code: 38 → 0 (-100%)
// - Imports simplified: 1 file updated previously
// - JULES Check: No Autonomous conflicts
// - Session: .Jules/guardian/2026-04-23/

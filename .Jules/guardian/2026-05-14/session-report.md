## $(date '+%Y-%m-%d') - Consolidate error states

**Target:** `src/app/error.tsx` and `src/app/not-found.tsx`
**Learning:** React error pages contain heavily duplicated UI code for presenting status codes and generic actions.
**Action:** Created `src/components/ui/error-state/error-state.tsx` to standardize error layouts and reduce duplication.
**JULES Check:** Verified no autonomous conflicts in task-log.md before modifying error pages.
**Conflicts Avoided:** No active tasks were touching the error pages or layout directories.

// 🛡️ Guardian Impact Report (JULES Compliant)
// - Files created: 2 (error-state.tsx, index.ts)
// - Duplication eliminated: Refactored `error.tsx` and `not-found.tsx` to use `ErrorState`
// - Code lines: Reduced duplication in error pages
// - JULES Check: No Autonomous conflicts
// - Session: .Jules/guardian/$(date '+%Y-%m-%d')/

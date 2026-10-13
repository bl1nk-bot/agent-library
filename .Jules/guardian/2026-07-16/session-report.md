## 2026-07-16 - Consolidate Utility Functions

**Target:** src/pages/api/mcp.ts
**Learning:** Avoid duplicating standard utility logic (`slugify`, `detectVariables`) inline inside API routes. Canonical implementations exist in `src/lib/slug.ts` and `src/lib/variable-detection.ts`. Note that the standard is `detectVariables`, not `extractVariables`.
**Action:** Next time, always search the `src/lib` directory for utility functions before implementing them inline to reduce code duplication and maintain standardization.
**JULES Check:** Verified no active Autonomous task conflicts using `.Jules/task-log.md`.
**Conflicts Avoided:** None found.

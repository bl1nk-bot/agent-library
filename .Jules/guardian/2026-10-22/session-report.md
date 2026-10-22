## $(date '+%Y-%m-%d') - Consolidate OpenAI client instantiation
**Target:** src/lib/ai/client.ts, src/lib/slug.ts, src/lib/ai/*.ts, API routes
**Learning:** Code duplication of singleton classes like OpenAI clients leads to potential inconsistency in error handling and client initialization options.
**Action:** Abstracted the shared structural similarities into a unified `client.ts` factory that manages the instance.
**JULES Check:** Verified no Autonomous task conflicts in .Jules/task-log.md.
**Conflicts Avoided:** Avoided breaking independent error handling for routes vs internal lib functions by providing optional vs throwing getters.

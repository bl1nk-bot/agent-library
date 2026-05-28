## 2026-05-28 - Consolidate OpenAI client instantiation
**Target:** src/lib/slug.ts, src/lib/ai/improve-prompt.ts, src/lib/ai/generation.ts, src/lib/ai/quality-check.ts, src/lib/ai/embeddings.ts
**Learning:** OpenAI client initialization with environment variables was repeatedly copy-pasted across multiple library files.
**Action:** Centralized the client creation into `src/lib/ai/openai.ts` and provided function overloads so TypeScript correctly infers whether the client will be null based on whether missing keys throw.
**JULES Check:** Verified no active Autonomous task in `.Jules/task-log.md`
**Conflicts Avoided:** No conflicts.

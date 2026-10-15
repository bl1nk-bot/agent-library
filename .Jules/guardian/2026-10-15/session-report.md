## 2026-10-15 - Consolidate getOpenAIClient into src/lib/ai/openai.ts

**Target:** src/lib/slug.ts, src/lib/ai/improve-prompt.ts, src/lib/ai/generation.ts, src/lib/ai/quality-check.ts, src/lib/ai/embeddings.ts
**Learning:** The `getOpenAIClient` function was duplicated across 5 different files in the `src/lib` and `src/lib/ai` directories. This caused architectural scattering and made it difficult to maintain the OpenAI client initialization logic consistently.
**Action:** Centralized the `getOpenAIClient` function into a new canonical file `src/lib/ai/openai.ts`. Also added `getOpenAIClientOrNull` for the specific case in `slug.ts` where it needs to handle a missing API key gracefully without throwing an error. Updated all consumers to import from the new canonical location.
**JULES Check:** Verified no active Autonomous tasks in `.Jules/task-log.md`.
**Conflicts Avoided:** None found during the check.

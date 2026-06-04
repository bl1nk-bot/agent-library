## $(date '+%Y-%m-%d') - Consolidate OpenAI client instantiation

**Target:** src/lib/ai/improve-prompt.ts, src/lib/ai/generation.ts, src/lib/ai/quality-check.ts, src/lib/ai/embeddings.ts, src/lib/slug.ts
**Learning:** The canonical OpenAI client initialization (`getOpenAIClient`) was duplicated across many files, increasing maintenance overhead. Some files needed an exception to be thrown when `OPENAI_API_KEY` was missing, while others needed a safe `null` fallback.
**Action:** Centralized the client creation in `src/lib/ai/openai.ts`. Exported `getOpenAIClient()` (throws) and `getSafeOpenAIClient()` (returns null fallback) to handle both architectural requirements.
**JULES Check:** Checked `.Jules/task-log.md` and verified no Autonomous tasks were modifying these files.
**Conflicts Avoided:** None found, safe to proceed.

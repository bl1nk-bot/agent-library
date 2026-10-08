## $(date '+%Y-%m-%d') - [Refactor Title: Consolidate OpenAI client initialization]

**Target:** src/lib/ai/embeddings.ts, src/lib/ai/generation.ts, src/lib/ai/improve-prompt.ts, src/lib/ai/quality-check.ts
**Learning:** Initializing the OpenAI client repeatedly in multiple files using duplicate configuration logic leads to maintenance overhead. When a configuration change is required (like changing base URL, headers, error handling), it has to be modified in several places.
**Action:** Extract the client initialization function `getOpenAIClient` to a dedicated `client.ts` module inside the `src/lib/ai/` directory and update all consumers to import it.
**JULES Check:** Verified no active Autonomous task in `.Jules/task-log.md` touching these AI modules.
**Conflicts Avoided:** None.

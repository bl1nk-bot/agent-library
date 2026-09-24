## $(date '+%Y-%m-%d') - Consolidated getOpenAIClient Logic

**Target:** src/lib/ai/embeddings.ts, src/lib/ai/generation.ts, src/lib/ai/improve-prompt.ts, src/lib/ai/quality-check.ts, src/lib/ai/utils/openai.ts
**Learning:** The logic to initialize the OpenAI client was duplicated verbatim across multiple core AI modules, introducing risk for discrepancies.
**Action:** Extracted the logic into \`src/lib/ai/utils/openai.ts\` and updated all 4 files to import from the unified location. This eliminates exactly ONE architectural smell per session.
**JULES Check:** Checked .Jules/task-log.md. No conflicting Autonomous tasks found.
**Conflicts Avoided:** None.

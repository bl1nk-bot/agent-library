import OpenAI from "openai";

// 🛡️ Guardian: Consolidated from src/lib/slug.ts, src/lib/ai/improve-prompt.ts, src/lib/ai/generation.ts, src/lib/ai/quality-check.ts, src/lib/ai/embeddings.ts
// This function was duplicated - moved to canonical location
// JULES Check: Verified no Autonomous task conflicts
// Impact: 5 files modified to use 1 centralized client instantiation
// Date: 2024-05-28
// Session: .Jules/guardian/2024-05-28/

let openai: OpenAI | null = null;

// Function signature overloads to allow TS to know it never returns null if throwOnMissing is true
export function getOpenAIClient(throwOnMissing?: true): OpenAI;
export function getOpenAIClient(throwOnMissing: false): OpenAI | null;
export function getOpenAIClient(throwOnMissing = true): OpenAI | null {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      if (throwOnMissing) {
        throw new Error("OPENAI_API_KEY is not set");
      }
      return null;
    }
    openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return openai;
}

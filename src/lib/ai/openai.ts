// 🛡️ Guardian: Consolidated from various AI modules (improve-prompt.ts, generation.ts, quality-check.ts, embeddings.ts, slug.ts)
// This function was centralized to prevent architectural scattering of OpenAI client instantiation.
// JULES Check: Verified no Autonomous task conflicts
// Impact: 5 duplicated blocks → 1 canonical location
// Date: 2026-06-04
// Session: .Jules/guardian/2026-06-04/

import OpenAI from "openai";

let openai: OpenAI | null = null;

/**
 * Returns the configured OpenAI client.
 * Throws an error if the OPENAI_API_KEY is not set.
 * Use this when the API key is strictly required.
 */
export function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return openai;
}

/**
 * Returns the configured OpenAI client, or null if the API key is missing.
 * Use this for optional features that can gracefully degrade.
 */
export function getSafeOpenAIClient(): OpenAI | null {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return null;
    }
    openai = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return openai;
}

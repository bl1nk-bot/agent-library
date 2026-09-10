import OpenAI from "openai";

let openai: OpenAI | null = null;

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

export function getOpenAIClientOrThrow(): OpenAI {
  const client = getOpenAIClient(true);
  if (!client) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return client;
}

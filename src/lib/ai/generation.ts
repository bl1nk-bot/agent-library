import { getConfig } from "@/lib/config";
import { loadPrompt, getSystemPrompt, interpolatePrompt } from "./load-prompt";

import { getOpenAIClient } from "@/lib/ai/openai";
const translatePrompt = loadPrompt("src/lib/ai/translate.prompt.yml");
const sqlGenerationPrompt = loadPrompt("src/lib/ai/sql-generation.prompt.yml");



const GENERATIVE_MODEL = process.env.OPENAI_GENERATIVE_MODEL || "gpt-4o-mini";

export function getAIModelName(): string {
  return GENERATIVE_MODEL;
}

export async function isAIGenerationEnabled(): Promise<boolean> {
  const config = await getConfig();
  return !!(config.features.aiGeneration && process.env.OPENAI_API_KEY);
}

export async function translateContent(content: string, targetLanguage: string): Promise<string> {
  const client = getOpenAIClient();

  const systemPrompt = interpolatePrompt(getSystemPrompt(translatePrompt), { targetLanguage });

  const response = await client.chat.completions.create({
    model: GENERATIVE_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

export async function generateSQL(prompt: string): Promise<string> {
  const config = await getConfig();
  if (!config.features.aiGeneration) {
    throw new Error("AI Generation is not enabled");
  }

  const client = getOpenAIClient();

  const systemPrompt = getSystemPrompt(sqlGenerationPrompt);

  const response = await client.chat.completions.create({
    model: GENERATIVE_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || "";

  // Clean up the response - remove markdown code blocks if present
  return content
    .replace(/^```sql\n?/i, "")
    .replace(/^```\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}

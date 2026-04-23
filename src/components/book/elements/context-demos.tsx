"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";

// Summarization Demo
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  tokens: number;
}

const sampleConversation: ConversationMessage[] = [
  { role: "user", content: "Hi, I want to learn Python", tokens: 8 },
  { role: "assistant", content: "Great choice! What's your goal?", tokens: 10 },
  { role: "user", content: "Data analysis for my job", tokens: 7 },
  { role: "assistant", content: "Perfect. Let's start with variables.", tokens: 12 },
  { role: "user", content: "What are variables?", tokens: 5 },
  { role: "assistant", content: "Variables store data like name = 'Alice'", tokens: 14 },
  { role: "user", content: "Can I store numbers?", tokens: 6 },
  { role: "assistant", content: "Yes! age = 25 or price = 19.99", tokens: 12 },
  { role: "user", content: "What about lists?", tokens: 5 },
  { role: "assistant", content: "Lists hold multiple values: [1, 2, 3]", tokens: 14 },
  { role: "user", content: "How do I loop through them?", tokens: 7 },
  { role: "assistant", content: "Use for loops: for x in list: print(x)", tokens: 16 },
];

interface SummarizationStrategy {
  name: string;
  description: string;
  color: string;
  apply: (messages: ConversationMessage[]) => {
    kept: number[];
    summarized: number[];
    summary?: string;
  };
}

const strategies: SummarizationStrategy[] = [
  {
    name: "Rolling Summary",
    description: "Summarize oldest messages, keep recent ones intact",
    color: "blue",
    apply: () => ({
      kept: [8, 9, 10, 11],
      summarized: [0, 1, 2, 3, 4, 5, 6, 7],
      summary: "User learning Python for data analysis. Covered: variables, numbers, lists basics.",
    }),
  },
  {
    name: "Hierarchical",
    description: "Create layered summaries (detail → overview)",
    color: "purple",
    apply: () => ({
      kept: [10, 11],
      summarized: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      summary:
        "Session 1: Python basics (variables, numbers). Session 2: Data structures (lists, loops).",
    }),
  },
  {
    name: "Key Points Only",
    description: "Extract decisions and facts, discard chitchat",
    color: "green",
    apply: () => ({
      kept: [2, 5, 7, 9, 11],
      summarized: [0, 1, 3, 4, 6, 8, 10],
      summary: "Goal: data analysis. Learned: variables, numbers, lists, loops.",
    }),
  },
  {
    name: "Sliding Window",
    description: "Keep last N messages, drop everything else",
    color: "amber",
    apply: () => ({
      kept: [6, 7, 8, 9, 10, 11],
      summarized: [0, 1, 2, 3, 4, 5],
    }),
  },
];

const strategyColors: Record<string, { bg: string; border: string; text: string; pill: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    pill: "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-700",
    text: "text-purple-700 dark:text-purple-300",
    pill: "bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
    pill: "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
    pill: "bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300",
  },
};

export function SummarizationDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const strategy = strategies[selectedIndex];
  const colors = strategyColors[strategy.color];
  const result = strategy.apply(sampleConversation);

  const originalTokens = sampleConversation.reduce((sum, m) => sum + m.tokens, 0);
  const keptTokens = result.kept.reduce((sum, i) => sum + sampleConversation[i].tokens, 0);
  const summaryTokens = result.summary ? 20 : 0;
  const savedTokens = originalTokens - keptTokens - summaryTokens;
  const savedPercent = Math.round((savedTokens / originalTokens) * 100);

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <h4 className="mt-2! font-semibold">Summarization Strategies</h4>
      </div>

      <div className="p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {strategies.map((s, index) => {
            const c = strategyColors[s.color];
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-all",
                  selectedIndex === index
                    ? c.pill
                    : "bg-muted/30 hover:bg-muted/50 border-transparent"
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <p className={cn("mb-4 text-sm", colors.text)}>{strategy.description}</p>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground mt-0! mb-2 text-xs font-medium">
              Original Conversation
            </p>
            {sampleConversation.map((msg, index) => {
              const isKept = result.kept.includes(index);
              const isSummarized = result.summarized.includes(index);
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded px-2 py-1 text-xs transition-all",
                    isKept && cn(colors.bg, colors.border, "border"),
                    isSummarized && "bg-muted/30 line-through opacity-50",
                    !isKept && !isSummarized && "bg-muted/20"
                  )}
                >
                  <span className="font-medium">{msg.role === "user" ? "U:" : "A:"}</span>{" "}
                  <span className="text-muted-foreground">{msg.content}</span>
                  <span className="text-muted-foreground/50 ml-1">({msg.tokens}t)</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground m-0! text-xs font-medium">After {strategy.name}</p>

            {result.summary && (
              <div className={cn("rounded-lg border p-3", colors.bg, colors.border)}>
                <p className="m-0! mb-1 text-xs font-medium">
                  <span className={colors.text}>Summary ({summaryTokens}t)</span>
                </p>
                <p className="text-muted-foreground m-0! text-xs">{result.summary}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-muted-foreground m-0! text-xs font-medium">
                Kept Messages ({keptTokens}t)
              </p>
              {result.kept.map((index) => {
                const msg = sampleConversation[index];
                return (
                  <div
                    key={index}
                    className={cn("rounded px-2 py-1 text-xs", colors.bg, colors.border, "border")}
                  >
                    <span className="font-medium">{msg.role === "user" ? "U:" : "A:"}</span>{" "}
                    <span className="text-muted-foreground">{msg.content}</span>
                  </div>
                );
              })}
            </div>

            <div className={cn("rounded-lg p-3", colors.bg)}>
              <p className="m-0! text-sm font-medium">
                <span className={colors.text}>Saved {savedPercent}%</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  ({originalTokens}t → {keptTokens + summaryTokens}t)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Context Playground
interface ContextBlock {
  id: string;
  type: "system" | "history" | "rag" | "tools" | "query";
  label: string;
  content: string;
  tokens: number;
  enabled: boolean;
}

const defaultContextBlocks: ContextBlock[] = [
  {
    id: "system",
    type: "system",
    label: "System Prompt",
    content: "You are a helpful customer support agent for TechStore. Be friendly and concise.",
    tokens: 25,
    enabled: true,
  },
  {
    id: "rag",
    type: "rag",
    label: "Retrieved Documents (RAG)",
    content:
      "From knowledge base:\n- Return policy: 30 days, original packaging required\n- Shipping: Free over $50\n- Warranty: 1 year on electronics",
    tokens: 45,
    enabled: true,
  },
  {
    id: "history",
    type: "history",
    label: "Conversation History",
    content:
      "[Summary] User asked about order #12345. Product: Wireless Mouse. Status: Shipped yesterday.\n\nUser: When will it arrive?\nAssistant: Based on standard shipping, it should arrive in 3-5 business days.",
    tokens: 55,
    enabled: true,
  },
  {
    id: "tools",
    type: "tools",
    label: "Available Tools",
    content:
      "Tools:\n- check_order(order_id) - Get order status\n- process_return(order_id) - Start return process\n- escalate_to_human() - Transfer to human agent",
    tokens: 40,
    enabled: false,
  },
  {
    id: "query",
    type: "query",
    label: "User Query",
    content: "Can I return it if I don't like it?",
    tokens: 12,
    enabled: true,
  },
];

const contextColors: Record<string, { bg: string; border: string; text: string }> = {
  system: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-700",
    text: "text-purple-700 dark:text-purple-300",
  },
  history: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
  },
  rag: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
  },
  tools: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
  },
  query: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-700",
    text: "text-rose-700 dark:text-rose-300",
  },
};

export function ContextPlayground() {
  const [blocks, setBlocks] = useState<ContextBlock[]>(defaultContextBlocks);
  const maxTokens = 200;

  const toggleBlock = (id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)));
  };

  const totalTokens = blocks.filter((b) => b.enabled).reduce((sum, b) => sum + b.tokens, 0);
  const usagePercent = Math.min((totalTokens / maxTokens) * 100, 100);
  const isOverLimit = totalTokens > maxTokens;

  const buildPrompt = () => {
    const parts: string[] = [];
    blocks
      .filter((b) => b.enabled)
      .forEach((block) => {
        parts.push(`--- ${block.label.toUpperCase()} ---\n${block.content}`);
      });
    return parts.join("\n\n");
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <h4 className="mt-2! font-semibold">Context Playground</h4>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn(isOverLimit ? "text-red-600" : "text-muted-foreground")}>
            {totalTokens} / {maxTokens} tokens
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mt-0! mb-4 text-sm">
          Toggle context blocks on/off to see how they combine. Watch the token count!
        </p>

        <div className="mb-4">
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full transition-all duration-300",
                isOverLimit ? "bg-red-500" : usagePercent > 80 ? "bg-amber-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          {isOverLimit && (
            <p className="mt-1 mb-0! text-xs text-red-600">
              Over context limit! Some content will be truncated.
            </p>
          )}
        </div>

        <div className="mb-4 grid gap-2">
          {blocks.map((block) => {
            const colors = contextColors[block.type];
            return (
              <button
                key={block.id}
                onClick={() => toggleBlock(block.id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-all",
                  block.enabled ? colors.bg : "bg-muted/30 opacity-50",
                  block.enabled ? colors.border : "border-muted"
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      block.enabled ? colors.text : "text-muted-foreground"
                    )}
                  >
                    {block.enabled ? "✓" : "○"} {block.label}
                  </span>
                  <span className="text-muted-foreground text-xs">{block.tokens} tokens</span>
                </div>
                <p className="text-muted-foreground m-0! line-clamp-2 font-mono text-xs">
                  {block.content}
                </p>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <pre className="bg-muted/30 max-h-48 overflow-y-auto rounded-lg p-3 pr-12 font-mono text-xs whitespace-pre-wrap">
            {buildPrompt() || "Enable some context blocks to build a prompt"}
          </pre>
          {blocks.some((b) => b.enabled) && (
            <div className="absolute top-2 right-2">
              <RunPromptButton
                content={buildPrompt()}
                title="Test Context"
                variant="ghost"
                size="icon"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

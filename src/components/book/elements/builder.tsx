"use client";

import { useState, useCallback } from "react";
import { Play, Copy, Check, Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// PromptBuilder Component - Step-by-step prompt construction
// ============================================================================

interface PromptBuilderProps {
  title?: string;
  description?: string;
  defaultValues?: {
    role?: string;
    context?: string;
    task?: string;
    constraints?: string;
    format?: string;
    examples?: string;
  };
  showAllFields?: boolean;
}

interface BuilderField {
  id: keyof NonNullable<PromptBuilderProps["defaultValues"]>;
  label: string;
  placeholder: string;
  hint: string;
  required?: boolean;
}

const BUILDER_FIELDS: BuilderField[] = [
  {
    id: "role",
    label: "Role / Persona",
    placeholder: "You are a senior software engineer...",
    hint: "Who should the AI act as? What expertise should it have?",
  },
  {
    id: "context",
    label: "Context / Background",
    placeholder: "I'm building a React app that...",
    hint: "What does the AI need to know about your situation?",
  },
  {
    id: "task",
    label: "Task / Instruction",
    placeholder: "Review this code and identify bugs...",
    hint: "What specific action should the AI take?",
    required: true,
  },
  {
    id: "constraints",
    label: "Constraints / Rules",
    placeholder: "Keep response under 200 words. Focus only on...",
    hint: "What limitations or rules should the AI follow?",
  },
  {
    id: "format",
    label: "Output Format",
    placeholder: "Return as a numbered list with...",
    hint: "How should the response be structured?",
  },
  {
    id: "examples",
    label: "Examples",
    placeholder: "Example input: X → Output: Y",
    hint: "Show examples of what you want (few-shot learning)",
  },
];

export function PromptBuilder({
  title = "Prompt Builder",
  description = "Build your prompt step by step",
  defaultValues = {},
  showAllFields = false,
}: PromptBuilderProps) {
  const [values, setValues] = useState<Record<string, string>>(
    defaultValues as Record<string, string>
  );
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    new Set(showAllFields ? BUILDER_FIELDS.map((f) => f.id) : ["task"])
  );
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{
    remaining?: number;
    dailyRemaining?: number;
  } | null>(null);

  const toggleField = (id: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];

    if (values.role) {
      parts.push(`# Role\n${values.role}`);
    }
    if (values.context) {
      parts.push(`# Context\n${values.context}`);
    }
    if (values.task) {
      parts.push(`# Task\n${values.task}`);
    }
    if (values.constraints) {
      parts.push(`# Constraints\n${values.constraints}`);
    }
    if (values.format) {
      parts.push(`# Output Format\n${values.format}`);
    }
    if (values.examples) {
      parts.push(`# Examples\n${values.examples}`);
    }

    return parts.join("\n\n");
  }, [values]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    const prompt = buildPrompt();
    if (!prompt.trim()) {
      setError("Please add at least a task to your prompt");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/book/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "run_prompt",
          prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            `Rate limit reached. Try again in ${data.resetIn}s${data.signInForMore ? " or sign in for more." : "."}`
          );
        } else {
          setError(data.error || "Failed to run prompt");
        }
        return;
      }

      setResponse(data.result);
      setRateLimit({ remaining: data.remaining, dailyRemaining: data.dailyRemaining });
    } catch {
      setError("Failed to connect to API");
    } finally {
      setIsRunning(false);
    }
  };

  const prompt = buildPrompt();
  const hasContent = prompt.trim().length > 0;

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground ml-2 text-sm">{description}</span>
      </div>

      <div className="space-y-3 p-4">
        {/* Builder Fields */}
        {BUILDER_FIELDS.map((field) => (
          <div key={field.id} className="overflow-hidden rounded-lg border">
            <button
              onClick={() => toggleField(field.id)}
              className={cn(
                "flex w-full items-center justify-between p-3 text-left transition-colors",
                expandedFields.has(field.id) ? "bg-muted/50" : "hover:bg-muted/30",
                values[field.id] && "border-l-primary border-l-4"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{field.label}</span>
                {field.required && <span className="text-xs text-red-500">*</span>}
                {values[field.id] && (
                  <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs">
                    filled
                  </span>
                )}
              </div>
              {expandedFields.has(field.id) ? (
                <ChevronUp className="text-muted-foreground h-4 w-4" />
              ) : (
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              )}
            </button>

            {expandedFields.has(field.id) && (
              <div className="space-y-2 p-3 pt-0">
                <p className="text-muted-foreground text-xs">{field.hint}</p>
                <textarea
                  value={values[field.id] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  className="bg-background focus:ring-primary/50 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            )}
          </div>
        ))}

        {/* Preview */}
        {hasContent && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Generated Prompt</span>
              <span className="text-muted-foreground text-xs">{prompt.length} chars</span>
            </div>
            <pre className="bg-muted/50 max-h-48 overflow-y-auto rounded-lg p-3 text-sm whitespace-pre-wrap">
              {prompt}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button onClick={handleCopy} variant="outline" size="sm" disabled={!hasContent}>
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={handleRun} size="sm" disabled={!hasContent || isRunning}>
            {isRunning ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1 h-4 w-4" />
            )}
            Run with AI
          </Button>
          {rateLimit?.remaining !== undefined && (
            <span className="text-muted-foreground ml-auto text-xs">
              {rateLimit.remaining}{" "}
              {rateLimit.dailyRemaining !== undefined ? `(${rateLimit.dailyRemaining}/day)` : ""}{" "}
              remaining
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                AI Response
              </span>
              <Button
                onClick={() => setResponse(null)}
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm whitespace-pre-wrap dark:border-green-800 dark:bg-green-950/30">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PromptAnalyzer Component - AI analyzes prompt quality
// ============================================================================

interface AnalysisResult {
  score: number;
  clarity: string;
  specificity: string;
  missingElements: string[];
  suggestions: string[];
  improved: string;
}

interface PromptAnalyzerProps {
  title?: string;
  description?: string;
  defaultPrompt?: string;
}

export function PromptAnalyzer({
  title = "Prompt Analyzer",
  description = "Get AI feedback on your prompt",
  defaultPrompt = "",
}: PromptAnalyzerProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{ remaining?: number } | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/book/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "analyze_prompt",
          prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(`Rate limit reached. Try again in ${data.resetIn}s.`);
        } else {
          setError(data.error || "Failed to analyze prompt");
        }
        return;
      }

      setAnalysis(data.result as AnalysisResult);
      setRateLimit({ remaining: data.remaining });
    } catch {
      setError("Failed to connect to API");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scoreColor = analysis?.score
    ? analysis.score >= 8
      ? "text-green-600"
      : analysis.score >= 5
        ? "text-amber-600"
        : "text-red-600"
    : "";

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground ml-2 text-sm">{description}</span>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Your Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste or write your prompt here..."
            rows={5}
            className="bg-background focus:ring-primary/50 w-full resize-none rounded-lg border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleAnalyze} size="sm" disabled={!prompt.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-1 h-4 w-4" />
            )}
            Analyze
          </Button>
          {rateLimit?.remaining !== undefined && (
            <span className="text-muted-foreground text-xs">{rateLimit.remaining} remaining</span>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-4">
              <div className="text-center">
                <div className={cn("text-4xl font-bold", scoreColor)}>{analysis.score}</div>
                <div className="text-muted-foreground text-xs">/ 10</div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs font-medium">Clarity</span>
                  <span className="text-muted-foreground flex-1 text-xs">{analysis.clarity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-xs font-medium">Specificity</span>
                  <span className="text-muted-foreground flex-1 text-xs">
                    {analysis.specificity}
                  </span>
                </div>
              </div>
            </div>

            {/* Missing Elements */}
            {analysis.missingElements.length > 0 && (
              <div>
                <p className="m-0! mb-2 text-sm font-medium">Missing Elements</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingElements.map((el, i) => (
                    <span
                      key={i}
                      className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <p className="m-0! mb-2 text-sm font-medium">Suggestions</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improved Version */}
            {analysis.improved && (
              <div>
                <p className="m-0! mb-2 text-sm font-medium">Improved Version</p>
                <pre className="rounded-lg border border-green-200 bg-green-50 p-3 font-mono text-sm whitespace-pre-wrap dark:border-green-800 dark:bg-green-950/30">
                  {analysis.improved}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

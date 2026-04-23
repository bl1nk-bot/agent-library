"use client";

import { useState, useCallback } from "react";
import { Check, X, RefreshCw, Lightbulb, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// FillInTheBlank Component
// ============================================================================

interface BlankConfig {
  id: string;
  correctAnswers: string[]; // Multiple acceptable answers (used as examples for AI)
  hint?: string;
  caseSensitive?: boolean;
  context?: string; // Additional context for AI validation
}

interface FillInTheBlankProps {
  title?: string;
  description?: string;
  template: string; // Use {{id}} for blanks
  blanks: BlankConfig[];
  explanation?: string;
  useAI?: boolean; // Enable AI-backed semantic validation
  openEnded?: boolean; // Allow any answers, check consistency instead of correctness
}

interface AIValidationResult {
  blankId: string;
  isCorrect: boolean;
  feedback?: string;
}

interface ConsistencyResult {
  isConsistent: boolean;
  overallScore: number;
  issues: Array<{ blankId: string; issue: string }>;
  suggestions: string[];
  praise?: string;
}

export function FillInTheBlank({
  title = "Fill in the Blanks",
  description,
  template,
  blanks,
  explanation,
  useAI = false,
  openEnded = false,
}: FillInTheBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [aiResults, setAiResults] = useState<Record<string, AIValidationResult>>({});
  const [consistencyResult, setConsistencyResult] = useState<ConsistencyResult | null>(null);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const checkAnswerLocal = useCallback(
    (blankId: string, value: string): boolean => {
      const blank = blanks.find((b) => b.id === blankId);
      if (!blank) return false;

      const normalizedValue = blank.caseSensitive ? value.trim() : value.trim().toLowerCase();
      return blank.correctAnswers.some((answer) => {
        const normalizedAnswer = blank.caseSensitive ? answer.trim() : answer.trim().toLowerCase();
        return normalizedValue === normalizedAnswer;
      });
    },
    [blanks]
  );

  const checkAnswer = useCallback(
    (blankId: string, value: string): boolean => {
      // If AI validation was used, check AI results
      if (useAI && aiResults[blankId]) {
        return aiResults[blankId].isCorrect;
      }
      // Fallback to local validation
      return checkAnswerLocal(blankId, value);
    },
    [useAI, aiResults, checkAnswerLocal]
  );

  const validateWithAI = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const res = await fetch("/api/book/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: openEnded ? "check_consistency" : "validate_blanks",
          blanks: blanks.map((b) => ({
            id: b.id,
            expectedAnswers: b.correctAnswers,
            userAnswer: answers[b.id] || "",
            context: b.context || b.hint,
          })),
          template,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(`Rate limit reached.${openEnded ? "" : " Using local validation."}`);
          if (!openEnded) setSubmitted(true);
          return;
        }
        throw new Error(data.error);
      }

      if (openEnded) {
        // Store consistency check results
        setConsistencyResult(data.result as ConsistencyResult);
      } else {
        // Store AI validation results
        const results: Record<string, AIValidationResult> = {};
        for (const result of data.result.validations as AIValidationResult[]) {
          results[result.blankId] = result;
        }
        setAiResults(results);
      }
      setSubmitted(true);
    } catch {
      setError(
        openEnded
          ? "AI check failed. Please try again."
          : "AI validation failed. Using local validation."
      );
      if (!openEnded) setSubmitted(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (useAI) {
      await validateWithAI();
    } else {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setAiResults({});
    setConsistencyResult(null);
    setShowHints({});
    setError(null);
  };

  // For openEnded mode, we don't check individual answers
  const allCorrect = openEnded
    ? (consistencyResult?.isConsistent ?? false)
    : submitted && blanks.every((blank) => checkAnswer(blank.id, answers[blank.id] || ""));
  const score = openEnded
    ? (consistencyResult?.overallScore ?? 0)
    : submitted
      ? blanks.filter((blank) => checkAnswer(blank.id, answers[blank.id] || "")).length
      : 0;

  // Parse template and render with inputs
  const renderTemplate = () => {
    const parts = template.split(/(\{\{[^}]+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{([^}]+)\}\}/);
      if (match) {
        const blankId = match[1];
        const blank = blanks.find((b) => b.id === blankId);
        const hasIssue = openEnded && consistencyResult?.issues.some((i) => i.blankId === blankId);
        const isCorrect = openEnded
          ? submitted && !hasIssue
          : submitted && checkAnswer(blankId, answers[blankId] || "");
        const isWrong = openEnded ? submitted && hasIssue : submitted && !isCorrect;

        return (
          <span key={index} className="mx-1 inline-flex items-center gap-1">
            <input
              type="text"
              value={answers[blankId] || ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [blankId]: e.target.value }))}
              disabled={submitted}
              placeholder="..."
              className={cn(
                "max-w-[200px] min-w-[80px] border-b-2 bg-transparent px-2 py-1 text-center transition-colors focus:outline-none",
                !submitted && "border-primary/50 focus:border-primary",
                isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                isWrong && "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
              )}
              style={{ width: `${Math.max(80, (answers[blankId]?.length || 3) * 10)}px` }}
            />
            {submitted && isCorrect && !openEnded && <Check className="h-4 w-4 text-green-500" />}
            {submitted && isWrong && !openEnded && <X className="h-4 w-4 text-red-500" />}
            {!submitted && blank?.hint && (
              <button
                onClick={() => setShowHints((prev) => ({ ...prev, [blankId]: !prev[blankId] }))}
                className="text-muted-foreground hover:text-primary"
                title="Show hint"
              >
                <Lightbulb className="h-4 w-4" />
              </button>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">{title}</span>
        {description && <span className="text-muted-foreground ml-2 text-sm">{description}</span>}
      </div>

      <div className="space-y-4 p-4">
        <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {renderTemplate()}
        </div>

        {/* Hints */}
        {Object.entries(showHints)
          .filter(([, show]) => show)
          .map(([blankId]) => {
            const blank = blanks.find((b) => b.id === blankId);
            return blank?.hint ? (
              <div
                key={blankId}
                className="text-muted-foreground flex items-center gap-2 rounded bg-amber-50 p-2 text-sm dark:bg-amber-950/30"
              >
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span>
                  <strong>Hint for blank:</strong> {blank.hint}
                </span>
              </div>
            ) : null;
          })}

        {/* Results - Standard mode */}
        {submitted && !openEnded && (
          <div
            className={cn(
              "rounded-lg p-3 text-sm",
              allCorrect
                ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                : "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            )}
          >
            <p className="m-0! font-medium">
              {allCorrect ? "🎉 Perfect!" : `${score} of ${blanks.length} correct`}
            </p>
            {!allCorrect && (
              <div className="mt-2 space-y-1">
                {blanks
                  .filter((blank) => !checkAnswer(blank.id, answers[blank.id] || ""))
                  .map((blank) => (
                    <p key={blank.id} className="text-muted-foreground m-0!">
                      <span className="text-red-600 dark:text-red-400">✗</span> Correct answer:{" "}
                      <code className="bg-muted rounded px-1">{blank.correctAnswers[0]}</code>
                    </p>
                  ))}
              </div>
            )}
            {explanation && <p className="m-0! mt-2">{explanation}</p>}
          </div>
        )}

        {/* Results - Open-ended mode */}
        {submitted && openEnded && consistencyResult && (
          <div
            className={cn(
              "rounded-lg p-3 text-sm",
              consistencyResult.isConsistent
                ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                : "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            )}
          >
            <div className="mb-2 flex items-center gap-3">
              <div
                className={cn(
                  "text-2xl font-bold",
                  consistencyResult.overallScore >= 8
                    ? "text-green-600"
                    : consistencyResult.overallScore >= 5
                      ? "text-amber-600"
                      : "text-red-600"
                )}
              >
                {consistencyResult.overallScore}/10
              </div>
              <p className="m-0! font-medium">
                {consistencyResult.isConsistent
                  ? "🎉 Well-structured prompt!"
                  : "Some consistency issues found"}
              </p>
            </div>

            {consistencyResult.praise && (
              <p className="m-0! mb-2 text-green-700 dark:text-green-400">
                {consistencyResult.praise}
              </p>
            )}

            {consistencyResult.issues.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="m-0! font-medium text-amber-700 dark:text-amber-400">Issues:</p>
                {consistencyResult.issues.map((issue, i) => (
                  <p key={i} className="text-muted-foreground m-0!">
                    <span className="text-amber-600">⚠</span> {issue.issue}
                  </p>
                ))}
              </div>
            )}

            {consistencyResult.suggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="m-0! font-medium">Suggestions:</p>
                {consistencyResult.suggestions.map((suggestion, i) => (
                  <p key={i} className="text-muted-foreground m-0!">
                    • {suggestion}
                  </p>
                ))}
              </div>
            )}

            {explanation && <p className="m-0! mt-2">{explanation}</p>}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            {error}
          </div>
        )}

        {/* AI Feedback */}
        {useAI && submitted && Object.values(aiResults).some((r) => r.feedback) && (
          <div className="space-y-1">
            {Object.values(aiResults)
              .filter((r) => r.feedback)
              .map((result) => (
                <div key={result.blankId} className="text-muted-foreground text-xs">
                  {result.feedback}
                </div>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!submitted ? (
            <Button onClick={handleSubmit} size="sm" disabled={isValidating}>
              {isValidating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-1 h-4 w-4" />
              )}
              {isValidating ? "Checking..." : "Check Answers"}
            </Button>
          ) : (
            <Button onClick={handleReset} variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              Try Again
            </Button>
          )}
          {useAI && !submitted && (
            <span className="text-muted-foreground self-center text-xs">
              AI-powered semantic validation
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// InteractiveChecklist Component
// ============================================================================

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface InteractiveChecklistProps {
  title?: string;
  items: ChecklistItem[];
  onComplete?: () => void;
}

export function InteractiveChecklist({
  title = "Checklist",
  items,
  onComplete,
}: InteractiveChecklistProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (next.size === items.length && onComplete) {
          onComplete();
        }
      }
      return next;
    });
  };

  const progress = (checked.size / items.length) * 100;
  const allComplete = checked.size === items.length;

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <span className="font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm">
          {checked.size}/{items.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-muted h-1">
        <div
          className={cn(
            "h-full transition-all duration-300",
            allComplete ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2 p-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors",
              checked.has(item.id)
                ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                : "bg-muted/30 hover:bg-muted/50 border border-transparent"
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                checked.has(item.id)
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-muted-foreground/50"
              )}
            >
              {checked.has(item.id) && <Check className="h-3 w-3" />}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "m-0! text-sm font-medium",
                  checked.has(item.id) && "text-muted-foreground line-through"
                )}
              >
                {item.label}
              </p>
              {item.description && (
                <p className="text-muted-foreground m-0! mt-0.5 text-xs">{item.description}</p>
              )}
            </div>
          </button>
        ))}

        {allComplete && (
          <div className="mt-4 rounded-lg bg-green-50 p-3 text-center dark:bg-green-950/30">
            <p className="m-0! font-medium text-green-700 dark:text-green-300">
              🎉 All done! Great work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// PromptDebugger Component
// ============================================================================

interface DebugOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

interface PromptDebuggerProps {
  title?: string;
  badPrompt: string;
  badOutput: string;
  options: DebugOption[];
  hint?: string;
}

export function PromptDebugger({
  title = "Debug This Prompt",
  badPrompt,
  badOutput,
  options,
  hint,
}: PromptDebuggerProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const selectedOption = options.find((o) => o.id === selected);

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <span className="font-semibold">{title}</span>
        {hint && !selected && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
          >
            <Lightbulb className="h-4 w-4" />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
      </div>

      <div className="space-y-4 p-4">
        {/* Bad prompt */}
        <div>
          <p className="text-muted-foreground m-0! mb-1 text-sm font-medium">The Prompt:</p>
          <pre className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">{badPrompt}</pre>
        </div>

        {/* Bad output */}
        <div>
          <p className="text-muted-foreground m-0! mb-1 text-sm font-medium">
            The Output (problematic):
          </p>
          <pre className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm whitespace-pre-wrap dark:border-red-800 dark:bg-red-950/30">
            {badOutput}
          </pre>
        </div>

        {/* Hint */}
        {showHint && hint && (
          <div className="flex items-center gap-2 rounded bg-amber-50 p-2 text-sm dark:bg-amber-950/30">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
            {hint}
          </div>
        )}

        {/* Question */}
        <div>
          <p className="m-0! mb-2 font-medium">What's wrong with this prompt?</p>
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                disabled={!!selected}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-colors",
                  selected === option.id
                    ? option.isCorrect
                      ? "border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950"
                      : "border-red-500 bg-red-100 dark:border-red-700 dark:bg-red-950"
                    : selected && option.isCorrect
                      ? "border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950"
                      : "hover:bg-muted border-border"
                )}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 shrink-0" />
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {selected && selectedOption && (
          <div
            className={cn(
              "rounded-lg p-3 text-sm",
              selectedOption.isCorrect
                ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                : "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            )}
          >
            <p className="m-0! font-medium">
              {selectedOption.isCorrect ? "✓ Correct!" : "✗ Not quite."}
            </p>
            <p className="m-0! mt-1">{selectedOption.explanation}</p>
          </div>
        )}

        {/* Reset */}
        {selected && (
          <Button onClick={() => setSelected(null)} variant="outline" size="sm">
            <RefreshCw className="mr-1 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

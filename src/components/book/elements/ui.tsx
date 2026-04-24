"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Lightbulb,
  AlertTriangle,
  Info,
  Zap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import Link from "next/link";

// Collapsible Component
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 overflow-hidden rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-muted/50 hover:bg-muted flex w-full items-center gap-2 p-4 text-left font-medium transition-colors"
      >
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </button>
      {isOpen && <div className="border-t p-4">{children}</div>}
    </div>
  );
}

// Callout Component
interface CalloutProps {
  type?: "info" | "warning" | "tip" | "example";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    },
    tip: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      icon: <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />,
    },
    example: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      icon: <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    },
  };

  const style = styles[type];

  return (
    <div className={cn("my-6 rounded-lg border p-4", style.bg, style.border)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{style.icon}</div>
        <div className="min-w-0 flex-1">
          {title && <span className="mb-1 block font-semibold">{title}</span>}
          <div className="text-sm [&>p]:m-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

// CopyableCode Component
interface CopyableCodeProps {
  code: string;
  language?: string;
}

export function CopyableCode({ code, language }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4">
      <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
        <code className={language ? `language-${language}` : ""}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

// Quiz Component
interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function Quiz({ question, options, correctIndex, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (index: number) => {
    setSelected(index);
    setShowExplanation(true);
  };

  const isCorrect = selected === correctIndex;

  return (
    <div className="bg-card my-6 rounded-lg border p-4">
      <p className="m-0! mb-4! font-semibold">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={showExplanation}
            className={cn(
              "w-full rounded-lg border p-3 text-left text-sm transition-colors",
              selected === index
                ? isCorrect
                  ? "border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950"
                  : "border-red-500 bg-red-100 dark:border-red-700 dark:bg-red-950"
                : showExplanation && index === correctIndex
                  ? "border-green-500 bg-green-100 dark:border-green-700 dark:bg-green-950"
                  : "hover:bg-muted"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div
          className={cn(
            "mt-4 rounded-lg p-3 text-sm",
            isCorrect ? "bg-green-50 dark:bg-green-950/50" : "bg-amber-50 dark:bg-amber-950/50"
          )}
        >
          <p className="m-0! mb-1! font-medium">{isCorrect ? "Correct!" : "Not quite."}</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

// TryIt Component
interface TryItProps {
  prompt: string;
  description?: string;
  title?: string;
  compact?: boolean;
}

function parsePromptVariables(content: string): { name: string; defaultValue: string }[] {
  const regex = /\$\{([^:}]+)(?::([^}]*))?\}/g;
  const seen = new Map<string, string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const defaultValue = match[2] || "";
    if (!seen.has(name)) {
      seen.set(name, defaultValue);
    }
  }
  return Array.from(seen.entries()).map(([name, defaultValue]) => ({ name, defaultValue }));
}

export function TryIt({
  prompt,
  description,
  title = "Try It Yourself",
  compact = false,
}: TryItProps) {
  const [copied, setCopied] = useState(false);

  const unfilledVariables = parsePromptVariables(prompt);

  const getContentWithVariables = (values: Record<string, string>) => {
    let result = prompt;
    for (const [name, value] of Object.entries(values)) {
      const regex = new RegExp(`\\$\\{${name}(?::[^}]*)?\\}`, "g");
      result = result.replace(regex, value);
    }
    return result;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <div className="relative my-4">
        <div className="absolute top-2 right-2 z-10">
          <RunPromptButton
            content={prompt}
            title={title}
            description={description}
            variant="ghost"
            size="icon"
            unfilledVariables={unfilledVariables}
            getContentWithVariables={getContentWithVariables}
          />
        </div>
        <pre className="bg-muted/50 rounded-lg p-3 pr-12 text-sm whitespace-pre-wrap">{prompt}</pre>
      </div>
    );
  }

  return (
    <div className="border-primary/30 bg-primary/5 my-6 rounded-lg border-2 border-dashed p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-primary flex items-center gap-2 font-semibold">
          <Zap className="h-4 w-4" />
          {title}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <RunPromptButton
            content={prompt}
            title={title}
            description={description}
            variant="default"
            size="sm"
            emphasized
            unfilledVariables={unfilledVariables}
            getContentWithVariables={getContentWithVariables}
          />
        </div>
      </div>
      {description && <p className="text-muted-foreground mt-0! mb-3 text-sm">{description}</p>}
      <pre className="bg-background mb-0! rounded border p-3 text-sm whitespace-pre-wrap">
        {prompt}
      </pre>
    </div>
  );
}

// Navigation Button Component
interface NavButtonProps {
  href: string;
  label: string;
  direction?: "next" | "prev";
}

export function NavButton({ href, label, direction = "next" }: NavButtonProps) {
  return (
    <Link href={href} className="no-underline">
      <Button variant="outline" className="gap-2">
        {direction === "prev" && <ArrowLeft className="h-4 w-4" />}
        {label}
        {direction === "next" && <ArrowRight className="h-4 w-4" />}
      </Button>
    </Link>
  );
}

// Navigation Footer Component
interface NavFooterProps {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}

export function NavFooter({ prev, next }: NavFooterProps) {
  return (
    <div
      className={cn(
        "mt-12 flex border-t pt-6",
        prev && next ? "justify-between" : next ? "justify-end" : "justify-start"
      )}
    >
      {prev && <NavButton href={prev.href} label={prev.label} direction="prev" />}
      {next && <NavButton href={next.href} label={next.label} direction="next" />}
    </div>
  );
}

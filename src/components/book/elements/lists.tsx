"use client";

import { useState } from "react";
import {
  Check,
  Target,
  Scissors,
  Palette,
  Megaphone,
  Code,
  GitBranch,
  Shield,
  Tag,
  Layers,
  Scale,
  Database,
  Layout,
  Plus,
  Minus,
  HelpCircle,
  Link,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Checklist Component
interface ChecklistItem {
  text: string;
}

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
}

export function Checklist({ title, items }: ChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));

  const toggleItem = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const checkedCount = checked.filter(Boolean).length;
  const allChecked = checkedCount === items.length;

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between px-4 py-3">
        <span className="font-semibold">{title}</span>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs",
            allChecked
              ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
              : "bg-muted text-muted-foreground"
          )}
        >
          {checkedCount}/{items.length}
        </span>
      </div>
      <div className="divide-y">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => toggleItem(index)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
              checked[index] ? "bg-green-50/50 dark:bg-green-950/20" : "hover:bg-muted/30"
            )}
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                checked[index]
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-muted-foreground/30"
              )}
            >
              {checked[index] && <Check className="h-3 w-3" />}
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                checked[index] && "text-muted-foreground line-through"
              )}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Compare Component
interface CompareProps {
  before: { label: string; content: string };
  after: { label: string; content: string };
}

export function Compare({ before, after }: CompareProps) {
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
        <p className="m-0! px-4 pt-3 text-sm font-semibold text-red-700 dark:text-red-400">
          {before.label}
        </p>
        <pre className="m-0! border-0! bg-transparent! p-4 pt-0! font-sans text-sm whitespace-pre-wrap">
          {before.content}
        </pre>
      </div>
      <div className="rounded-lg border border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
        <p className="m-0! px-4 pt-3 text-sm font-semibold text-green-700 dark:text-green-400">
          {after.label}
        </p>
        <pre className="m-0! border-0! bg-transparent! p-4 pt-0! font-sans text-sm whitespace-pre-wrap">
          {after.content}
        </pre>
      </div>
    </div>
  );
}

// InfoGrid Component
interface InfoItem {
  label?: string;
  title?: string;
  description: string;
  example?: string;
  exampleType?: "code" | "text"; // "code" = mono font, "text" = regular font
  icon?: string;
  color?: "purple" | "blue" | "green" | "amber" | "rose" | "red" | "cyan" | "pink" | "indigo";
}

interface InfoGridProps {
  items: InfoItem[];
  columns?: 1 | 2;
}

const infoColors: Record<string, { bg: string; border: string; text: string }> = {
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    text: "text-rose-700 dark:text-rose-300",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800",
    text: "text-cyan-700 dark:text-cyan-300",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800",
    text: "text-pink-700 dark:text-pink-300",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-700 dark:text-indigo-300",
  },
};

const defaultInfoColors = ["purple", "blue", "green", "amber", "rose", "cyan", "pink", "indigo"];

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  scissors: Scissors,
  palette: Palette,
  megaphone: Megaphone,
  code: Code,
  "git-branch": GitBranch,
  shield: Shield,
  tag: Tag,
  layers: Layers,
  scale: Scale,
  database: Database,
  layout: Layout,
  plus: Plus,
  minus: Minus,
  "help-circle": HelpCircle,
  link: Link,
};

export function InfoGrid({ items, columns = 1 }: InfoGridProps) {
  return (
    <div className={cn("my-4 grid gap-3", columns === 2 ? "md:grid-cols-2" : "grid-cols-1")}>
      {items.map((item, index) => {
        const colorKey = item.color || defaultInfoColors[index % defaultInfoColors.length];
        const colors = infoColors[colorKey] || infoColors.blue;
        const Icon = item.icon ? iconMap[item.icon] : null;
        const displayTitle = item.title || item.label;

        return (
          <div key={index} className="group relative py-2 pl-4">
            {/* Color accent bar */}
            <div
              className={cn(
                "absolute top-0 bottom-0 left-0 w-1 rounded-full",
                colors.text.replace("text-", "bg-")
              )}
            />

            <div className="space-y-1">
              {/* Title row */}
              <div className="flex items-center gap-2">
                {Icon && <Icon className={cn("h-4 w-4 shrink-0", colors.text)} />}
                <span className={cn("text-sm font-semibold", colors.text)}>{displayTitle}</span>
              </div>

              {/* Description */}
              <p className="text-foreground/80 m-0! text-sm leading-relaxed">{item.description}</p>

              {/* Example */}
              {item.example && (
                <p
                  className={cn(
                    "m-0! mt-1.5!",
                    item.exampleType === "text"
                      ? "text-muted-foreground text-sm italic"
                      : "bg-muted/50 text-foreground/70 border-border/50 rounded border px-2 py-1.5 font-mono text-xs"
                  )}
                >
                  {item.example}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

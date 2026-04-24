"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Copy, ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import { analyticsWidget } from "@/lib/analytics";
import type { WidgetPrompt } from "@/lib/plugins/widgets";

export interface WidgetCardProps {
  prompt: WidgetPrompt;
}

export function WidgetCard({ prompt }: WidgetCardProps) {
  const t = useTranslations("prompts");
  const tCommon = useTranslations("common");
  const [copied, setCopied] = useState(false);

  // If widget has a custom render function, use it
  if (prompt.render) {
    return <>{prompt.render()}</>;
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success(tCommon("copiedToClipboard"));
    analyticsWidget.copy(prompt.id, prompt.actionLabel || prompt.sponsor?.name);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActionClick = () => {
    analyticsWidget.action(prompt.id, prompt.actionLabel || prompt.sponsor?.name, prompt.actionUrl);
  };

  return (
    <div className="group hover:border-foreground/20 from-background to-muted/30 flex flex-col overflow-hidden rounded-[var(--radius)] border bg-gradient-to-br p-4 transition-colors">
      {/* Sponsor Header */}
      {prompt.sponsor && (
        <div className="mb-3 flex items-center justify-between border-b border-dashed pb-2">
          <Link
            href={prompt.sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            {prompt.sponsor.logoDark ? (
              <>
                <Image
                  src={prompt.sponsor.logo}
                  alt={prompt.sponsor.name}
                  width={80}
                  height={20}
                  className="h-5 w-auto dark:hidden"
                />
                <Image
                  src={prompt.sponsor.logoDark}
                  alt={prompt.sponsor.name}
                  width={80}
                  height={20}
                  className="hidden h-5 w-auto dark:block"
                />
              </>
            ) : (
              <Image
                src={prompt.sponsor.logo}
                alt={prompt.sponsor.name}
                width={80}
                height={20}
                className="h-5 w-auto"
              />
            )}
          </Link>
          <Badge variant="outline" className="text-muted-foreground text-[10px]">
            Sponsored
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="line-clamp-1 text-sm font-medium">{prompt.title}</span>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {t(`types.${prompt.type.toLowerCase()}`)}
        </Badge>
      </div>

      {/* Description */}
      {prompt.description && (
        <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{prompt.description}</p>
      )}

      {/* Content Preview */}
      <div className="relative mb-3 min-h-0 flex-1">
        <pre className="text-muted-foreground bg-muted line-clamp-10 h-full overflow-hidden rounded p-2 font-mono text-xs break-words whitespace-pre-wrap">
          {prompt.content}
        </pre>
      </div>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-muted-foreground mt-auto flex items-center justify-between border-t pt-2 text-[11px]">
        <div className="flex items-center gap-1.5">
          {prompt.sponsor && (
            <Link
              href={prompt.sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>by {prompt.sponsor.name}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyToClipboard} className="hover:bg-accent rounded p-1">
            <Copy className="h-3 w-3" />
          </button>
          {prompt.actionUrl ? (
            <Link
              href={prompt.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-accent flex h-6 w-6 items-center justify-center rounded"
              title={prompt.actionLabel || "Try it"}
              onClick={handleActionClick}
            >
              <Play className="h-4 w-4" />
            </Link>
          ) : (
            <RunPromptButton
              content={prompt.content}
              title={prompt.title}
              description={prompt.description}
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              categoryName={prompt.category}
              promptType={prompt.type}
            />
          )}
        </div>
      </div>
    </div>
  );
}

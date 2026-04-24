"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Masonry } from "@/components/ui/masonry";
import { PromptCard, type PromptCardProps } from "@/components/prompts/prompt-card";

export interface PromptListProps {
  prompts: PromptCardProps["prompt"][];
  currentPage: number;
  totalPages: number;
  pinnedIds?: Set<string>;
  showPinButton?: boolean;
}

export function PromptList({
  prompts,
  currentPage,
  totalPages,
  pinnedIds,
  showPinButton = false,
}: PromptListProps) {
  const t = useTranslations("prompts");

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          <SearchX className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-1 text-lg font-medium">{t("noPrompts")}</h3>
        <p className="text-muted-foreground max-w-sm text-sm">{t("noPromptsDescription")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Masonry columnCount={{ default: 1, md: 2, lg: 3 }} gap={16}>
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            showPinButton={showPinButton}
            isPinned={pinnedIds?.has(prompt.id) ?? false}
          />
        ))}
      </Masonry>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`?page=${currentPage - 1}`} prefetch={false}>
                Previous
              </Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>
          <span className="text-muted-foreground text-xs">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`?page=${currentPage + 1}`} prefetch={false}>
                Next
              </Link>
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

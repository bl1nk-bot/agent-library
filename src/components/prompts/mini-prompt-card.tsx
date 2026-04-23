"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPromptUrl } from "@/lib/urls";

interface MiniPromptCardProps {
  prompt: {
    id: string;
    slug?: string | null;
    title: string;
    description?: string | null;
    contentPreview: string;
    type: string;
    tags: string[];
  };
}

export function MiniPromptCard({ prompt }: MiniPromptCardProps) {
  return (
    <Link
      href={getPromptUrl(prompt.id, prompt.slug)}
      target="_blank"
      prefetch={false}
      className="hover:bg-accent/50 block rounded-md border p-2 text-xs transition-colors"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="line-clamp-1 flex-1 font-medium">{prompt.title}</span>
        <Badge variant="outline" className="shrink-0 px-1 py-0 text-[9px]">
          {prompt.type}
        </Badge>
      </div>
      <p className="text-muted-foreground mb-1.5 line-clamp-2">{prompt.contentPreview}</p>
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[9px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

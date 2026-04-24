"use client";

import Link from "next/link";
import { SubscribeButton } from "./subscribe-button";

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    promptCount: number;
  };
  isSubscribed: boolean;
  showSubscribe: boolean;
}

export function CategoryItem({ category, isSubscribed, showSubscribe }: CategoryItemProps) {
  return (
    <div className="group bg-card hover:bg-accent/50 flex items-center justify-between gap-2 rounded-[var(--radius)] border px-3 py-2 transition-colors">
      <Link
        href={`/categories/${category.slug}`}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        {category.icon && <span className="shrink-0 text-sm">{category.icon}</span>}
        <span className="truncate text-sm font-medium group-hover:underline">{category.name}</span>
      </Link>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-muted-foreground text-xs">{category.promptCount}</span>
        {showSubscribe && (
          <SubscribeButton
            categoryId={category.id}
            categoryName={category.name}
            initialSubscribed={isSubscribed}
            iconOnly
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFilterContext } from "./filter-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Sparkles, Search, SlidersHorizontal, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DeepWikiIcon from "@/../public/deepwiki.svg";
import config from "@/../prompts.config";
import { analyticsSearch } from "@/lib/analytics";

interface PromptFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
  }>;
  currentFilters: {
    q?: string;
    type?: string;
    category?: string;
    tag?: string;
    sort?: string;
    ai?: string;
  };
  aiSearchEnabled?: boolean;
}

const promptTypes = ["TEXT", "STRUCTURED", "IMAGE", "VIDEO", "AUDIO"];

export function PromptFilters({
  categories,
  tags,
  currentFilters,
  aiSearchEnabled,
}: PromptFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [tagSearch, setTagSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { setFilterPending } = useFilterContext();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return tags;
    const search = tagSearch.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(search));
  }, [tags, tagSearch]);

  const updateFilter = (key: string, value: string | null) => {
    setFilterPending(true);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/prompts?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilterPending(true);
    analyticsSearch.clearFilters();
    router.push("/prompts");
  };

  const hasFilters =
    currentFilters.q ||
    currentFilters.type ||
    currentFilters.category ||
    currentFilters.tag ||
    currentFilters.sort;

  const activeFilterCount = [
    currentFilters.type,
    currentFilters.category,
    currentFilters.tag,
    currentFilters.sort && currentFilters.sort !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="space-y-4 border-t p-0 pt-4 text-sm lg:rounded-lg lg:border lg:p-4 lg:pt-4">
        {/* Mobile: Compact search with filter toggle */}
        <div className="space-y-3 lg:hidden">
          {/* Search bar with AI toggle and filter toggle */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder={t("search.placeholder")}
                className="h-8 pl-8 text-xs"
                defaultValue={currentFilters.q}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterPending(true);
                  if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                  }
                  debounceRef.current = setTimeout(() => {
                    if (value) {
                      analyticsSearch.search(value, currentFilters.ai === "1");
                    }
                    updateFilter("q", value || null);
                  }, 300);
                }}
              />
            </div>
            {aiSearchEnabled && (
              <div className="flex shrink-0 items-center gap-1">
                <Sparkles className="text-primary h-3 w-3" />
                <Switch
                  id="ai-search-mobile"
                  checked={currentFilters.ai === "1"}
                  onCheckedChange={(checked) => {
                    analyticsSearch.aiSearchToggle(checked);
                    updateFilter("ai", checked ? "1" : null);
                  }}
                />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="relative h-8 shrink-0 px-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Collapsible filters */}
          {showFilters && (
            <div className="space-y-4 border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium uppercase">
                  {t("search.filters")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 text-xs ${hasFilters ? "visible" : "invisible"}`}
                  onClick={clearFilters}
                >
                  <X className="mr-1 h-3 w-3" />
                  {t("search.clear")}
                </Button>
              </div>
              {/* Mobile filters content rendered below */}
            </div>
          )}
        </div>

        {/* Desktop: Full filters */}
        <div className="hidden space-y-4 lg:block">
          <div className="flex h-6 items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium uppercase">
              {t("search.filters")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs ${hasFilters ? "visible" : "invisible"}`}
              onClick={clearFilters}
            >
              <X className="mr-1 h-3 w-3" />
              {t("search.clear")}
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-1.5">
            <Label className="text-xs">{t("search.search")}</Label>
            <Input
              placeholder={t("search.placeholder")}
              className="h-8 text-sm"
              defaultValue={currentFilters.q}
              onChange={(e) => {
                const value = e.target.value;
                setFilterPending(true);
                if (debounceRef.current) {
                  clearTimeout(debounceRef.current);
                }
                debounceRef.current = setTimeout(() => {
                  if (value) {
                    analyticsSearch.search(value, currentFilters.ai === "1");
                  }
                  updateFilter("q", value || null);
                }, 300);
              }}
            />
          </div>

          {/* AI Search Toggle */}
          {aiSearchEnabled && (
            <div className="flex items-center justify-between py-1">
              <Label
                className="flex cursor-pointer items-center gap-1.5 text-xs"
                htmlFor="ai-search"
              >
                <Sparkles className="text-primary h-3 w-3" />
                {t("search.aiSearch")}
              </Label>
              <Switch
                id="ai-search"
                checked={currentFilters.ai === "1"}
                onCheckedChange={(checked) => {
                  analyticsSearch.aiSearchToggle(checked);
                  updateFilter("ai", checked ? "1" : null);
                }}
              />
            </div>
          )}
        </div>

        {/* Shared filters - shown on desktop always, on mobile when showFilters is true */}
        <div className={`space-y-4 ${showFilters ? "block" : "hidden"} lg:block`}>
          {/* Type filter */}
          <div className="space-y-1.5">
            <Label className="text-xs">{t("prompts.promptType")}</Label>
            <Select
              value={currentFilters.type || "all"}
              onValueChange={(value) => {
                if (value !== "all") {
                  analyticsSearch.filter("type", value);
                }
                updateFilter("type", value === "all" ? null : value);
              }}
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue placeholder={t("common.all")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {promptTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`prompts.types.${type.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">{t("prompts.promptCategory")}</Label>
              <Select
                value={currentFilters.category || "all"}
                onValueChange={(value) => {
                  if (value !== "all") {
                    analyticsSearch.filter("category", value);
                  }
                  updateFilter("category", value === "all" ? null : value);
                }}
              >
                <SelectTrigger className="h-8 w-full text-sm">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {/* Parent categories */}
                  {categories
                    .filter((c) => c.id && !c.parentId)
                    .map((parent) => (
                      <div key={parent.id}>
                        <SelectItem value={parent.id} className="font-medium">
                          {parent.name}
                        </SelectItem>
                        {/* Child categories */}
                        {categories
                          .filter((c) => c.parentId === parent.id)
                          .map((child) => (
                            <SelectItem
                              key={child.id}
                              value={child.id}
                              className="text-muted-foreground pl-6"
                            >
                              ↳ {child.name}
                            </SelectItem>
                          ))}
                      </div>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort */}
          <div className="space-y-1.5">
            <Label className="text-xs">{t("search.sortBy")}</Label>
            <Select
              value={currentFilters.sort || "newest"}
              onValueChange={(value) => {
                analyticsSearch.sort(value);
                updateFilter("sort", value === "newest" ? null : value);
              }}
            >
              <SelectTrigger className="h-8 w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("search.newest")}</SelectItem>
                <SelectItem value="oldest">{t("search.oldest")}</SelectItem>
                <SelectItem value="upvotes">{t("search.mostUpvoted")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">{t("prompts.promptTags")}</Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2" />
                <Input
                  placeholder={t("search.searchTags")}
                  className="h-7 pl-7 text-xs"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                />
              </div>
              <div className="flex max-h-48 flex-wrap gap-1 overflow-y-auto">
                {filteredTags
                  .filter((tag) => tag.id && tag.slug)
                  .map((tag) => (
                    <button
                      key={tag.id}
                      className="rounded border px-2 py-0.5 text-[11px] transition-colors"
                      style={
                        currentFilters.tag === tag.slug
                          ? { backgroundColor: tag.color, color: "white", borderColor: tag.color }
                          : { borderColor: tag.color + "40", color: tag.color }
                      }
                      onClick={() => {
                        if (currentFilters.tag !== tag.slug) {
                          analyticsSearch.filter("tag", tag.slug);
                        }
                        updateFilter("tag", currentFilters.tag === tag.slug ? null : tag.slug);
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                {filteredTags.length === 0 && tagSearch && (
                  <span className="text-muted-foreground text-xs">{t("search.noResults")}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer links - desktop only */}
      <div className="hidden space-y-2 pt-2 lg:block">
        <nav className="text-muted-foreground flex flex-col gap-1.5 text-xs">
          {!config.homepage?.useCloneBranding && (
            <>
              <Link
                href="https://deepwiki.com/bl1nk-bot/agent-library"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="hover:text-foreground flex items-center gap-1.5"
              >
                <Image src={DeepWikiIcon} alt="" width={12} height={12} />
                DeepWiki
                <ExternalLink className="ml-auto h-2.5 w-2.5 opacity-50" />
              </Link>
              <Link
                href="/how_to_write_effective_prompts"
                prefetch={false}
                className="hover:text-foreground"
              >
                {t("footer.howTo")}
              </Link>
              <Link href="/docs/self-hosting" prefetch={false} className="hover:text-foreground">
                {t("footer.docs")}
              </Link>
              <Link href="/docs/api" prefetch={false} className="hover:text-foreground">
                {t("footer.api")}
              </Link>
              <Link href="/privacy" prefetch={false} className="hover:text-foreground">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" prefetch={false} className="hover:text-foreground">
                {t("footer.terms")}
              </Link>
              <Link href="/support" prefetch={false} className="hover:text-foreground">
                {t("footer.support")}
              </Link>
              <Link href="/about" prefetch={false} className="hover:text-foreground">
                {t("footer.about")}
              </Link>
            </>
          )}
          <Link
            href="https://github.com/bl1nk-bot/agent-library"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="hover:text-foreground flex items-center gap-1.5"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
            <ExternalLink className="ml-auto h-2.5 w-2.5 opacity-50" />
          </Link>
        </nav>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfinitePromptList } from "@/components/prompts/infinite-prompt-list";
import { SkillImportButton } from "@/components/prompts/skill-import-button";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Skills",
  description: "Browse and discover AI agent skills",
};

// Query for skills list (cached)
function getCachedSkills(orderBy: any, perPage: number, searchQuery?: string) {
  const cacheKey = JSON.stringify({ orderBy, perPage, searchQuery });

  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {
        type: "SKILL",
        isPrivate: false,
        isUnlisted: false,
        deletedAt: null,
      };

      if (searchQuery) {
        where.OR = [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ];
      }

      const [skillsRaw, totalCount] = await Promise.all([
        db.prompt.findMany({
          where,
          orderBy,
          skip: 0,
          take: perPage,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                verified: true,
              },
            },
            category: {
              include: {
                parent: {
                  select: { id: true, name: true, slug: true },
                },
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            contributors: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                votes: true,
                contributors: true,
                outgoingConnections: { where: { label: { not: "related" } } },
                incomingConnections: { where: { label: { not: "related" } } },
              },
            },
          },
        }),
        db.prompt.count({ where }),
      ]);

      return {
        skills: skillsRaw.map((p: any) => ({
          ...p,
          voteCount: p._count.votes,
          contributorCount: p._count.contributors,
          contributors: p.contributors,
        })),
        total: totalCount,
      };
    },
    ["skills", cacheKey],
    { tags: ["prompts"] }
  )();
}

interface SkillsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const t = await getTranslations("prompts");
  const tNav = await getTranslations("nav");
  const tSearch = await getTranslations("search");
  const params = await searchParams;

  const perPage = 24;

  // Build order by clause

  let orderBy: any = { createdAt: "desc" };
  if (params.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (params.sort === "upvotes") {
    orderBy = { votes: { _count: "desc" } };
  }

  const result = await getCachedSkills(orderBy, perPage, params.q);
  const skills = result.skills;
  const total = result.total;

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">{tNav("skills")}</h1>
          <span className="text-muted-foreground text-xs">
            {tSearch("found", { count: total })}
          </span>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <SkillImportButton />
          <Button size="sm" className="h-8 w-full text-xs sm:w-auto" asChild>
            <Link href="/prompts/new?type=SKILL">
              <Plus className="mr-1 h-3.5 w-3.5" />
              {t("createSkill")}
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 text-sm">{t("skillsDescription")}</p>

      <InfinitePromptList
        initialPrompts={skills}
        initialTotal={total}
        filters={{
          q: params.q,
          type: "SKILL",
          sort: params.sort,
        }}
      />
    </div>
  );
}

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { InfinitePromptList } from "@/components/prompts/infinite-prompt-list";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Workflows",
  description: "Browse prompts with sequential flows and connections",
};

// Query for workflows list (cached)
function getCachedWorkflows(orderBy: any, perPage: number, searchQuery?: string) {
  const cacheKey = JSON.stringify({ orderBy, perPage, searchQuery });

  return unstable_cache(
    async () => {
      const where: Record<string, unknown> = {
        isPrivate: false,
        isUnlisted: false,
        deletedAt: null,
        type: { not: "SKILL" },
        // Only include prompts with actual flow connections (not "related" connections)
        outgoingConnections: {
          some: {
            label: { not: "related" },
          },
        },
        incomingConnections: {
          none: {
            label: { not: "related" },
          },
        },
      };

      if (searchQuery) {
        where.OR = [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { content: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ];
      }

      const [workflowsRaw, totalCount] = await Promise.all([
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
        workflows: workflowsRaw.map((p: any) => ({
          ...p,
          voteCount: p._count.votes,
          contributorCount: p._count.contributors,
          contributors: p.contributors,
        })),
        total: totalCount,
      };
    },
    ["workflows", cacheKey],
    { tags: ["prompts", "connections"] }
  )();
}

interface WorkflowsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
}

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  const t = await getTranslations("workflows");
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

  const result = await getCachedWorkflows(orderBy, perPage, params.q);
  const workflows = result.workflows;
  const total = result.total;

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">{tNav("workflows")}</h1>
          <span className="text-muted-foreground text-xs">
            {tSearch("found", { count: total })}
          </span>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 text-sm">{t("description")}</p>

      <InfinitePromptList
        initialPrompts={workflows}
        initialTotal={total}
        filters={{
          q: params.q,
          sort: params.sort,
        }}
      />
    </div>
  );
}

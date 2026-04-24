import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Bell, FolderOpen, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptList } from "@/components/prompts/prompt-list";

export default async function FeedPage() {
  const t = await getTranslations("feed");
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Get user's subscribed categories
  const subscriptions = await db.categorySubscription.findMany({
    where: { userId: session.user.id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  const subscribedCategoryIds = subscriptions.map((s) => s.categoryId);

  // Fetch prompts from subscribed categories
  const promptsRaw =
    subscribedCategoryIds.length > 0
      ? await db.prompt.findMany({
          where: {
            isPrivate: false,
            isUnlisted: false,
            deletedAt: null,
            categoryId: { in: subscribedCategoryIds },
          },
          orderBy: { createdAt: "desc" },
          take: 30,
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
            _count: {
              select: {
                votes: true,
                contributors: true,
                outgoingConnections: { where: { label: { not: "related" } } },
                incomingConnections: { where: { label: { not: "related" } } },
              },
            },
          },
        })
      : [];

  const prompts = promptsRaw.map((p) => ({
    ...p,
    voteCount: p._count?.votes ?? 0,
    contributorCount: p._count?.contributors ?? 0,
  }));

  // Get all categories for subscription
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { prompts: true },
      },
    },
  });

  return (
    <div className="container py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">{t("yourFeed")}</h1>
          <p className="text-muted-foreground text-sm">{t("feedDescription")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/prompts">
              {t("browseAll")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/discover">
              <Sparkles className="mr-1.5 h-4 w-4" />
              {t("discover")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Subscribed Categories */}
      {subscriptions.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {subscriptions.map(({ category }) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Badge variant="secondary" className="gap-1">
                <Bell className="h-3 w-3" />
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Feed */}
      {prompts.length > 0 ? (
        <PromptList prompts={prompts} currentPage={1} totalPages={1} />
      ) : (
        <div className="bg-muted/30 rounded-lg border py-12 text-center">
          <FolderOpen className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <h2 className="mb-1 font-medium">{t("noPromptsInFeed")}</h2>
          <p className="text-muted-foreground mb-4 text-sm">{t("subscribeToCategories")}</p>

          {/* Category suggestions */}
          <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                  {category.name}
                  <span className="text-muted-foreground ml-1">({category._count.prompts})</span>
                </Badge>
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/categories">{t("viewAllCategories")}</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

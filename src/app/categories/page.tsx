import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { unstable_cache } from "next/cache";
import { FolderOpen, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubscribeButton } from "@/components/categories/subscribe-button";

// Visible prompt filter
const visiblePromptFilter = {
  isPrivate: false,
  isUnlisted: false,
  deletedAt: null,
};

// Cached categories query with filtered prompt counts
const getCategories = unstable_cache(
  async () => {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
    });

    // Get all category IDs (parents + children)
    const allCategoryIds = categories.flatMap((c) => [
      c.id,
      ...c.children.map((child) => child.id),
    ]);

    // Count visible prompts per category in one query
    const counts = await db.prompt.groupBy({
      by: ["categoryId"],
      where: {
        categoryId: { in: allCategoryIds },
        ...visiblePromptFilter,
      },
      _count: true,
    });

    const countMap = new Map(counts.map((c) => [c.categoryId, c._count]));

    // Attach counts to categories
    return categories.map((category) => ({
      ...category,
      promptCount: countMap.get(category.id) || 0,
      children: category.children.map((child) => ({
        ...child,
        promptCount: countMap.get(child.id) || 0,
      })),
    }));
  },
  ["categories-page"],
  { tags: ["categories"] }
);

export default async function CategoriesPage() {
  const t = await getTranslations("categories");
  const session = await auth();

  // Fetch root categories (no parent) with their children (cached)
  const rootCategories = await getCategories();

  // Get user's subscriptions if logged in
  const subscriptions = session?.user
    ? await db.categorySubscription.findMany({
        where: { userId: session.user.id },
        select: { categoryId: true },
      })
    : [];

  const subscribedIds = new Set(subscriptions.map((s) => s.categoryId));

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      {rootCategories.length === 0 ? (
        <div className="bg-muted/30 rounded-lg border py-12 text-center">
          <FolderOpen className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">{t("noCategories")}</p>
        </div>
      ) : (
        <div className="divide-y">
          {rootCategories.map((category) => (
            <section key={category.id} className="py-6 first:pt-0">
              {/* Main Category Header */}
              <div className="mb-3 flex items-start gap-3">
                {category.icon && <span className="mt-0.5 text-xl">{category.icon}</span>}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-1 font-semibold hover:underline"
                    >
                      {category.name}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    {session?.user && (
                      <SubscribeButton
                        categoryId={category.id}
                        categoryName={category.name}
                        initialSubscribed={subscribedIds.has(category.id)}
                        iconOnly
                      />
                    )}
                    <span className="text-muted-foreground text-xs">
                      {category.promptCount} {t("prompts")}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-muted-foreground mt-0.5 text-sm">{category.description}</p>
                  )}
                </div>
              </div>

              {/* Subcategories List */}
              {category.children.length > 0 && (
                <div className="ml-8 space-y-1">
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="group hover:bg-muted/50 -mx-3 rounded-md px-3 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {child.icon && <span className="text-sm">{child.icon}</span>}
                        <Link
                          href={`/categories/${child.slug}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {child.name}
                        </Link>
                        {session?.user && (
                          <SubscribeButton
                            categoryId={child.id}
                            categoryName={child.name}
                            initialSubscribed={subscribedIds.has(child.id)}
                            iconOnly
                          />
                        )}
                        <span className="text-muted-foreground text-xs">{child.promptCount}</span>
                      </div>
                      {child.description && (
                        <p className="text-muted-foreground mt-1 ml-6 line-clamp-1 text-xs">
                          {child.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

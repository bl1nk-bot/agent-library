"use client";

// 🛡️ Guardian: Consolidated error and not-found pages into a reusable UI component
// This layout was heavily duplicated between the two pages - moved to canonical location
// JULES Check: Verified no Autonomous task conflicts
// Impact: Reduced duplication in error pages
// Date: 2026-05-14
// Session: .Jules/guardian/2026-05-14

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, ArrowLeft, RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  icon: LucideIcon;
  code: string | number;
  titleKey: string;
  descriptionKey: string;
  namespace: string;
  showTryAgain?: boolean;
  onTryAgain?: () => void;
}

export function ErrorState({
  icon: Icon,
  code,
  titleKey,
  descriptionKey,
  namespace,
  showTryAgain,
  onTryAgain,
}: ErrorStateProps) {
  const router = useRouter();
  const t = useTranslations(namespace);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground h-10 w-10" />
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-bold">{code}</h1>
          <h2 className="text-xl font-semibold">{t(titleKey)}</h2>
          <p className="text-muted-foreground text-sm">{t(descriptionKey)}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          {showTryAgain && onTryAgain && (
            <Button onClick={onTryAgain}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("tryAgain")}
            </Button>
          )}
          <Button variant={showTryAgain ? "outline" : "default"} asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t("goHome")}
            </Link>
          </Button>
          <Button variant={showTryAgain ? "ghost" : "outline"} onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("goBack")}
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="border-t pt-8">
          <p className="text-muted-foreground mb-3 text-xs">{t("helpfulLinks")}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/prompts" className="text-primary hover:underline">
              {t("browsePrompts")}
            </Link>
            <Link href="/categories" className="text-primary hover:underline">
              {t("categories")}
            </Link>
            <Link href="/prompts/new" className="text-primary hover:underline">
              {t("createPrompt")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

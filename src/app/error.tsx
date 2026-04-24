"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ServerCrash, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  const router = useRouter();
  const t = useTranslations("serverError");

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <ServerCrash className="text-muted-foreground h-10 w-10" />
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-bold">500</h1>
          <h2 className="text-xl font-semibold">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Button onClick={() => reset()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("tryAgain")}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t("goHome")}
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
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

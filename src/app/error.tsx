"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ServerCrash, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  const router = useRouter();
  const t = useTranslations("serverError");

  return (
    <ErrorState
      icon={<ServerCrash className="text-muted-foreground h-10 w-10" />}
      code="500"
      title={t("title")}
      description={t("description")}
      actions={
        <>
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
        </>
      }
      helpfulLinksTitle={t("helpfulLinks")}
      helpfulLinks={[
        { label: t("browsePrompts"), href: "/prompts" },
        { label: t("categories"), href: "/categories" },
        { label: t("createPrompt"), href: "/prompts/new" },
      ]}
    />
  );
}

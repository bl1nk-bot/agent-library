"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state/error-state";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");

  return (
    <ErrorState
      icon={<FileQuestion className="text-muted-foreground h-10 w-10" />}
      code="404"
      title={t("title")}
      description={t("description")}
      actions={
        <>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {t("goHome")}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
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

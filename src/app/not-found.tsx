"use client";

import { useTranslations } from "next-intl";
import { FileQuestion } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <ErrorState
      icon={FileQuestion}
      code={404}
      title={t("title")}
      description={t("description")}
      goHomeText={t("goHome")}
      goBackText={t("goBack")}
      helpfulLinksTitle={t("helpfulLinks")}
      helpfulLinks={[
        { href: "/prompts", label: t("browsePrompts") },
        { href: "/categories", label: t("categories") },
        { href: "/prompts/new", label: t("createPrompt") },
      ]}
    />
  );
}

"use client";

import { useTranslations } from "next-intl";
import { ServerCrash } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  const t = useTranslations("serverError");

  return (
    <ErrorState
      icon={ServerCrash}
      code={500}
      title={t("title")}
      description={t("description")}
      tryAgain={reset}
      tryAgainText={t("tryAgain")}
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

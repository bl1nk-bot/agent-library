"use client";

import { useTranslations } from "next-intl";
import { FileQuestion } from "lucide-react";
import { ErrorState, HelpfulLinks } from "@/components/ui/error-state";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <ErrorState
      icon={<FileQuestion className="text-muted-foreground h-10 w-10" />}
      code="404"
      title={t("title")}
      description={t("description")}
      showBackButton={true}
    >
      <HelpfulLinks />
    </ErrorState>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, HelpfulLinks } from "@/components/ui/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  const t = useTranslations("serverError");

  return (
    <ErrorState
      icon={<ServerCrash className="text-muted-foreground h-10 w-10" />}
      code="500"
      title={t("title")}
      description={t("description")}
      primaryAction={
        <Button onClick={() => reset()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("tryAgain")}
        </Button>
      }
    >
      <HelpfulLinks />
    </ErrorState>
  );
}

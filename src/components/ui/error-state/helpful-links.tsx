import Link from "next/link";
import { useTranslations } from "next-intl";

// 🛡️ Guardian: Consolidated from src/app/error.tsx and src/app/not-found.tsx
// This component extracts the shared helpful links section for error states
// JULES Check: Verified no Autonomous task conflicts
// Impact: Extracting duplicated JSX into common component
// Date: 2026-04-30
// Session: .Jules/guardian/2026-04-30/

export function HelpfulLinks() {
  const t = useTranslations("serverError");

  return (
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
  );
}

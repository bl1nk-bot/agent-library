"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// 🛡️ Guardian: Consolidated from src/app/error.tsx and src/app/not-found.tsx
// This component extracts the shared layout structure for error states
// JULES Check: Verified no Autonomous task conflicts
// Impact: Extracting 118 lines of duplicated generic UI into common component
// Date: 2026-04-30
// Session: .Jules/guardian/2026-04-30/

export interface ErrorStateProps {
  icon: React.ReactNode;
  code: string;
  title: string;
  description: string;
  primaryAction?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export function ErrorState({
  icon,
  code,
  title,
  description,
  primaryAction,
  showHomeButton = true,
  showBackButton = true,
  children,
}: ErrorStateProps) {
  const router = useRouter();
  const t = useTranslations("serverError"); // Shared translations for buttons

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          {icon}
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-bold">{code}</h1>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          {primaryAction}

          {showHomeButton && (
            <Button variant={primaryAction ? "outline" : "default"} asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                {t("goHome")}
              </Link>
            </Button>
          )}

          {showBackButton && (
            <Button variant={primaryAction || showHomeButton ? "ghost" : "default"} onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("goBack")}
            </Button>
          )}
        </div>

        {/* Custom Content / Helpful Links */}
        {children}
      </div>
    </div>
  );
}

export { HelpfulLinks } from "./helpful-links";

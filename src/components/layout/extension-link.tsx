"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Chromium } from "lucide-react";
import { useTranslations } from "next-intl";
import { isChromeBrowser } from "@/lib/utils";

interface ExtensionLinkProps {
  url: string;
}

export function ExtensionLink({ url }: ExtensionLinkProps) {
  const t = useTranslations("homepage");
  const [isChromeBased, setIsChromeBased] = useState(false);

  useEffect(() => {
    setIsChromeBased(isChromeBrowser());
  }, []);

  if (!isChromeBased) return null;

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 transition-colors hover:bg-zinc-800 2xl:px-4 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <Chromium className="h-4 w-4 text-zinc-100" />
      <span className="hidden text-sm font-medium whitespace-nowrap text-zinc-100 2xl:inline">
        {t("extension")}
      </span>
    </Link>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { PromptIde } from "@/components/ide/prompt-ide";
import { PromptEnhancer } from "@/components/developers/prompt-enhancer";
import { EmbedDesigner } from "@/components/developers/embed-designer";
import { PromptTokenizer } from "@/components/developers/prompt-tokenizer";
import { Monitor, Code2, Sparkles, Frame, Hash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VALID_TABS = ["enhancer", "tokenizer", "builder", "embed"] as const;
type TabValue = (typeof VALID_TABS)[number];

export default function DevelopersPage() {
  const t = useTranslations("developers");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("enhancer");

  // Read hash from URL on mount and hash changes
  const updateTabFromHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (VALID_TABS.includes(hash as TabValue)) {
      setActiveTab(hash as TabValue);
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Check mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Read initial hash
    updateTabFromHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateTabFromHash);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("hashchange", updateTabFromHash);
    };
  }, [updateTabFromHash]);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    window.history.replaceState(null, "", `#${value}`);
  };

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Monitor className="text-muted-foreground mb-6 h-16 w-16" />
        <h1 className="mb-2 text-2xl font-bold">{t("desktopOnly")}</h1>
        <p className="text-muted-foreground mb-6 max-w-md">{t("desktopOnlyDescription")}</p>
        <Button asChild>
          <Link href="/prompts">{t("browsePrompts")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem-1.65rem)] flex-col overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex h-full flex-col gap-0 overflow-hidden"
      >
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-10 shrink-0 items-center border-b px-4 backdrop-blur">
          <TabsList className="h-9 gap-2 border-0 bg-transparent p-0">
            <TabsTrigger
              value="enhancer"
              className="data-[state=active]:border-b-primary h-9 gap-1.5 rounded-none border-0 border-b-2 border-b-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("promptEnhancer")}
            </TabsTrigger>
            <TabsTrigger
              value="tokenizer"
              className="data-[state=active]:border-b-primary h-9 gap-1.5 rounded-none border-0 border-b-2 border-b-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Hash className="h-3.5 w-3.5" />
              {t("promptTokenizer")}
            </TabsTrigger>
            <TabsTrigger
              value="builder"
              className="data-[state=active]:border-b-primary h-9 gap-1.5 rounded-none border-0 border-b-2 border-b-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Code2 className="h-3.5 w-3.5" />
              {t("promptBuilder")}
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className="data-[state=active]:border-b-primary h-9 gap-1.5 rounded-none border-0 border-b-2 border-b-transparent px-3 py-2 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Frame className="h-3.5 w-3.5" />
              {t("embedDesigner")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="enhancer"
          className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <PromptEnhancer />
        </TabsContent>

        <TabsContent
          value="tokenizer"
          className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <PromptTokenizer />
        </TabsContent>

        <TabsContent
          value="builder"
          className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <PromptIde />
        </TabsContent>

        <TabsContent
          value="embed"
          className="mt-0 min-h-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
        >
          <EmbedDesigner />
        </TabsContent>
      </Tabs>
    </div>
  );
}

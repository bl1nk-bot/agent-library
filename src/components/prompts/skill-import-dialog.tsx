"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { FileUp, Shield, Github, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SkillImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (content: string, filename: string) => void;
}

type ImportMethod = "upload" | "official" | "github" | null;

export function SkillImportDialog({
  open,
  onOpenChange,
  onImport,
}: SkillImportDialogProps) {
  const t = useTranslations("prompts");
  const tCommon = useTranslations("common");
  const [selectedMethod, setSelectedMethod] = useState<ImportMethod>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      onImport(text, file.name);
      onOpenChange(false);
      setSelectedMethod(null);
    } catch (error) {
      console.error("Failed to read file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubImport = async () => {
    if (!githubUrl.trim()) return;

    setIsLoading(true);
    try {
      // Parse GitHub URL to get raw content
      // Example: https://github.com/user/repo/blob/main/skill.md
      // to: https://raw.githubusercontent.com/user/repo/main/skill.md
      const url = githubUrl.trim();
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
      
      if (!match) {
        throw new Error("Invalid GitHub URL format");
      }

      const [, owner, repo, branch, path] = match;
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Failed to fetch from GitHub");

      const content = await response.text();
      const filename = path.split("/").pop() || "skill.md";
      
      onImport(content, filename);
      onOpenChange(false);
      setSelectedMethod(null);
      setGithubUrl("");
    } catch (error) {
      console.error("Failed to import from GitHub:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const importMethods = [
    {
      id: "upload" as const,
      icon: FileUp,
      title: t("uploadSkill"),
      description: t("uploadSkillDescription"),
      action: () => fileInputRef.current?.click(),
    },
    {
      id: "official" as const,
      icon: Shield,
      title: t("addFromOfficial"),
      description: t("addFromOfficialDescription"),
      action: () => setSelectedMethod("official"),
    },
    {
      id: "github" as const,
      icon: Github,
      title: t("importFromGitHub"),
      description: t("importFromGitHubDescription"),
      action: () => setSelectedMethod("github"),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("importSkill")}</DialogTitle>
            <DialogDescription>
              {t("importSkillDescription")}
            </DialogDescription>
          </DialogHeader>

          {!selectedMethod ? (
            <div className="grid gap-3 py-4">
              {importMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={method.action}
                  disabled={isLoading}
                  className={cn(
                    "group relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-180",
                    "bg-muted/30 border-border hover:border-primary/50 hover:bg-muted/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    "touch-manipulation"
                  )}
                >
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-background border transition-colors duration-180 group-hover:border-primary/50">
                    <method.icon className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground group-hover:text-primary transition-colors duration-180" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm sm:text-base mb-0.5">
                      {method.title}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {method.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : selectedMethod === "github" ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub Repository URL</Label>
                <Input
                  id="github-url"
                  placeholder="https://github.com/user/repo/blob/main/skill.md"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMethod(null);
                    setGithubUrl("");
                  }}
                  className="flex-1"
                >
                  {tCommon("back")}
                </Button>
                <Button
                  onClick={handleGithubImport}
                  disabled={!githubUrl.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? tCommon("loading") : "Import"}
                </Button>
              </div>
            </div>
          ) : selectedMethod === "official" ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Official skills coming soon...
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedMethod(null)}
                className="w-full"
              >
                {tCommon("back")}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".skill,.zip,.md,.json,.yaml,.yml"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
}

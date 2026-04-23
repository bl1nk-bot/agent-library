"use client";

import { useState, useEffect } from "react";
import { Lock, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "private-prompts-note-dismissed";

interface PrivatePromptsNoteProps {
  count: number;
}

export function PrivatePromptsNote({ count }: PrivatePromptsNoteProps) {
  const t = useTranslations("user");
  const [isDismissed, setIsDismissed] = useState(true); // Start hidden to prevent flash

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === "true";
    // Read from localStorage on mount - use queueMicrotask to avoid sync setState
    queueMicrotask(() => setIsDismissed(dismissed));
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed || count === 0) {
    return null;
  }

  return (
    <div className="border-primary/20 bg-primary/5 mb-4 flex items-start gap-3 rounded-lg border p-3">
      <Lock className="text-primary mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-foreground flex-1 text-sm">{t("privatePromptsNote", { count })}</p>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground -mt-0.5 -mr-1 h-6 w-6 shrink-0"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  );
}

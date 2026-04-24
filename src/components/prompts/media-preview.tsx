"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, AlertTriangle } from "lucide-react";
import { AudioPlayer } from "./audio-player";

interface MediaPreviewProps {
  mediaUrl: string;
  title: string;
  type: string;
}

export function MediaPreview({ mediaUrl, title, type }: MediaPreviewProps) {
  const t = useTranslations("prompts");
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="space-y-3">
        <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t("mediaLoadError")}</span>
        </div>
        <div className="bg-muted/30 flex h-48 items-center justify-center overflow-hidden rounded-lg border">
          <div className="text-muted-foreground text-center">
            <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-30" />
            <p className="text-sm">{t("mediaUnavailable")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 relative overflow-hidden rounded-lg border">
      {type === "VIDEO" ? (
        <video
          src={mediaUrl}
          controls
          className="block max-h-[500px] w-full object-contain"
          onError={() => setHasError(true)}
        />
      ) : type === "AUDIO" ? (
        <AudioPlayer src={mediaUrl} onError={() => setHasError(true)} />
      ) : (
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="relative block">
          {/* Blurred background for vertical images */}
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-2xl"
            style={{ backgroundImage: `url(${mediaUrl})` }}
          />
          {}
          <img
            src={mediaUrl}
            alt={title}
            className="relative block max-h-[500px] w-full object-contain"
            onError={() => setHasError(true)}
          />
        </a>
      )}
    </div>
  );
}

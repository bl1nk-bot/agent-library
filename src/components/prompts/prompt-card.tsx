"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { formatDistanceToNow } from "@/lib/date";
import { getPromptUrl } from "@/lib/urls";
import {
  ArrowBigUp,
  Lock,
  Copy,
  ImageIcon,
  Download,
  Play,
  BadgeCheck,
  Volume2,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeView } from "@/components/ui/code-view";
import { toast } from "sonner";
import { prettifyJson } from "@/lib/format";
import { PinButton } from "@/components/prompts/pin-button";
import { RunPromptButton } from "@/components/prompts/run-prompt-button";
import {
  VariableFillModal,
  hasVariables,
  renderContentWithVariables,
} from "@/components/prompts/variable-fill-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AudioPlayer } from "@/components/prompts/audio-player";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface PromptCardProps {
  prompt: {
    id: string;
    slug?: string | null;
    title: string;
    description: string | null;
    content: string;
    type: string;
    structuredFormat?: string | null;
    mediaUrl: string | null;
    isPrivate: boolean;
    voteCount: number;
    createdAt: Date;
    author: {
      id: string;
      name: string | null;
      username: string;
      avatar: string | null;
      verified?: boolean;
    };
    contributorCount?: number;
    contributors?: Array<{
      id: string;
      username: string;
      name: string | null;
      avatar: string | null;
    }>;
    category: {
      id: string;
      name: string;
      slug: string;
      parent?: {
        id: string;
        name: string;
        slug: string;
      } | null;
    } | null;
    tags: Array<{
      tag: {
        id: string;
        name: string;
        slug: string;
        color: string;
      };
    }>;
    _count?: {
      votes?: number;
      contributors?: number;
      outgoingConnections?: number;
      incomingConnections?: number;
    };
  };
  showPinButton?: boolean;
  isPinned?: boolean;
}

export function PromptCard({ prompt, showPinButton = false, isPinned = false }: PromptCardProps) {
  const t = useTranslations("prompts");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const outgoingCount = prompt._count?.outgoingConnections || 0;
  const incomingCount = prompt._count?.incomingConnections || 0;
  const isFlowStart = outgoingCount > 0 && incomingCount === 0;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"copy" | "run">("copy");
  const [imageError, setImageError] = useState(false);

  const isStructuredInput = !!prompt.structuredFormat;
  const isAudio = prompt.type === "AUDIO";
  const isVideo = prompt.type === "VIDEO";
  const hasMediaBackground =
    prompt.type === "IMAGE" || isVideo || (isStructuredInput && !!prompt.mediaUrl && !isAudio);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Autoplay video when visible in viewport
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isVideo]);

  const handleMouseEnter = () => {
    // Video autoplay is now handled by IntersectionObserver
  };

  const handleMouseLeave = () => {
    // Video pause is now handled by IntersectionObserver
  };
  const contentHasVariables = hasVariables(prompt.content);

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success(tCommon("copiedToClipboard"));
  };

  const handleCopyClick = () => {
    if (contentHasVariables) {
      setModalMode("copy");
      setModalOpen(true);
    } else {
      copyToClipboard(prompt.content);
    }
  };

  const handleRunClick = () => {
    setModalMode("run");
    setModalOpen(true);
  };

  const handleDownloadSkill = async () => {
    // Download .skill zip for skills
    const base = prompt.slug ? `${prompt.id}_${prompt.slug}` : prompt.id;
    const url = `/api/prompts/${base}/skill`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      // Use slug for filename
      const slug =
        prompt.slug ||
        prompt.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      a.download = `${slug}.skill`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      toast.success(t("downloadStarted"));
    } catch {
      toast.error(t("downloadFailed"));
    }
  };

  return (
    <div
      className={`group hover:border-foreground/20 flex flex-col overflow-hidden rounded-[var(--radius)] border transition-colors ${hasMediaBackground || isAudio ? "" : "p-4"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image/Video Background for IMAGE/VIDEO type or STRUCTURED with media */}
      {hasMediaBackground && (
        <div className="bg-muted relative">
          {prompt.mediaUrl && !imageError ? (
            isVideo ? (
              <video
                ref={videoRef}
                src={prompt.mediaUrl}
                className="w-full object-cover"
                style={{ maxHeight: "400px" }}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={prompt.mediaUrl}
                alt={prompt.title}
                className="w-full object-cover object-top"
                style={{ maxHeight: "400px" }}
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <div className="flex h-32 items-center justify-center">
              <ImageIcon className="text-muted-foreground/30 h-8 w-8" />
            </div>
          )}
          <div className="from-background via-background/30 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent" />
          {/* Badges overlay */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            {isFlowStart && (
              <div className="bg-background/80 flex items-center gap-0.5 rounded px-1.5 py-0.5 backdrop-blur-sm">
                <Link2 className="text-muted-foreground h-3 w-3" />
                <span className="bg-muted text-muted-foreground flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium">
                  {outgoingCount}
                </span>
              </div>
            )}
            <Badge variant="secondary" className="bg-background/80 text-[10px] backdrop-blur-sm">
              {t(`types.${prompt.type.toLowerCase()}`)}
            </Badge>
          </div>
        </div>
      )}

      {/* Audio Player for AUDIO type */}
      {isAudio && (
        <div className="p-3 pb-0">
          {prompt.mediaUrl ? (
            <AudioPlayer src={prompt.mediaUrl} compact />
          ) : (
            <div className="bg-muted flex h-12 items-center justify-center rounded-lg">
              <Volume2 className="text-muted-foreground/30 h-5 w-5" />
            </div>
          )}
        </div>
      )}

      <div
        className={
          hasMediaBackground || isAudio ? "flex flex-1 flex-col p-3" : "flex flex-1 flex-col"
        }
      >
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {prompt.isPrivate && <Lock className="text-muted-foreground h-3 w-3 shrink-0" />}
            <Link
              href={getPromptUrl(prompt.id, prompt.slug)}
              prefetch={false}
              className="line-clamp-1 text-sm font-medium hover:underline"
            >
              {prompt.title}
            </Link>
          </div>
          {(!hasMediaBackground || isAudio) && (
            <div className="flex shrink-0 items-center gap-1">
              {isFlowStart && (
                <div className="flex items-center gap-0.5 rounded border px-1.5 py-0.5">
                  <Link2 className="text-muted-foreground h-3 w-3" />
                  <span className="bg-muted text-muted-foreground flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-medium">
                    {outgoingCount}
                  </span>
                </div>
              )}
              <Badge variant="outline" className="text-[10px]">
                {t(`types.${prompt.type.toLowerCase()}`)}
              </Badge>
            </div>
          )}
        </div>

        {/* Description */}
        {prompt.description && (
          <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{prompt.description}</p>
        )}

        {/* Content Preview - smaller for image prompts */}
        <div className="relative mb-3 min-h-0 flex-1">
          {isStructuredInput ? (
            <CodeView
              content={
                prompt.structuredFormat?.toLowerCase() === "json"
                  ? prettifyJson(prompt.content)
                  : prompt.content
              }
              language={(prompt.structuredFormat?.toLowerCase() as "json" | "yaml") || "json"}
              maxLines={hasMediaBackground ? 3 : 10}
              fontSize="xs"
              preview
            />
          ) : (
            <pre
              className={`text-muted-foreground bg-muted h-full overflow-hidden rounded p-2 font-mono text-xs break-words whitespace-pre-wrap ${hasMediaBackground ? "line-clamp-2" : "line-clamp-4"}`}
            >
              {contentHasVariables ? renderContentWithVariables(prompt.content) : prompt.content}
            </pre>
          )}
          {showPinButton && (
            <div className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <PinButton promptId={prompt.id} initialPinned={isPinned} iconOnly />
            </div>
          )}
        </div>

        {/* Variable fill modal */}
        {contentHasVariables && (
          <VariableFillModal
            content={prompt.content}
            open={modalOpen}
            onOpenChange={setModalOpen}
            mode={modalMode}
          />
        )}

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                prefetch={false}
                className="rounded px-1.5 py-0.5 text-[10px] transition-opacity hover:opacity-80"
                style={{ backgroundColor: tag.color + "15", color: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-muted-foreground text-[10px]">+{prompt.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-muted-foreground mt-auto flex items-center justify-between border-t pt-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/@${prompt.author.username}`}
              prefetch={false}
              className="hover:text-foreground flex items-center gap-1.5"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={prompt.author.avatar || undefined} alt={prompt.author.username} />
                <AvatarFallback className="text-[8px]">
                  {prompt.author.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              @{prompt.author.username}
              {prompt.author.verified && (
                <BadgeCheck className="text-primary mt-0.5 h-3 w-3 shrink-0" />
              )}
            </Link>
            {prompt.contributors && prompt.contributors.length > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="hover:text-foreground cursor-default">
                    +{prompt.contributors.length}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="p-2">
                  <div className="space-y-1">
                    <div className="mb-1.5 text-xs font-medium">{t("promptContributors")}</div>
                    {prompt.contributors.map((contributor) => (
                      <Link
                        key={contributor.id}
                        href={`/@${contributor.username}`}
                        prefetch={false}
                        className="-mx-1 flex items-center gap-2 rounded px-1 py-0.5 hover:underline"
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={contributor.avatar || undefined} />
                          <AvatarFallback className="text-[8px]">
                            {contributor.name?.charAt(0) || contributor.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">@{contributor.username}</span>
                      </Link>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : prompt.contributorCount ? (
              <span>+{prompt.contributorCount}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              <ArrowBigUp className="h-3.5 w-3.5" />
              {prompt.voteCount}
            </span>
            <button onClick={handleCopyClick} className="hover:bg-accent rounded p-1">
              <Copy className="h-3 w-3" />
            </button>
            {prompt.type === "SKILL" ? (
              <button
                onClick={handleDownloadSkill}
                className="hover:bg-accent flex h-6 w-6 items-center justify-center rounded"
                title={t("download")}
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            ) : contentHasVariables ? (
              <button
                onClick={handleRunClick}
                className="hover:bg-accent flex h-6 w-6 items-center justify-center rounded"
              >
                <Play className="h-4 w-4" />
              </button>
            ) : (
              <RunPromptButton
                content={prompt.content}
                title={prompt.title}
                description={prompt.description || undefined}
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                categoryName={prompt.category?.name}
                parentCategoryName={prompt.category?.parent?.name}
                promptType={
                  prompt.type as "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "STRUCTURED" | "SKILL"
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

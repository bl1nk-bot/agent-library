import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { formatDistanceToNow } from "@/lib/date";
import { ArrowLeft, Clock, Check, X, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DiffView } from "@/components/ui/diff-view";
import { SkillDiffViewer } from "@/components/prompts/skill-diff-viewer";
import { ChangeRequestActions } from "@/components/prompts/change-request-actions";
import { ReopenChangeRequestButton } from "@/components/prompts/reopen-change-request-button";
import { DismissChangeRequestButton } from "@/components/prompts/dismiss-change-request-button";

interface ChangeRequestPageProps {
  params: Promise<{ id: string; changeId: string }>;
}

/**
 * Extracts the prompt ID from a URL parameter that may contain a slug
 */
function extractPromptId(idParam: string): string {
  const underscoreIndex = idParam.indexOf("_");
  if (underscoreIndex !== -1) {
    return idParam.substring(0, underscoreIndex);
  }
  return idParam;
}

export default async function ChangeRequestPage({ params }: ChangeRequestPageProps) {
  const session = await auth();
  const t = await getTranslations("changeRequests");
  const locale = await getLocale();
  const { id: idParam, changeId } = await params;
  const promptId = extractPromptId(idParam);

  const changeRequest = await db.changeRequest.findUnique({
    where: { id: changeId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      prompt: {
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          type: true,
        },
      },
    },
  });

  if (!changeRequest || changeRequest.prompt.id !== promptId) {
    notFound();
  }

  const isPromptOwner = session?.user?.id === changeRequest.prompt.authorId;
  const isChangeRequestAuthor = session?.user?.id === changeRequest.author.id;

  const statusConfig = {
    PENDING: {
      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      icon: Clock,
    },
    APPROVED: {
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      icon: Check,
    },
    REJECTED: {
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      icon: X,
    },
  };

  const StatusIcon = statusConfig[changeRequest.status].icon;
  const hasTitleChange =
    changeRequest.proposedTitle && changeRequest.proposedTitle !== changeRequest.originalTitle;

  return (
    <div className="container max-w-3xl py-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
          <Link href={`/prompts/${promptId}`}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t("backToPrompt")}
          </Link>
        </Button>

        {/* Title and status */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold">{t("title")}</h1>
              <Badge className={statusConfig[changeRequest.status].color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {t(changeRequest.status.toLowerCase())}
              </Badge>
            </div>
            <Link
              href={`/prompts/${promptId}`}
              className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1.5 text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              {changeRequest.prompt.title}
            </Link>
          </div>
        </div>

        {/* Author and time */}
        <div className="mt-4 flex items-center gap-2 border-t pt-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={changeRequest.author.avatar || ""} />
            <AvatarFallback className="text-xs">
              {changeRequest.author.name?.[0] || changeRequest.author.username[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">
            <Link
              href={`/@${changeRequest.author.username}`}
              className="font-medium hover:underline"
            >
              @{changeRequest.author.username}
            </Link>
            <span className="text-muted-foreground">
              {" "}
              · {formatDistanceToNow(changeRequest.createdAt, locale)}
            </span>
          </span>
        </div>
      </div>

      {/* Reason */}
      {changeRequest.reason && (
        <div className="bg-muted/30 mb-6 rounded-lg border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
            {t("reason")}
          </p>
          <p className="text-sm whitespace-pre-wrap">{changeRequest.reason}</p>
        </div>
      )}

      {/* Title change */}
      {hasTitleChange && (
        <div className="bg-muted/30 mb-6 rounded-lg border p-4">
          <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
            {t("titleChange")}
          </p>
          <div className="text-sm">
            <span className="text-red-600 line-through dark:text-red-400">
              {changeRequest.originalTitle}
            </span>
            <span className="text-muted-foreground mx-2">→</span>
            <span className="text-green-600 dark:text-green-400">
              {changeRequest.proposedTitle}
            </span>
          </div>
        </div>
      )}

      {/* Content diff */}
      <div className="mb-6">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          {t("contentChanges")}
        </p>
        {changeRequest.prompt.type === "SKILL" ? (
          <SkillDiffViewer
            original={changeRequest.originalContent}
            modified={changeRequest.proposedContent}
          />
        ) : (
          <DiffView
            original={changeRequest.originalContent}
            modified={changeRequest.proposedContent}
          />
        )}
      </div>

      {/* Review note (if exists) */}
      {changeRequest.reviewNote && (
        <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="mb-2 text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
            {t("reviewNote")}
          </p>
          <p className="text-sm whitespace-pre-wrap">{changeRequest.reviewNote}</p>
        </div>
      )}

      {/* Actions for prompt owner */}
      {isPromptOwner && changeRequest.status === "PENDING" && (
        <div className="border-t pt-4">
          <ChangeRequestActions changeRequestId={changeRequest.id} promptId={promptId} />
        </div>
      )}

      {/* Reopen button for rejected requests */}
      {isPromptOwner && changeRequest.status === "REJECTED" && (
        <div className="border-t pt-4">
          <ReopenChangeRequestButton changeRequestId={changeRequest.id} promptId={promptId} />
        </div>
      )}

      {/* Dismiss button for change request author (pending only) */}
      {isChangeRequestAuthor && changeRequest.status === "PENDING" && (
        <div className="border-t pt-4">
          <DismissChangeRequestButton changeRequestId={changeRequest.id} promptId={promptId} />
        </div>
      )}
    </div>
  );
}

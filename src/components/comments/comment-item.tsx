"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { formatDistanceToNow } from "@/lib/date";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Trash2,
  Flag,
  Loader2,
  MoreHorizontal,
  Plus,
  Minus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CommentForm } from "./comment-form";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  flagged: boolean;
  author: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
    role: string;
  };
  score: number;
  userVote: number;
  replyCount: number;
}

interface CommentItemProps {
  comment: Comment;
  promptId: string;
  currentUserId?: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
  locale: string;
  replies: Comment[];
  allComments: Comment[];
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  onCommentUpdated: (comment: Comment) => void;
  depth?: number;
}

// Autolink URLs with noopener noreferrer
function autoLinkText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Reset regex lastIndex
      urlRegex.lastIndex = 0;
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-primary break-all hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export function CommentItem({
  comment,
  promptId,
  currentUserId,
  isAdmin,
  isLoggedIn,
  locale,
  replies: _replies,
  allComments,
  onCommentAdded,
  onCommentDeleted,
  onCommentUpdated,
  depth = 0,
}: CommentItemProps) {
  const t = useTranslations("comments");
  const tCommon = useTranslations("common");
  const [isReplying, setIsReplying] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [localScore, setLocalScore] = useState(comment.score);
  const [localUserVote, setLocalUserVote] = useState(comment.userVote);
  const [localFlagged, setLocalFlagged] = useState(comment.flagged);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAuthor = currentUserId === comment.author.id;
  const canDelete = isAuthor || isAdmin;
  const isDownvoted = localScore < 0;

  const handleVote = async (value: 1 | -1) => {
    if (!isLoggedIn) {
      toast.error(t("loginToVote"));
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch(`/api/prompts/${promptId}/comments/${comment.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const data = await response.json();
      setLocalScore(data.score);
      setLocalUserVote(data.userVote);
      onCommentUpdated({ ...comment, score: data.score, userVote: data.userVote });
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/prompts/${promptId}/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      onCommentDeleted(comment.id);
      toast.success(t("commentDeleted"));
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleFlag = async () => {
    setIsFlagging(true);

    try {
      const response = await fetch(`/api/prompts/${promptId}/comments/${comment.id}/flag`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to flag comment");
      }

      const data = await response.json();
      setLocalFlagged(data.flagged);
      onCommentUpdated({ ...comment, flagged: data.flagged });
      toast.success(data.flagged ? t("commentFlagged") : t("commentUnflagged"));
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setIsFlagging(false);
    }
  };

  const handleReplyAdded = (newComment: Comment) => {
    onCommentAdded(newComment);
    setIsReplying(false);
  };

  // Get nested replies for this comment
  const nestedReplies = allComments.filter((c) => c.parentId === comment.id);

  return (
    <div className={cn("group", depth > 0 && "border-muted ml-6 border-l-2 pl-4")}>
      <div
        className={cn(
          "py-3",
          isDownvoted && "opacity-50",
          localFlagged && "-mx-3 rounded-md bg-red-500/5 px-3"
        )}
      >
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <Link href={`/@${comment.author.username}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={comment.author.avatar || undefined} />
              <AvatarFallback className="text-xs">
                {comment.author.name?.charAt(0) || comment.author.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hover:underline">{comment.author.username}</span>
          </Link>
          {comment.author.role === "ADMIN" && (
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
              {t("admin")}
            </span>
          )}
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(new Date(comment.createdAt), locale)}
          </span>
          {localFlagged && (
            <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
              {t("flagged")}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "text-sm break-words whitespace-pre-wrap",
            isDownvoted && "text-muted-foreground"
          )}
        >
          {autoLinkText(comment.content)}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-1">
          {/* Vote buttons */}
          <div className="flex items-center">
            <button
              onClick={() => handleVote(1)}
              disabled={isVoting}
              className={cn(
                "hover:bg-accent rounded p-1 transition-colors",
                localUserVote === 1 && "text-primary"
              )}
              title={t("upvote")}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <span
              className={cn(
                "min-w-[20px] text-center text-xs font-medium",
                localScore > 0 && "text-primary",
                localScore < 0 && "text-destructive"
              )}
            >
              {localScore}
            </span>
            <button
              onClick={() => handleVote(-1)}
              disabled={isVoting}
              className={cn(
                "hover:bg-accent rounded p-1 transition-colors",
                localUserVote === -1 && "text-destructive"
              )}
              title={t("downvote")}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Reply button */}
          {isLoggedIn && depth < 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 px-2 text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
              {t("reply")}
            </Button>
          )}

          {/* More actions */}
          {(canDelete || isAdmin) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem onClick={handleFlag} disabled={isFlagging}>
                    <Flag className="mr-2 h-4 w-4" />
                    {localFlagged ? t("unflag") : t("flag")}
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Reply form */}
        {isReplying && (
          <div className="mt-3">
            <CommentForm
              promptId={promptId}
              parentId={comment.id}
              isLoggedIn={isLoggedIn}
              onCommentAdded={handleReplyAdded}
              onCancel={() => setIsReplying(false)}
              placeholder={t("replyTo", { username: comment.author.username })}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {nestedReplies.length > 0 && (
        <div>
          {/* Collapse/Expand toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1 py-1 text-xs transition-colors"
          >
            {isCollapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            <span>
              {isCollapsed ? t("showReplies", { count: nestedReplies.length }) : t("hideReplies")}
            </span>
          </button>

          {!isCollapsed && (
            <div>
              {nestedReplies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  promptId={promptId}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  isLoggedIn={isLoggedIn}
                  locale={locale}
                  replies={[]}
                  allComments={allComments}
                  onCommentAdded={onCommentAdded}
                  onCommentDeleted={onCommentDeleted}
                  onCommentUpdated={onCommentUpdated}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteCommentTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteCommentDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                tCommon("delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

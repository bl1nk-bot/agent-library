import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowBigUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPromptUrl } from "@/lib/urls";

interface RelatedPrompt {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  type: string;
  author: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    votes: number;
  };
}

interface RelatedPromptsProps {
  prompts: RelatedPrompt[];
}

export function RelatedPrompts({ prompts }: RelatedPromptsProps) {
  const t = useTranslations("prompts");

  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">{t("relatedPrompts")}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prompts.map((prompt) => (
          <Link
            key={prompt.id}
            href={getPromptUrl(prompt.id, prompt.slug)}
            className="group hover:border-foreground/20 flex flex-col rounded-[var(--radius)] border p-4 transition-colors"
          >
            {/* Header */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <h4 className="line-clamp-1 text-sm font-medium group-hover:underline">
                {prompt.title}
              </h4>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {t(`types.${prompt.type.toLowerCase()}`)}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-xs">
              {prompt.description || "—"}
            </p>

            {/* Footer */}
            <div className="text-muted-foreground mt-auto flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={prompt.author.avatar || undefined} />
                  <AvatarFallback className="text-[8px]">
                    {prompt.author.name?.[0] || prompt.author.username[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="shrink-0">@{prompt.author.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowBigUp className="h-3.5 w-3.5" />
                <span>{prompt._count.votes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Trophy, GraduationCap, Github, Heart, Star, Users, Code, Rocket } from "lucide-react";

interface AchievementsSectionProps {
  t: (key: string, values?: any) => string;
  githubStars: number;
}

export function AchievementsSection({ t, githubStars }: AchievementsSectionProps) {
  const achievements = [
    {
      href: "https://www.forbes.com/sites/tjmccue/2023/01/19/chatgpt-success-completely-depends-on-your-prompt/",
      icon: <Trophy className="h-4 w-4 text-amber-500" />,
      text: <span>{t("achievements.featuredIn")} <strong>{t("achievements.forbes")}</strong></span>
    },
    {
      href: "https://www.huit.harvard.edu/news/ai-prompts",
      icon: <GraduationCap className="h-4 w-4 text-[#A51C30]" />,
      text: <span>{t("achievements.referencedBy")} <strong>{t("achievements.harvardUniversity")}</strong></span>
    },
    {
      href: "https://etc.cuit.columbia.edu/news/columbia-prompt-library-effective-academic-ai-use",
      icon: <GraduationCap className="h-4 w-4 text-[#B9D9EB]" />,
      text: <span>{t("achievements.referencedBy")} <strong>{t("achievements.columbiaUniversity")}</strong></span>
    },
    {
      href: "https://libguides.olympic.edu/UsingAI/Prompts",
      icon: <GraduationCap className="h-4 w-4 text-[#003366]" />,
      text: <span>{t("achievements.referencedBy")} <strong>{t("achievements.olympicCollege")}</strong></span>
    },
    {
      href: "https://scholar.google.com/citations?user=AZ0Dg8YAAAAJ&hl=en",
      icon: <GraduationCap className="h-4 w-4 text-[#4285F4]" />,
      text: <span><strong>40+</strong> {t("achievements.academicCitations")}</span>
    },
    {
      href: "https://github.blog/changelog/2025-02-14-personal-custom-instructions-bing-web-search-and-more-in-copilot-on-github-com/",
      icon: <Github className="h-4 w-4" />,
      text: <span>{t("achievements.referencedIn")} <strong>{t("achievements.githubBlog")}</strong></span>
    },
    {
      href: "https://huggingface.co/datasets/fka/agent-library",
      icon: <Heart className="h-4 w-4 text-red-500" />,
      text: <span>{t("achievements.mostLikedDataset")}</span>
    },
    {
      href: "https://github.com/bl1nk-bot/agent-library",
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      text: <span><strong>{(githubStars / 1000).toFixed(0)}k</strong> {t("achievements.githubStars")}</span>
    },
    {
      href: "https://github.com/bl1nk-bot/agent-library",
      icon: <Trophy className="h-4 w-4 text-purple-500" />,
      text: <span>{t("achievements.mostStarredRepo")}</span>
    },
    {
      icon: <Users className="h-4 w-4 text-green-500" />,
      text: <span>{t("achievements.usedByThousands")}</span>
    },
    {
      href: "https://spotlights-feed.github.com/spotlights/prompts-chat/index/",
      icon: <Github className="h-4 w-4 text-purple-600" />,
      text: <span>{t("achievements.githubStaffPick")}</span>
    },
    {
      icon: <Code className="h-4 w-4 text-blue-500" />,
      text: <span>{t("achievements.fullyOpenSource")}</span>
    },
    {
      icon: <Rocket className="h-4 w-4 text-orange-500" />,
      text: <span><strong>{t("achievements.firstEver")}</strong> · {t("achievements.releasedOn")}</span>
    }
  ];

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10 md:gap-y-2 text-sm">
        {achievements.map((item, index) => (
          item.href ? (
            <Link 
              key={index}
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon}
              {item.text}
            </Link>
          ) : (
            <span key={index} className="flex items-center gap-2 text-muted-foreground">
              {item.icon}
              {item.text}
            </span>
          )
        ))}
      </div>
    </div>
  );
}

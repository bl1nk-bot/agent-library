import Image from "next/image";
import { HeartHandshake } from "lucide-react";
import { SponsorLink, BecomeSponsorLink, BuiltWithLink } from "@/components/layout/sponsor-link";

interface SponsorsSectionProps {
  items: any[];
  t: (key: string) => string;
  useCloneBranding: boolean;
}

export function SponsorsSection({ items, t, useCloneBranding }: SponsorsSectionProps) {
  return (
    <section className="py-8 border-b">
      <div className="container">
        {!useCloneBranding && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-center text-xs text-muted-foreground">{t("achievements.sponsoredBy")}</p>
            <BecomeSponsorLink
              href="https://github.com/sponsors/f/sponsorships?sponsor=f&tier_id=558224&preview=false"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 rounded-full transition-colors border border-pink-200 dark:border-pink-800"
            >
              <HeartHandshake className="h-3 w-3" />
              {t("achievements.becomeSponsor")}
            </BecomeSponsorLink>
          </div>
        )}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-8">
          {items.map((sponsor) => (
            <SponsorLink
              key={sponsor.name}
              name={sponsor.name}
              url={sponsor.url}
              logo={sponsor.logo}
              darkLogo={sponsor.darkLogo}
              className={sponsor.className}
            />
          ))}
        </div>
        {!useCloneBranding && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 mt-4 pt-4 border-t text-xs text-muted-foreground">
            <span><b>prompts.chat</b> is built with</span>
            <span className="inline-flex items-center gap-1.5">
              <BuiltWithLink href="https://wind.surf/prompts-chat" toolName="Windsurf">
                <Image
                  src="/sponsors/windsurf.svg"
                  alt="Windsurf"
                  width={80}
                  height={20}
                  className="h-3 w-auto dark:invert"
                />
              </BuiltWithLink>
              <span>and</span>
              <BuiltWithLink href="https://devin.ai/?utm_source=prompts.chat" toolName="Devin">
                <Image
                  src="/sponsors/devin.svg"
                  alt="Devin"
                  width={80}
                  height={20}
                  className="h-6 w-auto dark:hidden"
                />
                <Image
                  src="/sponsors/devin-dark.svg"
                  alt="Devin"
                  width={80}
                  height={20}
                  className="h-6 w-auto hidden dark:block"
                />
              </BuiltWithLink>
              <span>by Cognition</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

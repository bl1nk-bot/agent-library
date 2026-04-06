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
      </div>
    </section>
  );
}

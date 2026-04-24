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
    <section className="border-b py-8">
      <div className="container">
        {!useCloneBranding && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <p className="text-muted-foreground text-center text-xs">
              {t("achievements.sponsoredBy")}
            </p>
          </div>
        )}
        <div className="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:gap-8">
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

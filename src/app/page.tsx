import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { getGithubStars } from "@/lib/github";
import { HeroSection } from "@/components/home/hero-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { AchievementsSection } from "@/components/home/achievements-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { DiscoveryPrompts } from "@/components/prompts/discovery-prompts";
import { CtaSection } from "@/components/home/cta-section";

export default async function HomePage() {
  const tHomepage = await getTranslations("homepage");
  const tNav = await getTranslations("nav");
  const session = await auth();
  const config = await getConfig();
  
  const isOAuth = config.auth.provider !== "credentials";
  // Show register button only for non-logged-in users
  const showRegisterButton = !session && (isOAuth || (config.auth.provider === "credentials" && config.auth.allowRegistration));

  const useCloneBranding = config.homepage?.useCloneBranding ?? false;
  
  // Fetch GitHub stars dynamically (with caching)
  const githubStars = await getGithubStars(useCloneBranding, config.homepage?.achievements?.enabled);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection 
        config={config}
        session={session}
        t={tHomepage}
        tNav={tNav}
        githubStars={githubStars}
        showRegisterButton={showRegisterButton}
        isOAuth={isOAuth}
      />

      {/* Sponsors Section */}
      {config.homepage?.sponsors?.enabled && config.homepage.sponsors.items.length > 0 && (
        <SponsorsSection 
          items={config.homepage.sponsors.items}
          t={tHomepage}
          useCloneBranding={useCloneBranding}
        />
      )}

      {/* Achievements & Testimonials - only show if not using clone branding */}
      {!useCloneBranding && (
        <section className="container">
          {config.homepage?.achievements?.enabled !== false && (
            <AchievementsSection t={tHomepage} githubStars={githubStars} />
          )}
          <TestimonialsSection t={tHomepage} />
        </section>
      )}

      {/* Featured & Latest Prompts Section */}
      <DiscoveryPrompts isHomepage />

      {/* CTA Section - only show if not using clone branding */}
      {!useCloneBranding && (
        <CtaSection 
          config={config}
          showRegisterButton={showRegisterButton}
          isOAuth={isOAuth}
          t={tHomepage}
          tNav={tNav}
        />
      )}
    </div>
  );
}
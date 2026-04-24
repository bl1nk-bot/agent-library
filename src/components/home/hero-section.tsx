import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Code, Lock, Building2, Github, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCategories } from "@/components/prompts/hero-categories";
import { CliCommand } from "@/components/layout/cli-command";
import { ExtensionLink } from "@/components/layout/extension-link";
import { AnimatedText } from "@/components/layout/animated-text";
import { AppStoreIcon, RaycastIcon } from "@/components/icons/app-icons";
import { getOrdinalSuffix } from "@/lib/utils";

interface HeroSectionProps {
  config: any;
  session: any;
  t: (key: string, values?: any) => string;
  tNav: (key: string) => string;
  githubStars: number;
  showRegisterButton: boolean;
  isOAuth: boolean;
}

export function HeroSection({
  config,
  session,
  t,
  tNav,
  githubStars,
  showRegisterButton,
  isOAuth,
}: HeroSectionProps) {
  const useCloneBranding = config.homepage?.useCloneBranding ?? false;

  return (
    <section className="relative overflow-hidden border-b py-12 md:py-16">
      {/* Background - Right Side */}
      {useCloneBranding ? (
        <div className="pointer-events-none absolute end-0 top-0 bottom-0 hidden w-1/2 overflow-hidden md:block">
          <div className="from-background via-background/80 absolute inset-0 z-10 bg-gradient-to-r to-transparent rtl:bg-gradient-to-l" />
          <Image
            src={config.branding.logo}
            alt={config.branding.name}
            width={800}
            height={800}
            className="absolute -end-20 top-1/2 h-auto w-[150%] -translate-y-1/2 opacity-15 dark:hidden"
          />
          <Image
            src={config.branding.logoDark || config.branding.logo}
            alt={config.branding.name}
            width={800}
            height={800}
            className="absolute -end-20 top-1/2 hidden h-auto w-[150%] -translate-y-1/2 opacity-10 dark:block"
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute end-0 top-0 bottom-0 hidden w-1/3 md:block 2xl:w-1/2">
          <div className="absolute inset-0">
            <div className="from-background via-background/80 absolute inset-0 z-10 bg-gradient-to-r to-transparent rtl:bg-gradient-to-l" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute end-0 top-1/2 h-auto w-full -translate-y-1/2 opacity-30 dark:opacity-15 dark:invert"
            >
              <source src="/animation_compressed.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="pointer-events-auto absolute inset-0 z-30 hidden flex-col items-center justify-center gap-6 pe-8 lg:flex">
            <HeroCategories />
            <div className="flex flex-col items-center gap-3">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                {t("clients")}
              </span>
              <div className="flex items-center gap-3">
                <CliCommand />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-20 container">
        <div className="max-w-2xl">
          {useCloneBranding ? (
            <>
              <h1 className="text-primary !text-2xl text-2xl font-bold tracking-tight sm:!text-3xl sm:text-3xl md:!text-4xl md:text-4xl lg:!text-5xl lg:text-5xl">
                {config.branding.name}
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg">
                {config.branding.description}
              </p>
            </>
          ) : (
            <>
              <h1 className="space-y-0 overflow-visible">
                <AnimatedText className="text-3xl leading-none font-bold tracking-tighter text-balance sm:text-4xl md:text-5xl lg:text-6xl">
                  {t("heroTitle")}
                </AnimatedText>
                <AnimatedText className="font-display text-4xl leading-none tracking-tight whitespace-nowrap italic sm:text-5xl md:text-6xl lg:text-7xl">
                  {t("heroSubtitle")}
                </AnimatedText>
              </h1>
              <p className="text-muted-foreground mt-6 max-w-xl text-lg">{t("heroDescription")}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="text-muted-foreground flex items-center gap-2">
                  <Code className="text-primary h-5 w-5" />
                  <span>{t("heroFeature1")}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <Lock className="text-primary h-5 w-5" />
                  <span>{t("heroFeature2")}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="text-primary h-5 w-5" />
                  <span>{t("heroFeature3")}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={session ? "/feed" : "/prompts"}>
                  {session ? t("viewFeed") : t("browsePrompts")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              {!useCloneBranding && (
                <Button variant="outline" size="lg" asChild>
                  <Link
                    href="https://github.com/bl1nk-bot/agent-library/blob/main/SELF-HOSTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-1.5 h-4 w-4" />
                    {t("setupPrivateServer")}
                  </Link>
                </Button>
              )}
              {showRegisterButton && (
                <Button asChild viewMode="text">
                  <Link href={isOAuth ? "/login" : "/register"} className="no-underline">
                    {isOAuth ? tNav("login") : tNav("register")}
                  </Link>
                </Button>
              )}
            </div>
            {!useCloneBranding && (
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="https://github.com/bl1nk-bot/agent-library/stargazers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>
                    {t("beStargazer", {
                      count: (githubStars + 1).toLocaleString(),
                      ordinal: getOrdinalSuffix(githubStars + 1),
                    })}
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                  <History className="h-4 w-4" />
                  {t("ourHistory")}
                </Link>
              </div>
            )}
          </div>

          <div className="mt-8 lg:hidden">
            <HeroCategories />
          </div>

          {!useCloneBranding && (
            <div className="mt-8 hidden flex-col items-center gap-3 sm:flex lg:hidden">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                {t("clients")}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <CliCommand />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

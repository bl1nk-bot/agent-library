import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Code, Lock, Building2, Github, LogIn, History } from "lucide-react";
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
    <section className="relative py-12 md:py-16 border-b overflow-hidden">
      {/* Background - Right Side */}
      {useCloneBranding ? (
        <div className="absolute top-0 end-0 bottom-0 w-1/2 hidden md:block pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
          <Image
            src={config.branding.logo}
            alt={config.branding.name}
            width={800}
            height={800}
            className="absolute top-1/2 -translate-y-1/2 -end-20 w-[150%] h-auto opacity-15 dark:hidden"
          />
          <Image
            src={config.branding.logoDark || config.branding.logo}
            alt={config.branding.name}
            width={800}
            height={800}
            className="absolute top-1/2 -translate-y-1/2 -end-20 w-[150%] h-auto opacity-10 hidden dark:block"
          />
        </div>
      ) : (
        <div className="absolute top-0 end-0 bottom-0 w-1/3 2xl:w-1/2 hidden md:block pointer-events-none">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-1/2 -translate-y-1/2 end-0 w-full h-auto opacity-30 dark:opacity-15 dark:invert"
            >
              <source src="/animation_compressed.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 hidden lg:flex flex-col items-center justify-center z-30 pe-8 pointer-events-auto gap-6">
            <HeroCategories />
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("clients")}</span>
              <div className="flex items-center gap-3">
                <CliCommand />
                {config.branding.appStoreUrl && (
                  <Link
                    href={config.branding.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-10 px-2.5 2xl:px-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 dark:border-zinc-600"
                  >
                    <AppStoreIcon className="text-zinc-100" />
                    <span className="hidden 2xl:inline text-sm font-medium text-zinc-100 whitespace-nowrap">App Store</span>
                  </Link>
                )}
                {config.branding.chromeExtensionUrl && (
                  <ExtensionLink url={config.branding.chromeExtensionUrl} />
                )}
                <Link
                  href="raycast://extensions/fka/prompts-chat?source=prompts.chat"
                  className="inline-flex items-center justify-center gap-2 h-10 px-2.5 2xl:px-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 dark:border-zinc-600"
                >
                  <RaycastIcon className="text-zinc-100" />
                  <span className="hidden 2xl:inline text-sm font-medium text-zinc-100 whitespace-nowrap">Raycast</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container relative z-20">
        <div className="max-w-2xl">
          {useCloneBranding ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl text-primary">
                {config.branding.name}
              </h1>
              <p className="mt-6 text-muted-foreground text-lg max-w-xl">
                {config.branding.description}
              </p>
            </>
          ) : (
            <>
              <h1 className="space-y-0 overflow-visible">
                <AnimatedText className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-balance">{t("heroTitle")}</AnimatedText>
                <AnimatedText className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-display tracking-tight leading-none whitespace-nowrap">{t("heroSubtitle")}</AnimatedText>
              </h1>
              <p className="mt-6 text-muted-foreground text-lg max-w-xl">
                {t("heroDescription")}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code className="h-5 w-5 text-primary" />
                  <span>{t("heroFeature1")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  <span>{t("heroFeature2")}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-5 w-5 text-primary" />
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
                  <Link href="https://github.com/bl1nk-bot/agent-library/blob/main/SELF-HOSTING.md" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-4 w-4" />
                    {t("setupPrivateServer")}
                  </Link>
                </Button>
              )}
              {showRegisterButton && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={isOAuth ? "/login" : "/register"}>
                    <LogIn className="mr-1.5 h-4 w-4" />
                    {isOAuth ? tNav("login") : tNav("register")}
                  </Link>
                </Button>
              )}
            </div>
            {!useCloneBranding && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Link 
                  href="https://github.com/bl1nk-bot/agent-library/stargazers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>{t("beStargazer", { count: (githubStars + 1).toLocaleString(), ordinal: getOrdinalSuffix(githubStars + 1) })}</span>
                </Link>
                <Link 
                  href="/about" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            <div className="mt-8 hidden sm:flex lg:hidden flex-col items-center gap-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("clients")}</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <CliCommand />
                {config.branding.appStoreUrl && (
                  <Link
                    href={config.branding.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-10 px-2.5 md:px-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 dark:border-zinc-600"
                  >
                    <AppStoreIcon className="text-zinc-100" />
                    <span className="hidden md:inline text-sm font-medium text-zinc-100 whitespace-nowrap">App Store</span>
                  </Link>
                )}
                {config.branding.chromeExtensionUrl && (
                  <ExtensionLink url={config.branding.chromeExtensionUrl} />
                )}
                <Link
                  href="raycast://extensions/fka/prompts-chat?source=prompts.chat"
                  className="inline-flex items-center justify-center gap-2 h-10 px-2.5 md:px-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 dark:border-zinc-600"
                >
                  <RaycastIcon className="text-zinc-100" />
                  <span className="hidden md:inline text-sm font-medium text-zinc-100 whitespace-nowrap">Raycast</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

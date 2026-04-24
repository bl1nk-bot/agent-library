import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  config: any;
  showRegisterButton: boolean;
  isOAuth: boolean;
  t: (key: string) => string;
  tNav: (key: string) => string;
}

export function CtaSection({ config, showRegisterButton, isOAuth, t, tNav }: CtaSectionProps) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="bg-muted/30 flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={config.branding.logo}
              alt={config.branding.name}
              width={48}
              height={48}
              className="h-12 w-12 dark:hidden"
            />
            <Image
              src={config.branding.logoDark || config.branding.logo}
              alt={config.branding.name}
              width={48}
              height={48}
              className="hidden h-12 w-12 dark:block"
            />
            <div>
              <h2 className="font-semibold">{t("readyToStart")}</h2>
              <p className="text-muted-foreground text-sm">{t("freeAndOpen")}</p>
            </div>
          </div>
          {showRegisterButton && (
            <Button asChild>
              <Link href={isOAuth ? "/login" : "/register"}>
                {isOAuth ? tNav("login") : t("createAccount")}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

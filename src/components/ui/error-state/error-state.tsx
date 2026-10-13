"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  icon: LucideIcon;
  code: string | number;
  title: string;
  description: string;
  tryAgain?: () => void;
  tryAgainText?: string;
  goHomeText?: string;
  goBackText?: string;
  helpfulLinksTitle?: string;
  helpfulLinks?: Array<{ href: string; label: string }>;
}

export function ErrorState({
  icon: Icon,
  code,
  title,
  description,
  tryAgain,
  tryAgainText = "Try Again",
  goHomeText = "Go Home",
  goBackText = "Go Back",
  helpfulLinksTitle = "Helpful Links",
  helpfulLinks,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground h-10 w-10" />
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-bold">{code}</h1>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          {tryAgain && (
            <Button onClick={tryAgain}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {tryAgainText}
            </Button>
          )}
          <Button variant={tryAgain ? "outline" : "default"} asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {goHomeText}
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {goBackText}
          </Button>
        </div>

        {/* Helpful Links */}
        {helpfulLinks && helpfulLinks.length > 0 && (
          <div className="border-t pt-8">
            <p className="text-muted-foreground mb-3 text-xs">{helpfulLinksTitle}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {helpfulLinks.map((link, i) => (
                <Link key={i} href={link.href} className="text-primary hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

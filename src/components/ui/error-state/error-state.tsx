import Link from "next/link";

interface ErrorStateProps {
  icon: React.ReactNode;
  code: string | number;
  title: string;
  description: string;
  actions?: React.ReactNode;
  helpfulLinksTitle?: string;
  helpfulLinks?: { label: string; href: string }[];
}

// 🛡️ Guardian: Consolidated from src/app/error.tsx and src/app/not-found.tsx
// This component unifies the error page layouts to prevent code duplication
// JULES Check: Verified no Autonomous task conflicts
// Impact: 2 files modified, consolidated ~60 LOC
// Date: 2024-05-21
// Session: .Jules/guardian/2024-05-21/
export function ErrorState({
  icon,
  code,
  title,
  description,
  actions,
  helpfulLinksTitle,
  helpfulLinks,
}: ErrorStateProps) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          {icon}
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-primary text-7xl font-bold">{code}</h1>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            {actions}
          </div>
        )}

        {/* Helpful Links */}
        {helpfulLinks && helpfulLinks.length > 0 && (
          <div className="border-t pt-8">
            {helpfulLinksTitle && (
              <p className="text-muted-foreground mb-3 text-xs">{helpfulLinksTitle}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {helpfulLinks.map((link, index) => (
                <Link key={index} href={link.href} className="text-primary hover:underline">
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

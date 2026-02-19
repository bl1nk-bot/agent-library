import type { Metadata } from "next";
import { Noto_Sans_Arabic, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsentBanner } from "@/components/layout/cookie-consent";
import { Analytics } from "@/components/layout/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { WebsiteStructuredData } from "@/components/seo/structured-data";
import { AppBanner } from "@/components/layout/app-banner";
import { LocaleDetector } from "@/components/providers/locale-detector";
import { getConfig } from "@/lib/config";
import { isRtlLocale } from "@/lib/i18n/config";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { converter, parse } from "culori";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "AI Command Hub",
    template: "%s | AI Command Hub",
  },
  description:
    "Digital Luxury Interface for AI Agents.",
  keywords: [
    "AI",
    "Agents",
    "Command Hub",
    "Digital Noir",
  ],
  authors: [{ name: "bl1nk Team" }],
  creator: "AI Command Hub",
  publisher: "AI Command Hub",
  icons: {
    icon: [
      { url: "/favicon/icon16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/icon32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/icon.ico",
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "apple-mobile-web-app-title": "AI Command Hub",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Command Hub",
    title: "AI Command Hub",
    description:
      "Digital Luxury Interface for AI Agents.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AI Command Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Command Hub",
    description:
      "Digital Luxury Interface for AI Agents.",
    images: ["/og.png"],
    creator: "@aicommandhub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXTAUTH_URL || "https://agent.bl1nk.site",
  },
};

const radiusValues = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
};

const toOklch = converter("oklch");

function hexToOklch(hex: string): string {
  const color = parse(hex);
  if (!color) return "oklch(0.5 0.2 260)";
  
  const oklch = toOklch(color);
  if (!oklch) return "oklch(0.5 0.2 260)";
  
  const h = oklch.h ?? 0;
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${h.toFixed(1)})`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  const isEmbedRoute = pathname.startsWith("/embed");
  const isKidsRoute = pathname.startsWith("/kids");
  
  const locale = await getLocale();
  const messages = await getMessages();
  const config = await getConfig();
  const isRtl = isRtlLocale(locale);

  // Calculate theme values server-side
  const themeClasses = `theme-${config.theme.variant} density-${config.theme.density}`;
  const primaryOklch = hexToOklch(config.theme.colors.primary);
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(config.theme.colors.primary);
  const lightness = rgb 
    ? 0.2126 * (parseInt(rgb[1], 16) / 255) + 0.7152 * (parseInt(rgb[2], 16) / 255) + 0.0722 * (parseInt(rgb[3], 16) / 255)
    : 0.5;
  const foreground = lightness > 0.5 ? "oklch(0.2 0 0)" : "oklch(0.98 0 0)";
  
  const themeStyles = {
    "--radius": radiusValues[config.theme.radius],
    "--primary": primaryOklch,
    "--primary-foreground": foreground,
  } as React.CSSProperties;

  const fontClasses = isRtl 
    ? `${inter.variable} ${notoSansArabic.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-arabic` 
    : `${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} font-sans`;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning className={themeClasses} style={themeStyles}>
      <head>
        <WebsiteStructuredData />
      </head>
      <body className={`${fontClasses} antialiased bg-[#050505] text-white selection:bg-cyan-500/30 selection:text-cyan-50`}>
        {process.env.GOOGLE_ANALYTICS_ID && (
          <Analytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
        )}
        <Providers locale={locale} messages={messages} theme={config.theme} branding={{ ...config.branding, useCloneBranding: config.homepage?.useCloneBranding }}>
          {isEmbedRoute || isKidsRoute ? (
            children
          ) : (
            <>
              <LocaleDetector />
              <div className="relative min-h-screen flex flex-col">
                {/* Temporary header/footer until we rebuild layout */}
                <Header authProvider={config.auth.provider} allowRegistration={config.auth.allowRegistration} />
                <main className="flex-1">{children}</main>
                <Footer />
                <CookieConsentBanner />
              </div>
            </>
          )}
        </Providers>
        <VercelAnalytics />
      </body>
    </html>
  );
}

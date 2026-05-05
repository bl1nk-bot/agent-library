"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { clearAllProgress, getTotalStars, getCompletedLevelsCount } from "@/lib/kids/progress";
import { setLocale } from "@/lib/i18n/client";
import { analyticsKids } from "@/lib/analytics";
import { Settings, X, Globe, Trash2, Check, Volume2 } from "lucide-react";
import { MusicVolumeSlider } from "./background-music";

const SUPPORTED_LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "az", label: "Azərbaycan", flag: "🇦🇿" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fa", label: "فارسی", flag: "🇮🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
];

export function SettingsButton() {
  const t = useTranslations("kids.settings");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          analyticsKids.openSettings();
        }}
        className="pixel-btn pixel-btn-purple flex h-8 items-center px-3 py-1.5 text-sm"
        aria-label={t("title") || "Settings"}
        title={t("title") || "Settings"}
      >
        <PixelSettingsIcon aria-hidden="true" />
      </button>

      {isOpen && <SettingsModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

// Pixel clip-paths for consistent styling
const pixelClipPath =
  "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))";
const smallPixelClipPath =
  "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))";

function SettingsModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("kids.settings");
  const currentLocale = useLocale();
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const stars = getTotalStars();
  const completed = getCompletedLevelsCount();

  const handleLanguageChange = (locale: string) => {
    if (locale === currentLocale) return;

    analyticsKids.changeLanguage(locale);
    clearAllProgress();
    setLocale(locale);
  };

  const handleResetProgress = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    clearAllProgress();
    analyticsKids.resetProgress();
    setResetComplete(true);
    setShowResetConfirm(false);

    // Navigate to world map
    setTimeout(() => {
      onClose();
      router.push("/kids/map");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="animate-in zoom-in-95 fade-in relative max-h-[90vh] w-full max-w-md overflow-y-auto border-4 border-[#8B4513] bg-[#FEF3C7] p-6 duration-200"
        style={{ clipPath: pixelClipPath }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-[#8B4513] hover:bg-[#8B4513]/10"
          style={{ clipPath: smallPixelClipPath }}
          aria-label={t("close") || "Close settings"}
          title={t("close") || "Close settings"}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Title */}
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-[#8B4513]">
          <Settings className="h-6 w-6" />
          {t("title")}
        </h2>

        {/* Music Section */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#5D4037]">
            <Volume2 className="h-5 w-5" />
            {t("music")}
          </h3>
          <MusicVolumeSlider />
          <p className="mt-3 text-xs text-[#8B7355]">
            Music by{" "}
            <a
              href="https://pixabay.com/users/djartmusic-46653586/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=301272"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#8B4513]"
            >
              Krzysztof Szymanski
            </a>{" "}
            from{" "}
            <a
              href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=301272"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#8B4513]"
            >
              Pixabay
            </a>
          </p>
        </div>

        {/* Language Section */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#5D4037]">
            <Globe className="h-5 w-5" />
            {t("language")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => handleLanguageChange(locale.code)}
                className={cn(
                  "flex items-center gap-2 border-2 p-2 text-sm font-medium transition-all",
                  currentLocale === locale.code
                    ? "border-[#5D4037] bg-[#8B4513] text-white"
                    : "border-[#D4A574] bg-white text-[#5D4037] hover:border-[#8B4513]"
                )}
                style={{ clipPath: smallPixelClipPath }}
              >
                <span className="text-lg">{locale.flag}</span>
                <span className="text-xs">{locale.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Info */}
        <div
          className="mb-6 border-2 border-[#D4A574] bg-white/50 p-4"
          style={{ clipPath: smallPixelClipPath }}
        >
          <h3 className="mb-2 text-lg font-bold text-[#5D4037]">{t("progress")}</h3>
          <div className="flex gap-4 text-[#5D4037]">
            <div>
              <span className="text-2xl font-bold text-[#FFD700]">⭐ {stars}</span>
              <div className="text-xs">{t("stars")}</div>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#22C55E]">✓ {completed}</span>
              <div className="text-xs">{t("completed")}</div>
            </div>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="border-t-2 border-[#D4A574] pt-4">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-[#5D4037]">
            <Trash2 className="h-5 w-5" />
            {t("resetTitle")}
          </h3>

          {resetComplete ? (
            <div
              className="flex items-center gap-2 border-2 border-green-500 bg-green-100 p-3 font-medium text-green-700"
              style={{ clipPath: smallPixelClipPath }}
            >
              <Check className="h-5 w-5" />
              {t("resetComplete")}
            </div>
          ) : showResetConfirm ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">{t("resetWarning")}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleResetProgress}
                  className="w-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                  style={{ clipPath: smallPixelClipPath }}
                >
                  {t("resetConfirm")}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300"
                  style={{ clipPath: smallPixelClipPath }}
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleResetProgress}
              className="w-full border-2 border-red-300 bg-red-100 px-4 py-2 font-bold text-red-700 hover:bg-red-200"
              style={{ clipPath: smallPixelClipPath }}
            >
              {t("resetButton")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Pixel art settings/gear icon
function PixelSettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5" style={{ imageRendering: "pixelated" }} {...props}>
      <rect x="6" y="0" width="4" height="2" fill="currentColor" />
      <rect x="6" y="14" width="4" height="2" fill="currentColor" />
      <rect x="0" y="6" width="2" height="4" fill="currentColor" />
      <rect x="14" y="6" width="2" height="4" fill="currentColor" />
      <rect x="2" y="2" width="2" height="2" fill="currentColor" />
      <rect x="12" y="2" width="2" height="2" fill="currentColor" />
      <rect x="2" y="12" width="2" height="2" fill="currentColor" />
      <rect x="12" y="12" width="2" height="2" fill="currentColor" />
      <rect x="4" y="4" width="8" height="8" fill="currentColor" />
      <rect x="6" y="6" width="4" height="4" fill="#2C1810" />
    </svg>
  );
}

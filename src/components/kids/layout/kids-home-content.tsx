"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { analyticsKids } from "@/lib/analytics";
import {
  PixelRobot,
  PixelStar,
  PixelTree,
  PixelCastle,
} from "@/components/kids/elements/pixel-art";

export function KidsHomeContent() {
  const t = useTranslations("kids");
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="flex h-full flex-col">
      {/* Main content area */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
        <div className="my-auto w-full max-w-2xl">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="animate-in fade-in slide-in-from-right-4 text-center duration-300">
              <div className="pixel-border-sm mb-4 inline-flex items-center gap-2 border-2 border-[#DAA520] bg-[#ffffff] px-4 py-2 text-lg text-[#8B4513]">
                <PixelStar filled className="h-4 w-4" />
                {t("home.badge")}
              </div>

              <h1 className="pixel-text-shadow mb-4 text-5xl font-bold tracking-tight text-[#2C1810] md:text-6xl">
                {t("home.title")}
              </h1>

              <p className="mb-8 text-3xl text-[#5D4037] md:text-4xl">{t("home.subtitle")}</p>

              <div className="pixel-panel p-4 md:p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row md:gap-6">
                  <div className="shrink-0">
                    <PixelRobot className="h-20 w-16" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="mb-2 text-2xl font-bold text-[#2C1810] md:text-3xl">
                      {t("home.promiIntro.greeting")}
                    </p>
                    <p className="text-xl text-[#5D4037] md:text-2xl">
                      {t("home.promiIntro.message")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Features */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 text-center duration-300">
              <h2 className="pixel-text-shadow mb-6 text-4xl font-bold text-[#2C1810] md:text-5xl">
                {t("home.whatYouLearn")}
              </h2>

              <div className="grid gap-4">
                <div className="pixel-panel pixel-panel-green flex items-center gap-4 p-4">
                  <PixelGamepad />
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-[#2C1810] md:text-3xl">
                      {t("home.features.games.title")}
                    </h3>
                    <p className="text-xl text-[#5D4037] md:text-2xl">
                      {t("home.features.games.description")}
                    </p>
                  </div>
                </div>
                <div className="pixel-panel pixel-panel-blue flex items-center gap-4 p-4">
                  <PixelBook />
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-[#2C1810] md:text-3xl">
                      {t("home.features.stories.title")}
                    </h3>
                    <p className="text-xl text-[#5D4037] md:text-2xl">
                      {t("home.features.stories.description")}
                    </p>
                  </div>
                </div>
                <div className="pixel-panel flex items-center gap-4 p-4">
                  <div className="flex">
                    <PixelStar filled className="h-8 w-8" />
                    <PixelStar filled className="h-8 w-8" />
                    <PixelStar filled className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-[#2C1810] md:text-3xl">
                      {t("home.features.stars.title")}
                    </h3>
                    <p className="text-xl text-[#5D4037] md:text-2xl">
                      {t("home.features.stars.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Ready to start */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 text-center duration-300">
              <div className="mb-6 flex items-end justify-center gap-4">
                <PixelTree className="h-14 w-10" />
                <PixelRobot className="animate-bounce-slow h-20 w-16" />
                <PixelCastle className="h-12 w-12" />
              </div>

              <h2 className="pixel-text-shadow mb-4 text-3xl font-bold text-[#2C1810] md:text-4xl">
                {t("home.readyTitle")}
              </h2>

              <p className="mb-8 text-xl text-[#5D4037] md:text-2xl">{t("home.readyMessage")}</p>

              <Link
                href="/kids/map"
                onClick={() => analyticsKids.startGame()}
                className="pixel-btn pixel-btn-green inline-block px-8 py-4 text-xl md:text-2xl"
              >
                <span className="flex items-center gap-2">
                  <PixelPlayIcon />
                  {t("home.startButton")}
                </span>
              </Link>

              <p className="mt-6 text-lg text-[#8B7355]">{t("home.ageNote")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation footer - pixel art style */}
      <div className="shrink-0 border-t-4 border-[#8B4513] bg-[#2C1810]">
        <div className="container flex flex-col gap-3 py-3 sm:gap-0">
          {/* Buttons row */}
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={cn(
                "pixel-btn px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg",
                step === 0 && "pointer-events-none opacity-0"
              )}
            >
              <span className="flex items-center gap-1">
                <PixelArrowLeft />
                {t("navigation.back")}
              </span>
            </button>

            {/* Step indicators - desktop only, centered */}
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={cn(
                    "h-4 w-4 border-2 transition-all",
                    i === step
                      ? "border-[#16A34A] bg-[#22C55E]"
                      : "border-[#8B4513] bg-[#4A3728] hover:bg-[#5D4037]"
                  )}
                  style={{
                    clipPath:
                      "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)",
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            {step < totalSteps - 1 ? (
              <button
                onClick={nextStep}
                className="pixel-btn pixel-btn-green px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg"
              >
                <span className="flex items-center gap-1">
                  {t("navigation.next")}
                  <PixelArrowRight />
                </span>
              </button>
            ) : (
              <Link
                href="/kids/map"
                className="pixel-btn pixel-btn-green px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg"
              >
                <span className="flex items-center gap-1">
                  <PixelPlayIcon />
                  {t("home.startButton")}
                </span>
              </Link>
            )}
          </div>

          {/* Step indicators - mobile only, below buttons */}
          <div className="flex items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  "h-4 w-4 border-2 transition-all",
                  i === step
                    ? "border-[#16A34A] bg-[#22C55E]"
                    : "border-[#8B4513] bg-[#4A3728] hover:bg-[#5D4037]"
                )}
                style={{
                  clipPath:
                    "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)",
                }}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pixel art icons
function PixelPlayIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-4 w-4" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="1" width="2" height="10" fill="currentColor" />
      <rect x="4" y="3" width="2" height="6" fill="currentColor" />
      <rect x="6" y="4" width="2" height="4" fill="currentColor" />
      <rect x="8" y="5" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelArrowLeft() {
  return (
    <svg viewBox="0 0 12 12" className="h-4 w-4" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="5" width="6" height="2" fill="currentColor" />
      <rect x="2" y="5" width="2" height="2" fill="currentColor" />
      <rect x="4" y="3" width="2" height="2" fill="currentColor" />
      <rect x="4" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelArrowRight() {
  return (
    <svg viewBox="0 0 12 12" className="h-4 w-4" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="5" width="6" height="2" fill="currentColor" />
      <rect x="8" y="5" width="2" height="2" fill="currentColor" />
      <rect x="6" y="3" width="2" height="2" fill="currentColor" />
      <rect x="6" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelGamepad() {
  return (
    <svg viewBox="0 0 24 16" className="h-7 w-10" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="2" width="16" height="12" fill="#333" />
      <rect x="2" y="4" width="4" height="8" fill="#333" />
      <rect x="18" y="4" width="4" height="8" fill="#333" />
      <rect x="6" y="6" width="2" height="4" fill="#22C55E" />
      <rect x="4" y="7" width="6" height="2" fill="#22C55E" />
      <rect x="16" y="6" width="2" height="2" fill="#EF4444" />
      <rect x="18" y="8" width="2" height="2" fill="#3B82F6" />
    </svg>
  );
}

function PixelBook() {
  return (
    <svg viewBox="0 0 20 16" className="h-6 w-8" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="1" width="16" height="14" fill="#8B4513" />
      <rect x="4" y="2" width="12" height="12" fill="#FEF3C7" />
      <rect x="9" y="2" width="2" height="12" fill="#D97706" />
      <rect x="5" y="4" width="3" height="1" fill="#333" />
      <rect x="5" y="6" width="3" height="1" fill="#333" />
      <rect x="12" y="4" width="3" height="1" fill="#333" />
      <rect x="12" y="6" width="3" height="1" fill="#333" />
    </svg>
  );
}

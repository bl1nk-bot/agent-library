"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { completeLevel, getLevelProgress } from "@/lib/kids/progress";
import { getAdjacentLevels, getLevelBySlug } from "@/lib/kids/levels";
import { analyticsKids } from "@/lib/analytics";
import { PixelRobot, PixelStar } from "./pixel-art";

interface LevelCompleteProps {
  levelSlug: string;
  stars?: number;
  message?: string;
}

export function LevelComplete({
  levelSlug,
  stars = 3,
  message = "You did it!",
}: LevelCompleteProps) {
  const t = useTranslations("kids");
  const [showConfetti, setShowConfetti] = useState(false);
  const [savedStars, setSavedStars] = useState(0);
  const { next } = getAdjacentLevels(levelSlug);

  useEffect(() => {
    const existingProgress = getLevelProgress(levelSlug);
    const existingStars = existingProgress?.stars || 0;

    if (stars > existingStars) {
      completeLevel(levelSlug, stars);
      setShowConfetti(true);

      // Track level completion
      const level = getLevelBySlug(levelSlug);
      if (level) {
        analyticsKids.completeLevel(levelSlug, level.world, stars);
      }
    }

    setSavedStars(Math.max(stars, existingStars));

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [levelSlug, stars]);

  return (
    <div className="relative my-8">
      {/* Pixel confetti effect */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${10 + i * 6}%`,
                top: `${10 + (i % 4) * 15}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + (i % 3) * 0.2}s`,
              }}
            >
              <PixelStar filled className="h-6 w-6" />
            </div>
          ))}
        </div>
      )}

      <div className="pixel-panel pixel-panel-green overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <PixelRobot className="animate-bounce-slow h-20 w-16" />
          </div>

          <h2 className="pixel-text-shadow mb-3 text-4xl font-bold text-[#2C1810]">
            {t("levelComplete.title")}
          </h2>
          <p className="m-0 text-xl text-[#5D4037]">{message}</p>
        </div>

        {/* Pixel Stars */}
        <div className="flex justify-center gap-3 pb-6">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={cn(
                "transition-all duration-500",
                star <= savedStars ? "scale-100" : "scale-75 opacity-30"
              )}
              style={{ animationDelay: `${star * 0.2}s` }}
            >
              <PixelStar filled={star <= savedStars} className="h-10 w-10" />
            </div>
          ))}
        </div>

        {/* Actions - pixel style */}
        <div className="flex flex-col justify-center gap-3 border-t-4 border-[#8B4513] bg-[#4A3728] p-4 sm:flex-row">
          {next ? (
            <Link
              href={`/kids/level/${next.slug}`}
              className="pixel-btn pixel-btn-green px-8 py-3 text-center text-xl"
            >
              <span className="flex items-center justify-center gap-2">
                {t("levelComplete.nextLevel")}
                <PixelArrowRight />
              </span>
            </Link>
          ) : (
            <Link
              href="/kids/map"
              className="pixel-btn pixel-btn-green px-8 py-3 text-center text-xl"
            >
              {t("levelComplete.allDone")}
            </Link>
          )}

          <Link
            href="/kids/map"
            className="pixel-btn pixel-btn-amber px-8 py-3 text-center text-xl"
          >
            <span className="flex items-center justify-center gap-2">
              <PixelMapIcon />
              {t("levelComplete.backToMap")}
            </span>
          </Link>
        </div>
      </div>
    </div>
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

function PixelMapIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" style={{ imageRendering: "pixelated" }}>
      {/* Pin head - circle */}
      <rect x="5" y="1" width="6" height="2" fill="currentColor" />
      <rect x="4" y="2" width="8" height="2" fill="currentColor" />
      <rect x="3" y="3" width="10" height="4" fill="currentColor" />
      <rect x="4" y="7" width="8" height="2" fill="currentColor" />
      <rect x="5" y="9" width="6" height="2" fill="currentColor" />
      {/* Pin point */}
      <rect x="6" y="11" width="4" height="2" fill="currentColor" />
      <rect x="7" y="13" width="2" height="2" fill="currentColor" />
      {/* Inner highlight */}
      <rect x="5" y="4" width="2" height="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

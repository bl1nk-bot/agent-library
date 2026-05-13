"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { getTotalStars, getCompletedLevelsCount } from "@/lib/kids/progress";
import { getTotalLevels, getLevelBySlug } from "@/lib/kids/levels";
import { PixelStar, PixelRobot } from "@/components/kids/elements/pixel-art";
import { MusicButton } from "./background-music";
import { SettingsButton } from "./settings-modal";
import { useLevelSlug } from "@/components/kids/providers/level-context";

export function KidsHeader() {
  const t = useTranslations("kids");
  const [stars, setStars] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const total = getTotalLevels();

  // Get current level from context (will be empty if not in a level)
  const levelSlug = useLevelSlug();
  const currentLevel = levelSlug ? getLevelBySlug(levelSlug) : null;
  const levelNumber = currentLevel ? `${currentLevel.world}.${currentLevel.levelNumber}` : null;

  useEffect(() => {
    setStars(getTotalStars());
    setCompleted(getCompletedLevelsCount());
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="z-50 w-full shrink-0 border-b-4 border-[#8B4513] bg-[#2C1810]">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <a href="/kids" className="flex items-center gap-2">
          <PixelRobot className="h-10 w-8" />
          <span className="pixel-text-shadow hidden text-2xl font-bold text-[#FFD700] sm:block">
            {t("header.title")}
          </span>
        </a>

        {/* Stats & Nav */}
        <div className="flex items-center gap-3">
          {/* Current level indicator */}
          {levelNumber && (
            <div className="pixel-border-sm flex h-8 items-center gap-1 border-2 border-[#DAA520] bg-[#FFD700] px-3">
              <span className="text-sm font-bold text-[#8B4513]">
                {t("level.levelLabel", { number: levelNumber })}
              </span>
            </div>
          )}

          {/* Stars counter */}
          <div className="pixel-border-sm flex h-8 items-center gap-1 border-2 border-[#8B4513] bg-[#4A3728] px-3">
            <PixelStar filled className="h-4 w-4" />
            <span className="text-sm text-white">{stars}</span>
          </div>

          {/* Progress */}
          <div className="pixel-border-sm hidden h-8 items-center gap-1 border-2 border-[#8B4513] bg-[#4A3728] px-3 sm:flex">
            <span className="text-sm text-[#22C55E]">
              {completed}/{total}
            </span>
          </div>

          {/* Nav buttons - desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <MusicButton />
            <SettingsButton />
            <a
              href="/kids"
              className="pixel-btn flex h-8 items-center px-3 py-1.5 text-sm"
              aria-label={t("header.home")}
              title={t("header.home")}
            >
              <PixelHomeIcon aria-hidden="true" />
            </a>
            <Link
              href="/kids/map"
              className="pixel-btn pixel-btn-green flex h-8 items-center px-3 py-1.5 text-sm"
              aria-label={t("level.map")}
              title={t("level.map")}
            >
              <PixelMapIcon aria-hidden="true" />
            </Link>
            {/* Back to main site */}
            <a
              href="/"
              className="pixel-btn pixel-btn-amber hidden h-8 items-center px-3 py-1.5 text-sm md:flex"
            >
              {t("header.mainSite")}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="relative sm:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="pixel-btn flex h-8 items-center px-3 py-1.5"
              aria-label={t("header.menu") || "Menu"}
              title={t("header.menu") || "Menu"}
            >
              <PixelMenuIcon aria-hidden="true" />
            </button>

            {/* Mobile dropdown menu */}
            {menuOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border-4 border-[#8B4513] bg-[#2C1810] shadow-xl duration-200">
                <div className="flex flex-col gap-2 p-2">
                  {/* Progress - mobile only */}
                  <div className="pixel-border-sm flex items-center justify-center gap-1 border-2 border-[#8B4513] bg-[#4A3728] px-3 py-2">
                    <span className="text-sm text-[#22C55E]">
                      {completed}/{total}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <MusicButton />
                    <SettingsButton />
                  </div>

                  <a
                    href="/kids"
                    className="pixel-btn flex items-center justify-center gap-2 px-3 py-2 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PixelHomeIcon />
                    {t("header.home")}
                  </a>
                  <Link
                    href="/kids/map"
                    className="pixel-btn pixel-btn-green flex items-center justify-center gap-2 px-3 py-2 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    <PixelMapIcon />
                    {t("level.map")}
                  </Link>
                  <a
                    href="/"
                    className="pixel-btn pixel-btn-amber flex items-center justify-center px-3 py-2 text-sm"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("header.mainSite")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Pixel art home icon
function PixelHomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5" style={{ imageRendering: "pixelated" }} {...props}>
      <rect x="7" y="1" width="2" height="2" fill="currentColor" />
      <rect x="5" y="3" width="6" height="2" fill="currentColor" />
      <rect x="3" y="5" width="10" height="2" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="3" y="9" width="10" height="6" fill="currentColor" />
      <rect x="6" y="11" width="4" height="4" fill="#2C1810" />
    </svg>
  );
}

// Pixel art pin/location icon
function PixelMapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5" style={{ imageRendering: "pixelated" }} {...props}>
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

// Pixel art hamburger menu icon
function PixelMenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5" style={{ imageRendering: "pixelated" }} {...props}>
      <rect x="2" y="3" width="12" height="2" fill="currentColor" />
      <rect x="2" y="7" width="12" height="2" fill="currentColor" />
      <rect x="2" y="11" width="12" height="2" fill="currentColor" />
    </svg>
  );
}

"use client";

import {
  Children,
  isValidElement,
  ReactNode,
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Section } from "@/components/kids/elements";
import { useSetLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getLevelBySlug } from "@/lib/kids/levels";
import { analyticsKids } from "@/lib/analytics";
import { isSectionCompleted, markSectionCompleted } from "@/lib/kids/progress";

interface LevelContentWrapperProps {
  children: ReactNode;
  levelSlug: string;
  levelNumber: string;
}

export function LevelContentWrapper({
  children,
  levelSlug,
  levelNumber,
}: LevelContentWrapperProps) {
  const t = useTranslations("kids");
  const setLevelSlug = useSetLevelSlug();
  const {
    currentSection,
    setCurrentSection,
    completedSections,
    markSectionComplete,
    isSectionComplete,
    sectionRequiresCompletion,
  } = useSectionNavigation();

  // Track section completion state from localStorage
  const [sectionCompletionState, setSectionCompletionState] = useState<Record<number, boolean>>({});

  // Check localStorage for section completion on mount and when section changes
  const checkSectionCompletion = useCallback(() => {
    const newState: Record<number, boolean> = {};
    for (let i = 0; i < 20; i++) {
      // Check up to 20 sections
      newState[i] = isSectionCompleted(levelSlug, i);
    }
    setSectionCompletionState(newState);
  }, [levelSlug]);

  useEffect(() => {
    checkSectionCompletion();
    // Re-check periodically to catch component completions
    const interval = setInterval(checkSectionCompletion, 500);
    return () => clearInterval(interval);
  }, [checkSectionCompletion, currentSection]);

  // Set the level slug in context when component mounts
  useEffect(() => {
    setLevelSlug(levelSlug);

    // Track level view
    const level = getLevelBySlug(levelSlug);
    if (level) {
      analyticsKids.viewLevel(levelSlug, level.world);
    }

    return () => setLevelSlug(""); // Clear when unmounting
  }, [levelSlug, setLevelSlug]);

  // Extract Section components from children
  const sections: ReactElement[] = [];
  let hasExplicitSections = false;

  // First pass: check if there are explicit Section components
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Section) {
      hasExplicitSections = true;
    }
  });

  // Second pass: collect sections
  if (hasExplicitSections) {
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === Section) {
        sections.push(child);
      }
    });
  } else {
    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        sections.push(<Section key={sections.length}>{child}</Section>);
      }
    });
  }

  // If no sections found, show coming soon
  if (sections.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="pixel-panel p-6 text-center">
          <p className="mb-4 text-[#5D4037]">{t("level.comingSoon")}</p>
          <Link
            href="/kids/map"
            className="pixel-btn pixel-btn-green inline-flex items-center gap-2 px-4 py-2"
          >
            <PixelMapIcon />
            {t("level.backToMap")}
          </Link>
        </div>
      </div>
    );
  }

  const totalSections = sections.length;
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;

  // Check if current section is complete (from localStorage) OR doesn't require completion
  const currentSectionRequiresCompletion = sectionRequiresCompletion(currentSection);
  const isCurrentSectionComplete =
    !currentSectionRequiresCompletion || sectionCompletionState[currentSection] || false;

  // Track the highest section the user has visited
  const [highestVisitedSection, setHighestVisitedSection] = useState(0);

  // Update highest visited when current section changes
  useEffect(() => {
    setHighestVisitedSection((prev) => Math.max(prev, currentSection));
  }, [currentSection]);

  // Can navigate to a section if it's:
  // 1. The current section
  // 2. A previously visited section (but NOT future sections)
  const canNavigateToSection = (targetSection: number): boolean => {
    if (targetSection === currentSection) return true;
    // Can only go back to sections we've already visited
    if (targetSection < currentSection && targetSection <= highestVisitedSection) return true;
    // Cannot skip ahead via dots - must use Next button
    return false;
  };

  const goToNext = () => {
    if (!isLastSection && isCurrentSectionComplete) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (!isFirstSection) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleDotClick = (targetSection: number) => {
    if (canNavigateToSection(targetSection)) {
      setCurrentSection(targetSection);
    }
  };

  // Mark section as complete manually (for sections without interactive elements)
  const handleMarkComplete = () => {
    markSectionCompleted(levelSlug, currentSection);
    markSectionComplete(currentSection);
    checkSectionCompletion();
  };

  // Reset to first section and visited state when level changes
  useEffect(() => {
    setCurrentSection(0);
    setHighestVisitedSection(0);
    setSectionCompletionState({});
  }, [levelSlug]);

  return (
    <div className="flex h-full flex-col">
      {/* Content area */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
        <div className="my-auto w-full max-w-2xl">
          <div
            key={currentSection}
            className="animate-in fade-in slide-in-from-right-4 prose kids-prose-pixel max-w-none duration-300"
          >
            {sections[currentSection]}
          </div>
        </div>
      </div>

      {/* Navigation footer - pixel art style */}
      <div className="shrink-0 border-t-4 border-[#8B4513] bg-[#2C1810]">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-3 sm:gap-0">
          {/* Buttons row */}
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={goToPrev}
              disabled={isFirstSection}
              className={cn(
                "pixel-btn px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-xl",
                isFirstSection && "pointer-events-none opacity-0"
              )}
            >
              <span className="flex items-center gap-1">
                <PixelArrowLeft />
                {t("navigation.back")}
              </span>
            </button>

            {/* Progress indicators - visible only on desktop, centered */}
            <div className="hidden items-center gap-2 sm:flex">
              {Array.from({ length: totalSections }).map((_, i) => {
                const canNavigate = canNavigateToSection(i);
                const isVisited = i <= highestVisitedSection;
                const isCurrent = i === currentSection;
                return (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    disabled={!canNavigate}
                    className={cn(
                      "h-4 w-4 border-2 transition-all",
                      isCurrent
                        ? "border-[#16A34A] bg-[#22C55E]"
                        : isVisited && i < currentSection
                          ? "border-[#2563EB] bg-[#3B82F6]"
                          : "cursor-not-allowed border-[#4A3728] bg-[#2C1810] opacity-50"
                    )}
                    style={{
                      clipPath:
                        "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)",
                    }}
                    aria-label={`Go to section ${i + 1}${!canNavigate ? " (locked)" : ""}`}
                  />
                );
              })}
            </div>

            {/* Next button or Map link */}
            {!isLastSection ? (
              <button
                onClick={goToNext}
                disabled={!isCurrentSectionComplete}
                className={cn(
                  "pixel-btn px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-xl",
                  isCurrentSectionComplete
                    ? "pixel-btn-green"
                    : "cursor-not-allowed border-[#8B4513] bg-[#4A3728] opacity-50"
                )}
                title={!isCurrentSectionComplete ? t("navigation.completeFirst") : undefined}
              >
                <span className="flex items-center gap-1">
                  {!isCurrentSectionComplete && <PixelLockIcon />}
                  {t("navigation.next")}
                  <PixelArrowRight />
                </span>
              </button>
            ) : (
              <Link
                href="/kids/map"
                className="pixel-btn pixel-btn-amber px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-xl"
              >
                <span className="flex items-center gap-1">
                  <PixelMapIcon />
                  {t("level.map")}
                </span>
              </Link>
            )}
          </div>

          {/* Progress indicators - mobile only, below buttons */}
          <div className="flex items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: totalSections }).map((_, i) => {
              const canNavigate = canNavigateToSection(i);
              const isVisited = i <= highestVisitedSection;
              const isCurrent = i === currentSection;
              return (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  disabled={!canNavigate}
                  className={cn(
                    "h-4 w-4 border-2 transition-all",
                    isCurrent
                      ? "border-[#16A34A] bg-[#22C55E]"
                      : isVisited && i < currentSection
                        ? "border-[#2563EB] bg-[#3B82F6]"
                        : "cursor-not-allowed border-[#4A3728] bg-[#2C1810] opacity-50"
                  )}
                  style={{
                    clipPath:
                      "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)",
                  }}
                  aria-label={`Go to section ${i + 1}${!canNavigate ? " (locked)" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pixel art icons
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

function PixelLockIcon() {
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3" style={{ imageRendering: "pixelated" }}>
      {/* Lock body */}
      <rect x="1" y="6" width="10" height="8" fill="currentColor" />
      {/* Lock shackle */}
      <rect x="3" y="2" width="2" height="4" fill="currentColor" />
      <rect x="7" y="2" width="2" height="4" fill="currentColor" />
      <rect x="3" y="1" width="6" height="2" fill="currentColor" />
      {/* Keyhole */}
      <rect x="5" y="9" width="2" height="3" fill="#2C1810" />
    </svg>
  );
}

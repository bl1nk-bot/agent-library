"use client";

import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PixelRobot, PixelStar } from "./pixel-art";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface PromptVsMistakeProps {
  question: string;
  good: string;
  bad: string;
  explanation?: string;
  promiMessage?: string;
}

interface SavedState {
  selected: "good" | "bad" | null;
  showResult: boolean;
  order: string[];
}

export function PromptVsMistake({
  question,
  good,
  bad,
  explanation,
  promiMessage,
}: PromptVsMistakeProps) {
  const t = useTranslations("kids.quiz");
  const levelSlug = useLevelSlug();
  const { currentSection, markSectionComplete, registerSectionRequirement } =
    useSectionNavigation();
  const componentId = useId();

  // Register that this section has an interactive element requiring completion
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);

  const [selected, setSelected] = useState<"good" | "bad" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const randomOrder = Math.random() > 0.5 ? ["good", "bad"] : ["bad", "good"];

    if (!levelSlug) {
      setOrder(randomOrder);
      setIsLoaded(true);
      return;
    }

    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.order && saved.order.length > 0) {
      setSelected(saved.selected);
      setShowResult(saved.showResult);
      setOrder(saved.order);
    } else {
      setOrder(randomOrder);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state when it changes
  useEffect(() => {
    if (!levelSlug || !isLoaded || order.length === 0) return;

    saveComponentState<SavedState>(levelSlug, componentId, {
      selected,
      showResult,
      order,
    });
  }, [levelSlug, componentId, selected, showResult, order, isLoaded]);

  const handleSelect = (choice: "good" | "bad") => {
    setSelected(choice);
    setShowResult(true);
    // Mark section as complete if correct answer selected
    if (choice === "good" && levelSlug) {
      markSectionCompleted(levelSlug, currentSection);
      markSectionComplete(currentSection);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  const isCorrect = selected === "good";

  const options = order.map((type) => ({
    type: type as "good" | "bad",
    text: type === "good" ? good : bad,
  }));

  // Pixel clip-path for consistent styling (stepped corners like pixel-panel)
  const pixelClipPath =
    "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))";
  const smallPixelClipPath =
    "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))";

  return (
    <div className="my-2">
      {/* Question card with Promi */}
      <div className="mb-2 flex items-center gap-2">
        <div className="shrink-0">
          <PixelRobot className="h-10 w-8" />
        </div>
        <div className="relative flex-1">
          {/* Speech bubble */}
          <div
            className="relative ml-2 border-2 border-[#8B4513] bg-white p-2 shadow-md"
            style={{ clipPath: pixelClipPath }}
          >
            {/* Arrow pointing left */}
            <div className="absolute top-1/2 -left-2 h-0 w-0 -translate-y-1/2 border-t-[6px] border-r-[8px] border-b-[6px] border-t-transparent border-r-[#8B4513] border-b-transparent" />
            <div className="absolute top-1/2 -left-1 h-0 w-0 -translate-y-1/2 border-t-[5px] border-r-[6px] border-b-[5px] border-t-transparent border-r-white border-b-transparent" />
            <p className="m-0 text-base font-bold text-[#2C1810]">{question}</p>
          </div>
        </div>
      </div>

      {/* Choice cards - stacked on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map(({ type, text }, index) => {
          const isGood = type === "good";

          return (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              disabled={showResult}
              className={cn(
                "h-full w-full overflow-hidden text-left transition-all duration-300",
                !showResult && "cursor-pointer hover:scale-[1.01] hover:shadow-lg",
                showResult && "scale-100"
              )}
              style={{ clipPath: pixelClipPath }}
            >
              <div
                className={cn(
                  "h-full p-0.5 transition-colors",
                  !showResult && "bg-gradient-to-br from-[#FFB347] to-[#FF8C00]",
                  showResult && isGood && "bg-gradient-to-br from-[#4ADE80] to-[#16A34A]",
                  showResult && !isGood && "bg-gradient-to-br from-[#FB7185] to-[#E11D48]"
                )}
              >
                <div
                  className={cn(
                    "flex h-full flex-col bg-white p-2 transition-colors",
                    showResult && isGood && "bg-[#F0FDF4]",
                    showResult && !isGood && "bg-[#FFF1F2]"
                  )}
                  style={{ clipPath: smallPixelClipPath }}
                >
                  {/* Option label */}
                  <div className="mb-1 flex items-center gap-1">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center text-sm font-bold text-white",
                        !showResult && "bg-[#F59E0B]",
                        showResult && isGood && "bg-[#22C55E]",
                        showResult && !isGood && "bg-[#EF4444]"
                      )}
                      style={{ clipPath: smallPixelClipPath }}
                    >
                      {showResult ? (
                        isGood ? (
                          <PixelCheckIcon />
                        ) : (
                          <PixelXIcon />
                        )
                      ) : index === 0 ? (
                        "A"
                      ) : (
                        "B"
                      )}
                    </span>
                    {showResult && (
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isGood ? "text-[#16A34A]" : "text-[#DC2626]"
                        )}
                      >
                        {isGood ? t("goodLabel") : t("badLabel")}
                      </span>
                    )}
                  </div>

                  {/* Prompt text */}
                  <div
                    className="flex flex-1 items-center border border-[#F59E0B]/30 bg-[#FEF3C7] p-1.5"
                    style={{ clipPath: smallPixelClipPath }}
                  >
                    <p className="m-0 text-sm leading-tight whitespace-pre-wrap text-[#2C1810]">
                      "{text}"
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div
          className={cn(
            "animate-in fade-in zoom-in-95 mt-3 p-3 text-center duration-300",
            isCorrect
              ? "border-2 border-[#22C55E] bg-gradient-to-br from-[#BBF7D0] to-[#86EFAC]"
              : "border-2 border-[#F59E0B] bg-gradient-to-br from-[#FEF08A] to-[#FDE047]"
          )}
          style={{ clipPath: pixelClipPath }}
        >
          <p className="m-0 text-base font-bold text-[#2C1810]">
            {isCorrect ? (
              <>
                <PixelStar filled className="inline h-4 w-4" /> {t("correct")}{" "}
                <PixelStar filled className="inline h-4 w-4" />
              </>
            ) : (
              t("incorrect")
            )}
          </p>
          {explanation && <p className="m-0 mt-2 text-sm text-[#5D4037]">{explanation}</p>}
          {promiMessage && (
            <div
              className="mt-3 flex items-center justify-center gap-2 bg-white/60 p-2"
              style={{ clipPath: smallPixelClipPath }}
            >
              <PixelRobot className="h-7 w-6 shrink-0" />
              <p className="m-0 text-sm text-[#5D4037]">{promiMessage}</p>
            </div>
          )}
          {!isCorrect && (
            <button
              onClick={handleReset}
              className="mt-3 inline-flex items-center gap-1 bg-[#8B4513] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#A0522D]"
              style={{ clipPath: smallPixelClipPath }}
            >
              <PixelRefreshIcon />
              {t("tryAgain")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Pixel art icons
function PixelCheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-5 w-5" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="6" width="2" height="2" fill="currentColor" />
      <rect x="4" y="8" width="2" height="2" fill="currentColor" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" />
      <rect x="8" y="4" width="2" height="2" fill="currentColor" />
      <rect x="10" y="2" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelXIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-5 w-5" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="2" height="2" fill="currentColor" />
      <rect x="8" y="2" width="2" height="2" fill="currentColor" />
      <rect x="4" y="4" width="2" height="2" fill="currentColor" />
      <rect x="6" y="4" width="2" height="2" fill="currentColor" />
      <rect x="4" y="6" width="2" height="2" fill="currentColor" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" />
      <rect x="2" y="8" width="2" height="2" fill="currentColor" />
      <rect x="8" y="8" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelRefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" style={{ imageRendering: "pixelated" }}>
      <rect x="6" y="1" width="4" height="2" fill="currentColor" />
      <rect x="4" y="3" width="2" height="2" fill="currentColor" />
      <rect x="10" y="3" width="2" height="2" fill="currentColor" />
      <rect x="2" y="5" width="2" height="2" fill="currentColor" />
      <rect x="12" y="5" width="2" height="4" fill="currentColor" />
      <rect x="2" y="7" width="2" height="4" fill="currentColor" />
      <rect x="12" y="9" width="2" height="2" fill="currentColor" />
      <rect x="4" y="11" width="2" height="2" fill="currentColor" />
      <rect x="10" y="11" width="2" height="2" fill="currentColor" />
      <rect x="6" y="13" width="4" height="2" fill="currentColor" />
      <rect x="12" y="3" width="3" height="2" fill="currentColor" />
      <rect x="1" y="11" width="3" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelThinkingIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-12 w-12" style={{ imageRendering: "pixelated" }}>
      {/* Face circle */}
      <rect x="10" y="4" width="12" height="2" fill="#F59E0B" />
      <rect x="8" y="6" width="2" height="2" fill="#F59E0B" />
      <rect x="22" y="6" width="2" height="2" fill="#F59E0B" />
      <rect x="6" y="8" width="2" height="4" fill="#F59E0B" />
      <rect x="24" y="8" width="2" height="4" fill="#F59E0B" />
      <rect x="6" y="12" width="2" height="4" fill="#F59E0B" />
      <rect x="24" y="12" width="2" height="4" fill="#F59E0B" />
      <rect x="8" y="16" width="2" height="2" fill="#F59E0B" />
      <rect x="22" y="16" width="2" height="2" fill="#F59E0B" />
      <rect x="10" y="18" width="12" height="2" fill="#F59E0B" />
      {/* Fill */}
      <rect x="8" y="8" width="16" height="8" fill="#FEF3C7" />
      <rect x="10" y="6" width="12" height="2" fill="#FEF3C7" />
      <rect x="10" y="16" width="12" height="2" fill="#FEF3C7" />
      {/* Eyes */}
      <rect x="10" y="10" width="2" height="2" fill="#2C1810" />
      <rect x="20" y="10" width="2" height="2" fill="#2C1810" />
      {/* Thinking mouth */}
      <rect x="14" y="14" width="4" height="2" fill="#2C1810" />
      {/* Thought bubbles */}
      <rect x="26" y="4" width="2" height="2" fill="#8B7355" />
      <rect x="28" y="2" width="3" height="3" fill="#8B7355" />
    </svg>
  );
}

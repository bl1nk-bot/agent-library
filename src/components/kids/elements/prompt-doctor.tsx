"use client";

import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface Problem {
  issue: string;
  symptom: string;
  fix: string;
}

interface PromptDoctorProps {
  title?: string;
  brokenPrompt: string;
  problems: Problem[];
  healedPrompt: string;
  successMessage?: string;
}

interface SavedState {
  fixedProblems: number[];
  isHealed: boolean;
}

export function PromptDoctor({
  title,
  brokenPrompt,
  problems,
  healedPrompt,
  successMessage,
}: PromptDoctorProps) {
  const t = useTranslations("kids.promptDoctor");
  const levelSlug = useLevelSlug();
  const { currentSection, markSectionComplete, registerSectionRequirement } =
    useSectionNavigation();
  const componentId = useId();

  // Register that this section has an interactive element requiring completion
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);

  const displayTitle = title || t("title");

  const [fixedProblems, setFixedProblems] = useState<number[]>([]);
  const [isHealed, setIsHealed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.fixedProblems) {
      setFixedProblems(saved.fixedProblems);
      setIsHealed(saved.isHealed || false);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      fixedProblems,
      isHealed,
    });
  }, [levelSlug, componentId, fixedProblems, isHealed, isLoaded]);

  if (!isLoaded) return null;

  const handleFixProblem = (index: number) => {
    if (fixedProblems.includes(index) || isHealed) return;

    const newFixed = [...fixedProblems, index];
    setFixedProblems(newFixed);

    if (newFixed.length === problems.length) {
      setIsHealed(true);
      // Mark section as complete
      if (levelSlug) {
        markSectionCompleted(levelSlug, currentSection);
        markSectionComplete(currentSection);
      }
    }
  };

  const handleReset = () => {
    setFixedProblems([]);
    setIsHealed(false);
  };

  // Calculate current prompt based on fixes applied
  const getCurrentPrompt = () => {
    if (isHealed) return healedPrompt;

    let currentPrompt = brokenPrompt;
    // Apply fixes in order
    problems.forEach((problem, index) => {
      if (fixedProblems.includes(index)) {
        // This is simplified - in reality you'd need smarter text manipulation
        currentPrompt = problem.fix;
      }
    });

    // Return the last applied fix or broken prompt
    if (fixedProblems.length > 0) {
      return problems[fixedProblems[fixedProblems.length - 1]].fix;
    }
    return brokenPrompt;
  };

  const healthPercentage = (fixedProblems.length / problems.length) * 100;

  return (
    <div className="my-4 rounded-xl border-4 border-[#EF4444] bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] p-4">
      {/* Title */}
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#DC2626]">
        🏥 {displayTitle}
      </h3>

      {/* Health bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-[#DC2626]">{t("health")}</span>
          <span className="text-sm font-medium text-[#DC2626]">
            {Math.round(healthPercentage)}%
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full border-2 border-[#EF4444] bg-red-200">
          <div
            className={cn(
              "h-full transition-all duration-500",
              healthPercentage < 50
                ? "bg-red-500"
                : healthPercentage < 100
                  ? "bg-yellow-500"
                  : "bg-green-500"
            )}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Current prompt display */}
      <div
        className={cn(
          "mb-4 rounded-lg border-4 p-4 transition-all duration-300",
          isHealed ? "border-green-500 bg-green-100" : "border-red-300 bg-white"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          {isHealed ? (
            <span className="text-2xl">💚</span>
          ) : (
            <span className="animate-pulse text-2xl">🤒</span>
          )}
          <span className={cn("font-bold", isHealed ? "text-green-700" : "text-red-600")}>
            {isHealed ? t("healthy") : t("sick")}
          </span>
        </div>
        <p className="m-0 text-lg font-medium text-[#2C1810]">"{getCurrentPrompt()}"</p>
      </div>

      {/* Problems to fix */}
      {!isHealed && (
        <div className="mb-4 space-y-2">
          <div className="mb-2 text-sm font-medium text-[#DC2626]">{t("diagnose")}</div>
          {problems.map((problem, index) => {
            const isFixed = fixedProblems.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleFixProblem(index)}
                disabled={isFixed}
                className={cn(
                  "w-full rounded-lg border-2 p-3 text-left transition-all",
                  isFixed
                    ? "border-green-400 bg-green-100 opacity-60"
                    : "cursor-pointer border-red-300 bg-white hover:border-red-500 hover:bg-red-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isFixed ? "✅" : "💊"}</span>
                  <div>
                    <div className="font-bold text-[#DC2626]">{problem.issue}</div>
                    <div className="text-sm text-[#5D4037]">{problem.symptom}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Success message */}
      {isHealed && (
        <div className="animate-in fade-in zoom-in-95 mb-4 rounded-lg border-2 border-green-500 bg-green-100 p-4 duration-300">
          <p className="m-0 text-lg font-bold text-green-700">
            ✨ {successMessage || t("success")}
          </p>
        </div>
      )}

      {/* Reset button */}
      {(isHealed || fixedProblems.length > 0) && (
        <button
          onClick={handleReset}
          className="rounded-lg bg-[#DC2626] px-6 py-2 font-bold text-white hover:bg-[#B91C1C]"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}

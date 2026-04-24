"use client";

import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface Improvement {
  label: string;
  prompt: string;
  response: string;
}

interface PromptLabProps {
  title?: string;
  scenario: string;
  basePrompt: string;
  baseResponse: string;
  improvements: Improvement[];
  successMessage?: string;
}

interface SavedState {
  appliedImprovements: number[];
  completed: boolean;
}

export function PromptLab({
  title,
  scenario,
  basePrompt,
  baseResponse,
  improvements,
  successMessage,
}: PromptLabProps) {
  const t = useTranslations("kids.promptLab");
  const levelSlug = useLevelSlug();
  const { currentSection, markSectionComplete, registerSectionRequirement } =
    useSectionNavigation();
  const componentId = useId();

  // Register that this section has an interactive element requiring completion
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);

  const displayTitle = title || t("title");

  const [appliedImprovements, setAppliedImprovements] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.appliedImprovements && Array.isArray(saved.appliedImprovements)) {
      setAppliedImprovements(saved.appliedImprovements);
      setCompleted(saved.completed || false);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      appliedImprovements,
      completed,
    });
  }, [levelSlug, componentId, appliedImprovements, completed, isLoaded]);

  if (!isLoaded) return null;

  const handleApplyImprovement = (index: number) => {
    if (appliedImprovements.includes(index) || completed) return;

    const newApplied = [...appliedImprovements, index];
    setAppliedImprovements(newApplied);

    if (newApplied.length === improvements.length) {
      setCompleted(true);
      // Mark section as complete
      if (levelSlug) {
        markSectionCompleted(levelSlug, currentSection);
        markSectionComplete(currentSection);
      }
    }
  };

  const handleReset = () => {
    setAppliedImprovements([]);
    setCompleted(false);
  };

  // Get current prompt based on applied improvements
  const getCurrentPrompt = () => {
    if (appliedImprovements.length === 0) return basePrompt;
    // Return the prompt from the highest applied improvement
    const maxApplied = Math.max(...appliedImprovements);
    return improvements[maxApplied].prompt;
  };

  // Get current response based on improvements
  const getCurrentResponse = () => {
    if (appliedImprovements.length === 0) return baseResponse;
    // Return the response from the highest applied improvement
    const maxApplied = Math.max(...appliedImprovements);
    return improvements[maxApplied].response;
  };

  const progressPercentage = (appliedImprovements.length / improvements.length) * 100;

  return (
    <div className="my-4 rounded-xl border-4 border-[#10B981] bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] p-4">
      {/* Title */}
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-[#047857]">
        🔬 {displayTitle}
      </h3>
      <p className="m-0 mb-4 text-[#5D4037]">{scenario}</p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-[#047857]">{t("progress")}</span>
          <span className="text-sm font-medium text-[#047857]">
            {appliedImprovements.length}/{improvements.length}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border-2 border-[#10B981] bg-green-200">
          <div
            className="h-full bg-[#10B981] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current prompt */}
      <div className="mb-4 rounded-lg border-2 border-[#10B981] bg-white/80 p-4">
        <div className="mb-2 text-sm font-medium text-[#047857]">{t("yourPrompt")}</div>
        <p className="m-0 text-lg font-medium text-[#2C1810]">"{getCurrentPrompt()}"</p>
      </div>

      {/* AI Response */}
      <div
        className={cn(
          "mb-4 rounded-lg border-2 p-4 transition-all duration-300",
          completed ? "border-green-500 bg-green-100" : "border-gray-300 bg-gray-50"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span
            className={cn("text-sm font-medium", completed ? "text-green-700" : "text-gray-600")}
          >
            {t("aiSays")}
          </span>
        </div>
        <p className="m-0 text-[#5D4037] italic">"{getCurrentResponse()}"</p>
      </div>

      {/* Improvement buttons */}
      {!completed && (
        <div className="mb-4 space-y-2">
          <div className="text-sm font-medium text-[#047857]">{t("addDetails")}</div>
          {improvements.map((improvement, index) => {
            const isApplied = appliedImprovements.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleApplyImprovement(index)}
                disabled={isApplied}
                className={cn(
                  "w-full rounded-lg border-2 p-3 text-left transition-all",
                  isApplied
                    ? "border-green-400 bg-green-100 opacity-60"
                    : "cursor-pointer border-[#10B981] bg-white hover:bg-green-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{isApplied ? "✅" : "➕"}</span>
                  <div className="font-bold text-[#047857]">{improvement.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Success message */}
      {completed && (
        <div className="animate-in fade-in zoom-in-95 mb-4 rounded-lg border-2 border-green-500 bg-green-100 p-4 duration-300">
          <p className="m-0 text-lg font-bold text-green-700">
            🎉 {successMessage || t("success")}
          </p>
        </div>
      )}

      {/* Reset button */}
      {(completed || appliedImprovements.length > 0) && (
        <button
          onClick={handleReset}
          className="rounded-lg bg-[#047857] px-6 py-2 font-bold text-white hover:bg-[#065F46]"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}

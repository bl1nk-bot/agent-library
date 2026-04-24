"use client";

import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface Example {
  input: string;
  output: string;
}

interface ExampleMatcherProps {
  title?: string;
  instruction?: string;
  examples: Example[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface SavedState {
  selectedAnswer: string | null;
  submitted: boolean;
}

export function ExampleMatcher({
  title,
  instruction,
  examples,
  question,
  options,
  correctAnswer,
  explanation,
}: ExampleMatcherProps) {
  const t = useTranslations("kids.exampleMatcher");
  const levelSlug = useLevelSlug();
  const { currentSection, markSectionComplete, registerSectionRequirement } =
    useSectionNavigation();
  const componentId = useId();

  // Register that this section has an interactive element requiring completion
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);

  const displayTitle = title || t("title");
  const displayInstruction = instruction || t("instruction");

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved) {
      setSelectedAnswer(saved.selectedAnswer);
      setSubmitted(saved.submitted);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      selectedAnswer,
      submitted,
    });
  }, [levelSlug, componentId, selectedAnswer, submitted, isLoaded]);

  if (!isLoaded) return null;

  const isCorrect = selectedAnswer === correctAnswer;

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    // Mark section as complete if correct answer
    if (selectedAnswer === correctAnswer && levelSlug) {
      markSectionCompleted(levelSlug, currentSection);
      markSectionComplete(currentSection);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  return (
    <div className="my-4 rounded-xl border-4 border-[#6366F1] bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] p-4">
      {/* Title */}
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-[#4338CA]">
        🧩 {displayTitle}
      </h3>
      <p className="m-0 mb-4 text-[#5D4037]">{displayInstruction}</p>

      {/* Examples Pattern */}
      <div className="mb-4 rounded-lg border-2 border-[#6366F1] bg-white/80 p-4">
        <div className="mb-2 text-sm font-medium text-[#4338CA]">{t("pattern")}</div>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <div key={index} className="flex items-center gap-3 text-lg">
              <span className="rounded-lg bg-[#E0E7FF] px-3 py-1 font-medium">{example.input}</span>
              <span className="font-bold text-[#6366F1]">→</span>
              <span className="rounded-lg bg-[#C7D2FE] px-3 py-1 font-medium">
                {example.output}
              </span>
            </div>
          ))}
          {/* Question row */}
          <div className="flex items-center gap-3 border-t-2 border-dashed border-[#6366F1] pt-2 text-lg">
            <span className="rounded-lg border-2 border-[#F59E0B] bg-[#FEF3C7] px-3 py-1 font-medium">
              {question}
            </span>
            <span className="font-bold text-[#6366F1]">→</span>
            <span className="rounded-lg bg-gray-100 px-3 py-1 font-medium text-gray-400">
              {submitted ? (isCorrect ? selectedAnswer : `${selectedAnswer} ❌`) : "???"}
            </span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const showCorrect = submitted && option === correctAnswer;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={submitted}
              className={cn(
                "rounded-lg border-2 px-4 py-3 text-xl font-bold transition-all",
                !submitted &&
                  !isSelected &&
                  "border-gray-300 bg-white hover:border-[#6366F1] hover:bg-[#E0E7FF]",
                !submitted && isSelected && "scale-105 border-[#6366F1] bg-[#C7D2FE]",
                showCorrect && "border-green-500 bg-green-100 text-green-700",
                showWrong && "border-red-400 bg-red-100 text-red-600",
                submitted && !showCorrect && !showWrong && "opacity-50"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Submit/Reset buttons */}
      <div className="flex gap-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className={cn(
              "rounded-lg px-6 py-2 font-bold text-white transition-all",
              selectedAnswer ? "bg-[#6366F1] hover:bg-[#4F46E5]" : "cursor-not-allowed bg-gray-300"
            )}
          >
            {t("check")}
          </button>
        ) : !isCorrect ? (
          <button
            onClick={handleReset}
            className="rounded-lg bg-[#6366F1] px-6 py-2 font-bold text-white hover:bg-[#4F46E5]"
          >
            {t("retry")}
          </button>
        ) : null}
      </div>

      {/* Result feedback */}
      {submitted && (
        <div
          className={cn(
            "animate-in fade-in zoom-in-95 mt-4 rounded-lg border-2 p-4 duration-300",
            isCorrect ? "border-green-500 bg-green-100" : "border-amber-500 bg-amber-100"
          )}
        >
          <p
            className={cn("m-0 text-lg font-bold", isCorrect ? "text-green-700" : "text-amber-700")}
          >
            {isCorrect ? t("correct") : t("tryAgain")}
          </p>
          {explanation && <p className="m-0 mt-2 text-[#5D4037]">{explanation}</p>}
        </div>
      )}
    </div>
  );
}

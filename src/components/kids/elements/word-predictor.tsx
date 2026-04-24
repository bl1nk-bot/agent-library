"use client";

import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface WordPredictorProps {
  title?: string;
  instruction?: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  aiThinking?: string;
  successMessage?: string;
}

interface SavedState {
  selectedAnswer: string | null;
  submitted: boolean;
}

export function WordPredictor({
  title,
  instruction,
  sentence,
  options,
  correctAnswer,
  explanation,
  aiThinking,
  successMessage,
}: WordPredictorProps) {
  const t = useTranslations("kids.wordPredictor");
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
    if (saved && typeof saved.submitted === "boolean") {
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

  // Render sentence with blank
  const renderSentence = () => {
    const parts = sentence.split("___");
    return (
      <span>
        {parts[0]}
        <span
          className={cn(
            "mx-1 inline-block min-w-[80px] rounded-lg border-2 border-dashed px-3 py-1 text-center font-bold",
            !submitted && "border-yellow-500 bg-yellow-100 text-yellow-700",
            submitted && isCorrect && "border-solid border-green-500 bg-green-100 text-green-700",
            submitted && !isCorrect && "border-solid border-red-400 bg-red-100 text-red-600"
          )}
        >
          {selectedAnswer || "???"}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="pixel-panel pixel-panel-indigo my-4 p-4">
      {/* Title */}
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-[#4338CA]">
        🧠 {displayTitle}
      </h3>
      <p className="m-0 mb-4 text-[#5D4037]">{displayInstruction}</p>

      {/* AI Brain visualization */}
      <div
        className="mb-4 border-2 border-[#6366F1] bg-white/80 p-4"
        style={{
          clipPath:
            "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-medium text-[#4338CA]">{t("aiThinks")}</span>
        </div>
        <p className="m-0 text-lg text-[#2C1810]">{renderSentence()}</p>
      </div>

      {/* Thinking bubble */}
      {!submitted && (
        <div
          className="mb-4 border-2 border-[#0EA5E9] bg-[#F0F9FF] p-3 text-[#0369A1] italic"
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          💭 {aiThinking || t("thinkingDefault")}
        </div>
      )}

      {/* Options */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const showCorrect = submitted && option === correctAnswer;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={submitted}
              className={cn(
                "border-2 p-3 text-lg font-bold transition-all",
                !submitted &&
                  !isSelected &&
                  "cursor-pointer border-[#6366F1] bg-white text-[#4338CA] hover:bg-indigo-50",
                !submitted &&
                  isSelected &&
                  "scale-105 border-[#4338CA] bg-indigo-100 text-[#4338CA] ring-2 ring-[#4338CA]",
                showCorrect && "border-green-500 bg-green-100 text-green-700",
                showWrong && "border-red-400 bg-red-100 text-red-600"
              )}
              style={{
                clipPath:
                  "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
              }}
            >
              {showCorrect && "✓ "}
              {showWrong && "✗ "}
              {option}
            </button>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className={cn(
            "w-full py-3 text-lg font-bold transition-all",
            selectedAnswer
              ? "cursor-pointer bg-[#6366F1] text-white hover:bg-[#4F46E5]"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          )}
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          {t("check")}
        </button>
      )}

      {/* Result */}
      {submitted && (
        <div
          className={cn(
            "animate-in fade-in zoom-in-95 mb-4 border-2 p-4 duration-300",
            isCorrect ? "border-green-500 bg-green-100" : "border-orange-400 bg-orange-100"
          )}
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          <p
            className={cn(
              "m-0 mb-2 text-lg font-bold",
              isCorrect ? "text-green-700" : "text-orange-700"
            )}
          >
            {isCorrect ? `🎉 ${successMessage || t("correct")}` : `🤔 ${t("tryAgain")}`}
          </p>
          <p className="m-0 text-[#5D4037]">{explanation}</p>
        </div>
      )}

      {/* Reset button */}
      {submitted && !isCorrect && (
        <button
          onClick={handleReset}
          className="bg-[#6366F1] px-6 py-2 font-bold text-white hover:bg-[#4F46E5]"
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { Check, RefreshCw, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionNavigation } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface BlankConfig {
  id?: string;
  hint: string;
  answers: string[]; // Words to choose from (all are correct)
  emoji?: string;
}

interface MagicWordsProps {
  title?: string;
  sentence: string; // Use _ for blanks
  blanks: BlankConfig[];
  successMessage?: string;
}

interface SavedState {
  placements: Record<string, string>;
  submitted: boolean;
  availableWords: { word: string; blankId: string }[];
}

export function MagicWords({ title, sentence, blanks, successMessage }: MagicWordsProps) {
  const t = useTranslations("kids.magicWords");
  const levelSlug = useLevelSlug();
  const { currentSection, markSectionComplete, registerSectionRequirement } =
    useSectionNavigation();
  const componentId = useId();
  const displayTitle = title || t("title");

  // Register that this section has an interactive element requiring completion
  useEffect(() => {
    registerSectionRequirement(currentSection);
  }, [currentSection, registerSectionRequirement]);

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [availableWords, setAvailableWords] = useState<{ word: string; blankId: string }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate IDs for blanks if not provided
  const blanksWithIds = blanks.map((blank, index) => ({
    ...blank,
    id: blank.id || `blank-${index}`,
  }));

  // Load saved state on mount
  useEffect(() => {
    const shuffleWords = () => {
      const words = blanksWithIds.flatMap((blank) =>
        blank.answers.map((answer) => ({ word: answer, blankId: blank.id! }))
      );
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      return words;
    };

    if (!levelSlug) {
      setPlacements({});
      setAvailableWords(shuffleWords());
      setIsLoaded(true);
      return;
    }

    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.placements && saved.availableWords && saved.availableWords.length > 0) {
      setPlacements(saved.placements);
      setSubmitted(saved.submitted || false);
      setAvailableWords(saved.availableWords);
    } else {
      setPlacements({});
      setAvailableWords(shuffleWords());
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state when it changes
  useEffect(() => {
    if (!levelSlug || !isLoaded || availableWords.length === 0) return;

    saveComponentState<SavedState>(levelSlug, componentId, {
      placements,
      submitted,
      availableWords,
    });
  }, [levelSlug, componentId, placements, submitted, availableWords, isLoaded]);

  const checkAnswer = useCallback(
    (blankId: string, value: string): boolean => {
      const blank = blanksWithIds.find((b) => b.id === blankId);
      if (!blank) return false;
      return blank.answers.some((answer) => answer.toLowerCase() === value.toLowerCase());
    },
    [blanksWithIds]
  );

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  const allCorrect =
    submitted && blanksWithIds.every((blank) => checkAnswer(blank.id, placements[blank.id] || ""));
  const score = blanksWithIds.filter((blank) =>
    checkAnswer(blank.id, placements[blank.id] || "")
  ).length;

  const usedWords = Object.values(placements);

  const handleDragStart = (word: string) => {
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
  };

  const handleDrop = (blankId: string) => {
    if (draggedWord && !submitted) {
      // Remove word from previous placement if it was placed somewhere
      const newPlacements = { ...placements };
      Object.keys(newPlacements).forEach((key) => {
        if (newPlacements[key] === draggedWord) {
          delete newPlacements[key];
        }
      });
      newPlacements[blankId] = draggedWord;
      setPlacements(newPlacements);
      setDraggedWord(null);
    }
  };

  const handleClickWord = (word: string) => {
    if (submitted) return;

    // Find first empty blank
    const emptyBlank = blanksWithIds.find((blank) => !placements[blank.id]);
    if (emptyBlank) {
      // Remove word from previous placement
      const newPlacements = { ...placements };
      Object.keys(newPlacements).forEach((key) => {
        if (newPlacements[key] === word) {
          delete newPlacements[key];
        }
      });
      newPlacements[emptyBlank.id] = word;
      setPlacements(newPlacements);
    }
  };

  const handleClickBlank = (blankId: string) => {
    if (submitted) return;
    // Remove word from this blank
    const newPlacements = { ...placements };
    delete newPlacements[blankId];
    setPlacements(newPlacements);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Check if all blanks are filled correctly
    const allFilled = blanksWithIds.every((blank) => placements[blank.id]);
    if (allFilled && levelSlug) {
      markSectionCompleted(levelSlug, currentSection);
      markSectionComplete(currentSection);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setSubmitted(false);
  };

  // Parse sentence and render with drop zones
  const renderSentence = () => {
    // Split by underscore placeholders OR {{placeholder}} syntax
    const parts = sentence.split(/(_+|\{\{[^}]+\}\})/g);
    let blankIndex = 0;

    return parts.map((part, index) => {
      // Check if this is a blank placeholder (underscores or {{...}})
      if (/^_+$/.test(part) || /^\{\{[^}]+\}\}$/.test(part)) {
        const blank = blanksWithIds[blankIndex];
        if (!blank) return <span key={index}>{part}</span>;

        const blankId = blank.id;
        const placedWord = placements[blankId];
        const isCorrect = submitted && checkAnswer(blankId, placedWord || "");
        const isWrong = submitted && !isCorrect;

        blankIndex++;

        return (
          <span key={index} className="mx-1 my-1 inline-flex items-center gap-1">
            <span
              onClick={() => placedWord && handleClickBlank(blankId)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(blankId)}
              className={cn(
                "min-w-[100px] cursor-pointer rounded-lg border-2 border-dashed px-3 py-2 text-center text-xl font-medium text-[#2C1810] transition-all",
                !placedWord && "border-purple-400 bg-white",
                placedWord && !submitted && "border-solid border-purple-500 bg-purple-100",
                isCorrect && "border-solid border-green-500 bg-green-50",
                isWrong && "border-solid border-red-400 bg-red-50",
                draggedWord && !placedWord && "scale-105 border-purple-500 bg-purple-50"
              )}
              title={blank.hint}
            >
              {placedWord || blank.hint}
            </span>
            {submitted && isCorrect && <Check className="h-6 w-6 text-green-500" />}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="pixel-panel pixel-panel-purple my-4 overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <span className="text-2xl font-bold text-[#2C1810]">{displayTitle}</span>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Sentence with blanks */}
        <div
          className="flex flex-wrap items-center bg-purple-50 p-4 text-xl leading-relaxed text-[#2C1810]"
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          {renderSentence()}
        </div>

        {/* Word bank */}
        <div
          className="bg-purple-100 p-4"
          style={{
            clipPath:
              "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
          }}
        >
          <p className="m-0 mb-3 text-lg font-medium text-purple-700">{t("dragOrTap")}</p>
          <div className="flex flex-wrap gap-2">
            {availableWords.map(({ word }, index) => {
              const isUsed = usedWords.includes(word);
              return (
                <button
                  key={`${word}-${index}`}
                  draggable={!submitted && !isUsed}
                  onDragStart={() => handleDragStart(word)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={() => !isUsed && !submitted && handleDragStart(word)}
                  onTouchEnd={() => handleDragEnd()}
                  onClick={() => !isUsed && handleClickWord(word)}
                  disabled={submitted || isUsed}
                  className={cn(
                    "flex items-center gap-2 border-2 px-4 py-3 text-xl font-medium text-[#2C1810] transition-all",
                    !isUsed &&
                      !submitted &&
                      "cursor-grab border-purple-300 bg-white hover:border-purple-500 hover:shadow-md active:cursor-grabbing",
                    isUsed &&
                      "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 opacity-50",
                    submitted && "cursor-default"
                  )}
                  style={{
                    clipPath:
                      "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
                  }}
                >
                  {!submitted && !isUsed && <GripVertical className="h-5 w-5 text-purple-400" />}
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result */}
        {submitted && (
          <div
            className={cn(
              "p-4 text-center",
              allCorrect
                ? "border-2 border-green-300 bg-green-100"
                : "border-2 border-amber-300 bg-amber-100"
            )}
            style={{
              clipPath:
                "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
            }}
          >
            {allCorrect ? (
              <p className="m-0 text-xl font-bold text-green-800">
                🎉 {successMessage || "Amazing!"}
              </p>
            ) : (
              <p className="m-0 text-lg font-bold text-amber-800">
                {score} / {blanksWithIds.length} {t("correct")}! {t("tryAgain")}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              className="h-12 rounded-full px-6 text-xl"
              disabled={Object.keys(placements).length < blanksWithIds.length}
            >
              <Check className="mr-2 h-5 w-5" />
              {t("check")}
            </Button>
          ) : !allCorrect ? (
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 rounded-full px-6 text-xl"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {t("retry")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

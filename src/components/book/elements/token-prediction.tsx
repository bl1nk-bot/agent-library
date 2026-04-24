"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, RotateCcw } from "lucide-react";

interface TokenPrediction {
  token: string;
  probability: number;
  isPartial?: boolean;
}

// Define the full sentence with token boundaries
const TOKENS = ["The", " capital", " of", " France", " is", " Paris", "."];
const FULL_TEXT = TOKENS.join("");

// Get predictions based on current position in the text
const getPredictions = (text: string, fullText: string = FULL_TEXT): TokenPrediction[] => {
  const lowerText = text.toLowerCase();

  if (text === "" || text.length === 0) {
    return [
      { token: "The", probability: 0.15 },
      { token: "I", probability: 0.12 },
      { token: "What", probability: 0.08 },
    ];
  }

  // Find which token we're currently in and how much is left
  let currentPos = 0;
  let currentTokenIndex = 0;

  for (let i = 0; i < TOKENS.length; i++) {
    const tokenEnd = currentPos + TOKENS[i].length;
    if (text.length <= tokenEnd) {
      currentTokenIndex = i;
      break;
    }
    currentPos = tokenEnd;
  }

  const currentToken = TOKENS[currentTokenIndex];
  const typedInToken = text.length - currentPos;
  const remainingInToken = currentToken.slice(typedInToken);

  // If we're in the middle of typing a token, show the remainder as top prediction
  if (remainingInToken.length > 0 && typedInToken > 0) {
    const prob = 0.85 + (typedInToken / currentToken.length) * 0.1; // Increases as more is typed
    return [
      { token: remainingInToken, probability: Math.min(prob, 0.98), isPartial: true },
      { token: " and", probability: 0.02 },
      { token: " the", probability: 0.01 },
    ];
  }

  // At token boundaries, show next token predictions
  if (lowerText === "the") {
    return [
      { token: " capital", probability: 0.04 },
      { token: " best", probability: 0.03 },
      { token: " first", probability: 0.03 },
    ];
  }

  if (lowerText === "the capital") {
    return [
      { token: " of", probability: 0.85 },
      { token: " city", probability: 0.08 },
      { token: " is", probability: 0.04 },
    ];
  }

  if (lowerText === "the capital of") {
    return [
      { token: " France", probability: 0.18 },
      { token: " the", probability: 0.15 },
      { token: " Japan", probability: 0.09 },
    ];
  }

  if (lowerText === "the capital of france") {
    return [
      { token: " is", probability: 0.92 },
      { token: ",", probability: 0.05 },
      { token: " was", probability: 0.02 },
    ];
  }

  if (lowerText === "the capital of france is") {
    return [
      { token: " Paris", probability: 0.94 },
      { token: " a", probability: 0.02 },
      { token: " the", probability: 0.01 },
    ];
  }

  if (lowerText === "the capital of france is paris") {
    return [
      { token: ".", probability: 0.65 },
      { token: ",", probability: 0.2 },
      { token: " which", probability: 0.08 },
    ];
  }

  if (text === fullText) {
    return [
      { token: " It", probability: 0.25 },
      { token: " The", probability: 0.18 },
      { token: " Paris", probability: 0.12 },
    ];
  }

  return [
    { token: " the", probability: 0.08 },
    { token: " and", probability: 0.06 },
    { token: " is", probability: 0.05 },
  ];
};

export function TokenPredictionDemo() {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState<TokenPrediction[]>(getPredictions(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const autoTypeRef = useRef<NodeJS.Timeout | null>(null);

  const exampleText = FULL_TEXT;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setPredictions(getPredictions(text));
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [text]);

  const startAnimation = () => {
    setText("");
    setIsPlaying(true);
    setIsComplete(false);
    let index = 0;

    const typeNext = () => {
      if (index <= exampleText.length) {
        setText(exampleText.slice(0, index));
        index++;
        autoTypeRef.current = setTimeout(typeNext, 200);
      } else {
        setIsPlaying(false);
        setIsComplete(true);
      }
    };

    typeNext();
  };

  const resetAnimation = () => {
    if (autoTypeRef.current) {
      clearTimeout(autoTypeRef.current);
    }
    setText("");
    setIsPlaying(false);
    setIsComplete(false);
  };

  useEffect(() => {
    return () => {
      if (autoTypeRef.current) {
        clearTimeout(autoTypeRef.current);
      }
    };
  }, []);

  const getProbabilityColor = (prob: number): string => {
    if (prob >= 0.7) return "bg-green-500";
    if (prob >= 0.3) return "bg-amber-500";
    return "bg-blue-500";
  };

  const getTokenStyle = (prob: number): string => {
    if (prob >= 0.7) return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
    if (prob >= 0.3) return "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200";
    return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
  };

  const formatToken = (token: string): string => {
    if (token === " ") return "␣";
    if (token.startsWith(" ")) return `␣${token.slice(1)}`;
    return token;
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <div>
          <h4 className="mt-2! font-semibold">Next Token Prediction</h4>
          <p className="text-muted-foreground mt-1 mb-0! text-sm">
            Watch how the AI predicts the next token at each step
          </p>
        </div>
        <button
          onClick={isComplete ? resetAnimation : startAnimation}
          disabled={isPlaying}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            isPlaying
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isComplete ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Replay
            </>
          ) : isPlaying ? (
            "Playing..."
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="bg-muted/30 flex min-h-[56px] items-center rounded-lg border p-4">
            <span className="font-mono text-lg">
              {text || <span className="text-muted-foreground">Press Play to start...</span>}
            </span>
            {isPlaying && <span className="ml-0.5 animate-pulse text-lg">▌</span>}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">
            {predictions[0]?.isPartial
              ? "Completing current token:"
              : "Top 3 Predicted Next Tokens:"}
          </p>
          <div className="space-y-2">
            {predictions.map((pred, index) => (
              <div
                key={`${pred.token}-${index}`}
                className={cn(
                  "bg-muted/30 rounded-lg border p-3 transition-all duration-200",
                  isAnimating && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                        index === 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          : index === 1
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-1 text-sm font-medium transition-all",
                        getTokenStyle(pred.probability)
                      )}
                    >
                      {formatToken(pred.token)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          getProbabilityColor(pred.probability)
                        )}
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-14 text-right font-mono text-sm">
                      {(pred.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 mt-4 rounded-lg border p-3">
          <p className="text-muted-foreground m-0! text-xs">
            <strong>How it works:</strong> At each step, the model calculates probabilities for all
            possible next tokens (~50,000+). The highest probability token is selected, then the
            process repeats.
          </p>
        </div>
      </div>
    </div>
  );
}

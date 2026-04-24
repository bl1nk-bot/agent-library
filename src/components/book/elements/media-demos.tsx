"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Text-to-Image Demo
const imagePromptOptions: Record<string, string[]> = {
  subject: ["a cat", "a robot", "a castle", "an astronaut", "a forest"],
  style: ["photorealistic", "oil painting", "anime style", "watercolor", "3D render"],
  lighting: ["golden hour", "dramatic shadows", "soft diffused", "neon glow", "moonlight"],
  composition: [
    "close-up portrait",
    "wide landscape",
    "aerial view",
    "symmetrical",
    "rule of thirds",
  ],
  mood: ["peaceful", "mysterious", "energetic", "melancholic", "whimsical"],
};

const imagePartColors: Record<string, { bg: string; border: string; text: string }> = {
  subject: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
  },
  style: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-300 dark:border-purple-700",
    text: "text-purple-700 dark:text-purple-300",
  },
  lighting: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
  },
  composition: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
  },
  mood: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-300 dark:border-rose-700",
    text: "text-rose-700 dark:text-rose-300",
  },
};

export function TextToImageDemo() {
  const [selections, setSelections] = useState<Record<string, number>>({
    subject: 0,
    style: 0,
    lighting: 0,
    composition: 0,
    mood: 0,
  });
  const [step, setStep] = useState(0);

  const categories = Object.keys(imagePromptOptions);

  const buildPrompt = () => {
    return categories.map((cat) => imagePromptOptions[cat][selections[cat]]).join(", ");
  };

  const handleSelect = (category: string, index: number) => {
    setSelections((prev) => ({ ...prev, [category]: index }));
  };

  const simulateDiffusion = () => {
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          return 5;
        }
        return prev + 1;
      });
    }, 600);
  };

  const noiseLevel = Math.max(0, 100 - step * 20);

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <h4 className="mt-2! font-semibold">Text-to-Image: Build Your Prompt</h4>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mt-0! mb-4 text-sm">
          Select options from each category to build an image prompt:
        </p>

        <div className="mb-4 space-y-3">
          {categories.map((category) => {
            const colors = imagePartColors[category];
            return (
              <div key={category} className="flex flex-wrap items-center gap-2">
                <span className={cn("w-24 text-xs font-medium capitalize", colors.text)}>
                  {category}:
                </span>
                <div className="flex flex-wrap gap-1">
                  {imagePromptOptions[category].map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(category, index)}
                      className={cn(
                        "rounded border px-2 py-1 text-xs transition-all",
                        selections[category] === index
                          ? cn(colors.bg, colors.border, colors.text)
                          : "bg-muted/30 hover:bg-muted/50 border-transparent"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/30 mb-4 rounded-lg p-3">
          <p className="text-muted-foreground mt-0! mb-1 text-xs font-medium">Generated Prompt:</p>
          <p className="m-0! font-mono text-sm">{buildPrompt()}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <button
              onClick={simulateDiffusion}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mb-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Simulate Diffusion Process
            </button>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all",
                      step >= s ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {s}
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      step >= s ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s === 1 && "Start from random noise"}
                    {s === 2 && "Detect rough shapes"}
                    {s === 3 && "Add basic colors & forms"}
                    {s === 4 && "Refine details"}
                    {s === 5 && "Final image"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed transition-all duration-500"
              style={{
                background:
                  step === 0
                    ? "repeating-conic-gradient(#666 0% 25%, #999 25% 50%) 50% / 8px 8px"
                    : step < 5
                      ? `linear-gradient(135deg, hsl(${200 + selections.mood * 30}, ${40 + step * 10}%, ${50 + step * 5}%), hsl(${250 + selections.style * 20}, ${30 + step * 12}%, ${40 + step * 8}%))`
                      : `linear-gradient(135deg, hsl(${200 + selections.mood * 30}, 70%, 60%), hsl(${250 + selections.style * 20}, 60%, 50%))`,
                filter: `blur(${noiseLevel / 10}px)`,
              }}
            >
              {step === 5 && (
                <span className="px-2 text-center text-xs font-medium text-white drop-shadow-lg">
                  {imagePromptOptions.subject[selections.subject]}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-muted-foreground m-0! mt-4 text-xs">
          Real diffusion models run thousands of steps, gradually removing noise until a coherent
          image emerges.
        </p>
      </div>
    </div>
  );
}

// Text-to-Video Demo
const videoPromptOptions = {
  subject: ["A bird", "A car", "A person", "A wave", "A flower"],
  action: [
    "takes flight",
    "drives down a road",
    "walks through rain",
    "crashes on rocks",
    "blooms in timelapse",
  ],
  camera: ["static shot", "slow pan left", "dolly zoom", "aerial tracking", "handheld follow"],
  duration: ["2 seconds", "4 seconds", "6 seconds", "8 seconds", "10 seconds"],
};

export function TextToVideoDemo() {
  const [selections, setSelections] = useState({ subject: 0, action: 0, camera: 1, duration: 1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 12;

  const buildPrompt = () => {
    return `${videoPromptOptions.subject[selections.subject]} ${videoPromptOptions.action[selections.action]}, ${videoPromptOptions.camera[selections.camera]}, ${videoPromptOptions.duration[selections.duration]}`;
  };

  const handleSelect = (category: keyof typeof selections, index: number) => {
    setSelections((prev) => ({ ...prev, [category]: index }));
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const playVideo = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentFrame(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= totalFrames - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const categories = [
    { key: "subject" as const, label: "Subject", color: "blue" },
    { key: "action" as const, label: "Action", color: "green" },
    { key: "camera" as const, label: "Camera", color: "purple" },
    { key: "duration" as const, label: "Duration", color: "amber" },
  ];

  const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-300 dark:border-blue-700",
      text: "text-blue-700 dark:text-blue-300",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-300 dark:border-green-700",
      text: "text-green-700 dark:text-green-300",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-300 dark:border-purple-700",
      text: "text-purple-700 dark:text-purple-300",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-300 dark:border-amber-700",
      text: "text-amber-700 dark:text-amber-300",
    },
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <h4 className="mt-2! font-semibold">Text-to-Video: Build Your Prompt</h4>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mt-0! mb-4 text-sm">
          Video prompts need motion, camera work, and timing:
        </p>

        <div className="mb-4 space-y-3">
          {categories.map(({ key, label, color }) => {
            const colors = categoryColors[color];
            const options = videoPromptOptions[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-2">
                <span className={cn("w-20 text-xs font-medium", colors.text)}>{label}:</span>
                <div className="flex flex-wrap gap-1">
                  {options.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(key, index)}
                      className={cn(
                        "rounded border px-2 py-1 text-xs transition-all",
                        selections[key] === index
                          ? cn(colors.bg, colors.border, colors.text)
                          : "bg-muted/30 hover:bg-muted/50 border-transparent"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/30 mb-4 rounded-lg p-3">
          <p className="text-muted-foreground mt-0! mb-1 text-xs font-medium">Generated Prompt:</p>
          <p className="m-0! font-mono text-sm">{buildPrompt()}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <button
              onClick={playVideo}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mb-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              {isPlaying ? "Stop" : "Play Animation"}
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-16 text-xs">Frame:</span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all duration-200"
                    style={{ width: `${(currentFrame / (totalFrames - 1)) * 100}%` }}
                  />
                </div>
                <span className="w-12 font-mono text-xs">
                  {currentFrame + 1}/{totalFrames}
                </span>
              </div>

              <div className="text-muted-foreground mt-3 space-y-1 text-xs">
                <p>
                  <strong>Consistency:</strong> Subject stays the same across frames
                </p>
                <p>
                  <strong>Motion:</strong> Position changes smoothly over time
                </p>
                <p>
                  <strong>Physics:</strong> Movement follows natural laws
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div
              className="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-lg border-2"
              style={{
                background: `linear-gradient(${135 + currentFrame * 3}deg, hsl(${200 + selections.subject * 30}, 50%, 70%), hsl(${240 + selections.action * 20}, 40%, 50%))`,
              }}
            >
              <div
                className="absolute text-2xl transition-all duration-200"
                style={{
                  transform: `translateX(${(currentFrame - 6) * (selections.camera === 1 ? 8 : selections.camera === 3 ? 5 : 0)}px) translateY(${selections.action === 0 ? -currentFrame * 3 : 0}px)`,
                  opacity: 0.9,
                }}
              >
                {selections.subject === 0 && "🐦"}
                {selections.subject === 1 && "🚗"}
                {selections.subject === 2 && "🚶"}
                {selections.subject === 3 && "🌊"}
                {selections.subject === 4 && "🌸"}
              </div>
            </div>
            <p className="text-muted-foreground m-0! text-xs">Simplified animation preview</p>
          </div>
        </div>

        <p className="text-muted-foreground m-0! mt-4 text-xs">
          Real video models generate 24-60 frames per second with photorealistic detail and
          consistent subjects.
        </p>
      </div>
    </div>
  );
}

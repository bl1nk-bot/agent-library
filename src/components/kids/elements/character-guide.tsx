"use client";

import { cn } from "@/lib/utils";

type PromiMood = "happy" | "thinking" | "excited" | "confused" | "celebrating";

interface PromiCharacterProps {
  mood?: PromiMood;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

const moodEmojis: Record<PromiMood, string> = {
  happy: "😊",
  thinking: "🤔",
  excited: "🤩",
  confused: "😵‍💫",
  celebrating: "🎉",
};

const sizeClasses = {
  sm: "w-12 h-12 text-2xl",
  md: "w-20 h-20 text-4xl",
  lg: "w-28 h-28 text-5xl",
};

export function PromiCharacter({
  mood = "happy",
  size = "md",
  className,
  animate = true,
}: PromiCharacterProps) {
  return (
    <div
      className={cn(
        "from-primary/20 border-primary/30 relative flex items-center justify-center rounded-full border-4 bg-gradient-to-br to-purple-500/20",
        sizeClasses[size],
        animate && "animate-float",
        className
      )}
    >
      {/* Robot face */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative">
          🤖
          {/* Mood indicator */}
          <span className="absolute -right-1 -bottom-1 text-lg">{moodEmojis[mood]}</span>
        </span>
      </div>
    </div>
  );
}

interface SpeechBubbleProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "bottom";
  className?: string;
}

export function SpeechBubble({ children, direction = "right", className }: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        "dark:bg-card border-primary/20 relative rounded-2xl border-2 bg-white p-4 shadow-lg",
        className
      )}
    >
      {children}
      {/* Speech bubble tail */}
      <div
        className={cn(
          "dark:bg-card border-primary/20 absolute h-4 w-4 rotate-45 border-2 bg-white",
          direction === "left" && "top-1/2 -left-2 -translate-y-1/2 border-t-0 border-r-0",
          direction === "right" && "top-1/2 -right-2 -translate-y-1/2 border-b-0 border-l-0",
          direction === "bottom" && "-bottom-2 left-1/2 -translate-x-1/2 border-t-0 border-l-0"
        )}
      />
    </div>
  );
}

interface PromiWithMessageProps {
  message: string;
  mood?: PromiMood;
  promiPosition?: "left" | "right";
}

export function PromiWithMessage({
  message,
  mood = "happy",
  promiPosition = "left",
}: PromiWithMessageProps) {
  return (
    <div
      className={cn("my-6 flex items-start gap-4", promiPosition === "right" && "flex-row-reverse")}
    >
      <PromiCharacter mood={mood} size="md" />
      <SpeechBubble direction={promiPosition === "left" ? "left" : "right"} className="flex-1">
        <p className="m-0 text-base leading-relaxed">{message}</p>
      </SpeechBubble>
    </div>
  );
}

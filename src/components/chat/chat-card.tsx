"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Bot, User } from "lucide-react";

interface Message {
  role: string;
  content: string;
  agent?: string; // Gemini, Claude, System
}

interface ChatCardProps {
  message: Message;
}

export function ChatCard({ message }: ChatCardProps) {
  const isAI = message.role === "assistant" || message.role === "system";

  // Determine accent color based on agent
  let accentColor = "border-l-agent-cyan"; // Default System
  let Icon = Bot;

  if (message.agent === "Gemini") {
    accentColor = "border-l-agent-gold";
    Icon = Sparkles;
  } else if (message.agent === "Claude") {
    accentColor = "border-l-agent-sapphire";
  }

  if (!isAI) {
    // User Message Style - Minimal, Right Aligned (or Left but distinct)
    // As per spec: "username@foundry:~$ [command]" style
    return (
      <div className="group flex w-full justify-start py-4">
        <div className="flex items-center gap-2 font-mono text-sm text-green-500 opacity-80 transition-opacity group-hover:opacity-100">
          <span className="text-white/40">user@foundry:~$</span>
          <span className="text-agent-cyan">{message.content}</span>
        </div>
      </div>
    );
  }

  // AI Response Style - Deep Glass Card
  return (
    <div
      data-testid="chat-card"
      className={cn(
        "my-2 w-full rounded-r-lg border-y border-r border-l-2 border-white/5 bg-[#0A0A0A]/80 p-6 shadow-lg backdrop-blur-md",
        accentColor
      )}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-xs tracking-widest uppercase opacity-50">
        <Icon size={12} />
        <span>{message.agent || "System"}</span>
      </div>
      <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300">
        {message.content}
      </div>

      {/* Interaction Actions (Hover) */}
      <div className="mt-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Action buttons will go here */}
      </div>
    </div>
  );
}

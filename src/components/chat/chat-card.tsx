"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Bot, User } from 'lucide-react';

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
      <div className="w-full flex justify-start py-4 group">
        <div className="font-mono text-sm text-green-500 flex gap-2 items-center opacity-80 group-hover:opacity-100 transition-opacity">
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
        "w-full my-2 p-6 rounded-r-lg border-l-2 bg-[#0A0A0A]/80 border-y border-r border-white/5 backdrop-blur-md shadow-lg",
        accentColor
      )}
    >
      <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest opacity-50">
        <Icon size={12} />
        <span>{message.agent || "System"}</span>
      </div>
      <div className="prose prose-invert max-w-none text-sm leading-relaxed text-gray-300">
        {message.content}
      </div>
      
      {/* Interaction Actions (Hover) */}
      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         {/* Action buttons will go here */}
      </div>
    </div>
  );
}

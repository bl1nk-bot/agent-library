"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Command, ChevronRight, Sparkles, Zap } from "lucide-react";

export function OmniBar() {
  const [value, setValue] = useState("");
  const [activeAgent, setActiveAgent] = useState("System");

  return (
    <div className="glass-panel focus-within:border-agent-cyan/30 mx-auto flex w-full max-w-3xl items-center gap-2 rounded-lg p-1 transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.15)]">
      {/* Agent Switcher */}
      <button
        data-testid="agent-switcher"
        className="focus-visible:ring-agent-cyan text-agent-cyan flex items-center gap-2 rounded border border-white/5 bg-white/5 px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Switch agent, current agent: ${activeAgent}`}
      >
        <Sparkles size={12} aria-hidden="true" />
        {activeAgent}
      </button>

      <div className="mx-1 h-6 w-px bg-white/10" />

      {/* Input Area */}
      <div className="relative flex flex-1 items-center">
        <ChevronRight size={16} className="absolute left-0 text-white/30" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a command or ask AI..."
          aria-label="Command input"
          className="h-10 w-full border-none bg-transparent pl-6 font-mono text-sm text-white outline-none placeholder:text-white/20 focus:ring-0"
        />
      </div>

      {/* Action Hints */}
      <div
        className="hidden items-center gap-2 px-2 font-mono text-[10px] text-white/30 md:flex"
        aria-hidden="true"
      >
        <span className="rounded border border-white/10 px-1.5 py-0.5">⌘K</span>
        <span>CMDS</span>
      </div>

      <button
        className="bg-agent-cyan/10 text-agent-cyan hover:bg-agent-cyan/20 focus-visible:ring-agent-cyan rounded p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Execute command"
      >
        <Zap size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

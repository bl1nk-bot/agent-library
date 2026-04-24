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
        className="flex items-center gap-2 px-3 py-2 rounded bg-white/5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-agent-cyan focus-visible:outline-none transition-colors border border-white/5 text-xs font-mono text-agent-cyan uppercase tracking-wider"
        aria-label={`Switch agent, current agent: ${activeAgent}`}
      >
        <Sparkles size={12} aria-hidden="true" />
        {activeAgent}
      </button>

      <div className="mx-1 h-6 w-px bg-white/10" />

      {/* Input Area */}
      <div className="flex-1 flex items-center relative">
        <ChevronRight size={16} className="text-white/30 absolute left-0" aria-hidden="true" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a command or ask AI..."
          aria-label="Command input"
          className="w-full bg-transparent border-none outline-none focus:ring-0 pl-6 text-sm text-white font-mono placeholder:text-white/20 h-10"
        />
      </div>

      {/* Action Hints */}
      <div className="hidden md:flex items-center gap-2 px-2 text-[10px] text-white/30 font-mono" aria-hidden="true">
        <span className="border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
        <span>CMDS</span>
      </div>
      
      <button
        className="p-2 rounded bg-agent-cyan/10 text-agent-cyan hover:bg-agent-cyan/20 focus-visible:ring-2 focus-visible:ring-agent-cyan focus-visible:outline-none transition-colors"
        aria-label="Execute command"
      >
        <Zap size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

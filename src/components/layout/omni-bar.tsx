"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Command, ChevronRight, Sparkles, Zap } from 'lucide-react';

export function OmniBar() {
  const [value, setValue] = useState("");
  const [activeAgent, setActiveAgent] = useState("System");

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-lg p-1 flex items-center gap-2 transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(0,229,255,0.15)] focus-within:border-agent-cyan/30">
      
      {/* Agent Switcher */}
      <button 
        data-testid="agent-switcher"
        className="flex items-center gap-2 px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-xs font-mono text-agent-cyan uppercase tracking-wider"
      >
        <Sparkles size={12} />
        {activeAgent}
      </button>

      <div className="h-6 w-px bg-white/10 mx-1" />

      {/* Input Area */}
      <div className="flex-1 flex items-center relative">
        <ChevronRight size={16} className="text-white/30 absolute left-0" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a command or ask AI..."
          className="w-full bg-transparent border-none outline-none focus:ring-0 pl-6 text-sm text-white font-mono placeholder:text-white/20 h-10"
        />
      </div>

      {/* Action Hints */}
      <div className="hidden md:flex items-center gap-2 px-2 text-[10px] text-white/30 font-mono">
        <span className="border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
        <span>CMDS</span>
      </div>
      
      <button className="p-2 rounded bg-agent-cyan/10 text-agent-cyan hover:bg-agent-cyan/20 transition-colors">
        <Zap size={16} />
      </button>
    </div>
  );
}

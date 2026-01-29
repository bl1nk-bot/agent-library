"use client";

import React from 'react';
import { Pin, Trash2, FileText, Database } from 'lucide-react';

export function ContextPanel() {
  const pinnedItems = [
    { id: 1, type: "file", title: "schema.prisma", snippet: "model User { id String... }" },
    { id: 2, type: "memory", title: "Project Goal", snippet: "Build a luxury AI command interface" },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-white/40">Active Context</h3>
        <span className="w-2 h-2 rounded-full bg-agent-cyan animate-pulse shadow-[0_0_8px_cyan]" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {pinnedItems.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-white/5 border border-white/5 p-3 rounded hover:border-white/20 transition-all duration-300 hover:bg-white/10"
          >
            <div className="flex items-center gap-2 mb-2 text-agent-cyan/70">
              {item.type === "file" ? <FileText size={12} /> : <Database size={12} />}
              <span className="text-xs font-mono truncate">{item.title}</span>
            </div>
            <div className="text-[10px] text-white/50 font-mono line-clamp-3 bg-black/30 p-2 rounded">
              {item.snippet}
            </div>
            
            {/* Actions */}
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Metrics / Stats at bottom */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>TOKENS: 4,203</span>
          <span>CTX: 12%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
          <div className="h-full w-[12%] bg-agent-cyan/50" />
        </div>
      </div>
    </div>
  );
}

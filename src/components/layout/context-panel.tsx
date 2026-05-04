"use client";

import React from "react";
import { Pin, Trash2, FileText, Database } from "lucide-react";

export function ContextPanel() {
  const pinnedItems = [
    { id: 1, type: "file", title: "schema.prisma", snippet: "model User { id String... }" },
    {
      id: 2,
      type: "memory",
      title: "Project Goal",
      snippet: "Build a luxury AI command interface",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b border-white/5 p-4">
        <h3 className="font-mono text-xs tracking-widest text-white/40 uppercase">
          Active Context
        </h3>
        <span className="bg-agent-cyan h-2 w-2 animate-pulse rounded-full shadow-[0_0_8px_cyan]" />
      </div>

      <div className="scrollbar-thin scrollbar-thumb-white/10 flex-1 space-y-3 overflow-y-auto p-4">
        {pinnedItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded border border-white/5 bg-white/5 p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            <div className="text-agent-cyan/70 mb-2 flex items-center gap-2">
              {item.type === "file" ? <FileText size={12} /> : <Database size={12} />}
              <span className="truncate font-mono text-xs">{item.title}</span>
            </div>
            <div className="line-clamp-3 rounded bg-black/30 p-2 font-mono text-[10px] text-white/50">
              {item.snippet}
            </div>

            {/* Actions */}
            <button
              className="focus-visible:ring-agent-cyan absolute top-2 right-2 rounded text-white/30 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-400 focus-visible:text-red-400 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
              aria-label={`Remove ${item.title}`}
            >
              <Trash2 size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* Metrics / Stats at bottom */}
      <div className="border-t border-white/5 bg-black/20 p-4">
        <div className="flex justify-between font-mono text-[10px] text-white/30">
          <span>TOKENS: 4,203</span>
          <span>CTX: 12%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className="bg-agent-cyan/50 h-full w-[12%]" />
        </div>
      </div>
    </div>
  );
}

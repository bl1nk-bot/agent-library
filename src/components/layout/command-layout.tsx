"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommandLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  contextPanel: React.ReactNode;
  className?: string;
}

export function CommandLayout({ children, sidebar, contextPanel, className }: CommandLayoutProps) {
  return (
    <div
      data-testid="command-layout-container"
      className={cn("flex h-screen w-full flex-row overflow-hidden bg-[#050505]", className)}
    >
      {/* Left Sidebar - Engine Rack */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-30 h-full w-16 flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl md:w-20 lg:w-64"
      >
        {sidebar}
      </motion.aside>

      {/* Main Content - The Stream */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="relative z-10 flex h-full min-w-0 flex-1 flex-col"
      >
        <div className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>

        {/* Omni-Bar Area (Floating at bottom) */}
        <div className="pointer-events-none absolute right-0 bottom-6 left-0 px-4 md:px-8">
          <div className="pointer-events-auto mx-auto max-w-3xl">
            {/* OmniBar slot will be injected here later or via children */}
          </div>
        </div>
      </motion.div>

      {/* Right Sidebar - Active Context Rack */}
      <motion.aside
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="z-20 hidden h-full w-80 flex-shrink-0 flex-col border-l border-white/5 bg-black/20 backdrop-blur-md xl:flex"
      >
        {contextPanel}
      </motion.aside>
    </div>
  );
}

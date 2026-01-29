"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CommandLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  contextPanel: React.ReactNode;
  className?: string;
}

export function CommandLayout({ 
  children, 
  sidebar, 
  contextPanel,
  className 
}: CommandLayoutProps) {
  return (
    <div 
      data-testid="command-layout-container"
      className={cn(
        "h-screen w-full overflow-hidden bg-[#050505] flex flex-row",
        className
      )}
    >
      {/* Left Sidebar - Engine Rack */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-16 md:w-20 lg:w-64 h-full border-r border-white/5 bg-black/40 backdrop-blur-xl flex-shrink-0 z-30"
      >
        {sidebar}
      </motion.aside>

      {/* Main Content - The Stream */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="flex-1 h-full relative flex flex-col min-w-0 z-10"
      >
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 md:p-6 lg:p-8">
          {children}
        </div>
        
        {/* Omni-Bar Area (Floating at bottom) */}
        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-8 pointer-events-none">
           <div className="pointer-events-auto max-w-3xl mx-auto">
             {/* OmniBar slot will be injected here later or via children */}
           </div>
        </div>
      </motion.div>

      {/* Right Sidebar - Active Context Rack */}
      <motion.aside 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="hidden xl:flex w-80 h-full border-l border-white/5 bg-black/20 backdrop-blur-md flex-shrink-0 z-20 flex-col"
      >
        {contextPanel}
      </motion.aside>
    </div>
  );
}

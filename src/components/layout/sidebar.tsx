"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Home, Command, Box, Settings, Cpu, Terminal, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Command, label: "Agents", href: "/agents" },
    { icon: Box, label: "Marketplace", href: "/marketplace" },
    { icon: BookOpen, label: "Knowledge", href: "/knowledge" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const activeAgents = [
    { name: "System", color: "bg-agent-cyan", status: "active" },
    { name: "Gemini", color: "bg-agent-gold", status: "idle" },
    { name: "Claude", color: "bg-agent-sapphire", status: "active" },
  ];

  return (
    <div className="flex flex-col h-full py-6 items-center w-full">
      {/* Logo / Brand */}
      <div className="mb-8">
        <div className="w-8 h-8 bg-white/10 rounded-sm border border-white/20 flex items-center justify-center">
          <Terminal size={16} className="text-agent-cyan" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              aria-label={item.label}
              className={cn(
                "p-3 rounded-md flex items-center justify-center transition-all duration-300 group relative",
                isActive ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              {/* Tooltip on Hover */}
              <span className="absolute left-14 bg-black/80 backdrop-blur-md border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Agent Status Indicators (Engine Rack) */}
      <div className="mt-auto flex flex-col gap-3 w-full px-4 items-center">
        <div className="w-full h-px bg-white/10 mb-2" />
        {activeAgents.map((agent) => (
          <div 
            key={agent.name} 
            className="group relative w-full flex justify-center"
            data-testid="agent-status-indicator"
          >
            <div className={cn(
              "w-1.5 h-8 rounded-full transition-all duration-500",
              agent.color,
              agent.status === "active" ? "shadow-[0_0_10px_currentColor] animate-pulse" : "opacity-30"
            )} />
             <span className="absolute left-10 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {agent.name}: {agent.status.toUpperCase()}
              </span>
          </div>
        ))}
        <div className="mt-4 text-[10px] font-mono text-white/20">v2.0</div>
      </div>
    </div>
  );
}

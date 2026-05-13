"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Command,
  Box,
  Settings,
  Cpu,
  Terminal,
  Sparkles,
  BookOpen,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setLocale } from "@/lib/i18n/client";

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

  const toggleLanguage = () => {
    // Basic toggle between EN and TH for quick access in sidebar
    // In a full implementation, this could open a small glass menu
    const newLocale = window.location.pathname.startsWith("/th") ? "en" : "th";
    setLocale(newLocale);
  };

  return (
    <div className="flex h-full w-full flex-col items-center py-6">
      {/* Logo / Brand */}
      <div className="mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/20 bg-white/10">
          <Terminal size={16} className="text-agent-cyan" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex w-full flex-1 flex-col gap-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "group relative flex items-center justify-center rounded-md p-3 transition-all duration-300",
                isActive
                  ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {/* Tooltip on Hover */}
              <span className="pointer-events-none absolute left-14 z-50 rounded border border-white/10 bg-black/80 px-2 py-1 text-xs whitespace-nowrap opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle & Agent Status */}
      <div className="mt-auto flex w-full flex-col items-center gap-3 px-4">
        <button
          onClick={toggleLanguage}
          className="group relative mb-2 rounded-md p-3 text-white/40 transition-all hover:bg-white/5 hover:text-white"
          aria-label="Toggle Language"
        >
          <Globe size={20} />
          <span className="pointer-events-none absolute left-14 z-50 rounded border border-white/10 bg-black/80 px-2 py-1 font-mono text-[10px] whitespace-nowrap uppercase opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
            Toggle EN/TH
          </span>
        </button>

        <div className="mb-2 h-px w-full bg-white/10" />

        {activeAgents.map((agent) => (
          <div
            key={agent.name}
            className="group relative flex w-full justify-center"
            data-testid="agent-status-indicator"
          >
            <div
              className={cn(
                "h-8 w-1.5 rounded-full transition-all duration-500",
                agent.color,
                agent.status === "active"
                  ? "animate-pulse shadow-[0_0_10px_currentColor]"
                  : "opacity-30"
              )}
            />
            <span className="pointer-events-none absolute top-1/2 left-10 z-50 -translate-y-1/2 rounded border border-white/10 bg-black/80 px-2 py-1 font-mono text-[10px] whitespace-nowrap opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
              {agent.name}: {agent.status.toUpperCase()}
            </span>
          </div>
        ))}
        <div className="mt-4 font-mono text-[10px] text-white/20">v2.0</div>
      </div>
    </div>
  );
}

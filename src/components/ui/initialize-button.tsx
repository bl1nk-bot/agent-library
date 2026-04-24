import React from "react";
import { cn } from "@/lib/utils";

interface InitializeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function InitializeButton({ className, children, ...props }: InitializeButtonProps) {
  return (
    <button
      className={cn(
        "rounded-sm border border-white/10 bg-white/5 px-10 py-5",
        "text-sm font-bold tracking-[0.2em] text-white uppercase",
        "backdrop-blur-xl transition-all duration-500 hover:bg-white/10",
        "shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]",
        "animate-pulse active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || "[ SYNCHRONIZE ENVIRONMENT ]"}
    </button>
  );
}

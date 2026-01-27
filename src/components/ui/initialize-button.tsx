import React from 'react';
import { cn } from '@/lib/utils';

interface InitializeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function InitializeButton({ className, ...props }: InitializeButtonProps) {
  return (
    <button
      className={cn(
        "px-10 py-5 bg-white/5 border border-white/10 rounded-sm",
        "text-white font-bold tracking-[0.2em] uppercase text-sm",
        "hover:bg-white/10 transition-all duration-500 backdrop-blur-xl",
        "shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]",
        "animate-pulse active:scale-95",
        className
      )}
      {...props}
    >
      [ INITIALIZE DECK ]
    </button>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Background({ children, className, ...props }: BackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white",
        className
      )}
      {...props}
    >
      <div
        data-testid="noise-overlay"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

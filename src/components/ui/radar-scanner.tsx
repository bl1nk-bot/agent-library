import React from 'react';
import { cn } from '@/lib/utils';

export function RadarScanner({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-64 h-64 flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        data-testid="radar-svg"
      >
        {/* Concentric Circles */}
        <circle cx="100" cy="100" r="98" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" fill="none" data-testid="radar-circle" />
        <circle cx="100" cy="100" r="70" stroke="rgba(34, 197, 94, 0.15)" strokeWidth="1" fill="none" data-testid="radar-circle" />
        <circle cx="100" cy="100" r="40" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1" fill="none" data-testid="radar-circle" />
        
        {/* Crosshair lines */}
        <line x1="100" y1="2" x2="100" y2="198" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1" />
        <line x1="2" y1="100" x2="198" y2="100" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="1" />

        {/* Sweep Line with Animation */}
        <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="2"
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            strokeLinecap="round"
            data-testid="radar-sweep"
          />
          {/* Subtle trail using a rotating gradient or multiple lines if needed */}
          <circle 
            cx="100" 
            cy="100" 
            r="98" 
            fill="url(#radarGradient)" 
            opacity="0.1"
          />
          <defs>
            <linearGradient id="radarGradient" x1="50%" y1="0%" x2="50%" y2="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 1)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </linearGradient>
          </defs>
        </g>
      </svg>
      
      {/* Central Point */}
      <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
    </div>
  );
}

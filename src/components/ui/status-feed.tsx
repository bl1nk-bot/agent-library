"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface StatusFeedProps {
  messages: string[];
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function StatusFeed({ 
  messages, 
  delay = 800, 
  className, 
  onComplete 
}: StatusFeedProps) {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, messages[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, messages, delay, onComplete]);

  return (
    <div 
      data-testid="status-feed"
      className={cn("font-mono text-green-500 text-sm space-y-1", className)}
    >
      {visibleMessages.map((msg, i) => (
        <div 
          key={i} 
          className="animate-in fade-in slide-in-from-left-2 duration-500"
        >
          {msg}
        </div>
      ))}
      {currentIndex < messages.length && (
        <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1 align-middle" />
      )}
    </div>
  );
}

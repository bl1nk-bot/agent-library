"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  onError?: () => void;
  className?: string;
  compact?: boolean;
}

const BARS = 32;

export function AudioPlayer({ src, onError, className, compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedHeights, setAnimatedHeights] = useState<number[]>(Array(BARS).fill(0.15));

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Generate static waveform pattern based on src
  const baseHeights = useMemo(() => {
    const seed = src.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: BARS }, (_, i) => {
      const pseudo = Math.abs((Math.sin(seed + i * 12.9898) * 43758.5453) % 1);
      return 0.2 + pseudo * 0.6;
    });
  }, [src]);

  // Animate waveform when playing
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setAnimatedHeights(baseHeights.map((h) => h * 0.5));
      return;
    }

    let phase = 0;
    const animate = () => {
      phase += 0.15;
      const newHeights = baseHeights.map((base, i) => {
        const wave = Math.sin(phase + i * 0.3) * 0.3 + 0.7;
        const beat = Math.sin(phase * 2 + i * 0.1) * 0.2 + 0.8;
        return Math.min(1, base * wave * beat);
      });
      setAnimatedHeights(newHeights);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, baseHeights]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      onError?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [onError]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (e) {
      console.error("Playback error:", e);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("bg-muted/50 flex items-center gap-3 rounded-lg p-3", className)}>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* Play button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!isLoaded}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </button>

      {/* Waveform */}
      <div className="flex h-8 min-w-0 flex-1 cursor-pointer items-center" onClick={handleSeek}>
        <div className="flex h-full flex-1 items-center gap-[2px]">
          {animatedHeights.map((height, i) => {
            const barProgress = ((i + 1) / BARS) * 100;
            const isActive = barProgress <= progress;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full transition-all duration-75",
                  isActive ? "bg-primary" : "bg-muted-foreground/30"
                )}
                style={{ height: `${height * 100}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Countdown timer */}
      {!compact && (
        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
          {formatTime(Math.max(0, duration - currentTime))}
        </span>
      )}

      {/* Mute button */}
      {!compact && (
        <button
          type="button"
          onClick={toggleMute}
          className="hover:bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors"
        >
          {isMuted ? (
            <VolumeX className="text-muted-foreground h-3.5 w-3.5" />
          ) : (
            <Volume2 className="text-muted-foreground h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

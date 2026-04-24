"use client";

import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

export function CliCommand() {
  const t = useTranslations("homepage");
  const tCommon = useTranslations("common");
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [copied, setCopied] = useState(false);
  const command = "npx prompts.chat";

  useEffect(() => {
    if (isHovered) {
      setDisplayedText("");
      let index = 0;
      const interval = setInterval(() => {
        if (index < command.length) {
          setDisplayedText(command.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    } else {
      setDisplayedText("");
    }
  }, [isHovered]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
    }
  };

  return (
    <div className="relative">
      {/* Copied tooltip */}
      <span
        className={`absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white transition-all duration-200 ${
          copied ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {tCommon("copied")}
      </span>
      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group inline-flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 transition-all duration-300 hover:bg-zinc-800 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      >
        <Terminal className="h-4 w-4 shrink-0 text-green-400" />
        <div className="relative flex h-5 items-center overflow-hidden">
          {/* Grid container for smooth width animation */}
          <div
            className="grid transition-all duration-500 ease-out"
            style={{ gridTemplateColumns: isHovered ? "0fr 1fr" : "1fr 0fr" }}
          >
            {/* Default label */}
            <span
              className={`overflow-hidden text-sm font-medium whitespace-nowrap text-zinc-100 transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              {t("commandLine")}
            </span>
            {/* Hover state - command with typewriter (force LTR for CLI) */}
            <code
              dir="ltr"
              className={`overflow-hidden font-mono text-sm whitespace-nowrap text-zinc-100 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-zinc-400">$ </span>
              {displayedText}
              <span className="animate-pulse">▌</span>
            </code>
          </div>
        </div>
      </button>
    </div>
  );
}

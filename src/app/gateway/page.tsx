"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Background } from "@/components/ui/background";
import { RadarScanner } from "@/components/ui/radar-scanner";
import { StatusFeed } from "@/components/ui/status-feed";
import { InitializeButton } from "@/components/ui/initialize-button";

export default function GatewayPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessages, setScanMessages] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  // Configuration simulation messages
  const configMessages = [
    "[SYSTEM] Initiating scan protocol...",
    "[CHECK] Locating configuration files...",
    "[FOUND] gemini.json detected in workspace root",
    "[FOUND] Local environment variables loaded",
    "[SYNC] Synchronizing with Agent Registry...",
    "[SUCCESS] Environment synchronized. Ready.",
  ];

  const handleSynchronize = () => {
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning && scanMessages.length < configMessages.length) {
      const timer = setTimeout(() => {
        setScanMessages((prev) => [...prev, configMessages[prev.length]]);
      }, 800); // Simulate processing time per step
      return () => clearTimeout(timer);
    } else if (isScanning && scanMessages.length === configMessages.length) {
      // Scan complete, initiate exit sequence
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        // Simulate navigation
        console.log("Navigating to Command Deck...");
      }, 1500);
      return () => clearTimeout(exitTimer);
    }
  }, [isScanning, scanMessages, configMessages]);

  return (
    <Background role="main">
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="motion-div-check flex w-full max-w-lg flex-col items-center gap-12 px-6"
          >
            {/* Radar Scanner Component */}
            <div className="relative">
              <RadarScanner className={isScanning ? "animate-[spin_2s_linear_infinite]" : ""} />
              {isScanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] bg-green-500/50 blur-sm" />
                </div>
              )}
            </div>

            {/* Status Feed Area */}
            <div className="relative flex h-40 w-full flex-col items-start justify-start overflow-hidden rounded-md border border-white/5 bg-black/20 p-4 backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-1 font-mono text-[10px] text-white/20">
                LOG_STREAM
              </div>
              {isScanning ? (
                <StatusFeed messages={scanMessages} delay={50} />
              ) : (
                <div className="font-mono text-sm text-white/30 italic">
                  System standby. Waiting for synchronization...
                </div>
              )}
            </div>

            <InitializeButton
              onClick={handleSynchronize}
              disabled={isScanning}
              className={isScanning ? "opacity-50" : ""}
            >
              {isScanning
                ? scanMessages.length === configMessages.length
                  ? "[ COMPLETE ]"
                  : "[ SCANNING... ]"
                : "[ SYNCHRONIZE ENVIRONMENT ]"}
            </InitializeButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
}

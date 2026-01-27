"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from '@/components/ui/background';
import { RadarScanner } from '@/components/ui/radar-scanner';
import { StatusFeed } from '@/components/ui/status-feed';
import { InitializeButton } from '@/components/ui/initialize-button';

export default function GatewayPage() {
  const [isExiting, setIsExiting] = useState(false);

  const handshakeMessages = [
    "[SYSTEM] Initializing...",
    "[SCAN] Searching for local AI agents...",
    "[FOUND] Gemini CLI detected at /usr/local/bin/gemini",
    "[FOUND] MCP Server available at port 3001",
    "[STATUS] Handshake Success > Connection established."
  ];

  const handleInitialize = () => {
    setIsExiting(true);
    // Simulate navigation delay for animation
    setTimeout(() => {
      console.log("Navigating to Command Deck...");
      // In a real app: router.push('/deck')
    }, 1000);
  };

  return (
    <Background role="main">
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-12 max-w-lg w-full px-6 motion-div-check"
          >
            {/* Radar Scanner Component */}
            <RadarScanner />

            {/* Handshake Status Feed */}
            <div className="h-32 w-full flex flex-col items-start justify-start">
              <StatusFeed messages={handshakeMessages} delay={1000} />
            </div>

            <InitializeButton onClick={handleInitialize} />
          </motion.div>
        )}
      </AnimatePresence>
    </Background>
  );
}

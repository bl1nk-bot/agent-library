"use client";

import React from 'react';
import { CommandLayout } from '@/components/layout/command-layout';
import { Sidebar } from '@/components/layout/sidebar';
import { ContextPanel } from '@/components/layout/context-panel';
import { OmniBar } from '@/components/layout/omni-bar';
import { ChatCard } from '@/components/chat/chat-card';

export default function DeckPage() {
  const dummyMessages = [
    { role: "user", content: "Analyze the security of my authentication flow." },
    { role: "system", content: "Initializing Codebase Investigator Agent..." },
    { 
      role: "assistant", 
      agent: "Claude", 
      content: "I've reviewed your `src/lib/auth/index.ts`. While you're using NextAuth.js which is secure by default, I noticed you haven't set up `NEXTAUTH_SECRET` in your environment variables for production yet.\n\n**Recommendation:**\nRun `openssl rand -base64 32` to generate a secure key." 
    },
    { role: "user", content: "Fix it for me." },
    { 
      role: "assistant", 
      agent: "Gemini", 
      content: "I can help generate that key and add it to your `.env` file. Would you like me to proceed?" 
    }
  ];

  return (
    <CommandLayout
      sidebar={<Sidebar />}
      contextPanel={<ContextPanel />}
    >
      <div className="flex flex-col gap-2 pb-32 max-w-3xl mx-auto w-full">
        {dummyMessages.map((msg, idx) => (
          <ChatCard key={idx} message={msg} />
        ))}
      </div>
      
      {/* OmniBar Positioned via Absolute in Layout, but we can pass it here if we want content-relative positioning */}
      <div className="fixed bottom-8 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
           <OmniBar />
        </div>
      </div>
    </CommandLayout>
  );
}

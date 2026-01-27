import React from 'react';
import { Background } from '@/components/ui/background';

import { StatusFeed } from '@/components/ui/status-feed';



export default function GatewayPage() {

  const handshakeMessages = [

    "[SYSTEM] Initializing...",

    "[SCAN] Searching for local AI agents...",

    "[FOUND] Gemini CLI detected at /usr/local/bin/gemini",

    "[FOUND] MCP Server available at port 3001",

    "[STATUS] Handshake Success > Connection established."

  ];



  return (

    <Background role="main">

      <div className="flex flex-col items-center gap-12 max-w-lg w-full px-6">

         {/* Radar Scanner Component */}

         <RadarScanner />



         {/* Handshake Status Feed */}

         <div className="h-32 w-full flex flex-col items-start justify-start">

            <StatusFeed messages={handshakeMessages} delay={1000} />

         </div>



         <button 

 
           className="px-8 py-4 bg-white/5 border border-white/10 rounded-sm text-white font-bold tracking-widest hover:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]"
         >
           [ INITIALIZE DECK ]
         </button>
      </div>
    </Background>
  );
}

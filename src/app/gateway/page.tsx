import React from 'react';
import { Background } from '@/components/ui/background';

import { InitializeButton } from '@/components/ui/initialize-button';



export default function GatewayPage() {

  const handshakeMessages = [

    "[SYSTEM] Initializing...",

    "[SCAN] Searching for local AI agents...",

    "[FOUND] Gemini CLI detected at /usr/local/bin/gemini",

    "[FOUND] MCP Server available at port 3001",

    "[STATUS] Handshake Success > Connection established."

  ];



  const handleInitialize = () => {

    console.log("Initializing Deck...");

    // Future navigation logic will go here

  };



  return (

    <Background role="main">

      <div className="flex flex-col items-center gap-12 max-w-lg w-full px-6">

         {/* Radar Scanner Component */}

         <RadarScanner />



         {/* Handshake Status Feed */}

         <div className="h-32 w-full flex flex-col items-start justify-start">

            <StatusFeed messages={handshakeMessages} delay={1000} />

         </div>



         <InitializeButton onClick={handleInitialize} />

      </div>

    </Background>

  );

}



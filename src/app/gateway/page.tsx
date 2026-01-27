import React from 'react';
import { Background } from '@/components/ui/background';

import { RadarScanner } from '@/components/ui/radar-scanner';

export default function GatewayPage() {
  return (
    <Background role="main">
      <div className="flex flex-col items-center gap-12">
         {/* Radar Scanner Component */}
         <RadarScanner />

         {/* Placeholder for Handshake Status */}

         <div className="font-mono text-green-500 text-sm h-20">
            [SYSTEM] Initializing...
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

import React from 'react';

export default function GatewayPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0A0A0A] text-white overflow-hidden relative">
      <div className="z-10 flex flex-col items-center gap-8">
         {/* Placeholder for Radar */}
         <div className="w-64 h-64 border border-green-500 rounded-full flex items-center justify-center">
            <span className="text-green-500 text-xs">RADAR SCANNER</span>
         </div>

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
    </main>
  );
}

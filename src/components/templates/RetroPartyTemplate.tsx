import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Sparkles, Zap, Disc3, PartyPopper, Flame } from 'lucide-react';
import { triggerConfetti, triggerFireworks } from '../../utils/confetti';

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const RetroPartyTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [partyMode, setPartyMode] = useState(false);

  const recipient = wish.recipientName || 'Sammy';
  const sender = wish.senderName || 'The Squad';
  const message = wish.message || 'ANOTHER YEAR OLDER, NEVER GROWING UP! Grab the disco ball, turn the tunes to maximum, and let us celebrate the coolest human in the room today!';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80';

  const handlePartyExplosion = () => {
    setPartyMode(true);
    triggerFireworks();
    triggerConfetti(0.3);
  };

  return (
    <div className={`relative min-h-full ${partyMode ? 'bg-[#7C3AED]' : 'bg-[#FAF5FF]'} text-slate-900 p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans transition-colors duration-500`}>
      
      {/* Neo-brutalist retro badges */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FDE047] border-2 border-black shadow-[4px_4px_0px_#000] text-black text-xs font-black uppercase tracking-wider mb-6 rotate-[-2deg]">
        <Disc3 className="w-4 h-4 animate-spin" />
        <span>OFFICIAL BIRTHDAY BASH TICKET</span>
      </div>

      {/* Chunky Retro Headline */}
      <h1 className={`font-display font-black text-4xl sm:text-6xl text-center uppercase tracking-tight mb-3 ${partyMode ? 'text-white' : 'text-black'}`}>
        HAPPY B-DAY <span className="bg-[#FDE047] text-black px-3 py-0.5 border-2 border-black inline-block shadow-[4px_4px_0px_#000] rotate-1">{recipient}!</span>
      </h1>

      <p className={`text-center font-bold text-sm sm:text-base max-w-md mb-8 ${partyMode ? 'text-purple-200' : 'text-purple-900'}`}>
        Maximum volume, zero regrets, and infinite high energy today!
      </p>

      {/* Neo-Brutalist Photo Frame */}
      <div className="relative mb-8">
        <div className="w-56 h-56 sm:w-64 sm:h-64 border-4 border-black bg-white p-2 shadow-[8px_8px_0px_#000] rounded-xl rotate-[-1deg] hover:rotate-0 transition-transform">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover border-2 border-black rounded-lg"
          />
        </div>
        <div className="absolute -bottom-4 -left-4 bg-[#06B6D4] text-black font-black text-xs px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] rotate-6 flex items-center gap-1">
          <Zap className="w-4 h-4 fill-yellow-300 text-black" />
          <span>VIP CELEBRITY</span>
        </div>
      </div>

      {/* Message Box */}
      <div className="w-full max-w-lg bg-white border-4 border-black rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] mb-8">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <span className="font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            MESSAGE FROM THE CREW
          </span>
          <span className="text-xs font-mono font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded border border-black">
            LOUD & PROUD
          </span>
        </div>

        <p className="font-bold text-lg text-slate-800 leading-relaxed mb-6">
          &ldquo;{message}&rdquo;
        </p>

        <div className="text-right font-black text-sm text-purple-700">
          — Signed, {sender} ⚡
        </div>
      </div>

      {/* Party Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePartyExplosion}
          className="px-6 py-3.5 rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-white font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all"
        >
          <PartyPopper className="w-5 h-5" />
          <span>FIRE UP PARTY MODE!</span>
        </button>
        <button
          onClick={() => triggerConfetti(0.5)}
          className="px-6 py-3.5 rounded-xl bg-[#FDE047] hover:bg-[#FACC15] text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-5 h-5 text-black" />
          <span>MORE CONFETTI</span>
        </button>
      </div>

      {/* Footer */}
      <div className={`mt-8 text-xs font-mono font-bold uppercase tracking-wider ${partyMode ? 'text-purple-300' : 'text-slate-500'}`}>
        WishCraft Retro • Party On {recipient}!
      </div>

    </div>
  );
};

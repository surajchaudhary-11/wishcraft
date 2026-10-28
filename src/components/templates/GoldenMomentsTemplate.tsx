import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Sparkles, Award, GlassWater, Heart } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

const CURRENT_YEAR = new Date().getFullYear();

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const GoldenMomentsTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [toasted, setToasted] = useState(false);

  const recipient = wish.recipientName || 'David';
  const sender = wish.senderName || 'The Sterling Family';
  const message = wish.message || 'Wishing you a magnificent milestone celebration! May this landmark year stand as a testament to your legacy, kindness, and unyielding inspiration to us all.';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80';

  const handleChampagneToast = () => {
    setToasted(true);
    triggerConfetti(0.5);
    setTimeout(() => setToasted(false), 3500);
  };

  return (
    <div className="relative min-h-full bg-[#0F0D11] text-amber-100 p-6 sm:p-12 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Golden Shimmer Accents */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* VIP Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-950/90 to-amber-900/60 border border-amber-400/50 text-amber-300 text-xs font-serif font-bold uppercase tracking-[0.2em] mb-6 shadow-glow-gold">
        <Award className="w-4 h-4 text-amber-400" />
        <span>Prestige Milestone Edition</span>
      </div>

      {/* Gold Foil Headline */}
      <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-center font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 max-w-xl">
        In Honor of {recipient}
      </h1>

      <p className="text-center text-amber-200/70 text-sm sm:text-base max-w-md mb-10 font-light tracking-wide">
        A distinguished milestone celebrating excellence, kindness, and an extraordinary life journey.
      </p>

      {/* Portrait Framed in Liquid Gold */}
      <div className="relative mb-10">
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-800 shadow-glow-gold">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover rounded-full border-2 border-amber-200"
          />
        </div>
        <div className="absolute -bottom-3 inset-x-0 flex justify-center">
          <span className="px-5 py-1 rounded-full bg-black/90 border border-amber-400/70 text-[11px] font-serif uppercase tracking-widest text-amber-300 shadow-lg">
            ★ Milestone Honors ★
          </span>
        </div>
      </div>

      {/* Dedication Card */}
      <div className="w-full max-w-lg bg-gradient-to-b from-zinc-900/90 to-black/90 border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative mb-8 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-4 text-xs font-serif tracking-widest text-amber-300 uppercase">
          <span>Personal Tribute</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Special Dedication
          </span>
        </div>

        <p className="font-serif italic text-lg sm:text-xl text-amber-100 leading-relaxed font-light mb-6">
          &ldquo;{message}&rdquo;
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-amber-400/20 text-xs">
          <div className="flex items-center gap-1 text-amber-300">
            <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Presented with gratitude</span>
          </div>
          <div className="font-serif font-bold text-sm text-amber-300">
            — {sender}
          </div>
        </div>
      </div>

      {/* Raise Champagne Toast Button */}
      <button
        onClick={handleChampagneToast}
        className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:opacity-95 text-black font-serif font-bold text-xs uppercase tracking-widest shadow-glow-gold flex items-center gap-2 active:scale-95 transition-all"
      >
        <GlassWater className="w-4 h-4 text-black" />
        <span>{toasted ? 'Toasting David! 🥂' : 'Raise a Champagne Toast'}</span>
      </button>

      {/* Footer */}
      <div className="mt-8 text-center text-xs font-serif tracking-widest text-amber-400/50 uppercase">
        WishCraft Luxury Celebrations • {CURRENT_YEAR}
      </div>

    </div>
  );
};

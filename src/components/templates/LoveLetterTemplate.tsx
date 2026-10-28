import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Heart, Sparkles, Lock, Unlock } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

const CURRENT_YEAR = new Date().getFullYear();

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const LoveLetterTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [unsealed, setUnsealed] = useState(false);

  const recipient = wish.recipientName || 'Amara';
  const sender = wish.senderName || 'Lucas';
  const message = wish.message || 'Every day with you feels like a gift I never knew I was waiting for. You bring warmth to every morning and magic to every evening. Happy Birthday, my love.';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80';

  const handleUnseal = () => {
    setUnsealed(true);
    triggerConfetti(0.4);
  };

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#FFF0F3] via-[#FFE4E8] to-[#FFF5F7] text-slate-900 p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Floating gentle hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Heart className="absolute top-12 left-10 w-6 h-6 text-rose-300/60 fill-rose-300 animate-float-slow" />
        <Heart className="absolute top-28 right-12 w-8 h-8 text-rose-400/50 fill-rose-300 animate-float-reverse" />
        <Heart className="absolute bottom-20 left-16 w-7 h-7 text-rose-300/60 fill-rose-200 animate-float-slow" />
        <Heart className="absolute bottom-24 right-20 w-5 h-5 text-rose-400/60 fill-rose-300 animate-float-reverse" />
      </div>

      {/* Top romantic tag */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-200/70 border border-rose-300 text-rose-900 text-xs font-semibold uppercase tracking-wider mb-6">
        <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
        <span>A Sealed Love Letter</span>
      </div>

      {/* Headline */}
      <h1 className="font-serif italic text-4xl sm:text-5xl text-center text-rose-950 font-bold mb-3 tracking-tight">
        To My Forever Love, <span className="text-rose-600 not-italic">{recipient}</span>
      </h1>

      <p className="text-center text-rose-800/80 text-sm sm:text-base max-w-md mb-8 font-light">
        Written by hand, sealed with affection, and dedicated entirely to you.
      </p>

      {/* Portrait with Heart Badge */}
      <div className="relative mb-10">
        <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-full p-2 bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-300 shadow-soft-xl">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
          />
        </div>
        <div className="absolute -bottom-2 inset-x-0 flex justify-center">
          <span className="px-4 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>My Entire Heart</span>
          </span>
        </div>
      </div>

      {/* The Wax Sealed Envelope Card */}
      <div className="w-full max-w-lg relative">
        {!unsealed ? (
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-rose-200 shadow-soft-xl text-center flex flex-col items-center">
            {/* Wax Seal */}
            <div 
              onClick={handleUnseal}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 text-amber-200 flex flex-col items-center justify-center shadow-lg border-4 border-rose-800 cursor-pointer hover:scale-105 active:scale-95 transition-all mb-4 group"
            >
              <Lock className="w-6 h-6 group-hover:hidden text-amber-100" />
              <Unlock className="w-6 h-6 hidden group-hover:block text-amber-100" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-100 mt-0.5">Seal</span>
            </div>

            <h3 className="font-serif font-bold text-xl text-rose-950 mb-1">
              Confidential Birthday Letter
            </h3>
            <p className="text-xs text-rose-600 mb-6">
              This letter has been sealed with care by {sender}.
            </p>

            <button
              onClick={handleUnseal}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Break Wax Seal to Open</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFDF9] rounded-3xl p-8 border-2 border-rose-200 shadow-soft-xl animate-fadeIn relative">
            <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
              <span className="font-serif italic text-sm text-rose-800 font-semibold">
                Dearest {recipient},
              </span>
              <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Unsealed with Love
              </span>
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl text-rose-950 leading-relaxed mb-8">
              &ldquo;{message}&rdquo;
            </p>

            <div className="text-right pt-4 border-t border-rose-100">
              <div className="font-serif italic text-rose-900 font-bold text-lg">
                Forever & Always,
              </div>
              <div className="font-handwriting text-2xl text-rose-600 font-bold">
                {sender}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Romantic Footer */}
      <div className="mt-8 text-center text-xs text-rose-400">
        A special romantic tribute for {recipient} • {CURRENT_YEAR}
      </div>

    </div>
  );
};

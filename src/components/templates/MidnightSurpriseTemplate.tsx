import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Sparkles, Moon, Flame, PartyPopper, Music2, Volume2, Star } from 'lucide-react';
import { triggerFireworks } from '../../utils/confetti';

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const MidnightSurpriseTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const recipient = wish.recipientName || 'Alex';
  const sender = wish.senderName || 'The Crew';
  const message = wish.message || 'To the person who illuminates the room everywhere you go. Wishing you a year of electrifying victories and wild dreams!';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  const handleReveal = () => {
    setIsRevealed(true);
    triggerFireworks();
  };

  return (
    <div className="relative min-h-full bg-[#12081F] text-slate-100 p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Starry starry night particle effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 text-violet-400 animate-pulse">
          <Star className="w-4 h-4 fill-violet-300" />
        </div>
        <div className="absolute top-24 right-1/4 text-purple-400 animate-pulse delay-700">
          <Star className="w-5 h-5 fill-purple-300" />
        </div>
        <div className="absolute bottom-32 left-10 text-amber-300 animate-pulse delay-300">
          <Star className="w-3 h-3 fill-amber-300" />
        </div>
        <div className="absolute bottom-20 right-12 text-rose-400 animate-pulse delay-500">
          <Star className="w-4 h-4 fill-rose-300" />
        </div>
      </div>

      {/* Radial Neon Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Occasion Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-semibold tracking-wider uppercase mb-6 shadow-glow">
        <Moon className="w-3.5 h-3.5 text-purple-400" />
        <span>Midnight VIP Celebration</span>
      </div>

      {/* Hero Headline */}
      <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-center tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-300 to-warmamber-200">
        Happy Birthday, {recipient}!
      </h1>
      
      <p className="text-center text-purple-200/70 text-sm sm:text-base max-w-md mb-8 font-light">
        Tonight the stars align to honor an unforgettable legend.
      </p>

      {/* Interactive Surprise State */}
      {!isRevealed ? (
        <div className="w-full max-w-md bg-purple-950/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center my-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mb-6 shadow-glow animate-bounce">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold font-display text-white mb-2">
            A Midnight Secret Awaits
          </h2>
          <p className="text-xs text-purple-300/80 mb-6 leading-relaxed">
            {sender} prepared a personalized birthday surprise designed just for you.
          </p>
          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-sm tracking-wide uppercase shadow-glow hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Tap to Ignite the Celebration</span>
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-8 animate-fadeIn">
          {/* Main Portrait with Neon Halo */}
          <div className="flex flex-col items-center">
            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-purple-500 via-pink-500 to-amber-400 shadow-glow">
              <img
                src={photo}
                alt={recipient}
                className="w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-[22px]"
              />
              <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                <span className="px-4 py-1 rounded-full bg-purple-900 border border-purple-400 text-xs font-bold text-amber-300 shadow-md">
                  ★ Star of the Night ★
                </span>
              </div>
            </div>
          </div>

          {/* Unlocked Message Card */}
          <div className="bg-purple-950/70 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 border-b border-purple-800/50 pb-3">
              <span className="text-xs uppercase font-bold text-purple-300 tracking-wider">
                A Message from {sender}
              </span>
              <span className="text-xs text-purple-400">Midnight Edition</span>
            </div>

            <p className="text-base sm:text-lg text-purple-100 leading-relaxed font-light mb-6">
              &ldquo;{message}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-semibold text-pink-300">
                — {sender}
              </div>
              <button
                onClick={() => triggerFireworks()}
                className="px-3.5 py-1.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-xs font-medium text-purple-200 flex items-center gap-1.5 transition-colors"
              >
                <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
                <span>Fireworks Again!</span>
              </button>
            </div>
          </div>

          {/* Sound demo toggle */}
          {wish.enableSoundDemo && (
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isPlayingMusic ? 'bg-pink-500 text-white animate-pulse' : 'bg-purple-800 text-purple-300'}`}>
                  {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Celebratory Beats (Demo)</div>
                  <div className="text-[11px] text-purple-300/70">
                    {isPlayingMusic ? 'Now Playing: Synthwave Celebration' : 'Visual audio rhythm demo'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-medium"
              >
                {isPlayingMusic ? 'Pause' : 'Play'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer tribute */}
      <div className="mt-auto pt-8 text-center text-xs text-purple-400/60">
        Created for {recipient} • Best wishes from {sender}
      </div>

    </div>
  );
};

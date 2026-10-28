import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Sparkles, Heart, PartyPopper, Cake, Flame, Smile, Wind } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const CutePlayfulTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  const recipient = wish.recipientName || 'Mia';
  const sender = wish.senderName || 'Lily';
  const message = wish.message || 'Happy Birthday to my favorite human bean! Blow out the candles and make a super big wish!';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80';

  const handleBlowCandles = () => {
    setCandlesLit(false);
    setWishMade(true);
    triggerConfetti(0.4);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
  };

  return (
    <div className="relative min-h-full bg-[#FFFBF0] text-slate-800 p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Playful background doodles & pastel blobs */}
      <div className="absolute top-4 left-6 text-pink-400 rotate-12 animate-bounce-gentle">
        <Smile className="w-10 h-10" />
      </div>
      <div className="absolute top-14 right-8 text-amber-400 -rotate-12 animate-bounce-gentle">
        <Sparkles className="w-9 h-9" />
      </div>
      <div className="absolute bottom-12 left-10 text-teal-400 rotate-45">
        <Heart className="w-8 h-8 fill-teal-200" />
      </div>

      {/* Fun Rounded Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border-2 border-pink-300 text-pink-700 text-xs font-black tracking-wider uppercase mb-5 shadow-xs">
        <PartyPopper className="w-4 h-4 text-pink-600" />
        <span>Today is All About {recipient}!</span>
      </div>

      {/* Bubble Headline */}
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-center text-slate-900 tracking-tight mb-3">
        HAPPY BIRTHDAY! 🎉
      </h1>
      
      <p className="text-center text-slate-600 text-base max-w-md mb-8 font-medium">
        Sending maximum joy, endless cake slices, and infinite high fives!
      </p>

      {/* Cute Framed Photo */}
      <div className="relative mb-8">
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl p-3 bg-gradient-to-tr from-pink-400 via-amber-300 to-teal-300 shadow-soft-lg rotate-2 hover:rotate-0 transition-transform duration-300">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-inner"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 bg-white px-3.5 py-1.5 rounded-full border-2 border-pink-400 shadow-sm font-bold text-xs text-pink-600 flex items-center gap-1 -rotate-6">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>Cutest Human</span>
        </div>
      </div>

      {/* Interactive Birthday Cake with Blowable Candles */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-soft-lg mb-8 text-center flex flex-col items-center">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-1.5">
          <Cake className="w-4 h-4 text-amber-500" />
          <span>Interactive Birthday Cake</span>
        </div>

        {/* Candles representation */}
        <div className="flex gap-4 mb-2">
          {[1, 2, 3].map((candle) => (
            <div key={candle} className="flex flex-col items-center">
              {candlesLit ? (
                <div className="animate-pulse text-amber-500 mb-0.5">
                  <Flame className="w-5 h-5 fill-amber-400 animate-bounce" />
                </div>
              ) : (
                <div className="text-slate-300 mb-0.5 text-[10px] italic">
                  puff~
                </div>
              )}
              <div className="w-2.5 h-7 rounded-sm bg-gradient-to-b from-pink-400 to-pink-500 border border-pink-600" />
            </div>
          ))}
        </div>

        {/* Cake Base */}
        <div className="w-44 h-16 rounded-2xl bg-gradient-to-r from-amber-100 via-pink-100 to-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-inner relative overflow-hidden mb-4">
          <div className="absolute top-0 inset-x-0 h-3 bg-pink-300 rounded-b-xl" />
          <span className="font-bold text-sm text-pink-700 mt-2">🎂 Make a Wish! 🎂</span>
        </div>

        {candlesLit ? (
          <button
            onClick={handleBlowCandles}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <Wind className="w-4 h-4" />
            <span>Blow Out Candles!</span>
          </button>
        ) : (
          <div className="space-y-2 animate-fadeIn">
            <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              ✨ {wishMade ? 'Wish Made! May it come true today!' : 'Candles Blown Out!'} ✨
            </div>
            <button
              onClick={handleRelight}
              className="text-xs text-slate-500 underline hover:text-slate-800"
            >
              Relight Candles
            </button>
          </div>
        )}
      </div>

      {/* Message Card */}
      <div className="w-full max-w-md bg-pink-50 rounded-3xl p-6 border-2 border-pink-200 shadow-soft mb-8">
        <h3 className="font-bold text-pink-900 text-sm mb-2 flex items-center gap-1.5">
          <span>💌 Birthday Note from {sender}</span>
        </h3>
        <p className="text-slate-700 text-base leading-relaxed mb-4">
          &ldquo;{message}&rdquo;
        </p>
        <div className="text-right text-xs font-bold text-pink-700">
          Lots of love, {sender} 💖
        </div>
      </div>

      {/* Confetti button */}
      <button
        onClick={() => triggerConfetti(0.6)}
        className="px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-600 font-bold text-xs shadow-xs hover:bg-pink-100 flex items-center gap-1.5 transition-colors"
      >
        <PartyPopper className="w-3.5 h-3.5" />
        <span>Toss More Confetti!</span>
      </button>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-400">
        WishCraft Celebration • Best Day Ever for {recipient}!
      </div>

    </div>
  );
};

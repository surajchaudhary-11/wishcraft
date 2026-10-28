import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Heart, Sparkles, Mail, MailOpen, PartyPopper, Flower2 } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const BlushCelebrationTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const recipient = wish.recipientName || 'Special Person';
  const sender = wish.senderName || 'Your Loved Ones';
  const message = wish.message || 'Wishing you the happiest and most magical birthday filled with boundless joy, laughter, and sweet memories!';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const handleConfetti = () => {
    triggerConfetti(0.5);
  };

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#FFF5F6] via-[#FFFDF9] to-[#FDF2F4] text-slate-800 p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Decorative floral & sparkle elements */}
      {wish.enableFloatingHearts && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-8 text-rose-300/60 animate-float-slow">
            <Flower2 className="w-10 h-10" />
          </div>
          <div className="absolute top-32 right-10 text-rose-400/50 animate-float-reverse">
            <Heart className="w-8 h-8 fill-rose-300" />
          </div>
          <div className="absolute bottom-20 left-12 text-warmamber-400/50 animate-float-slow">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="absolute bottom-16 right-16 text-pink-300/60 animate-float-reverse">
            <Heart className="w-6 h-6 fill-pink-200" />
          </div>
        </div>
      )}

      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/90 text-rose-800 text-xs font-semibold tracking-wider uppercase mb-6 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
        <span>Celebration for {recipient}</span>
      </div>

      {/* Hero Headline */}
      <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-center text-plum-950 font-bold mb-4 tracking-tight max-w-2xl leading-tight">
        Happy Birthday, <br className="hidden sm:inline" />
        <span className="not-italic text-rose-600">{recipient}</span>
      </h1>

      <p className="text-center text-slate-600 text-sm sm:text-base max-w-lg mb-8 font-light">
        A special day to celebrate someone truly extraordinary. Here is to making this year your brightest, most breathtaking chapter yet.
      </p>

      {/* Main Recipient Photo */}
      <div className="relative group mb-10">
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-rose-400 via-pink-300 to-warmamber-300 shadow-soft-xl animate-pulse-subtle">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
          />
        </div>
        <button
          onClick={handleConfetti}
          aria-label="Celebrate with confetti"
          className="absolute -bottom-3 right-4 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold shadow-soft-lg flex items-center gap-1.5 hover:bg-rose-700 active:scale-95 transition-all"
        >
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Pop Confetti!</span>
        </button>
      </div>

      {/* Interactive Birthday Card / Envelope */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-soft-lg mb-10 transition-all duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100/80 mb-4">
          <div className="flex items-center gap-2 text-rose-800 font-serif font-semibold text-lg">
            {isLetterOpen ? <MailOpen className="w-5 h-5 text-rose-500" /> : <Mail className="w-5 h-5 text-rose-500" />}
            <span>Personal Letter from {sender}</span>
          </div>
          <button
            onClick={() => setIsLetterOpen(!isLetterOpen)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-full transition-colors"
          >
            {isLetterOpen ? 'Fold Letter' : 'Tap to Read Letter'}
          </button>
        </div>

        {isLetterOpen ? (
          <div className="animate-fadeIn space-y-4">
            <p className="font-handwriting text-2xl sm:text-3xl text-plum-900 leading-relaxed tracking-wide">
              &ldquo;{message}&rdquo;
            </p>
            <div className="pt-4 flex justify-end">
              <span className="font-serif italic text-base text-rose-800 font-semibold">
                — Forever yours, {sender}
              </span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsLetterOpen(true)}
            className="cursor-pointer py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-rose-200 rounded-2xl hover:border-rose-400 hover:bg-rose-50/50 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <Mail className="w-6 h-6 animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-rose-800">
              Click to unfold personal birthday message
            </p>
            <span className="text-xs text-rose-500 mt-1">Written with all our love</span>
          </div>
        )}
      </div>

      {/* Photo Memories Gallery (if provided) */}
      {wish.photoMemories && wish.photoMemories.length > 0 && (
        <div className="w-full max-w-xl mb-10">
          <h3 className="font-serif font-bold text-xl text-center text-plum-950 mb-4">
            Cherished Memories
          </h3>
          <div className="bg-white rounded-3xl p-4 shadow-soft border border-rose-100">
            <div className="aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-slate-100 relative">
              <img 
                src={wish.photoMemories[activePhotoIdx].url} 
                alt="Memory" 
                className="w-full h-full object-cover transition-all duration-300"
              />
              {wish.photoMemories[activePhotoIdx].caption && (
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-xs text-white p-2.5 text-xs text-center">
                  {wish.photoMemories[activePhotoIdx].caption}
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              {wish.photoMemories.map((mem, idx) => (
                <button
                  key={mem.id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activePhotoIdx === idx ? 'border-rose-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={mem.url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom celebration note */}
      <div className="text-center pt-4 border-t border-rose-200/50 w-full max-w-md">
        <p className="text-xs text-slate-500">
          With love from {sender} • Happy Birthday {recipient}!
        </p>
      </div>

    </div>
  );
};

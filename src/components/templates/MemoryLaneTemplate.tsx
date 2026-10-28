import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Camera, ChevronLeft, ChevronRight, Heart, Sparkles, MapPin } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const MemoryLaneTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const recipient = wish.recipientName || 'Chloe';
  const sender = wish.senderName || 'Danielle & Noah';
  const message = wish.message || 'Looking through all these snapshots reminds us how lucky we are to share life with you. From late night road trips to lazy Sunday mornings, cheers to millions more memories!';
  
  const memories = wish.photoMemories && wish.photoMemories.length > 0 
    ? wish.photoMemories 
    : [
        { id: '1', url: wish.photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', caption: 'Our favorite day in the city' },
        { id: '2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', caption: 'Laughing until our stomachs ached' },
        { id: '3', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', caption: 'That unforgettable roadtrip sunset' },
      ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % memories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="relative min-h-full bg-[#FAF5EE] text-[#332A25] p-6 sm:p-10 flex flex-col items-center overflow-hidden font-sans">
      
      {/* Scrapbook paper texture styling */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE4D6] border border-[#DECFBE] text-[#634E3F] text-xs font-semibold tracking-wider uppercase mb-6">
        <Camera className="w-3.5 h-3.5" />
        <span>Memory Scrapbook Collection</span>
      </div>

      {/* Editorial Title */}
      <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-center text-[#2C211B] font-bold mb-3">
        Chapters of Us & <span className="not-italic text-amber-800">{recipient}</span>
      </h1>

      <p className="text-center text-[#695A50] text-sm sm:text-base max-w-md mb-8 font-light">
        A celebration of smiles, road trips, adventures, and the moments that matter most.
      </p>

      {/* Polaroid Gallery Frame with Washi Tape */}
      <div className="w-full max-w-md bg-white p-5 pb-7 rounded-sm shadow-xl border border-stone-200 relative mb-10 transform rotate-1 hover:rotate-0 transition-transform duration-300">
        
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-200/70 border border-amber-300/40 rotate-1 shadow-xs pointer-events-none" />

        {/* Polaroid Picture */}
        <div className="aspect-4/3 bg-stone-100 overflow-hidden relative mb-4">
          <img
            src={memories[currentSlide]?.url || wish.photoUrl}
            alt={memories[currentSlide]?.caption || 'Scrapbook snapshot'}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Navigation Arrows */}
          {memories.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
            {currentSlide + 1} / {memories.length}
          </div>
        </div>

        {/* Polaroid Caption */}
        <div className="text-center font-handwriting text-2xl text-[#3D2C20] min-h-[36px] flex items-center justify-center">
          &ldquo;{memories[currentSlide]?.caption || 'A moment we cherish'}&rdquo;
        </div>
      </div>

      {/* Thumbnails strip */}
      {memories.length > 1 && (
        <div className="flex gap-2 justify-center mb-8">
          {memories.map((m, idx) => (
            <button
              key={m.id || idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                currentSlide === idx ? 'border-amber-700 scale-110 shadow-sm' : 'border-stone-300 opacity-60'
              }`}
            >
              <img src={m.url} alt="Thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Handwritten Personal Note */}
      <div className="w-full max-w-lg bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DEC9] shadow-soft mb-8 relative">
        <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider mb-3">
          <Heart className="w-4 h-4 fill-amber-700 text-amber-700" />
          <span>From the Heart of {sender}</span>
        </div>
        <p className="font-serif italic text-lg sm:text-xl text-[#2F241C] leading-relaxed mb-4">
          &ldquo;{message}&rdquo;
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-stone-200">
          <span className="text-xs text-[#7B6C61] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Special memories forever
          </span>
          <span className="font-handwriting text-2xl font-bold text-amber-900">
            — {sender}
          </span>
        </div>
      </div>

      {/* Celebrate Button */}
      <button
        onClick={() => triggerConfetti(0.5)}
        className="px-6 py-3 rounded-full bg-[#3B2C23] hover:bg-[#281E18] text-[#F7F2EB] text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-2 active:scale-95 transition-all"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Celebrate {recipient}!</span>
      </button>

    </div>
  );
};

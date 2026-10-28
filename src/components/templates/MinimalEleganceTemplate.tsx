import React, { useState } from 'react';
import type { WishConfig } from '../../types';
import { Sparkles, Plus, Minus, Check } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

const CURRENT_YEAR = new Date().getFullYear();

interface TemplateProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const MinimalEleganceTemplate: React.FC<TemplateProps> = ({ wish }) => {
  const [expanded, setExpanded] = useState(true);
  const [toasted, setToasted] = useState(false);

  const recipient = wish.recipientName || 'Julian';
  const sender = wish.senderName || 'Claire';
  const message = wish.message || 'Celebrating another year of your quiet wisdom, generosity, and effortless grace. May this milestone chapter bring you quiet fulfillment and extraordinary breakthroughs.';
  const photo = wish.photoUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80';

  const handleToast = () => {
    setToasted(true);
    triggerConfetti(0.5);
    setTimeout(() => setToasted(false), 3000);
  };

  return (
    <div className="relative min-h-full bg-white text-slate-900 p-8 sm:p-14 flex flex-col items-center justify-between font-sans">
      
      {/* Top Hairline Header */}
      <div className="w-full max-w-xl flex items-center justify-between pb-6 border-b border-slate-200 text-xs tracking-[0.2em] uppercase text-slate-400">
        <span>Celebration Record</span>
        <span className="font-serif italic normal-case text-slate-800 text-sm">WishCraft Edition</span>
        <span>{CURRENT_YEAR}</span>
      </div>

      <div className="w-full max-w-xl my-10 flex flex-col items-center">
        {/* Recipient Photo with Pristine Frame */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border border-slate-300 p-1 mb-8">
          <img
            src={photo}
            alt={recipient}
            className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        {/* Minimal Typography */}
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">
          Honoring
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-center text-slate-950 font-normal tracking-tight mb-4">
          {recipient}
        </h1>

        <div className="w-12 h-px bg-slate-900 mb-8" />

        {/* Expandable Dedication Card */}
        <div className="w-full border border-slate-200 rounded-lg p-6 sm:p-8 bg-slate-50/50 transition-all">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Dedication & Well Wishes
            </div>
            <button className="text-slate-400 hover:text-slate-900">
              {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {expanded && (
            <div className="pt-6 mt-4 border-t border-slate-200/80 animate-fadeIn">
              <p className="font-serif italic text-lg sm:text-xl text-slate-800 leading-relaxed font-light mb-6">
                &ldquo;{message}&rdquo;
              </p>
              <div className="text-right text-xs uppercase tracking-widest text-slate-600 font-medium">
                — {sender}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Quiet Toast */}
        <div className="mt-8">
          <button
            onClick={handleToast}
            className="px-6 py-2.5 rounded-full border border-slate-900 text-slate-900 hover:bg-slate-950 hover:text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2"
          >
            {toasted ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toasted with Distinction</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Raise a Toast</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="w-full max-w-xl pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 uppercase tracking-widest">
        <span>Presented by {sender}</span>
        <span>For {recipient}</span>
      </div>

    </div>
  );
};

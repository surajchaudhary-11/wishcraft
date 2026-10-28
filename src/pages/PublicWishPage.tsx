import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, Sparkles, AlertCircle, Gift, ArrowRight, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import type { WishConfig } from '../types';

export const PublicWishPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [wish, setWish] = useState<WishConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PIN state
  const [isPinRequired, setIsPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    async function fetchPublicSite() {
      try {
        const siteData = await api.public.getPublicSite(slug!);
        if (!isMounted) return;

        if (siteData.is_pin_required) {
          setIsPinRequired(true);
        } else if (siteData.creation) {
          const c = siteData.creation;
          setWish({
            id: c.id,
            occasion: c.occasion,
            recipientName: c.recipient_name,
            senderName: c.sender_name,
            relationship: c.relationship,
            message: c.message,
            tone: c.tone,
            photoUrl: c.photo_url,
            photoMemories: c.photo_memories || [],
            templateId: c.template_id,
            colorScheme: c.color_scheme,
            enableConfetti: c.enable_confetti,
            enableFloatingHearts: c.enable_floating_hearts,
            enableSoundDemo: c.enable_sound_demo,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          });

          // Record visit event
          api.public.recordEvent(slug!, 'page_view').catch(() => {});
        }
      } catch (err: any) {
        if (!isMounted) return;
        if (err.status === 404) {
          setError('This celebration page was not found or has been unpublished by the creator.');
        } else if (err.status === 410) {
          setError('This celebration website has reached its scheduled expiration date.');
        } else {
          setError('Unable to load celebration. Please check your internet connection and try again.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchPublicSite();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleUnlockPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !pinInput.trim()) return;

    setIsVerifyingPin(true);
    setPinError(null);

    try {
      const res = await api.public.verifyPin(slug, pinInput.trim());
      if (res.creation) {
        const c = res.creation;
        setWish({
          id: c.id,
          occasion: c.occasion,
          recipientName: c.recipient_name,
          senderName: c.sender_name,
          relationship: c.relationship,
          message: c.message,
          tone: c.tone,
          photoUrl: c.photo_url,
          photoMemories: c.photo_memories || [],
          templateId: c.template_id,
          colorScheme: c.color_scheme,
          enableConfetti: c.enable_confetti,
          enableFloatingHearts: c.enable_floating_hearts,
          enableSoundDemo: c.enable_sound_demo,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        });
        setIsPinRequired(false);
      }
    } catch (err: any) {
      setPinError(err.message || 'Incorrect PIN code. Please try again.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-plum-900 to-rosewood-600 flex items-center justify-center text-white shadow-soft animate-bounce-gentle mb-4">
          <Gift className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-xl text-plum-950 mb-1">
          Unwrapping Celebration...
        </h2>
        <p className="text-xs text-slate-500 font-light">
          Preparing animations, music, and heartfelt memories.
        </p>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || (!wish && !isPinRequired)) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-plum-950 mb-2">
          Celebration Unavailable
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 font-light leading-relaxed">
          {error || 'This celebration link does not exist or may have been unpublished.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-xs shadow-soft hover:shadow-glow transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Your Own Celebration on WishCraft</span>
        </Link>
      </div>
    );
  }

  // 3. PIN Protection Screen
  if (isPinRequired) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-plum-100 shadow-soft-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rosewood-500 to-warmamber-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="font-display font-bold text-2xl text-plum-950 mb-2">
            Protected Celebration
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            The creator protected this celebration website with a private PIN code. Enter the code below to reveal your surprise!
          </p>

          <form onSubmit={handleUnlockPin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 4829)"
                className="w-full text-center text-lg tracking-widest font-mono py-3 rounded-xl border border-plum-200 focus:outline-none focus:border-rosewood-500 bg-[#FAF7F5]/50"
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-rose-600 text-left">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifyingPin || !pinInput.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-plum-900 to-rosewood-600 text-white font-bold text-sm shadow-soft hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isVerifyingPin ? 'Unlocking...' : 'Unlock Celebration'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. Render Celebration Website!
  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-1">
        <TemplateRenderer wish={wish!} isPreview={false} />
      </main>

      {/* Floating Footer watermark / badge */}
      <footer className="fixed bottom-3 right-3 z-40">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-plum-100 shadow-soft text-slate-700 hover:text-plum-950 text-xs font-semibold transition-all hover:scale-105"
        >
          <Gift className="w-3.5 h-3.5 text-rosewood-600" />
          <span>Made with WishCraft</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </Link>
      </footer>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  PartyPopper, 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  Globe, 
  EyeOff, 
  Edit3, 
  RefreshCw,
  Power,
  AlertCircle
} from 'lucide-react';
import { useWish } from '../context/WishContext';
import { QRCodeSvg } from '../components/common/QRCodeSvg';
import { triggerFireworks } from '../utils/confetti';

export const PublishPage: React.FC = () => {
  const { currentWish, publishCurrentWish, unpublishWish, showToast } = useWish();

  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'unlisted' | 'pin_protected'>('public');
  const [pinCode, setPinCode] = useState('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  // Always derive public URL from the slug using current browser window origin
  const effectiveSlug = currentWish.slug || (publishedUrl ? publishedUrl.split('/wish/').pop() : '');
  const activeUrl = effectiveSlug ? `${window.location.origin}/wish/${effectiveSlug}` : '';

  const handlePublish = async (overridePrivacy?: 'public' | 'unlisted' | 'pin_protected') => {
    if (!currentWish.recipientName?.trim()) {
      setPublishError('Recipient name is required before publishing.');
      return;
    }
    if (!currentWish.message?.trim()) {
      setPublishError('Celebration message is required before publishing.');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    const selectedPrivacy = overridePrivacy || privacy;
    try {
      const res = await publishCurrentWish({
        privacy: selectedPrivacy,
        pin: selectedPrivacy === 'pin_protected' ? pinCode : undefined,
      });
      setPublishedUrl(res.public_url);
      triggerFireworks();
      showToast('Celebration published live!', 'success');
    } catch (e: any) {
      setPublishError(e.message || 'Failed to publish celebration.');
      showToast(e.message || 'Failed to publish celebration.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Automatically publish once if valid draft is ready and not yet published
  useEffect(() => {
    if (!currentWish.slug && currentWish.recipientName?.trim() && currentWish.message?.trim()) {
      handlePublish();
    }
  }, [currentWish.slug, currentWish.recipientName, currentWish.message]);

  const handleUnpublish = async () => {
    if (!currentWish.id) return;
    try {
      await unpublishWish(currentWish.id);
      setPublishedUrl('');
    } catch (e: any) {
      showToast(e.message || 'Failed to unpublish.', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (!activeUrl) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = activeUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      showToast('Live celebration link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
      showToast('Failed to copy. Please manually copy the link.', 'error');
    }
  };

  const handleShareWhatsApp = () => {
    if (!activeUrl) return;
    const text = encodeURIComponent(
      `🎂 I made a personalized celebration website for ${currentWish.recipientName || 'you'} on WishCraft! Check it out: ${activeUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (!activeUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Celebration for ${currentWish.recipientName || 'Friend'}`,
          text: `Check out this personalized celebration website created on WishCraft!`,
          url: activeUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTriggerCelebrate = () => {
    triggerFireworks();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Celebration Success Header */}
        <div className="text-center mb-8">
          <div 
            onClick={handleTriggerCelebrate}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-rosewood-500 to-warmamber-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
            title="Click for celebratory fireworks!"
          >
            <PartyPopper className="w-10 h-10 animate-bounce-gentle" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Celebration Website Live</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-plum-950 mb-2">
            Hurray! {currentWish.recipientName ? `${currentWish.recipientName}'s` : 'Your'} Wish is Crafted!
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-light max-w-md mx-auto">
            Your personalized celebration website is live on a permanent link and ready to share worldwide.
          </p>
        </div>

        {/* Main Share Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-plum-100 shadow-soft-lg space-y-6">
          
          {/* Shareable Link Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Live Celebration URL
              </label>
              {currentWish.isPublished && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Publicly Accessible
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={
                  activeUrl ||
                  (isPublishing
                    ? 'Generating live celebration link...'
                    : publishError
                    ? `Publishing issue: ${publishError}`
                    : 'Crafting celebration link...')
                }
                className="flex-1 px-4 py-3 rounded-xl border border-plum-200 bg-plum-50/50 text-sm font-mono text-plum-900 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                disabled={!activeUrl}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-plum-900 to-rosewood-600 text-white font-bold text-xs shadow-soft hover:opacity-95 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {publishError && !activeUrl && (
              <div className="mt-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{publishError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={isPublishing}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors shrink-0"
                >
                  {isPublishing ? 'Publishing...' : 'Retry Publishing'}
                </button>
              </div>
            )}
          </div>

          {/* QR Code and Sharing Actions */}
          {activeUrl && (
            <div className="p-6 rounded-2xl bg-[#FAF7F5] border border-plum-100 flex flex-col sm:flex-row items-center gap-6">
              <QRCodeSvg value={activeUrl} size={150} />

              <div className="flex-1 text-center sm:text-left space-y-3">
                <h3 className="font-display font-bold text-base text-plum-950">
                  Scan to Open on Phone
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scan this interactive QR code to experience the celebration website on any mobile device, complete with music and particle effects.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share...</span>
                  </button>

                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl border border-plum-200 hover:bg-plum-100 text-plum-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Open Live View</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Access Controls */}
          <div className="pt-4 border-t border-plum-100 space-y-4">
            <h3 className="font-display font-bold text-sm text-plum-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rosewood-600" />
              <span>Privacy & Access Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setPrivacy('public'); handlePublish('public'); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  privacy === 'public'
                    ? 'border-plum-950 bg-plum-50 font-bold'
                    : 'border-plum-100 hover:bg-slate-50'
                }`}
              >
                <Globe className="w-4 h-4 text-plum-900 mb-1" />
                <div className="text-xs font-bold text-plum-950">Public</div>
                <div className="text-[10px] text-slate-500">Accessible by anyone with link</div>
              </button>

              <button
                type="button"
                onClick={() => { setPrivacy('unlisted'); handlePublish('unlisted'); }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  privacy === 'unlisted'
                    ? 'border-plum-950 bg-plum-50 font-bold'
                    : 'border-plum-100 hover:bg-slate-50'
                }`}
              >
                <EyeOff className="w-4 h-4 text-plum-900 mb-1" />
                <div className="text-xs font-bold text-plum-950">Unlisted</div>
                <div className="text-[10px] text-slate-500">Hidden from directories</div>
              </button>

              <button
                type="button"
                onClick={() => setPrivacy('pin_protected')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  privacy === 'pin_protected'
                    ? 'border-plum-950 bg-plum-50 font-bold'
                    : 'border-plum-100 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-4 h-4 text-plum-900 mb-1" />
                <div className="text-xs font-bold text-plum-950">PIN Protected</div>
                <div className="text-[10px] text-slate-500">Requires passcode to view</div>
              </button>
            </div>

            {privacy === 'pin_protected' && (
              <div className="p-4 rounded-xl bg-plum-50 border border-plum-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Set 4-Digit Access PIN
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={8}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 4829"
                    className="w-36 px-3 py-2 text-center text-sm font-mono font-bold rounded-lg border border-plum-200 focus:outline-none focus:border-rosewood-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handlePublish('pin_protected')}
                    disabled={pinCode.length < 4}
                    className="px-4 py-2 rounded-lg bg-plum-900 text-white text-xs font-bold hover:bg-plum-800 disabled:opacity-50"
                  >
                    Apply PIN
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Visitors must enter this exact PIN code before the message and photos unfold.
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions & Unpublish */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/editor"
              className="flex-1 py-3 px-4 rounded-xl border border-plum-200 hover:bg-plum-50 text-plum-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Continue Editing</span>
            </Link>

            {currentWish.isPublished ? (
              <button
                type="button"
                onClick={handleUnpublish}
                className="py-3 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Power className="w-4 h-4 text-rose-500" />
                <span>Unpublish Website</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePublish()}
                disabled={isPublishing}
                className="py-3 px-4 rounded-xl bg-rosewood-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center shadow-soft"
              >
                <RefreshCw className={`w-4 h-4 ${isPublishing ? 'animate-spin' : ''}`} />
                <span>Publish Website</span>
              </button>
            )}
          </div>

        </div>

        {/* Dashboard Link */}
        <div className="text-center mt-6">
          <Link
            to="/my-creations"
            className="text-xs font-bold text-rosewood-600 hover:underline"
          >
            ← View all saved celebrations in My Creations
          </Link>
        </div>

      </div>
    </div>
  );
};

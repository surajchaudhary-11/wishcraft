import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Smartphone, Monitor, RotateCcw } from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import { useWish } from '../context/WishContext';
import type { WishConfig } from '../types';

function createSampleWish(template: (typeof TEMPLATES)[0]): WishConfig {
  return {
    id: `preview-${template.id}`,
    occasion: template.occasion,
    recipientName: template.defaultWish.recipientName || 'Sophia Loren',
    senderName: template.defaultWish.senderName || 'Marcus & Friends',
    relationship: 'Friend',
    message: template.defaultWish.message || 'Wishing you the happiest and most magical birthday filled with boundless joy, laughter, and sweet memories!',
    tone: 'Heartfelt',
    photoUrl: template.defaultWish.photoUrl || template.thumbnail,
    photoMemories: [
      { id: '1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', caption: 'Sunset laughter' },
      { id: '2', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80', caption: 'Road trip vibes' },
    ],
    templateId: template.id,
    colorScheme: 'default',
    enableConfetti: true,
    enableFloatingHearts: true,
    enableSoundDemo: true,
    createdAt: '2026-10-28T10:00:00Z',
    updatedAt: '2026-10-28T10:00:00Z',
  };
}

export const TemplateDetailPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { setCurrentWish } = useWish();

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const template = TEMPLATES.find(t => t.id === templateId);

  if (!template) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display font-bold text-3xl text-plum-950 mb-2">
          Template Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          The requested celebration theme does not exist or has been relocated.
        </p>
        <Link
          to="/templates"
          className="px-6 py-2.5 rounded-full bg-plum-950 text-white font-bold text-sm"
        >
          Return to Template Gallery
        </Link>
      </div>
    );
  }

  // Create representative sample wish for this template
  const sampleWish = createSampleWish(template);

  const handleCustomize = () => {
    setCurrentWish(sampleWish);
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-[#1E1B2E] flex flex-col">
      
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 sm:px-8 py-3 flex items-center justify-between sticky top-20 z-40">
        <div className="flex items-center gap-4">
          <Link
            to="/templates"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Gallery</span>
          </Link>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="font-display font-bold text-sm sm:text-base text-white">
              {template.name}
            </h1>
            <span className="text-[11px] text-slate-400">
              Style: {template.style} • Full Interactive Preview
            </span>
          </div>
        </div>

        {/* Viewport switch & Customize CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                deviceMode === 'desktop' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                deviceMode === 'mobile' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Restart Template Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCustomize}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rosewood-600 to-rosewood-500 hover:opacity-95 text-white font-bold text-xs shadow-soft flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customize This Template</span>
          </button>
        </div>
      </div>

      {/* Full-Page Live Template Preview Container */}
      <div className="flex-1 flex justify-center items-center p-0 sm:p-6 overflow-auto">
        {deviceMode === 'mobile' ? (
          <div className="w-[375px] max-w-full h-[720px] bg-white rounded-[44px] shadow-2xl border-8 border-slate-950 overflow-hidden flex flex-col relative my-4">
            <div className="h-5 bg-slate-950 w-full flex justify-center items-end pb-1 shrink-0">
              <div className="w-24 h-3 bg-slate-900 rounded-b-lg" />
            </div>
            <div key={refreshKey} className="flex-1 overflow-y-auto">
              <TemplateRenderer wish={sampleWish} isPreview={true} />
            </div>
            <div className="h-4 bg-slate-950 w-full flex justify-center items-center shrink-0">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        ) : (
          <div key={refreshKey} className="w-full max-w-5xl min-h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden my-4">
            <TemplateRenderer wish={sampleWish} isPreview={false} />
          </div>
        )}
      </div>

    </div>
  );
};

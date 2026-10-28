import React, { useState } from 'react';
import { Smartphone, Monitor, ExternalLink, RotateCcw } from 'lucide-react';
import type { WishConfig } from '../../types';
import { TemplateRenderer } from '../templates/TemplateRenderer';

interface PreviewDeviceFrameProps {
  wish: WishConfig;
  defaultDevice?: 'mobile' | 'desktop';
  allowToggle?: boolean;
  onOpenFullPreview?: () => void;
  className?: string;
}

export const PreviewDeviceFrame: React.FC<PreviewDeviceFrameProps> = ({
  wish,
  defaultDevice = 'desktop',
  allowToggle = true,
  onOpenFullPreview,
  className = '',
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>(defaultDevice);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Device Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-plum-100/90 rounded-t-2xl">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px] sm:max-w-none">
            {wish.recipientName ? `${wish.recipientName}'s Birthday Website` : 'Live Website Preview'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {allowToggle && (
            <div className="flex items-center p-0.5 rounded-lg bg-plum-100/70 border border-plum-200/60">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-md transition-all ${
                  device === 'desktop'
                    ? 'bg-white text-plum-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Desktop View"
                aria-label="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-md transition-all ${
                  device === 'mobile'
                    ? 'bg-white text-plum-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mobile View"
                aria-label="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-plum-950 hover:bg-plum-50"
            title="Reload Preview Animation"
            aria-label="Reload Preview Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onOpenFullPreview && (
            <button
              onClick={onOpenFullPreview}
              className="p-1.5 rounded-lg text-slate-500 hover:text-plum-950 hover:bg-plum-50"
              title="Open Fullscreen Preview"
              aria-label="Open Fullscreen Preview"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-900/5 p-4 sm:p-6 flex items-center justify-center overflow-auto rounded-b-2xl">
        {device === 'mobile' ? (
          /* Mobile Phone Mockup */
          <div className="w-[360px] max-w-full h-[640px] bg-white rounded-[40px] shadow-soft-xl border-8 border-slate-900 overflow-hidden flex flex-col relative ring-1 ring-slate-800/10">
            {/* Phone Notch */}
            <div className="h-5 bg-slate-900 w-full flex justify-center items-end pb-1 shrink-0">
              <div className="w-20 h-3 bg-slate-950 rounded-b-lg" />
            </div>
            {/* Screen Content */}
            <div key={refreshKey} className="flex-1 overflow-y-auto">
              <TemplateRenderer wish={wish} isPreview={true} />
            </div>
            {/* Phone Bottom Home Bar */}
            <div className="h-4 bg-slate-900 w-full flex justify-center items-center shrink-0">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        ) : (
          /* Desktop Browser Mockup */
          <div className="w-full h-full min-h-[500px] max-h-[720px] bg-white rounded-xl shadow-soft-lg border border-plum-100 overflow-y-auto">
            <div key={refreshKey} className="min-h-full">
              <TemplateRenderer wish={wish} isPreview={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

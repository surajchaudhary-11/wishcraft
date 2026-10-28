import React from 'react';
import { Gift } from 'lucide-react';

interface QRCodeSvgProps {
  value: string;
  size?: number;
}

export const QRCodeSvg: React.FC<QRCodeSvgProps> = ({ size = 180 }) => {
  return (
    <div 
      className="p-3 bg-white rounded-2xl border border-plum-100 shadow-soft inline-flex flex-col items-center justify-center relative"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full text-plum-950" 
        fill="currentColor"
        aria-label="QR Code link preview"
      >
        {/* Top-left position pattern */}
        <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="11" y="11" width="16" height="16" rx="2" fill="currentColor" />

        {/* Top-right position pattern */}
        <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="73" y="11" width="16" height="16" rx="2" fill="currentColor" />

        {/* Bottom-left position pattern */}
        <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
        <rect x="11" y="73" width="16" height="16" rx="2" fill="currentColor" />

        {/* Decorative QR code matrix dots */}
        <rect x="38" y="8" width="6" height="6" rx="1.5" />
        <rect x="48" y="8" width="6" height="6" rx="1.5" />
        <rect x="58" y="14" width="6" height="6" rx="1.5" />
        <rect x="38" y="22" width="6" height="6" rx="1.5" />
        <rect x="50" y="25" width="6" height="6" rx="1.5" />

        <rect x="8" y="38" width="6" height="6" rx="1.5" />
        <rect x="18" y="44" width="6" height="6" rx="1.5" />
        <rect x="25" y="52" width="6" height="6" rx="1.5" />

        <rect x="72" y="38" width="6" height="6" rx="1.5" />
        <rect x="85" y="44" width="6" height="6" rx="1.5" />
        <rect x="68" y="52" width="6" height="6" rx="1.5" />

        <rect x="38" y="70" width="6" height="6" rx="1.5" />
        <rect x="48" y="76" width="6" height="6" rx="1.5" />
        <rect x="58" y="84" width="6" height="6" rx="1.5" />
        <rect x="74" y="74" width="6" height="6" rx="1.5" />
        <rect x="84" y="82" width="6" height="6" rx="1.5" />

        {/* Center decorative clear area */}
        <rect x="38" y="38" width="24" height="24" rx="6" fill="#FFF1F2" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-rosewood-600 text-white flex items-center justify-center shadow-xs">
          <Gift className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

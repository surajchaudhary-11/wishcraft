import React from 'react';
import type { WishConfig } from '../../types';
import { BlushCelebrationTemplate } from './BlushCelebrationTemplate';
import { MidnightSurpriseTemplate } from './MidnightSurpriseTemplate';
import { CutePlayfulTemplate } from './CutePlayfulTemplate';
import { MemoryLaneTemplate } from './MemoryLaneTemplate';
import { MinimalEleganceTemplate } from './MinimalEleganceTemplate';
import { LoveLetterTemplate } from './LoveLetterTemplate';
import { RetroPartyTemplate } from './RetroPartyTemplate';
import { GoldenMomentsTemplate } from './GoldenMomentsTemplate';

interface TemplateRendererProps {
  wish: WishConfig;
  isPreview?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ wish, isPreview }) => {
  switch (wish.templateId) {
    case 'blush-celebration':
      return <BlushCelebrationTemplate wish={wish} isPreview={isPreview} />;
    case 'midnight-surprise':
      return <MidnightSurpriseTemplate wish={wish} isPreview={isPreview} />;
    case 'cute-playful':
      return <CutePlayfulTemplate wish={wish} isPreview={isPreview} />;
    case 'memory-lane':
      return <MemoryLaneTemplate wish={wish} isPreview={isPreview} />;
    case 'minimal-elegance':
      return <MinimalEleganceTemplate wish={wish} isPreview={isPreview} />;
    case 'love-letter':
      return <LoveLetterTemplate wish={wish} isPreview={isPreview} />;
    case 'retro-party':
      return <RetroPartyTemplate wish={wish} isPreview={isPreview} />;
    case 'golden-moments':
      return <GoldenMomentsTemplate wish={wish} isPreview={isPreview} />;
    default:
      return <BlushCelebrationTemplate wish={wish} isPreview={isPreview} />;
  }
};

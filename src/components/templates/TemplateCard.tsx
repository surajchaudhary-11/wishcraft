import React from 'react';
import type { TemplateDefinition } from '../../types';
import { Eye, Sparkles, Check } from 'lucide-react';
import { Badge } from '../common/Badge';

interface TemplateCardProps {
  template: TemplateDefinition;
  isSelected?: boolean;
  onSelect?: (template: TemplateDefinition) => void;
  onPreview?: (template: TemplateDefinition) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onSelect,
  onPreview,
}) => {
  return (
    <div 
      className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden ${
        isSelected
          ? 'border-rosewood-500 ring-2 ring-rosewood-400 shadow-soft-lg scale-[1.01]'
          : 'border-plum-100 hover:border-plum-300 shadow-soft hover:shadow-soft-lg'
      }`}
    >
      {/* Thumbnail Preview Area */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="plum" className="bg-white/90 backdrop-blur-xs font-bold text-plum-950 border-white/60">
            {template.style}
          </Badge>
          {template.badgeText && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rosewood-600 text-white shadow-xs">
              {template.badgeText}
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-plum-950/40 backdrop-blur-[2px] transition-opacity">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview(template);
              }}
              className="px-3.5 py-2 rounded-xl bg-white text-plum-950 text-xs font-bold shadow-md hover:bg-slate-100 flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Full Preview</span>
            </button>
          )}

          {onSelect && (
            <button
              onClick={() => onSelect(template)}
              className="px-3.5 py-2 rounded-xl bg-rosewood-600 text-white text-xs font-bold shadow-md hover:bg-rosewood-700 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSelected ? 'Selected' : 'Use Theme'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-display font-bold text-lg text-plum-950 group-hover:text-rosewood-600 transition-colors">
              {template.name}
            </h3>
            {isSelected && (
              <span className="w-5 h-5 rounded-full bg-rosewood-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {template.description}
          </p>
        </div>

        {/* Features Chips */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-plum-50">
          {template.features.slice(0, 2).map((feat, idx) => (
            <span key={idx} className="text-[10px] font-medium bg-plum-50 text-plum-700 px-2 py-0.5 rounded-md">
              • {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

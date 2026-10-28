import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Palette } from 'lucide-react';
import { TEMPLATES, TEMPLATE_STYLES } from '../data/templates';
import { TemplateCard } from '../components/templates/TemplateCard';
import { EmptyState } from '../components/common/EmptyState';
import { useWish } from '../context/WishContext';
import type { TemplateDefinition } from '../types';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentWish, setCurrentWish } = useWish();

  const styleParam = searchParams.get('style') || 'All Styles';
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedStyle, setSelectedStyle] = useState(styleParam);
  const [sortBy, setSortBy] = useState<'featured' | 'name'>('featured');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((tpl) => {
      const matchesSearch = 
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStyle = 
        selectedStyle === 'All Styles' || tpl.style.toLowerCase() === selectedStyle.toLowerCase();

      return matchesSearch && matchesStyle;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // Maintain featured order
    });
  }, [searchQuery, selectedStyle, sortBy]);

  const handleSelectTemplate = (template: TemplateDefinition) => {
    setCurrentWish(prev => ({
      ...prev,
      templateId: template.id,
      recipientName: prev.recipientName || template.defaultWish.recipientName || '',
      message: prev.message || template.defaultWish.message || '',
      photoUrl: prev.photoUrl || template.defaultWish.photoUrl || '',
    }));
    navigate('/create');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All Styles');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rosewood-50 border border-rosewood-200/80 text-rosewood-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Palette className="w-3.5 h-3.5" />
            <span>8 Distinct Celebration Designs</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-plum-950 tracking-tight mb-3">
            Find the perfect way to celebrate.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
            Choose from modern minimalist designs, romantic letter reveals, photo scrapbooks, and party themes. Pick a template to customize live.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-plum-100 shadow-soft mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates (e.g., cake, romantic, dark)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-plum-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rosewood-500 bg-[#FAF7F5]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Style Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {TEMPLATE_STYLES.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStyle === style
                      ? 'bg-plum-950 text-white shadow-xs'
                      : 'bg-plum-50/70 text-slate-600 hover:bg-plum-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <span className="text-xs text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'name')}
                className="bg-plum-50/60 border border-plum-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

          </div>

          {/* Active Filter feedback */}
          {(searchQuery || selectedStyle !== 'All Styles') && (
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-plum-100 text-xs text-slate-500">
              <span>Showing {filteredTemplates.length} matching templates</span>
              <button
                onClick={handleClearFilters}
                className="text-rosewood-600 font-semibold hover:underline ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={currentWish.templateId === template.id}
                onSelect={handleSelectTemplate}
                onPreview={(t) => navigate(`/templates/${t.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-plum-100 shadow-soft">
            <EmptyState
              icon={<Filter className="w-8 h-8" />}
              title="No templates match your filters"
              description="Try adjusting your search query or selecting a different style category to discover our collection."
              actionLabel="Reset All Filters"
              onAction={handleClearFilters}
            />
          </div>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OCCASIONS } from '../data/occasions';
import { Sparkles, ArrowRight, Heart, Gift } from 'lucide-react';
import { useWish } from '../context/WishContext';
import type { OccasionType } from '../types';

export const OccasionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentWish } = useWish();

  const handleStartOccasion = (occId: OccasionType) => {
    setCurrentWish(prev => ({
      ...prev,
      occasion: occId,
    }));
    navigate(`/create?occasion=${occId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rosewood-50 border border-rosewood-200/80 text-rosewood-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Heart className="w-3.5 h-3.5" />
            <span>Celebration Occasions</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-plum-950 tracking-tight mb-4">
            Celebrate Every Meaningful Chapter
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
            While birthday websites are our flagship experience, WishCraft is engineered to power digital keepsakes for every heartfelt milestone.
          </p>
        </div>

        {/* Occasions List */}
        <div className="space-y-12">
          {OCCASIONS.map((occ, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={occ.id}
                id={occ.id}
                className="bg-white rounded-3xl border border-plum-100 shadow-soft overflow-hidden hover:shadow-soft-lg transition-all"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Visual Preview */}
                  <div className={`lg:col-span-6 relative aspect-16/10 lg:aspect-auto lg:h-[380px] overflow-hidden ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                    <img
                      src={occ.imageUrl}
                      alt={occ.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-plum-950 shadow-md">
                        {occ.badge}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`lg:col-span-6 p-6 sm:p-10 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="text-xs font-bold uppercase tracking-wider text-rosewood-600 mb-2">
                      {occ.subtitle}
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-plum-950 mb-3">
                      {occ.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-light">
                      {occ.description}
                    </p>

                    <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-plum-100 mb-6">
                      <div className="text-xs font-bold text-plum-950 mb-1">
                        Recommended For:
                      </div>
                      <div className="text-xs text-slate-500">
                        {occ.exampleRecipient}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => handleStartOccasion(occ.id)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-sm shadow-soft hover:shadow-glow flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{occ.id === 'birthday' ? 'Create Birthday Website' : `Create ${occ.title.split(' ')[0]} Site`}</span>
                      </button>

                      <Link
                        to="/templates"
                        className="w-full sm:w-auto px-5 py-3 rounded-full border border-plum-200 text-plum-950 font-bold text-sm hover:bg-plum-50/80 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>View Matching Themes</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </Link>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-rosewood-900 via-plum-950 to-plum-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-soft-xl">
          <h3 className="font-display font-black text-2xl sm:text-3xl mb-3">
            Have a custom celebration in mind?
          </h3>
          <p className="text-sm text-purple-200/80 max-w-lg mx-auto mb-6">
            All 8 of our templates allow custom recipient names, relationships, personal messages, and photos.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-plum-950 font-bold text-sm shadow-md hover:bg-rosewood-50 transition-all"
          >
            <Gift className="w-4 h-4 text-rosewood-600" />
            <span>Launch the Creation Wizard</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

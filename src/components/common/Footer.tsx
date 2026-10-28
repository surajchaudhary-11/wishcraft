import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Sparkles, Shield, ArrowUpRight } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-canvas-dark text-slate-300 pt-16 pb-12 border-t border-plum-900/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-plum-900/60">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rosewood-600 to-warmamber-400 flex items-center justify-center text-white shadow-soft">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                WishCraft
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Craft unforgettable personalized celebration websites in minutes. No coding required — just love, memories, and joyful surprises.
            </p>
            <div className="flex items-center gap-2 text-xs text-rosewood-300 bg-rosewood-950/60 border border-rosewood-800/40 rounded-full px-3 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Frontend Interactive Experience Demo</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore Templates
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/templates?style=Romantic" className="hover:text-rosewood-300 transition-colors">
                  Romantic Surprises
                </Link>
              </li>
              <li>
                <Link to="/templates?style=Playful" className="hover:text-rosewood-300 transition-colors">
                  Playful & Cute
                </Link>
              </li>
              <li>
                <Link to="/templates?style=Photo+Gallery" className="hover:text-rosewood-300 transition-colors">
                  Memory Lane Scrapbook
                </Link>
              </li>
              <li>
                <Link to="/templates?style=Elegant" className="hover:text-rosewood-300 transition-colors">
                  Golden Moments VIP
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-rosewood-300 transition-colors flex items-center gap-1">
                  Browse All 8 Themes <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Celebrations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/create?occasion=birthday" className="hover:text-rosewood-300 transition-colors">
                  Birthday Websites
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="hover:text-rosewood-300 transition-colors">
                  Anniversaries
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="hover:text-rosewood-300 transition-colors">
                  Love & Romance
                </Link>
              </li>
              <li>
                <Link to="/occasions" className="hover:text-rosewood-300 transition-colors">
                  Friendship Tributes
                </Link>
              </li>
              <li>
                <Link to="/my-creations" className="hover:text-rosewood-300 transition-colors">
                  My Saved Creations
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Product & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/sign-in" className="hover:text-rosewood-300 transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-rosewood-300 transition-colors">
                  Create Demo Account
                </Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Client-side Mock Privacy
                </span>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Uploaded images remain in your local browser session and are never uploaded to any remote server.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {CURRENT_YEAR} WishCraft Platform. Built with care for unforgettable birthdays.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rosewood-400 fill-rosewood-400 inline" />
            <span>for heartfelt celebrations worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

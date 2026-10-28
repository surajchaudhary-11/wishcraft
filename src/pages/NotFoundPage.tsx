import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Home, Palette } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#FAF7F5]">
      
      {/* Decorative Brand Icon */}
      <div className="w-20 h-20 rounded-3xl bg-plum-100 text-rosewood-600 flex items-center justify-center mb-6 shadow-soft animate-float-slow">
        <Gift className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rosewood-600 mb-2">
        Error 404
      </span>

      <h1 className="font-display font-black text-4xl sm:text-5xl text-plum-950 mb-3">
        Page Wandered Away
      </h1>

      <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto mb-8 font-light leading-relaxed">
        The celebration page you are looking for does not exist or may have been moved. Let us get you back to crafting magic!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-xs shadow-soft hover:shadow-glow flex items-center justify-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/templates"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-plum-200 text-plum-950 font-bold text-xs hover:bg-plum-50 flex items-center justify-center gap-2 transition-all"
        >
          <Palette className="w-4 h-4 text-slate-500" />
          <span>Browse 8 Themes</span>
        </Link>
      </div>

    </div>
  );
};

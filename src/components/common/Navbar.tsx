import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Gift, Palette, Heart, FolderHeart, LogOut } from 'lucide-react';
import { useWish } from '../../context/WishContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { creations } = useWish();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: 'Templates', path: '/templates', icon: Palette },
    { label: 'Occasions', path: '/occasions', icon: Heart },
    { label: 'My Creations', path: '/my-creations', icon: FolderHeart, count: creations.length },
    { label: 'Live Editor', path: '/editor', icon: Sparkles },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-plum-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-plum-900 via-rosewood-600 to-warmamber-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-plum-950 flex items-center gap-1.5">
                WishCraft
                <span className="w-2 h-2 rounded-full bg-rosewood-500 animate-pulse"></span>
              </span>
              <span className="text-[11px] font-medium tracking-wide uppercase text-plum-500/90 -mt-0.5">
                Celebration Builder
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-plum-950 bg-plum-100/70 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-plum-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-rosewood-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-rosewood-100 text-rosewood-700">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum-50 border border-plum-100">
                  <div className="w-6 h-6 rounded-full bg-rosewood-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.display_name ? user.display_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-plum-950 max-w-[120px] truncate">
                    {user?.display_name || 'My Account'}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 p-2 rounded-xl transition-colors flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="text-sm font-medium text-slate-600 hover:text-plum-950 px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 hover:opacity-95 shadow-soft hover:shadow-glow transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your Wish</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/create"
              aria-label="Create your wish"
              className="p-2 rounded-xl bg-rosewood-600 text-white shadow-soft"
            >
              <Sparkles className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-plum-100/60 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-plum-100 bg-[#FAF7F5] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium ${
                  active
                    ? 'bg-plum-100 text-plum-950 font-semibold'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-rosewood-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rosewood-100 text-rosewood-700">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-plum-100 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user?.display_name})</span>
              </button>
            ) : (
              <Link
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 text-sm font-semibold text-plum-950 bg-white rounded-xl border border-plum-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

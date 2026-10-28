import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Cake, 
  Camera, 
  Mail, 
  CheckCircle2, 
  Eye, 
  PartyPopper
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';
import { OCCASIONS } from '../data/occasions';
import { TemplateCard } from '../components/templates/TemplateCard';
import { PreviewDeviceFrame } from '../components/preview/PreviewDeviceFrame';
import { useWish } from '../context/WishContext';
import { triggerConfetti } from '../utils/confetti';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentWish, setCurrentWish } = useWish();
  const [activeSurpriseTab, setActiveSurpriseTab] = useState<'letter' | 'cake' | 'memories'>('cake');

  const featuredTemplates = TEMPLATES.slice(0, 6);

  const handleSelectTemplate = (template: typeof TEMPLATES[0]) => {
    setCurrentWish(prev => ({
      ...prev,
      templateId: template.id,
      recipientName: prev.recipientName || template.defaultWish.recipientName || 'Alex',
      message: prev.message || template.defaultWish.message || 'Happy Birthday!',
      photoUrl: prev.photoUrl || template.defaultWish.photoUrl || '',
    }));
    navigate('/create');
  };

  const handleHeroConfetti = () => {
    triggerConfetti(0.4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        {/* Subtle decorative atmospheric background blurs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-rose-200/40 via-purple-200/30 to-amber-200/40 blur-3xl pointer-events-none -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            
            {/* Pill Tag */}
            <div 
              onClick={handleHeroConfetti}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-plum-200/80 shadow-soft text-rosewood-600 text-xs font-bold uppercase tracking-wider mb-6 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 text-rosewood-500" />
              <span>Personalized Celebration Website Builder</span>
              <span className="text-[10px] bg-rosewood-100 text-rosewood-700 px-2 py-0.5 rounded-full font-bold">New</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-plum-950 tracking-tight leading-[1.08] mb-6">
              Make their birthday <br className="hidden sm:inline" />
              <span className="text-gradient-plum">unforgettable.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Create a personalized, interactive mini-website in minutes with photos, heartfelt letters, cake reveals, and festive music. No coding required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/create"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-base shadow-soft-lg hover:shadow-glow hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Create a Birthday Website</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/templates"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-plum-50/80 text-plum-950 font-bold text-base border border-plum-200 shadow-soft flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-5 h-5 text-slate-500" />
                <span>Explore Themes</span>
              </Link>
            </div>

            {/* Feature trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 8 Unique Visual Themes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Interactive Candles & Letter
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free Frontend Demo
              </span>
            </div>

          </div>

          {/* LARGE VISUAL PREVIEW MOCKUP */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-plum-200/50 to-rose-200/30 p-2 sm:p-4 shadow-soft-xl border border-plum-200/60">
            <PreviewDeviceFrame
              wish={currentWish}
              allowToggle={true}
              defaultDevice="desktop"
              onOpenFullPreview={() => navigate('/editor')}
            />
          </div>

        </div>
      </section>

      {/* THREE-STEP EXPLANATION */}
      <section className="py-20 bg-white border-y border-plum-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rosewood-600 mb-2">
              Simple 3-Step Creation
            </h2>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-950">
              How WishCraft Works
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              No tech knowledge needed. Turn your personal photos and thoughts into a digital celebration in under three minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FAF7F5] rounded-3xl p-8 border border-plum-100 shadow-soft flex flex-col items-start relative group hover:-translate-y-1 transition-transform">
              <span className="w-12 h-12 rounded-2xl bg-rosewood-100 text-rosewood-700 font-display font-black text-xl flex items-center justify-center mb-6 shadow-xs">
                1
              </span>
              <h4 className="font-display font-bold text-xl text-plum-950 mb-2">
                Personalize & Upload
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add the celebrants name, choose your relationship, type your heartfelt or funny wish, and drop in their favorite photo.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF7F5] rounded-3xl p-8 border border-plum-100 shadow-soft flex flex-col items-start relative group hover:-translate-y-1 transition-transform">
              <span className="w-12 h-12 rounded-2xl bg-plum-200 text-plum-900 font-display font-black text-xl flex items-center justify-center mb-6 shadow-xs">
                2
              </span>
              <h4 className="font-display font-bold text-xl text-plum-950 mb-2">
                Choose Theme & Preview
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Select from 8 distinctive designs — from romantic love letters to blowout party cakes. Preview live changes instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF7F5] rounded-3xl p-8 border border-plum-100 shadow-soft flex flex-col items-start relative group hover:-translate-y-1 transition-transform">
              <span className="w-12 h-12 rounded-2xl bg-warmamber-100 text-warmamber-800 font-display font-black text-xl flex items-center justify-center mb-6 shadow-xs">
                3
              </span>
              <h4 className="font-display font-bold text-xl text-plum-950 mb-2">
                Share the Magic
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate your personalized link and custom QR code. Send via WhatsApp, email, or surprise them with a midnight text!
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-plum-950 text-white font-bold text-sm shadow-soft hover:bg-plum-900 transition-all"
            >
              <Sparkles className="w-4 h-4 text-warmamber-300" />
              <span>Start Building Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* THEME SHOWCASE SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rosewood-600 mb-2">
              Curated Designs
            </h2>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-950">
              Pick a Theme That Matches Their Vibe
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
              Each template offers a completely distinct layout, aesthetic, and celebratory interaction.
            </p>
          </div>
          <Link
            to="/templates"
            className="mt-4 md:mt-0 text-sm font-bold text-rosewood-600 hover:text-rosewood-700 flex items-center gap-1.5"
          >
            <span>View all 8 templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={currentWish.templateId === template.id}
              onSelect={handleSelectTemplate}
              onPreview={(t) => navigate(`/templates/${t.id}`)}
            />
          ))}
        </div>
      </section>

      {/* INTERACTIVE SURPRISES DEMONSTRATION SECTION */}
      <section className="py-20 bg-gradient-to-b from-plum-950 to-plum-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-rosewood-400 mb-2 block">
              Digital Surprises
            </span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Moments That Delight
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 mt-2">
              WishCraft sites arent static cards. They feature delightful interactive surprises designed to make them smile.
            </p>

            {/* Interactive Selector Tabs */}
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setActiveSurpriseTab('cake')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSurpriseTab === 'cake'
                    ? 'bg-rosewood-600 text-white shadow-soft'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                }`}
              >
                <Cake className="w-4 h-4" />
                <span>Blowable Birthday Cake</span>
              </button>
              <button
                onClick={() => setActiveSurpriseTab('letter')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSurpriseTab === 'letter'
                    ? 'bg-rosewood-600 text-white shadow-soft'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Hidden Wax Letter</span>
              </button>
              <button
                onClick={() => setActiveSurpriseTab('memories')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeSurpriseTab === 'memories'
                    ? 'bg-rosewood-600 text-white shadow-soft'
                    : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Photo Memory Gallery</span>
              </button>
            </div>
          </div>

          {/* Interactive Feature Demo Box */}
          <div className="max-w-2xl mx-auto bg-purple-950/70 border border-purple-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center">
            {activeSurpriseTab === 'cake' && (
              <div className="animate-fadeIn space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                  <Cake className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-white">
                  Interactive Cake with Blowable Candles
                </h4>
                <p className="text-sm text-purple-200/80 max-w-md mx-auto">
                  The recipient taps the screen to blow out their digital candles, triggering celebratory smoke puffs and an avalanche of colorful confetti!
                </p>
                <div className="pt-2">
                  <Link
                    to="/create?theme=cute-playful"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosewood-600 hover:bg-rosewood-500 text-white text-xs font-bold shadow-soft"
                  >
                    <span>Try the Cute & Playful Theme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {activeSurpriseTab === 'letter' && (
              <div className="animate-fadeIn space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-white">
                  Wax-Sealed Virtual Love Letter
                </h4>
                <p className="text-sm text-purple-200/80 max-w-md mx-auto">
                  Clicking the wax seal stamp smoothly unfolds a parchment letter with handwritten calligraphy, floating romantic hearts, and your personal message.
                </p>
                <div className="pt-2">
                  <Link
                    to="/create?theme=love-letter"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosewood-600 hover:bg-rosewood-500 text-white text-xs font-bold shadow-soft"
                  >
                    <span>Try the Love Letter Theme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {activeSurpriseTab === 'memories' && (
              <div className="animate-fadeIn space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl text-white">
                  Polaroid Scrapbook Memories
                </h4>
                <p className="text-sm text-purple-200/80 max-w-md mx-auto">
                  Recipients can flip through polaroid snapshots, tap through memory slides, and read nostalgic captions written just for them.
                </p>
                <div className="pt-2">
                  <Link
                    to="/create?theme=memory-lane"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosewood-600 hover:bg-rosewood-500 text-white text-xs font-bold shadow-soft"
                  >
                    <span>Try the Memory Lane Theme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* OCCASIONS PREVIEW SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-rosewood-600 mb-2">
            Every Moment Worth Celebrating
          </h2>
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-plum-950">
            More Than Just Birthdays
          </h3>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            From anniversaries to spontaneous cheer-ups, WishCraft is built for celebrating the people you love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              className="group bg-white rounded-3xl border border-plum-100 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 overflow-hidden">
                <img
                  src={occ.imageUrl}
                  alt={occ.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-plum-950 shadow-xs">
                    {occ.badge}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-bold text-lg text-plum-950 mb-1 group-hover:text-rosewood-600 transition-colors">
                    {occ.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {occ.subtitle}
                  </p>
                </div>

                <Link
                  to={occ.id === 'birthday' ? '/create?occasion=birthday' : `/occasions#${occ.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rosewood-600 hover:text-rosewood-700"
                >
                  <span>{occ.id === 'birthday' ? 'Create Birthday Website' : 'Explore Concept'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-tr from-plum-950 via-rosewood-900 to-plum-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-warmamber-300 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4">
            Ready to blow them away on their special day?
          </h2>
          <p className="text-base sm:text-lg text-purple-200/90 font-light max-w-xl mx-auto mb-8 leading-relaxed">
            Create their personalized website in minutes. Preview live in your browser and get your shareable link immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-plum-950 font-bold text-base shadow-soft-xl hover:bg-rosewood-50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <PartyPopper className="w-5 h-5 text-rosewood-600" />
              <span>Create Your Celebration Site</span>
            </Link>
            <Link
              to="/templates"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-bold text-base border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Browse Themes</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

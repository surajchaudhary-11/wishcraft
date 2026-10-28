import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Heart, 
  Volume2, 
  PartyPopper, 
  Image as ImageIcon, 
  AlertCircle,
  Eye,
  Edit3
} from 'lucide-react';
import { useWish } from '../context/WishContext';
import { OCCASIONS } from '../data/occasions';
import { TEMPLATES } from '../data/templates';
import { StepProgress } from '../components/wizard/StepProgress';
import { PhotoUploader } from '../components/wizard/PhotoUploader';
import { PreviewDeviceFrame } from '../components/preview/PreviewDeviceFrame';
import { TemplateCard } from '../components/templates/TemplateCard';
import type { 
  RelationshipType, 
  MessageTone, 
  PhotoMemory 
} from '../types';

const STEPS = [
  { id: 1, title: 'Occasion', subtitle: 'Choose celebration' },
  { id: 2, title: 'Personalize', subtitle: 'Add details & photo' },
  { id: 3, title: 'Theme', subtitle: 'Select design' },
  { id: 4, title: 'Touches', subtitle: 'Effects & music' },
  { id: 5, title: 'Review', subtitle: 'Preview & publish' },
];

export const WizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentWish, updateCurrentWish, saveCurrentWish, showToast } = useWish();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Optional new memory input for step 4
  const [newMemoryUrl, setNewMemoryUrl] = useState('');
  const [newMemoryCaption, setNewMemoryCaption] = useState('');

  // Step 2 validation
  const validateStep2 = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!currentWish.recipientName.trim()) {
      errs.recipientName = "Please enter the recipient's name";
    }
    if (!currentWish.senderName.trim()) {
      errs.senderName = "Please enter your name or group";
    }
    if (!currentWish.message.trim()) {
      errs.message = "Please write a heartfelt birthday message";
    } else if (currentWish.message.trim().length < 10) {
      errs.message = "Please enter at least 10 characters for your message";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (!validateStep2()) {
        showToast('Please fill in required fields to continue', 'error');
        return;
      }
    }
    setErrors({});
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    await saveCurrentWish();
    navigate('/publish');
  };

  const handleAddMemory = () => {
    if (!newMemoryUrl.trim()) return;
    const newMemory: PhotoMemory = {
      id: `mem-${Date.now()}`,
      url: newMemoryUrl.trim(),
      caption: newMemoryCaption.trim() || 'Special Memory',
    };
    updateCurrentWish({
      photoMemories: [...(currentWish.photoMemories || []), newMemory]
    });
    setNewMemoryUrl('');
    setNewMemoryCaption('');
    showToast('Photo memory added to celebration!', 'success');
  };

  const handleRemoveMemory = (id: string) => {
    updateCurrentWish({
      photoMemories: (currentWish.photoMemories || []).filter(m => m.id !== id)
    });
  };

  const selectedTemplateDef = TEMPLATES.find(t => t.id === currentWish.templateId) || TEMPLATES[0];

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Wizard Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-rosewood-600 mb-1 block">
            WishCraft Website Builder
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-plum-950">
            Create a Personalized Celebration
          </h1>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="mb-8">
          <StepProgress
            currentStep={currentStep}
            steps={STEPS}
            onStepClick={(s) => {
              if (s < currentStep) setCurrentStep(s);
              else if (s === currentStep + 1 && currentStep === 2) {
                if (validateStep2()) setCurrentStep(s);
              }
            }}
          />
        </div>

        {/* Wizard Main Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-plum-100 shadow-soft">
          
          {/* STEP 1: CHOOSE OCCASION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto mb-6">
                <h2 className="font-display font-bold text-2xl text-plum-950 mb-1">
                  What are you celebrating?
                </h2>
                <p className="text-sm text-slate-500">
                  Select the celebration occasion. Birthday websites are fully customized and ready.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {OCCASIONS.map((occ) => {
                  const isSelected = currentWish.occasion === occ.id;
                  return (
                    <div
                      key={occ.id}
                      onClick={() => updateCurrentWish({ occasion: occ.id })}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-rosewood-500 ring-2 ring-rosewood-400 bg-rosewood-50/30 shadow-soft'
                          : 'border-plum-100 hover:border-plum-300 bg-white hover:bg-[#FAF7F5]'
                      }`}
                    >
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-3">
                        <img src={occ.imageUrl} alt={occ.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-plum-950">
                          {occ.badge}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-sm text-plum-950">
                            {occ.title}
                          </h3>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-rosewood-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {occ.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZE */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h2 className="font-display font-bold text-2xl text-plum-950 mb-1">
                  Personalize the Celebration
                </h2>
                <p className="text-sm text-slate-500">
                  Enter their name, your relationship, and your heartfelt message.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Name */}
                <div>
                  <label htmlFor="recipientName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Celebrants Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="recipientName"
                    type="text"
                    placeholder="e.g. Sophia Loren"
                    value={currentWish.recipientName}
                    onChange={(e) => updateCurrentWish({ recipientName: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none ${
                      errors.recipientName ? 'border-red-500 bg-red-50/20' : 'border-plum-200 focus:border-rosewood-500'
                    }`}
                  />
                  {errors.recipientName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.recipientName}
                    </p>
                  )}
                </div>

                {/* Sender Name */}
                <div>
                  <label htmlFor="senderName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name or Group <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="senderName"
                    type="text"
                    placeholder="e.g. Marcus & Friends"
                    value={currentWish.senderName}
                    onChange={(e) => updateCurrentWish({ senderName: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none ${
                      errors.senderName ? 'border-red-500 bg-red-50/20' : 'border-plum-200 focus:border-rosewood-500'
                    }`}
                  />
                  {errors.senderName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.senderName}
                    </p>
                  )}
                </div>
              </div>

              {/* Relationship & Tone Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="relationship" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Relationship
                  </label>
                  <select
                    id="relationship"
                    value={currentWish.relationship}
                    onChange={(e) => updateCurrentWish({ relationship: e.target.value as RelationshipType })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 text-sm text-slate-900 focus:outline-none focus:border-rosewood-500 bg-white"
                  >
                    <option value="Friend">Friend</option>
                    <option value="Partner">Partner / Significant Other</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other Loved One</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message Tone
                  </label>
                  <select
                    id="tone"
                    value={currentWish.tone}
                    onChange={(e) => updateCurrentWish({ tone: e.target.value as MessageTone })}
                    className="w-full px-4 py-2.5 rounded-xl border border-plum-200 text-sm text-slate-900 focus:outline-none focus:border-rosewood-500 bg-white"
                  >
                    <option value="Heartfelt">Heartfelt & Warm</option>
                    <option value="Funny">Funny & Playful</option>
                    <option value="Romantic">Romantic & Deep</option>
                    <option value="Cute">Cute & Sweet</option>
                    <option value="Emotional">Emotional & Nostalgic</option>
                  </select>
                </div>
              </div>

              {/* Personal Message Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="personalMessage" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Personal Message <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {currentWish.message.length} characters
                  </span>
                </div>
                <textarea
                  id="personalMessage"
                  rows={4}
                  placeholder="Write your genuine celebration message here... (e.g., Happy Birthday! May this year bring endless joy, laughter, and sweet victories!)"
                  value={currentWish.message}
                  onChange={(e) => updateCurrentWish({ message: e.target.value })}
                  className={`w-full p-4 rounded-xl border text-sm text-slate-900 focus:outline-none ${
                    errors.message ? 'border-red-500 bg-red-50/20' : 'border-plum-200 focus:border-rosewood-500'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Photo Upload with Drag & Drop */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Celebrants Photo
                </label>
                <PhotoUploader
                  currentPhotoUrl={currentWish.photoUrl}
                  onPhotoSelected={(url) => updateCurrentWish({ photoUrl: url })}
                  onPhotoRemoved={() => updateCurrentWish({ photoUrl: '' })}
                />
              </div>

            </div>
          )}

          {/* STEP 3: CHOOSE THEME */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h2 className="font-display font-bold text-2xl text-plum-950 mb-1">
                  Choose a Visual Theme
                </h2>
                <p className="text-sm text-slate-500">
                  Select how their celebration website will look and feel. Your details are preserved!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TEMPLATES.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isSelected={currentWish.templateId === tpl.id}
                    onSelect={(t) => updateCurrentWish({ templateId: t.id })}
                    onPreview={(t) => window.open(`/templates/${t.id}`, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: ADD FINISHING TOUCHES */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto mb-4">
                <h2 className="font-display font-bold text-2xl text-plum-950 mb-1">
                  Celebration Finishing Touches
                </h2>
                <p className="text-sm text-slate-500">
                  Add celebratory effects, color variations, and optional photo memories.
                </p>
              </div>

              {/* Interactive Effect Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Confetti Toggle */}
                <div 
                  onClick={() => updateCurrentWish({ enableConfetti: !currentWish.enableConfetti })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    currentWish.enableConfetti 
                      ? 'border-rosewood-500 bg-rosewood-50/40 shadow-xs' 
                      : 'border-plum-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <PartyPopper className={`w-5 h-5 ${currentWish.enableConfetti ? 'text-rosewood-600' : 'text-slate-400'}`} />
                    <input
                      type="checkbox"
                      checked={currentWish.enableConfetti}
                      onChange={() => {}}
                      className="rounded text-rosewood-600 focus:ring-rosewood-500"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-plum-950 mb-1">Confetti Cannon</h4>
                  <p className="text-xs text-slate-500">Pops celebratory confetti when opened or interacted with.</p>
                </div>

                {/* Floating Hearts Toggle */}
                <div 
                  onClick={() => updateCurrentWish({ enableFloatingHearts: !currentWish.enableFloatingHearts })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    currentWish.enableFloatingHearts 
                      ? 'border-rosewood-500 bg-rosewood-50/40 shadow-xs' 
                      : 'border-plum-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Heart className={`w-5 h-5 ${currentWish.enableFloatingHearts ? 'text-rosewood-600 fill-rosewood-400' : 'text-slate-400'}`} />
                    <input
                      type="checkbox"
                      checked={currentWish.enableFloatingHearts}
                      onChange={() => {}}
                      className="rounded text-rosewood-600 focus:ring-rosewood-500"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-plum-950 mb-1">Floating Particles</h4>
                  <p className="text-xs text-slate-500">Gentle decorative floating hearts and sparkle elements.</p>
                </div>

                {/* Sound Demo Toggle */}
                <div 
                  onClick={() => updateCurrentWish({ enableSoundDemo: !currentWish.enableSoundDemo })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    currentWish.enableSoundDemo 
                      ? 'border-rosewood-500 bg-rosewood-50/40 shadow-xs' 
                      : 'border-plum-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Volume2 className={`w-5 h-5 ${currentWish.enableSoundDemo ? 'text-rosewood-600' : 'text-slate-400'}`} />
                    <input
                      type="checkbox"
                      checked={currentWish.enableSoundDemo}
                      onChange={() => {}}
                      className="rounded text-rosewood-600 focus:ring-rosewood-500"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-plum-950 mb-1">Music Player (Demo)</h4>
                  <p className="text-xs text-slate-500">Includes visual soundtrack player demo.</p>
                </div>

              </div>

              {/* Color Variation Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Color Accent for {selectedTemplateDef.name}
                </label>
                <div className="flex flex-wrap gap-3">
                  {selectedTemplateDef.colorVariations.map((color) => {
                    const isSelected = currentWish.colorScheme === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateCurrentWish({ colorScheme: color.id })}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-plum-900 bg-plum-100/60 font-bold'
                            : 'border-plum-200 bg-white hover:bg-plum-50/50'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${color.bgClass}`} />
                        <span>{color.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-plum-950 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Memory Addition (Optional) */}
              <div className="p-5 rounded-2xl bg-[#FAF7F5] border border-plum-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-rosewood-600" />
                    <h4 className="font-bold text-sm text-plum-950">Add Extra Photo Memories (Optional)</h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {(currentWish.photoMemories || []).length} added
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Great for themes like Memory Lane and Blush Celebration that showcase a mini photo gallery.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Photo image URL..."
                    value={newMemoryUrl}
                    onChange={(e) => setNewMemoryUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-plum-200 text-xs text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Caption (e.g. Summer picnic)..."
                    value={newMemoryCaption}
                    onChange={(e) => setNewMemoryCaption(e.target.value)}
                    className="sm:w-64 px-3 py-2 rounded-xl border border-plum-200 text-xs text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMemory}
                    className="px-4 py-2 rounded-xl bg-plum-900 text-white font-bold text-xs hover:bg-plum-800 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Memories Thumbnails */}
                {(currentWish.photoMemories || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentWish.photoMemories.map((m) => (
                      <div key={m.id} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-plum-200">
                        <img src={m.url} alt={m.caption} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveMemory(m.id)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 5: REVIEW AND PREVIEW */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center max-w-lg mx-auto mb-2">
                <h2 className="font-display font-bold text-2xl text-plum-950 mb-1">
                  Ready to Celebrate!
                </h2>
                <p className="text-sm text-slate-500">
                  Inspect your live celebration website preview below before generating your shareable link.
                </p>
              </div>

              {/* Summary Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 py-3 border-y border-plum-100 text-xs font-medium text-slate-600">
                <span>To: <strong className="text-plum-950">{currentWish.recipientName || 'Friend'}</strong></span>
                <span>•</span>
                <span>From: <strong className="text-plum-950">{currentWish.senderName || 'You'}</strong></span>
                <span>•</span>
                <span>Theme: <strong className="text-rosewood-600">{selectedTemplateDef.name}</strong></span>
                <span>•</span>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-rosewood-600 font-bold hover:underline ml-2 flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit details
                </button>
              </div>

              {/* Full Live Interactive Preview Device */}
              <div className="rounded-3xl border border-plum-200/80 overflow-hidden shadow-soft-lg">
                <PreviewDeviceFrame
                  wish={currentWish}
                  allowToggle={true}
                  defaultDevice="desktop"
                  onOpenFullPreview={() => navigate('/editor')}
                />
              </div>

              {/* Ready to Publish Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/editor')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-plum-200 text-plum-950 font-bold text-xs hover:bg-plum-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Open in Live Split Editor</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-sm shadow-soft-lg hover:shadow-glow flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & Get Share Link</span>
                </button>
              </div>

            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-plum-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-5 py-2.5 rounded-xl border border-plum-200 text-xs font-bold text-plum-950 hover:bg-plum-50 flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white text-xs font-bold shadow-soft flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

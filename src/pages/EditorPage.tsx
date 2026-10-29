import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCcw, 
  PartyPopper, 
  Heart, 
  Volume2, 
  Eye, 
  Share2, 
  Sliders,
  Sparkles,
  Save,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Bot
} from 'lucide-react';
import { useWish } from '../context/WishContext';
import { TEMPLATES } from '../data/templates';
import { PreviewDeviceFrame } from '../components/preview/PreviewDeviceFrame';
import { PhotoUploader } from '../components/wizard/PhotoUploader';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { api } from '../services/api';
import type { PhotoMemory } from '../types';

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentWish, 
    updateCurrentWish, 
    resetCurrentWish, 
    saveCurrentWish, 
    saveStatus,
    uploadPhoto,
    showToast 
  } = useWish();

  const [activeTabMobile, setActiveTabMobile] = useState<'edit' | 'preview'>('edit');
  const [showResetModal, setShowResetModal] = useState(false);

  // AI Assistant Modal
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTone, setAiTone] = useState<'Heartfelt' | 'Funny' | 'Romantic' | 'Cute' | 'Emotional'>('Heartfelt');
  const [aiRelationship, setAiRelationship] = useState('Friend');
  const [aiLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Memory timeline input
  const [newMemoryCaption, setNewMemoryCaption] = useState('');
  const memoryFileInputRef = useRef<HTMLInputElement>(null);

  const selectedTemplate = TEMPLATES.find(t => t.id === currentWish.templateId) || TEMPLATES[0];

  // Debounced Autosave (saves 2 seconds after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentWish.recipientName || currentWish.message) {
        saveCurrentWish().catch(() => {});
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    currentWish.recipientName,
    currentWish.senderName,
    currentWish.message,
    currentWish.templateId,
    currentWish.colorScheme,
    currentWish.photoUrl,
    currentWish.photoMemories,
    currentWish.enableConfetti,
    currentWish.enableFloatingHearts,
    currentWish.enableSoundDemo,
  ]);

  const handleManualSave = async () => {
    await saveCurrentWish();
  };

  const handleSaveAndPublish = async () => {
    if (!currentWish.recipientName?.trim()) {
      showToast('Please enter a recipient name before publishing.', 'error');
      return;
    }
    if (!currentWish.message?.trim()) {
      showToast('Please enter a celebration message before publishing.', 'error');
      return;
    }
    await saveCurrentWish();
    navigate('/publish');
  };

  const handleConfirmReset = () => {
    resetCurrentWish();
    setShowResetModal(false);
  };

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await api.ai.generateMessage({
        occasion: currentWish.occasion,
        recipient_name: currentWish.recipientName || 'Alex',
        relationship: aiRelationship,
        tone: aiTone,
        length: aiLength,
      });
      setAiSuggestions(res.suggestions);
    } catch {
      showToast('Could not fetch suggestions. Please try again.', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyAISuggestion = (text: string) => {
    updateCurrentWish({ message: text, tone: aiTone as any });
    setShowAIModal(false);
    showToast('AI suggestion applied to your celebration message!', 'success');
  };

  const handleAddMemoryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await uploadPhoto(file);
        const newMemory: PhotoMemory = {
          id: `mem-${Date.now()}`,
          url,
          caption: newMemoryCaption.trim() || 'Precious moment',
        };
        updateCurrentWish({
          photoMemories: [...(currentWish.photoMemories || []), newMemory],
        });
        setNewMemoryCaption('');
        showToast('Memory photo added to gallery!', 'success');
      } catch {
        showToast('Failed to upload memory photo.', 'error');
      }
    }
  };

  const handleRemoveMemory = (id: string) => {
    updateCurrentWish({
      photoMemories: (currentWish.photoMemories || []).filter(m => m.id !== id),
    });
    showToast('Photo removed from memory timeline.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col">
      
      {/* Editor Sub-Header Toolbar */}
      <header className="bg-white border-b border-plum-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-20 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/create')}
            className="p-2 rounded-xl text-slate-600 hover:text-plum-950 hover:bg-plum-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Wizard</span>
          </button>
          <div className="h-4 w-px bg-plum-100 hidden sm:block" />
          <div>
            <h1 className="font-display font-bold text-sm sm:text-base text-plum-950 flex items-center gap-2">
              <span>Editing: {currentWish.recipientName || 'Celebration'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rosewood-100 text-rosewood-700">
                {selectedTemplate.name}
              </span>
            </h1>
          </div>
        </div>

        {/* Mobile Edit/Preview Tabs */}
        <div className="flex lg:hidden items-center bg-plum-100/70 p-0.5 rounded-xl border border-plum-200/60">
          <button
            onClick={() => setActiveTabMobile('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTabMobile === 'edit'
                ? 'bg-white text-plum-950 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => setActiveTabMobile('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTabMobile === 'preview'
                ? 'bg-white text-plum-950 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Preview
          </button>
        </div>

        {/* Right Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Real Save status badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-500 mr-1">
            {saveStatus === 'saving' && (
              <span className="text-amber-600 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-rose-600">Save failed</span>
            )}
          </div>

          <button
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-plum-950 hover:bg-plum-50 border border-plum-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Save changes"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Reset to fresh draft"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-plum-900 via-rosewood-600 to-rosewood-500 text-white font-bold text-xs shadow-soft hover:shadow-glow flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Publish Link</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Live Controls */}
        <div className={`lg:col-span-5 space-y-6 ${activeTabMobile === 'edit' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl p-6 border border-plum-100 shadow-soft space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-plum-100">
              <h2 className="font-display font-bold text-base text-plum-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rosewood-600" />
                <span>Content & Styling Controls</span>
              </h2>
              <span className="text-xs text-slate-400">Live previewing</span>
            </div>

            {/* Recipient & Sender Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={currentWish.recipientName}
                  onChange={(e) => updateCurrentWish({ recipientName: e.target.value })}
                  placeholder="e.g. Sophia"
                  className="w-full px-3 py-2 rounded-xl border border-plum-200 text-sm focus:outline-none focus:border-rosewood-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={currentWish.senderName}
                  onChange={(e) => updateCurrentWish({ senderName: e.target.value })}
                  placeholder="e.g. Marcus"
                  className="w-full px-3 py-2 rounded-xl border border-plum-200 text-sm focus:outline-none focus:border-rosewood-500"
                />
              </div>
            </div>

            {/* Message Field with AI Assistant Trigger */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Celebration Message
                </label>
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rosewood-50 text-rosewood-700 hover:bg-rosewood-100 text-xs font-bold transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Message Assistant</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={currentWish.message}
                onChange={(e) => updateCurrentWish({ message: e.target.value })}
                placeholder="Write celebration note..."
                className="w-full p-3 rounded-xl border border-plum-200 text-sm focus:outline-none focus:border-rosewood-500"
              />
            </div>

            {/* Primary Celebrant Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Celebrant Photo
              </label>
              <PhotoUploader
                currentPhotoUrl={currentWish.photoUrl}
                onPhotoSelected={(url) => updateCurrentWish({ photoUrl: url })}
                onPhotoRemoved={() => updateCurrentWish({ photoUrl: '' })}
              />
            </div>

            {/* Photo Memories Gallery */}
            <div className="pt-2 border-t border-plum-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Memory Gallery ({currentWish.photoMemories?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={() => memoryFileInputRef.current?.click()}
                  className="text-xs font-bold text-rosewood-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory Photo</span>
                </button>
              </div>

              <input
                ref={memoryFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAddMemoryPhoto}
                className="hidden"
              />

              {currentWish.photoMemories && currentWish.photoMemories.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentWish.photoMemories.map((mem) => (
                    <div key={mem.id} className="flex items-center gap-3 p-2 rounded-xl border border-plum-100 bg-[#FAF7F5]">
                      <img src={mem.url} alt="Memory" className="w-12 h-12 rounded-lg object-cover border border-plum-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={mem.caption || ''}
                          onChange={(e) => {
                            const newCaption = e.target.value;
                            updateCurrentWish({
                              photoMemories: currentWish.photoMemories.map(m => m.id === mem.id ? { ...m, caption: newCaption } : m)
                            });
                          }}
                          placeholder="Caption (e.g. Road trip)"
                          className="w-full text-xs px-2 py-1 rounded border border-plum-200 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMemory(mem.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No additional memory photos yet. Click 'Add Memory Photo' to add to timeline.</p>
              )}
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Active Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TEMPLATES.map((tpl) => {
                  const isSelected = currentWish.templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => updateCurrentWish({ templateId: tpl.id })}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-rosewood-600 bg-rosewood-50/60 ring-1 ring-rosewood-500'
                          : 'border-plum-100 hover:border-plum-300'
                      }`}
                    >
                      <div className="aspect-16/10 rounded-lg overflow-hidden mb-1.5">
                        <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[11px] font-bold text-plum-950 truncate">
                        {tpl.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Variation Accent */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Theme Color Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.colorVariations.map((color) => {
                  const isSelected = currentWish.colorScheme === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => updateCurrentWish({ colorScheme: color.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                        isSelected
                          ? 'border-plum-950 bg-plum-100 font-bold'
                          : 'border-plum-200 bg-white hover:bg-plum-50'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${color.bgClass}`} />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Effects Toggles */}
            <div className="pt-2 border-t border-plum-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Animations & Effects
              </label>
              
              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-rosewood-600" />
                  Enable Confetti Cannon
                </span>
                <input
                  type="checkbox"
                  checked={currentWish.enableConfetti}
                  onChange={(e) => updateCurrentWish({ enableConfetti: e.target.checked })}
                  className="rounded text-rosewood-600 focus:ring-rosewood-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rosewood-600 fill-rosewood-200" />
                  Floating Particle Elements
                </span>
                <input
                  type="checkbox"
                  checked={currentWish.enableFloatingHearts}
                  onChange={(e) => updateCurrentWish({ enableFloatingHearts: e.target.checked })}
                  className="rounded text-rosewood-600 focus:ring-rosewood-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-rosewood-600" />
                  Visual Music Player Demo
                </span>
                <input
                  type="checkbox"
                  checked={currentWish.enableSoundDemo}
                  onChange={(e) => updateCurrentWish({ enableSoundDemo: e.target.checked })}
                  className="rounded text-rosewood-600 focus:ring-rosewood-500"
                />
              </label>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: Live-rendered Celebration Website Preview */}
        <div className={`lg:col-span-7 flex flex-col h-[780px] ${activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl border border-plum-100 shadow-soft overflow-hidden flex-1 flex flex-col">
            <PreviewDeviceFrame
              wish={currentWish}
              allowToggle={true}
              defaultDevice="desktop"
              className="h-full"
            />
          </div>
        </div>

      </div>

      {/* AI Message Assistant Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-plum-100 shadow-soft-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-plum-100">
              <h3 className="font-display font-bold text-lg text-plum-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rosewood-600" />
                <span>AI Celebration Message Assistant</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAIModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Generate heartfelt, funny, romantic, or cute messages tailored for {currentWish.recipientName || 'your celebrant'}.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-plum-200 text-xs bg-white"
                >
                  <option value="Heartfelt">Heartfelt & Warm</option>
                  <option value="Funny">Funny & Witty</option>
                  <option value="Romantic">Romantic & Intimate</option>
                  <option value="Cute">Cute & Playful</option>
                  <option value="Emotional">Deeply Emotional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Relationship</label>
                <select
                  value={aiRelationship}
                  onChange={(e) => setAiRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-plum-200 text-xs bg-white"
                >
                  <option value="Friend">Best Friend</option>
                  <option value="Partner">Partner / Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Parent">Parent</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-plum-900 to-rosewood-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-soft hover:opacity-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Generating Suggestions...' : 'Generate 3 Messages'}</span>
            </button>

            {aiSuggestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Select a suggestion to apply:
                </span>
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-plum-100 space-y-2">
                    <p className="text-xs text-slate-700 leading-relaxed font-light">{suggestion}</p>
                    <button
                      type="button"
                      onClick={() => handleApplyAISuggestion(suggestion)}
                      className="text-xs font-bold text-rosewood-600 hover:text-rosewood-700 flex items-center gap-1"
                    >
                      <span>Insert This Message</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Website Content?"
        message="Are you sure you want to reset this website? All entered names and messages will be reverted to blank defaults."
        confirmLabel="Yes, Reset Draft"
        cancelLabel="Keep Editing"
        variant="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

    </div>
  );
};

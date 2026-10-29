import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { WishConfig } from '../types';
import { INITIAL_SAMPLE_WISHES, DEFAULT_NEW_WISH } from '../data/sampleWishes';
import { WishContext } from './WishContextBase';
import { api, BACKEND_HOST, getPublicWishUrl } from '../services/api';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'wishcraft_saved_creations';
const DRAFT_KEY = 'wishcraft_active_draft';

function sanitizeMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_HOST}${path}`;
}

function mapBackendToWishConfig(backendItem: any): WishConfig {
  return {
    id: backendItem.id,
    occasion: backendItem.occasion || 'birthday',
    recipientName: backendItem.recipient_name || '',
    senderName: backendItem.sender_name || '',
    relationship: backendItem.relationship || 'Friend',
    message: backendItem.message || '',
    tone: backendItem.tone || 'Heartfelt',
    photoUrl: sanitizeMediaUrl(backendItem.photo_url),
    photoMemories: (backendItem.photo_memories || []).map((m: any) => ({
      id: m.id || m.asset_id,
      url: sanitizeMediaUrl(m.url),
      caption: m.caption,
    })),
    templateId: backendItem.template_id || 'blush-celebration',
    colorScheme: backendItem.color_scheme || 'default',
    enableConfetti: backendItem.enable_confetti ?? true,
    enableFloatingHearts: backendItem.enable_floating_hearts ?? true,
    enableSoundDemo: backendItem.enable_sound_demo ?? true,
    isFavorite: backendItem.is_favorite ?? false,
    status: backendItem.status,
    slug: backendItem.published_site?.slug,
    isPublished: backendItem.published_site?.is_published ?? false,
    createdAt: backendItem.created_at || new Date().toISOString(),
    updatedAt: backendItem.updated_at || new Date().toISOString(),
  };
}

function mapWishConfigToBackend(wish: WishConfig): any {
  return {
    occasion: wish.occasion,
    recipient_name: wish.recipientName,
    sender_name: wish.senderName,
    relationship: wish.relationship,
    message: wish.message,
    tone: wish.tone,
    template_id: wish.templateId,
    color_scheme: wish.colorScheme,
    photo_url: wish.photoUrl,
    enable_confetti: wish.enableConfetti,
    enable_floating_hearts: wish.enableFloatingHearts,
    enable_sound_demo: wish.enableSoundDemo,
    is_favorite: wish.isFavorite ?? false,
    photo_memories: (wish.photoMemories || []).map((m, idx) => ({
      asset_id: m.id || `mem-${idx}`,
      url: m.url,
      caption: m.caption || '',
      display_order: idx,
    })),
  };
}

export const WishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [creations, setCreations] = useState<WishConfig[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_WISHES;
  });

  const [currentWish, setCurrentWish] = useState<WishConfig>(() => {
    try {
      const storedDraft = localStorage.getItem(DRAFT_KEY);
      if (storedDraft) {
        return JSON.parse(storedDraft);
      }
    } catch {
      // Fallback
    }
    return {
      ...INITIAL_SAMPLE_WISHES[0],
      id: `draft-${Date.now()}`,
    };
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const isSavingRef = useRef(false);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Sync creations from backend when authenticated
  const refreshCreations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const remoteCreations = await api.creations.list();
      const mapped = remoteCreations.map(mapBackendToWishConfig);
      setCreations(mapped);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
    } catch (e) {
      console.warn('Could not sync creations from API:', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCreations();
    }
  }, [isAuthenticated, refreshCreations]);

  // Sync draft to localStorage as local mirror
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(currentWish));
    } catch (e) {
      console.warn('Could not save draft to localStorage:', e);
    }
  }, [currentWish]);

  const updateCurrentWish = (updates: Partial<WishConfig>) => {
    setCurrentWish(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetCurrentWish = () => {
    const blank: WishConfig = {
      ...DEFAULT_NEW_WISH,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentWish(blank);
    showToast('Reset to a fresh draft template', 'info');
  };

  // Upload permanent photo to backend
  const uploadPhoto = async (file: File): Promise<string> => {
    try {
      const res = await api.uploads.uploadPhoto(file);
      // Prepend host if relative path returned
      const fullUrl = res.url.startsWith('http')
        ? res.url
        : `${BACKEND_HOST}${res.url}`;
      return fullUrl;
    } catch (error) {
      console.warn('Backend upload failed, using local fallback:', error);
      showToast('Uploaded photo locally. Connecting to backend for permanent sync.', 'info');
      return URL.createObjectURL(file);
    }
  };

  // Save current wish to backend (or fallback to localStorage)
  const saveCurrentWish = async (): Promise<WishConfig> => {
    if (isSavingRef.current) return currentWish;
    isSavingRef.current = true;
    setSaveStatus('saving');

    const isBackendUuid = currentWish.id && !currentWish.id.startsWith('draft-') && !currentWish.id.startsWith('wish-');
    let savedWish: WishConfig = { ...currentWish, updatedAt: new Date().toISOString() };

    try {
      const payload = mapWishConfigToBackend(currentWish);
      let res: any;

      if (isBackendUuid) {
        try {
          res = await api.creations.update(currentWish.id, payload);
        } catch (updateErr: any) {
          if (updateErr.status === 404) {
            console.warn('Creation ID not found on server, creating fresh record:', currentWish.id);
            res = await api.creations.create(payload);
          } else {
            throw updateErr;
          }
        }
      } else {
        res = await api.creations.create(payload);
      }

      savedWish = mapBackendToWishConfig(res);
      setSaveStatus('saved');
      showToast('Celebration saved successfully!', 'success');
    } catch (err: any) {
      console.warn('API save error, saving to local offline storage:', err);
      // Local fallback save
      setSaveStatus('saved');
      showToast('Saved locally in your browser.', 'info');
    } finally {
      isSavingRef.current = false;
      setTimeout(() => setSaveStatus('idle'), 3000);
    }

    // Update state and creations list
    setCurrentWish(savedWish);
    setCreations(prev => {
      const idx = prev.findIndex(w => w.id === savedWish.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedWish;
        return next;
      }
      return [savedWish, ...prev];
    });

    return savedWish;
  };

  const deleteWish = async (id: string) => {
    try {
      if (!id.startsWith('draft-') && !id.startsWith('wish-')) {
        await api.creations.delete(id);
      }
    } catch (e) {
      console.warn('Failed to delete on server:', e);
    }
    setCreations(prev => prev.filter(w => w.id !== id));
    showToast('Creation removed', 'info');
  };

  const duplicateWish = async (id: string): Promise<WishConfig | null> => {
    try {
      if (!id.startsWith('draft-') && !id.startsWith('wish-')) {
        const res = await api.creations.duplicate(id);
        const copy = mapBackendToWishConfig(res);
        setCreations(prev => [copy, ...prev]);
        showToast(`Duplicated "${copy.recipientName}"`, 'success');
        return copy;
      }
    } catch (e) {
      console.warn('Remote duplicate failed, duplicating locally:', e);
    }

    const target = creations.find(w => w.id === id);
    if (!target) return null;

    const copy: WishConfig = {
      ...target,
      id: `draft-${Date.now()}`,
      recipientName: `${target.recipientName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCreations(prev => [copy, ...prev]);
    showToast(`Duplicated "${target.recipientName}"`, 'success');
    return copy;
  };

  const loadWishForEdit = (id: string): boolean => {
    const target = creations.find(w => w.id === id);
    if (!target) return false;
    setCurrentWish({ ...target });
    return true;
  };

  // Publish current wish
  const publishCurrentWish = async (options?: { custom_slug?: string; privacy?: string; pin?: string }) => {
    // 1. Ensure draft is saved first
    let saved = await saveCurrentWish();

    // If still a local draft ID, force persistence to backend before publishing
    if (!saved.id || saved.id.startsWith('draft-') || saved.id.startsWith('wish-')) {
      const payload = mapWishConfigToBackend(saved);
      const res = await api.creations.create(payload);
      saved = mapBackendToWishConfig(res);
      setCurrentWish(saved);
    }

    // 2. Call backend publish with self-healing fallback
    let pubRes: any;
    try {
      pubRes = await api.public.publish(saved.id, {
        custom_slug: options?.custom_slug,
        privacy: options?.privacy || 'public',
        pin: options?.pin,
      });
    } catch (pubErr: any) {
      if (pubErr.status === 404) {
        console.warn('Backend reported celebration not found during publish. Creating fresh record...');
        const payload = mapWishConfigToBackend(saved);
        const freshRes = await api.creations.create(payload);
        saved = mapBackendToWishConfig(freshRes);
        setCurrentWish(saved);
        pubRes = await api.public.publish(saved.id, {
          custom_slug: options?.custom_slug,
          privacy: options?.privacy || 'public',
          pin: options?.pin,
        });
      } else {
        throw pubErr;
      }
    }

    // 3. Update current wish with slug
    const updatedWish: WishConfig = {
      ...saved,
      slug: pubRes.slug,
      isPublished: true,
      status: 'published',
    };
    setCurrentWish(updatedWish);

    // Update in creations list
    setCreations(prev => prev.map(c => c.id === saved.id ? updatedWish : c));

    // Construct canonical public URL (never localhost in production)
    const publicUrl = getPublicWishUrl(pubRes.slug);

    return {
      slug: pubRes.slug,
      public_url: publicUrl,
    };
  };

  // Unpublish
  const unpublishWish = async (id: string) => {
    try {
      await api.public.unpublish(id);
      setCurrentWish(prev => prev.id === id ? { ...prev, isPublished: false, status: 'draft' } : prev);
      setCreations(prev => prev.map(c => c.id === id ? { ...c, isPublished: false, status: 'draft' } : c));
      showToast('Celebration unpublished. Public link is now inactive.', 'info');
    } catch (e: any) {
      showToast(e.message || 'Failed to unpublish celebration.', 'error');
    }
  };

  return (
    <WishContext.Provider
      value={{
        currentWish,
        setCurrentWish,
        updateCurrentWish,
        resetCurrentWish,
        creations,
        saveCurrentWish,
        deleteWish,
        duplicateWish,
        loadWishForEdit,
        uploadPhoto,
        publishCurrentWish,
        unpublishWish,
        saveStatus,
        toast,
        showToast,
        refreshCreations,
      }}
    >
      {children}
    </WishContext.Provider>
  );
};

export { useWish } from './WishContextBase';

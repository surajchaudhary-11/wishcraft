import { createContext, useContext } from 'react';
import type { WishConfig } from '../types';

export interface WishContextType {
  currentWish: WishConfig;
  setCurrentWish: React.Dispatch<React.SetStateAction<WishConfig>>;
  updateCurrentWish: (updates: Partial<WishConfig>) => void;
  resetCurrentWish: () => void;
  creations: WishConfig[];
  saveCurrentWish: () => Promise<WishConfig>;
  deleteWish: (id: string) => Promise<void>;
  duplicateWish: (id: string) => Promise<WishConfig | null>;
  loadWishForEdit: (id: string) => Promise<boolean> | boolean;
  uploadPhoto: (file: File) => Promise<string>;
  publishCurrentWish: (options?: { custom_slug?: string; privacy?: string; pin?: string }) => Promise<{ slug: string; public_url: string }>;
  unpublishWish: (id: string) => Promise<void>;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  refreshCreations: () => Promise<void>;
}

export const WishContext = createContext<WishContextType | undefined>(undefined);

export const useWish = () => {
  const context = useContext(WishContext);
  if (!context) {
    throw new Error('useWish must be used within a WishProvider');
  }
  return context;
};

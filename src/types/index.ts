export type OccasionType = 
  | 'birthday'
  | 'anniversary'
  | 'romance'
  | 'friendship'
  | 'family'
  | 'just-because';

export type TemplateStyle = 
  | 'Romantic'
  | 'Cute'
  | 'Minimal'
  | 'Elegant'
  | 'Playful'
  | 'Photo Gallery'
  | 'Retro';

export type RelationshipType = 
  | 'Friend'
  | 'Partner'
  | 'Sibling'
  | 'Parent'
  | 'Colleague'
  | 'Other';

export type MessageTone = 
  | 'Heartfelt'
  | 'Funny'
  | 'Romantic'
  | 'Cute'
  | 'Emotional';

export interface PhotoMemory {
  id: string;
  url: string;
  caption?: string;
}

export interface WishConfig {
  id: string;
  occasion: OccasionType;
  recipientName: string;
  senderName: string;
  relationship: RelationshipType;
  message: string;
  tone: MessageTone;
  photoUrl: string;
  photoMemories: PhotoMemory[];
  templateId: string;
  colorScheme: string; // 'default' | 'vibrant' | 'pastel' | 'monochrome'
  enableConfetti: boolean;
  enableFloatingHearts: boolean;
  enableSoundDemo: boolean;
  isFavorite?: boolean;
  status?: 'draft' | 'published';
  slug?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  style: TemplateStyle;
  occasion: OccasionType;
  description: string;
  longDescription: string;
  accentColor: string;
  badgeText: string;
  thumbnail: string;
  features: string[];
  colorVariations: { id: string; name: string; hex: string; bgClass: string }[];
  defaultWish: Partial<WishConfig>;
}

export interface OccasionInfo {
  id: OccasionType;
  title: string;
  subtitle: string;
  description: string;
  accentGradient: string;
  badge: string;
  imageUrl: string;
  exampleRecipient: string;
  isReady: boolean;
}

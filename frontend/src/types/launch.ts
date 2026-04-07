export interface LaunchInput {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  usp: string; // Proposta Única de Valor
  price: number;
  originalPrice?: number;
  captacaoStart: string; // ISO date
  captacaoEnd: string;   // ISO date
  liveDate: string;
  liveTime: string;
  livePlatform: 'YouTube' | 'Instagram' | 'Zoom';
  instructorName: string;
  instructorBio: string;
  bonuses: string[];
  guarantee?: string;
  metaCampaignId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdCopyVariant {
  id: string;
  phase: 'captacao' | 'perpetual';
  format: 'feed' | 'story' | 'reel';
  headline: string;
  primaryText: string;
  cta: string;
}

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  benefits: string[];
  aboutInstructor: string;
  ctaText: string;
}

export interface SalesPageCopy {
  headline: string;
  subheadline: string;
  problemStatement: string;
  solution: string;
  benefits: string[];
  testimonialPlaceholders: string[];
  bonusSection: string;
  priceSection: string;
  guarantee: string;
  faq: { question: string; answer: string }[];
  ctaText: string;
}

export interface GeneratedAssets {
  launchId: string;
  metaAdsCopy?: {
    captacao: AdCopyVariant[];
    perpetual: AdCopyVariant[];
  };
  landingPageCopy?: LandingPageCopy;
  salesPageCopy?: SalesPageCopy;
  youtubeThumbnailText?: { headline: string; subheadline: string };
}

export type LaunchFormData = Omit<LaunchInput, 'id' | 'createdAt' | 'updatedAt'>;

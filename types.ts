
export enum FitType {
  SLIM = 'slim',
  REGULAR = 'regular',
  LOOSE = 'loose'
}

export enum SleeveLength {
  SHORT = 'short',
  LONG = 'long',
  SLEEVELESS = 'sleeveless'
}

export interface GenerationConfig {
  fit: FitType;
  sleeve: SleeveLength;
  realism: number;
  colorCorrection: boolean;
  customPrompt?: string;
  engine: 'standard' | 'pro';
}

export interface GenerationResult {
  id: string;
  originalPersonUrl: string;
  originalGarmentUrl: string;
  resultImageUrl: string;
  createdAt: string;
  config: GenerationConfig;
}

export interface WebsiteConfig {
  siteName: string;
  logoUrl: string;
  primaryColor: string; // Hex code
  promoText: string;
  showPromoBanner: boolean;
  layoutStyle: 'modern' | 'classic' | 'minimal';
  heroAlignment: 'left' | 'center';
  showTestimonials: boolean;
}

export enum Page {
  LANDING = 'landing',
  TOOL = 'tool',
  PRICING = 'pricing',
  DASHBOARD = 'dashboard',
  LOGIN = 'login',
  ADMIN = 'admin'
}

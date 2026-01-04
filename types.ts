
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
}

export interface GenerationResult {
  id: string;
  originalPersonUrl: string;
  originalGarmentUrl: string;
  resultImageUrl: string;
  createdAt: string;
  config: GenerationConfig;
}

export enum Page {
  LANDING = 'landing',
  TOOL = 'tool',
  PRICING = 'pricing',
  DASHBOARD = 'dashboard'
}

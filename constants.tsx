
import { WebsiteConfig } from './types';

export const DEFAULT_CONFIG: WebsiteConfig = {
  siteName: "Titik Kreatif Studio",
  logoUrl: "https://i.ibb.co/pBqXy9z/titik-kreatif-logo.png",
  primaryColor: "#f59e0b", // amber-500
  promoText: "New Year Sale: Get 20% extra credits with code CREATIVE2024",
  showPromoBanner: true,
  layoutStyle: 'modern',
  heroAlignment: 'left',
  showTestimonials: true
};

// Fix: Export APP_NAME and LOGO_URL for use in authentication components
export const APP_NAME = DEFAULT_CONFIG.siteName;
export const LOGO_URL = DEFAULT_CONFIG.logoUrl;

export const PRESET_GARMENTS = [
  { id: 'g1', name: 'Premium White Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
  { id: 'g2', name: 'Black Hoodie', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
  { id: 'g3', name: 'Flannel Shirt', url: 'https://images.unsplash.com/photo-1588359348347-9bc6cbb6cf97?auto=format&fit=crop&q=80&w=400' },
  { id: 'g4', name: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576905341935-4ef2443449c0?auto=format&fit=crop&q=80&w=400' },
];

export const TESTIMONIALS = [
  { name: "Alex Rivera", role: "E-com Founder", text: "Titik Kreatif saved us thousands in photoshoot costs. The realism is uncanny." },
  { name: "Sarah Chen", role: "Fashion Designer", text: "Perfect for rapid prototyping of patterns and fits." },
  { name: "Jordan Smith", role: "Content Creator", text: "Finally an AI tool that actually keeps the person's face recognizable." }
];

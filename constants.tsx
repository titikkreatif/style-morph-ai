import { WebsiteConfig } from './types';

// A stylish "TK" logo mark in SVG format (Data URI)
const TK_LOGO_SVG = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiByeD0iNjAiIGZpbGw9IiMwRjE3MkEiLz4KPHBhdGggZD0iTTgwIDE4MEgyMjBNMTUwIDE4MFYzODBNMzAwIDE4MFYzODBNNDIwIDE4MEwzMDAgMjgwTTQyMCAzODBMMzAwIDI4MCIgc3Ryb2tlPSIjRjU5RTBCIiBzdHJva2Utd2lkdGg9IjQwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+`;

export const DEFAULT_CONFIG: WebsiteConfig = {
  siteName: "Titik Kreatif Studio",
  logoUrl: TK_LOGO_SVG,
  primaryColor: "#f59e0b", // amber-500
  promoText: "New Year Sale: Get 20% extra credits with code CREATIVE2024",
  showPromoBanner: true,
  layoutStyle: 'modern',
  heroAlignment: 'left',
  showTestimonials: true,
  stripeLinks: {
    starter: '',
    pro: '',
    business: ''
  }
};

export const APP_NAME = DEFAULT_CONFIG.siteName;
export const LOGO_URL = DEFAULT_CONFIG.logoUrl;

export const PRESET_GARMENTS = [
  { id: 'g1', name: 'Premium White Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
  { id: 'g2', name: 'Black Hoodie', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
  { id: 'g3', name: 'Flannel Jacket', url: 'https://images.unsplash.com/photo-1588359348347-9bc6cbb6cf97?auto=format&fit=crop&q=80&w=400' },
  { id: 'g4', name: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576905341935-4ef2443449c0?auto=format&fit=crop&q=80&w=400' },
  { id: 'g5', name: 'Leather Biker', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400' },
  { id: 'g6', name: 'Beige Trench', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400' },
  { id: 'g7', name: 'Silk Blouse', url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=400' },
  { id: 'g8', name: 'Olive Parka', url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=400' },
];

export const TESTIMONIALS = [
  { name: "Alex Rivera", role: "E-com Founder", text: "Titik Kreatif saved us thousands in photoshoot costs. The realism is uncanny." },
  { name: "Sarah Chen", role: "Fashion Designer", text: "Perfect for rapid prototyping of patterns and fits." },
  { name: "Jordan Smith", role: "Content Creator", text: "Finally an AI tool that actually keeps the person's face recognizable." }
];
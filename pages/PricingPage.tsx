import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Page, WebsiteConfig } from '../types';
import { firestoreService } from '../services/firestoreService';
import { DEFAULT_CONFIG } from '../constants';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [config, setConfig] = useState<WebsiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const loadConfig = async () => {
      const remoteConfig = await firestoreService.getWebsiteConfig();
      if (remoteConfig) setConfig(remoteConfig);
    };
    loadConfig();
  }, []);

  const handleStripeCheckout = async (tierName: string) => {
    const key = tierName.toLowerCase() as keyof WebsiteConfig['stripeLinks'];
    const link = config.stripeLinks?.[key];

    if (link && link.trim() !== '') {
      setLoadingTier(tierName);
      // Real redirection to the provided Stripe Payment Link
      window.open(link, '_blank', 'noopener,noreferrer');
      setLoadingTier(null);
    } else if (tierName === "Free") {
      onNavigate(Page.TOOL);
    } else {
      alert(`The ${tierName} plan is currently being configured by the studio administrator. Please check back soon or contact support.`);
    }
  };

  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "For testing and personal fun",
      features: ["5 generations per month", "Standard resolution (720p)", "Studio Watermark", "Community Support"],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Starter",
      price: "$5",
      period: "/mo",
      desc: "Perfect for hobbyists & creators",
      features: ["50 generations per month", "High Resolution (1080p)", "No Watermark", "Email Support"],
      cta: "Monthly Subscription",
      featured: false,
      isStripe: true
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      desc: "Perfect for creators & designers",
      features: ["Unlimited generations", "High-Resolution (2K)", "No Watermark", "Batch Processing", "Priority Support"],
      cta: "Try Pro Free",
      featured: true,
      isStripe: true
    },
    {
      name: "Business",
      price: "$99",
      period: "/mo",
      desc: "For e-commerce & brands",
      features: ["API Access", "4K Resolution output", "Bulk Uploads", "Team Accounts", "Dedicated Account Manager"],
      cta: "Upgrade to Business",
      featured: false,
      isStripe: true
    }
  ];

  return (
    <div className="py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">Simple, transparent pricing</h1>
          <p className="text-slate-400 text-lg">Choose the plan that fits your production workflow. Scale as your studio grows.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02] ${tier.featured ? 'bg-slate-900 border-amber-500 shadow-2xl shadow-amber-500/10' : 'bg-slate-900/50 border-slate-800'}`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2 text-white">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
                </div>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed min-h-[40px]">{tier.desc}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300 leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.featured ? 'primary' : 'outline'} 
                className="w-full flex items-center justify-center gap-2 group"
                isLoading={loadingTier === tier.name}
                onClick={() => handleStripeCheckout(tier.name)}
              >
                {tier.isStripe && (
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.911 8.02c0-1.152-.942-1.764-2.529-1.764-1.588 0-2.825.441-3.66 1.059l-.49-1.87c.983-.655 2.529-1.121 4.394-1.121 3.25 0 5.176 1.63 5.176 4.332 0 4.14-5.647 4.697-5.647 6.47 0 .424.323.712.983.712 1.343 0 2.859-.441 3.73-.966l.542 1.832c-1.106.746-2.906 1.188-4.577 1.188-3.323 0-5.123-1.63-5.123-4.312 0-4.14 5.617-4.664 5.617-6.536z" />
                  </svg>
                )}
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center space-y-10">
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Trusted by global fashion innovators</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-20 grayscale invert">
            {['Nike', 'Zara', 'ASOS', 'Adidas', 'Gucci'].map(brand => (
              <span key={brand} className="text-3xl font-black italic tracking-tighter hover:opacity-100 transition-opacity cursor-default">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
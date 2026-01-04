
import React from 'react';
import { Button } from '../components/Button';
import { Page } from '../types';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "For testing and personal fun",
      features: ["5 generations per month", "Standard resolution (720p)", "StyleMorph Watermark", "Community Support"],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      desc: "Perfect for creators & designers",
      features: ["Unlimited generations", "High-Resolution (2K)", "No Watermark", "Batch Processing", "Priority Support"],
      cta: "Try Pro Free",
      featured: true
    },
    {
      name: "Business",
      price: "$99",
      period: "/mo",
      desc: "For e-commerce & brands",
      features: ["API Access", "4K Resolution output", "Bulk Uploads", "Team Accounts", "Dedicated Account Manager"],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold">Simple, transparent pricing</h1>
          <p className="text-slate-400 text-lg">Choose the plan that fits your workflow. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative flex flex-col p-8 rounded-3xl border transition-all ${tier.featured ? 'bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900/50 border-slate-800'}`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
                </div>
                <p className="text-slate-400 text-sm mt-3">{tier.desc}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-slate-300">{f}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.featured ? 'primary' : 'outline'} 
                className="w-full"
                onClick={() => onNavigate(Page.TOOL)}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center space-y-4">
          <p className="text-slate-500 font-medium">Trusted by leading teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale invert">
            {['Nike', 'Zara', 'ASOS', 'Adidas', 'Gucci'].map(brand => (
              <span key={brand} className="text-2xl font-black italic">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

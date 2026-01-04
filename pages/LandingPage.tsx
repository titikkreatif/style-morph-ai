
import React from 'react';
import { Page } from '../types';
import { Button } from '../components/Button';
import { TESTIMONIALS } from '../constants';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Next-Gen Virtual Try-On</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Change Clothes in Any Photo <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Instantly with AI</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0">
              Upload a photo. Select a garment. Our AI naturally fits any clothing onto any person while preserving identity, lighting, and pose. No Photoshop needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button size="lg" onClick={() => onNavigate(Page.TOOL)}>Try Free Now</Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate(Page.PRICING)}>View Pricing</Button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">100k+</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Generations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">2.4s</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Avg. Speed</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
             <div className="relative z-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="rounded-lg grayscale brightness-50" alt="Original" />
                    <p className="text-center text-xs font-semibold text-slate-500 uppercase">Original Photo</p>
                  </div>
                  <div className="space-y-4">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="rounded-lg shadow-xl shadow-indigo-500/20" alt="AI Generated" />
                    <p className="text-center text-xs font-semibold text-indigo-400 uppercase">AI Enhanced</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xl max-w-[180px]">
                   <p className="text-xs text-slate-400 mb-2">Processing...</p>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-3/4 animate-pulse"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">Built for Professionals</h2>
            <p className="text-slate-400">Everything you need to create perfect fashion mockups.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Identity Preserved", desc: "Our models strictly separate garment layers from the person, ensuring faces and features remain unchanged.", icon: "👤" },
              { title: "Physics-Aware", desc: "AI understands fabric weight and body geometry to create realistic wrinkles, shadows, and drapes.", icon: "👕" },
              { title: "Lighting Matching", desc: "The new garment inherits the color temperature and shadows of your original environment naturally.", icon: "✨" }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex flex-col justify-between space-y-6">
                <p className="text-lg italic text-slate-300">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30"></div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 text-center bg-indigo-600">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-extrabold text-white">Ready to transform your images?</h2>
          <p className="text-indigo-100 text-lg">Join 10,000+ fashion creators and start generating today.</p>
          <Button variant="secondary" size="lg" className="bg-white text-indigo-600 hover:bg-slate-100" onClick={() => onNavigate(Page.TOOL)}>Start Generating for Free</Button>
        </div>
      </section>
    </div>
  );
};

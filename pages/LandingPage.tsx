
import React from 'react';
import { Page, WebsiteConfig } from '../types';
import { Button } from '../components/Button';
import { TESTIMONIALS } from '../constants';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  config: WebsiteConfig;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, config }) => {
  const isCentered = config.heroAlignment === 'center';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative pt-32 pb-32 px-6 overflow-hidden ${isCentered ? 'text-center' : 'text-left'}`}>
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] blur-[160px] rounded-full -z-10 opacity-10"
          style={{ backgroundColor: config.primaryColor }}
        ></div>
        
        <div className={`max-w-7xl mx-auto flex flex-col ${isCentered ? 'items-center' : 'lg:flex-row'} items-center gap-16`}>
          <div className={`flex-1 space-y-8 ${isCentered ? 'max-w-3xl' : ''}`}>
            <div 
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: `${config.primaryColor}1A`, borderColor: `${config.primaryColor}33`, color: config.primaryColor }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: config.primaryColor }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: config.primaryColor }}></span>
              </span>
              <span>Next-Gen Visual Production</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Professional <span style={{ color: config.primaryColor }}>AI Fashion Studio</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 leading-relaxed mx-auto lg:mx-0">
              Transform fashion photography at {config.siteName}. Our studio-grade AI naturally fits garments onto any silhouette while preserving identity and lighting.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center gap-4 ${isCentered ? 'justify-center' : ''}`}>
              <button 
                className="px-8 py-4 text-lg font-bold rounded-xl text-slate-950 shadow-2xl transition-all hover:scale-105 active:scale-95" 
                onClick={() => onNavigate(Page.TOOL)} 
                style={{ backgroundColor: config.primaryColor }}
              >
                Launch Swap Engine
              </button>
              <Button variant="outline" size="lg" onClick={() => onNavigate(Page.PRICING)}>Explore Studio Plans</Button>
            </div>
          </div>
          
          {!isCentered && (
            <div className="flex-1 relative">
               <div className="relative z-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400" className="rounded-xl grayscale brightness-50 border border-slate-800" alt="Original" />
                      <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset Context</p>
                    </div>
                    <div className="space-y-4">
                      <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400" className="rounded-xl shadow-xl border border-white/10" style={{ boxShadow: `0 0 40px ${config.primaryColor}1A` }} alt="AI Generated" />
                      <p className="text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: config.primaryColor }}>Studio Result</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl max-w-[200px]">
                     <p className="text-xs text-slate-400 mb-2 font-medium">Neural Rendering...</p>
                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full animate-pulse" style={{ backgroundColor: config.primaryColor, width: '75%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950/80 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-white">Studio-Grade Infrastructure</h2>
            <p className="text-slate-400">Precision-engineered for high-stakes fashion production.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Identity Preserved", desc: "Our models separate garment layers with pixel-perfect accuracy, ensuring faces and textures remain pristine.", icon: "👤" },
              { title: "Dynamic Physics", desc: "AI understands fabric drape and weight, generating realistic wrinkles and shadows based on body pose.", icon: "👕" },
              { title: "Neural Lighting", desc: "Garments inherit the environment's color temperature and global illumination automatically.", icon: "✨" }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:border-white/20 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {config.showTestimonials && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="flex flex-col justify-between space-y-8">
                  <p className="text-lg italic text-slate-300 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center font-bold" style={{ backgroundColor: `${config.primaryColor}1A`, borderColor: `${config.primaryColor}33`, color: config.primaryColor }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="py-24 px-6 text-center" style={{ background: `linear-gradient(to bottom right, ${config.primaryColor}, ${config.primaryColor}CC)` }}>
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-extrabold text-slate-950">Elevate Your Visual Content</h2>
          <p className="text-slate-900 text-lg font-medium">Join {config.siteName} and revolutionize your fashion workflow.</p>
          <Button variant="secondary" size="lg" className="bg-slate-950 text-white border-none shadow-2xl hover:scale-105" onClick={() => onNavigate(Page.TOOL)}>Enter the Studio</Button>
        </div>
      </section>
    </div>
  );
};

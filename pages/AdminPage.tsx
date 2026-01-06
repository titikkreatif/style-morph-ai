import React, { useState, useRef } from 'react';
import { WebsiteConfig, Page } from '../types';
import { Button } from '../components/Button';

interface AdminPageProps {
  config: WebsiteConfig;
  onUpdateConfig: (newConfig: WebsiteConfig) => void;
  onNavigate: (page: Page) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ config, onUpdateConfig, onNavigate }) => {
  const [localConfig, setLocalConfig] = useState<WebsiteConfig>({ 
    ...config,
    stripeLinks: config.stripeLinks || { starter: '', pro: '', business: '' }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateConfig(localConfig);
    alert('Studio Configuration Updated Successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalConfig({ ...localConfig, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const updateStripeLink = (tier: keyof WebsiteConfig['stripeLinks'], val: string) => {
    setLocalConfig({
      ...localConfig,
      stripeLinks: {
        ...localConfig.stripeLinks,
        [tier]: val
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Studio Administration</h1>
          <p className="text-slate-400 mt-2 font-medium">Configure your studio's branding, payments, and layout.</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate(Page.DASHBOARD)}>Exit Admin</Button>
      </div>

      <div className="grid gap-10">
        {/* Identity Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 lg:p-10 space-y-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">ID</div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Studio Identity</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Brandmark (Logo)</label>
              <div className="flex items-start gap-6">
                <div className="w-28 h-28 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-3 overflow-hidden shrink-0 shadow-inner">
                  <img src={localConfig.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="space-y-3 flex-1">
                  <Button variant="secondary" size="sm" className="w-full text-[10px]" onClick={triggerFileUpload}>
                    Change Image
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                    onChange={handleFileChange} 
                  />
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">Upload your studio logo. PNG with transparency is preferred for dark mode compatibility.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Studio Display Name</label>
                <input 
                  type="text" 
                  value={localConfig.siteName}
                  onChange={(e) => setLocalConfig({...localConfig, siteName: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                  placeholder="e.g. Titik Kreatif Studio"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Manual Logo URL</label>
                <input 
                  type="text" 
                  value={localConfig.logoUrl.startsWith('data:') ? 'Custom Asset Uploaded' : localConfig.logoUrl}
                  onChange={(e) => setLocalConfig({...localConfig, logoUrl: e.target.value})}
                  disabled={localConfig.logoUrl.startsWith('data:')}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                />
                {localConfig.logoUrl.startsWith('data:') && (
                   <button 
                     onClick={() => setLocalConfig({...localConfig, logoUrl: config.logoUrl})}
                     className="text-[10px] text-amber-500 font-bold hover:underline ml-1"
                   >
                     Reset to Default Logo
                   </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Payments Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 lg:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.911 8.02c0-1.152-.942-1.764-2.529-1.764-1.588 0-2.825.441-3.66 1.059l-.49-1.87c.983-.655 2.529-1.121 4.394-1.121 3.25 0 5.176 1.63 5.176 4.332 0 4.14-5.647 4.697-5.647 6.47 0 .424.323.712.983.712 1.343 0 2.859-.441 3.73-.966l.542 1.832c-1.106.746-2.906 1.188-4.577 1.188-3.323 0-5.123-1.63-5.123-4.312 0-4.14 5.617-4.664 5.617-6.536z" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">$</div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Payments & Monetization</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-medium">
              Paste your <span className="text-white font-bold underline">Stripe Payment Links</span> below to enable real checkouts. 
              Users will be redirected to Stripe when they click subscribe on the Pricing page.
            </p>
            
            <div className="grid md:grid-cols-1 gap-6">
              {[
                { id: 'starter', label: 'Starter Tier ($5/mo)', placeholder: 'https://buy.stripe.com/...' },
                { id: 'pro', label: 'Pro Tier ($29/mo)', placeholder: 'https://buy.stripe.com/...' },
                { id: 'business', label: 'Business Tier ($99/mo)', placeholder: 'https://buy.stripe.com/...' }
              ].map((tier) => (
                <div key={tier.id} className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tier.label}</label>
                    <span className="text-[9px] text-amber-500 font-bold uppercase tracking-tighter">Stripe URL</span>
                  </div>
                  <input 
                    type="url" 
                    value={localConfig.stripeLinks?.[tier.id as keyof WebsiteConfig['stripeLinks']] || ''}
                    onChange={(e) => updateStripeLink(tier.id as any, e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-5 py-3.5 text-xs text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                    placeholder={tier.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Appearance & Layout Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 lg:p-10 space-y-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black">🎨</div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Visual Architecture</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Studio Theme Color</label>
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <input 
                  type="color" 
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                  className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white uppercase tracking-tight">{localConfig.primaryColor}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Accent</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Alignment</label>
              <div className="flex p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <button 
                  onClick={() => setLocalConfig({...localConfig, heroAlignment: 'left'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${localConfig.heroAlignment === 'left' ? 'bg-slate-800 text-amber-500 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Left
                </button>
                <button 
                  onClick={() => setLocalConfig({...localConfig, heroAlignment: 'center'})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${localConfig.heroAlignment === 'center' ? 'bg-slate-800 text-amber-500 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Center
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Studio UI Preset</label>
              <select 
                value={localConfig.layoutStyle}
                onChange={(e) => setLocalConfig({...localConfig, layoutStyle: e.target.value as any})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3.5 text-xs text-white outline-none focus:border-amber-500 font-bold appearance-none"
              >
                <option value="modern">Modern Glassmorphism</option>
                <option value="classic">Classic Professional</option>
                <option value="minimal">Minimalist & Clean</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-slate-800 mt-auto">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-white uppercase tracking-tight">Social Proof</span>
                <span className="text-[10px] text-slate-500 font-medium block">Testimonials Section</span>
              </div>
              <button 
                onClick={() => setLocalConfig({...localConfig, showTestimonials: !localConfig.showTestimonials})}
                className={`w-12 h-6 rounded-full transition-all relative ${localConfig.showTestimonials ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${localConfig.showTestimonials ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-10 border-t border-slate-800/50">
          <Button size="lg" className="flex-1 py-5 text-sm uppercase tracking-[0.2em] font-black" onClick={handleSave}>Push Config to Studio</Button>
          <Button variant="outline" size="lg" className="px-10" onClick={() => setLocalConfig({...config})}>Discard</Button>
        </div>
      </div>
    </div>
  );
};
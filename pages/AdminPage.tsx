
import React, { useState, useRef } from 'react';
import { WebsiteConfig, Page } from '../types';
import { Button } from '../components/Button';

interface AdminPageProps {
  config: WebsiteConfig;
  onUpdateConfig: (newConfig: WebsiteConfig) => void;
  onNavigate: (page: Page) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ config, onUpdateConfig, onNavigate }) => {
  const [localConfig, setLocalConfig] = useState<WebsiteConfig>({ ...config });
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Studio Admin Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your website's identity and visual layout.</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate(Page.DASHBOARD)}>Back to Account</Button>
      </div>

      <div className="grid gap-8">
        {/* Identity Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-amber-500">◈</span> Branding & Identity
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Studio Logo</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-2 overflow-hidden shrink-0">
                  <img src={localConfig.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Action</p>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="sm" onClick={triggerFileUpload}>
                      Upload JPG/PNG
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg" 
                      onChange={handleFileChange} 
                    />
                    <p className="text-[10px] text-slate-500 italic">Recommended: Horizontal logo with transparent background.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Studio Name</label>
                <input 
                  type="text" 
                  value={localConfig.siteName}
                  onChange={(e) => setLocalConfig({...localConfig, siteName: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 transition-all"
                  placeholder="e.g. Titik Kreatif Studio"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase font-mono">Manual Logo URL (Optional)</label>
                <input 
                  type="text" 
                  value={localConfig.logoUrl.startsWith('data:') ? 'Base64 Uploaded' : localConfig.logoUrl}
                  onChange={(e) => setLocalConfig({...localConfig, logoUrl: e.target.value})}
                  disabled={localConfig.logoUrl.startsWith('data:')}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com/logo.png"
                />
                {localConfig.logoUrl.startsWith('data:') && (
                   <button 
                     onClick={() => setLocalConfig({...localConfig, logoUrl: config.logoUrl})}
                     className="text-[10px] text-amber-500 font-bold hover:underline ml-1"
                   >
                     Clear Uploaded File
                   </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-amber-500">◈</span> Promotions
            </h2>
            <button 
              onClick={() => setLocalConfig({...localConfig, showPromoBanner: !localConfig.showPromoBanner})}
              className={`w-12 h-6 rounded-full transition-all relative ${localConfig.showPromoBanner ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${localConfig.showPromoBanner ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Promotion Banner Text</label>
            <textarea 
              value={localConfig.promoText}
              onChange={(e) => setLocalConfig({...localConfig, promoText: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 min-h-[80px] resize-none"
              placeholder="Announce your latest deals here..."
            />
          </div>
        </section>

        {/* Appearance & Layout Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-amber-500">◈</span> Visual Layout
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Primary Theme Color</label>
              <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <input 
                  type="color" 
                  value={localConfig.primaryColor}
                  onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                  className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                />
                <span className="text-sm font-mono text-slate-400 font-bold uppercase">{localConfig.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Hero Text Alignment</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLocalConfig({...localConfig, heroAlignment: 'left'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${localConfig.heroAlignment === 'left' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  Left Align
                </button>
                <button 
                  onClick={() => setLocalConfig({...localConfig, heroAlignment: 'center'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${localConfig.heroAlignment === 'center' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                >
                  Center Align
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase">Website Style</label>
              <select 
                value={localConfig.layoutStyle}
                onChange={(e) => setLocalConfig({...localConfig, layoutStyle: e.target.value as any})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 appearance-none"
              >
                <option value="modern">Modern Glassmorphism</option>
                <option value="classic">Classic Professional</option>
                <option value="minimal">Minimalist & Clean</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 mt-auto">
              <div className="space-y-0.5">
                <span className="text-sm font-bold block">Testimonials Section</span>
                <span className="text-[10px] text-slate-500">Enable/Disable social proof</span>
              </div>
              <button 
                onClick={() => setLocalConfig({...localConfig, showTestimonials: !localConfig.showTestimonials})}
                className={`w-10 h-5 rounded-full transition-all relative ${localConfig.showTestimonials ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${localConfig.showTestimonials ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-4 border-t border-slate-800">
          <Button size="lg" className="flex-1" onClick={handleSave}>Apply Changes</Button>
          <Button variant="outline" size="lg" onClick={() => setLocalConfig({...config})}>Discard Edits</Button>
        </div>
      </div>
    </div>
  );
};

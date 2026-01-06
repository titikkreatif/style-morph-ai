
import React, { useState, useEffect } from 'react';
import { Page, FitType, SleeveLength, GarmentCategory, GenerationConfig } from '../types';
import { Button } from '../components/Button';
import { ImageDropzone } from '../components/ImageDropzone';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { PRESET_GARMENTS } from '../constants';
import { geminiService } from '../services/geminiService';
import { firestoreService } from '../services/firestoreService';

interface ToolPageProps {
  onNavigate: (page: Page) => void;
  userEmail: string;
}

export const ToolPage: React.FC<ToolPageProps> = ({ onNavigate, userEmail }) => {
  const [personImg, setPersonImg] = useState<string | null>(null);
  const [garmentImg, setGarmentImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finishResult, setFinishResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);

  const [config, setConfig] = useState<GenerationConfig>({
    fit: FitType.REGULAR,
    sleeve: SleeveLength.SHORT,
    category: [GarmentCategory.TOP],
    targetColor: '',
    backgroundPrompt: '',
    realism: 0.9,
    colorCorrection: true,
    customPrompt: '',
    engine: 'standard'
  });

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    // Assume window.aistudio is pre-configured and valid
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleConnectKey = async () => {
    // Assume success after triggering the selection to mitigate race conditions
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const toggleCategory = (cat: GarmentCategory) => {
    setConfig(prev => {
      const isSelected = prev.category.includes(cat);
      if (isSelected) {
        // Don't allow empty selection
        if (prev.category.length === 1) return prev;
        return { ...prev, category: prev.category.filter(c => c !== cat) };
      } else {
        return { ...prev, category: [...prev.category, cat] };
      }
    });
  };

  const toggleAllCategories = () => {
    const all = Object.values(GarmentCategory);
    if (config.category.length === all.length) {
      setConfig({ ...config, category: [GarmentCategory.TOP] });
    } else {
      setConfig({ ...config, category: all });
    }
  };

  const handleSelectPreset = async (id: string, url: string) => {
    setLoadingPresetId(id);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not fetch preset image.");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setGarmentImg(base64);
        setLoadingPresetId(null);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Failed to load preset:", err);
      setError("Failed to load preset garment.");
      setLoadingPresetId(null);
    }
  };

  const handleGenerate = async () => {
    if (!personImg || !garmentImg) return;
    
    if (config.engine === 'pro' && !hasKey) {
      setError("Please connect your Google Cloud API key to use the Pro engine.");
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await geminiService.performClothingSwap(personImg, garmentImg, config);
      setFinishResult(result);

      if (userEmail) {
        await firestoreService.saveGeneration(userEmail, {
          originalPersonUrl: `data:image/jpeg;base64,${personImg}`,
          originalGarmentUrl: `data:image/jpeg;base64,${garmentImg}`,
          resultImageUrl: result,
          config: config
        });
      }
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setHasKey(false);
        setError("Your session requires a valid paid API key for the Pro engine.");
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } else {
        setError(err.message || "Generation failed. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFinishResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      {config.engine === 'pro' && !hasKey && (
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-500">Pro Studio Key Required</h3>
            <p className="text-sm text-slate-400">
              Gemini 3 Pro requires a studio-linked API key. 
              Please ensure you select an API key from a project with 
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline"> billing enabled</a>.
            </p>
          </div>
          <Button onClick={handleConnectKey} className="whitespace-nowrap">Connect Studio Key</Button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Asset Uploads */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Asset Context</h3>
               <span className="text-[10px] text-slate-600 font-bold uppercase">Person / Model</span>
            </div>
            <ImageDropzone 
              label="Subject Photo" 
              previewUrl={personImg ? `data:image/jpeg;base64,${personImg}` : undefined}
              onImageSelect={(base64) => {
                setPersonImg(base64);
                setFinishResult(null);
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">2. Target Items</h3>
               <span className="text-[10px] text-slate-600 font-bold uppercase">Outfit / Elements</span>
            </div>
            <ImageDropzone 
              label="Item Image" 
              previewUrl={garmentImg ? `data:image/jpeg;base64,${garmentImg}` : undefined}
              onImageSelect={(base64) => {
                setGarmentImg(base64);
                setFinishResult(null);
              }}
            />
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Studio Presets</label>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_GARMENTS.map(garment => (
                  <button 
                    key={garment.id}
                    disabled={loadingPresetId !== null}
                    onClick={() => handleSelectPreset(garment.id, garment.url)}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-square bg-slate-900 ${loadingPresetId === garment.id ? 'border-amber-500 scale-95' : 'border-slate-800 hover:border-amber-500'}`}
                  >
                    <img src={garment.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={garment.name} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Viewport */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden min-h-[550px] flex items-center justify-center relative shadow-2xl">
            {!finishResult && !isGenerating && (
              <div className="text-center p-12 space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">Studio Ready</h2>
                <p className="text-slate-500 text-sm">Upload context assets and target items to begin neural synthesis.</p>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold mb-2">Neural Rendering...</h2>
                <p className="text-slate-400">Preserving identity across {config.category.length} items.</p>
              </div>
            )}
            {finishResult && personImg && (
              <ComparisonSlider 
                before={`data:image/jpeg;base64,${personImg}`} 
                after={finishResult} 
              />
            )}
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {finishResult && (
            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={() => {
                const link = document.createElement('a');
                link.href = finishResult;
                link.download = `tk-studio-${Date.now()}.png`;
                link.click();
              }}>Export High-Res</Button>
              <Button variant="outline" className="px-6" onClick={handleReset}>Reset Workspace</Button>
            </div>
          )}
        </div>

        {/* Right Column: Style Studio Controls */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 space-y-8">
              {/* Engine Mode */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Swap Engine</label>
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button onClick={() => setConfig({...config, engine: 'standard'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${config.engine === 'standard' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-400'}`}>Standard</button>
                  <button onClick={() => setConfig({...config, engine: 'pro'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${config.engine === 'pro' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-400'}`}>Pro Ultra</button>
                </div>
              </div>

              {/* Multi-Category Selector */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synthesis Targets</label>
                  <button 
                    onClick={toggleAllCategories}
                    className="text-[9px] font-black text-amber-500 uppercase hover:underline"
                  >
                    {config.category.length === Object.values(GarmentCategory).length ? 'Unselect All' : 'Full Outfit'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(GarmentCategory).map(cat => {
                    const active = config.category.includes(cat);
                    return (
                      <button 
                        key={cat} 
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase border transition-all text-left flex items-center justify-between ${active ? 'bg-slate-800 text-white border-slate-600 ring-2 ring-amber-500/20' : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'}`}
                      >
                        {cat}
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Studio FX */}
              <div className="space-y-5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Studio FX</label>
                
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-600 uppercase ml-1">Universal Color Override</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Matte Black, Pastel"
                    value={config.targetColor}
                    onChange={(e) => setConfig({...config, targetColor: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-600 uppercase ml-1">Background Scene</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Minimalist Studio, Beach"
                    value={config.backgroundPrompt}
                    onChange={(e) => setConfig({...config, backgroundPrompt: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Physical Properties (Visible if TOP is selected) */}
              {config.category.includes(GarmentCategory.TOP) && (
                <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Top Fit</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(FitType).map(f => (
                        <button key={f} onClick={() => setConfig({...config, fit: f})} className={`px-2 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${config.fit === f ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sleeve Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(SleeveLength).map(s => (
                        <button key={s} onClick={() => setConfig({...config, sleeve: s})} className={`px-2 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${config.sleeve === s ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-950 text-slate-600 border-slate-800 hover:border-slate-700'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Creative Brief */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Custom Artistic Brief</label>
                <textarea 
                  value={config.customPrompt}
                  onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 transition-all min-h-[80px] resize-none"
                  placeholder="Describe material textures, accessory positions, or specific outfit details..."
                />
              </div>

              <Button 
                className="w-full py-5 text-xs font-black uppercase tracking-[0.2em]" 
                size="lg" 
                disabled={!personImg || !garmentImg || isGenerating} 
                isLoading={isGenerating} 
                onClick={handleGenerate}
              >
                Launch Synthesis
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};

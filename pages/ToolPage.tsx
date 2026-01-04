
import React, { useState, useEffect } from 'react';
import { Page, FitType, SleeveLength, GenerationConfig } from '../types';
import { Button } from '../components/Button';
import { ImageDropzone } from '../components/ImageDropzone';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { PRESET_GARMENTS } from '../constants';
import { geminiService } from '../services/geminiService';

interface ToolPageProps {
  onNavigate: (page: Page) => void;
}

export const ToolPage: React.FC<ToolPageProps> = () => {
  const [personImg, setPersonImg] = useState<string | null>(null);
  const [garmentImg, setGarmentImg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  const [config, setConfig] = useState<GenerationConfig>({
    fit: FitType.REGULAR,
    sleeve: SleeveLength.SHORT,
    realism: 0.9,
    colorCorrection: true,
    customPrompt: '',
    engine: 'standard'
  });

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } else {
      setHasKey(true);
    }
  };

  const handleConnectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!personImg || !garmentImg) return;
    
    // Only block if Pro engine is selected and key is missing
    if (config.engine === 'pro' && !hasKey) {
      setError("Please connect your Google Cloud API key to use the Pro engine.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await geminiService.performClothingSwap(personImg, garmentImg, config);
      setResultImg(result);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setHasKey(false);
        setError("Your session requires an API key for the Pro engine. Please connect your key.");
      } else {
        setError(err.message || "Generation failed. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResultImg(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      {config.engine === 'pro' && !hasKey && (
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-500">Pro Studio Key Required</h3>
            <p className="text-sm text-slate-400">Artistic swaps and creative prompts require a Gemini 3 Pro compatible API key.</p>
          </div>
          <Button onClick={handleConnectKey} className="whitespace-nowrap">Connect Studio Key</Button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Input Panels */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Upload Context</h3>
            <ImageDropzone 
              label="Person Photo" 
              description="Full body or torso" 
              previewUrl={personImg ? `data:image/jpeg;base64,${personImg}` : undefined}
              onImageSelect={(base64) => setPersonImg(base64)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">2. Target Garment</h3>
            <ImageDropzone 
              label="Clothing Image" 
              description="T-shirt, Hoodie, etc." 
              previewUrl={garmentImg ? `data:image/jpeg;base64,${garmentImg}` : undefined}
              onImageSelect={(base64) => setGarmentImg(base64)}
            />
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GARMENTS.slice(0, 4).map(garment => (
                <button 
                  key={garment.id}
                  onClick={() => alert("Presets are for visualization. Please upload your custom garment.")}
                  className="rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 transition-all aspect-square"
                >
                  <img src={garment.url} className="w-full h-full object-cover" alt={garment.name} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Preview Canvas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center relative shadow-2xl">
            {!resultImg && !isGenerating && (
              <div className="text-center p-12 space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                <h2 className="text-xl font-bold">Swap Engine Ready</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Upload assets and select your engine mode to begin.</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                <div className="relative w-20 h-20 mb-6">
                   <div className={`absolute inset-0 border-4 ${config.engine === 'pro' ? 'border-amber-500' : 'border-slate-400'} border-t-transparent rounded-full animate-spin`}></div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{config.engine === 'pro' ? 'Pro Artistic Processing' : 'Standard Swap Generation'}</h2>
                <p className="text-slate-400 font-medium animate-pulse">Rendering neural textures...</p>
              </div>
            )}

            {resultImg && personImg && (
              <ComparisonSlider 
                before={`data:image/jpeg;base64,${personImg}`} 
                after={resultImg} 
              />
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <span className="flex-shrink-0">⚠️</span>
              {error}
            </div>
          )}

          {resultImg && (
            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={() => {
                const link = document.createElement('a');
                link.href = resultImg;
                link.download = `swap-${Date.now()}.png`;
                link.click();
              }}>Export Result</Button>
              <Button variant="outline" className="px-6" onClick={handleReset}>New Project</Button>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-3 space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engine Mode</label>
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => setConfig({...config, engine: 'standard'})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${config.engine === 'standard' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Standard (Free)
                  </button>
                  <button 
                    onClick={() => setConfig({...config, engine: 'pro'})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${config.engine === 'pro' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Pro Studio
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 px-1">
                  {config.engine === 'pro' ? 'Uses Gemini 3 Pro for high-fidelity artistic control.' : 'Uses Standard Engine for quick, basic swaps.'}
                </p>
              </div>

              {config.engine === 'pro' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Creative Prompt</label>
                  <textarea 
                    value={config.customPrompt}
                    onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-amber-500 focus:border-amber-500 outline-none h-28 resize-none transition-all"
                    placeholder="e.g. Change background to a luxury store, add dramatic shadows..."
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Garment Fit</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(FitType).map(f => (
                    <button 
                      key={f}
                      onClick={() => setConfig({...config, fit: f})}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${config.fit === f ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sleeve length</label>
                <select 
                  value={config.sleeve}
                  onChange={(e) => setConfig({...config, sleeve: e.target.value as SleeveLength})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 outline-none"
                >
                  {Object.values(SleeveLength).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-sm font-semibold">Color Matching</span>
                <button 
                  onClick={() => setConfig({...config, colorCorrection: !config.colorCorrection})}
                  className={`w-10 h-6 rounded-full transition-colors relative ${config.colorCorrection ? 'bg-amber-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${config.colorCorrection ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
           </div>

           <Button 
             className="w-full" 
             size="lg" 
             disabled={!personImg || !garmentImg || isGenerating}
             isLoading={isGenerating}
             onClick={handleGenerate}
             variant={config.engine === 'pro' ? 'primary' : 'secondary'}
           >
             {config.engine === 'pro' ? 'Generate Pro Swap' : 'Generate Standard Swap'}
           </Button>
        </div>
      </div>
    </div>
  );
};

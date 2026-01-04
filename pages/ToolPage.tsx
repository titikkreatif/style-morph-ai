
import React, { useState } from 'react';
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

  const [config, setConfig] = useState<GenerationConfig>({
    fit: FitType.REGULAR,
    sleeve: SleeveLength.SHORT,
    realism: 0.9,
    colorCorrection: true
  });

  const handleGenerate = async () => {
    if (!personImg || !garmentImg) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await geminiService.performClothingSwap(personImg, garmentImg, config);
      setResultImg(result);
    } catch (err: any) {
      setError("AI generation failed. Please check your API key and try again.");
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">2. Target Garment</h3>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">Presets Available</span>
            </div>
            <ImageDropzone 
              label="Clothing Image" 
              description="T-shirt, Hoodie, etc." 
              previewUrl={garmentImg ? `data:image/jpeg;base64,${garmentImg}` : undefined}
              onImageSelect={(base64) => setGarmentImg(base64)}
            />
            <div className="grid grid-cols-4 gap-2">
              {PRESET_GARMENTS.map(garment => (
                <button 
                  key={garment.id}
                  onClick={() => {
                    // Note: In a real app, we'd fetch the actual base64 of the preset. 
                    // For this demo, we'll just log or handle it.
                    alert("Selecting a preset (Mock logic: in production this fetches the garment asset)");
                  }}
                  className="rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all aspect-square"
                >
                  <img src={garment.url} className="w-full h-full object-cover" alt={garment.name} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Preview Canvas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center relative">
            {!resultImg && !isGenerating && (
              <div className="text-center p-12 space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                <h2 className="text-xl font-bold">Ready to Generate</h2>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Upload both photos on the left to start the magic engine.</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="relative w-24 h-24 mb-6">
                   <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Analyzing Silhouette</h2>
                <p className="text-indigo-400 font-medium animate-pulse">Fitting garment textures...</p>
                <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
                   <div className="h-1 bg-indigo-500/30 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full"></div>
                </div>
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
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {resultImg && (
            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={() => {
                const link = document.createElement('a');
                link.href = resultImg;
                link.download = `stylemorph-generation-${Date.now()}.png`;
                link.click();
              }}>
                Download High-Res
              </Button>
              <Button variant="outline" className="px-6" onClick={handleReset}>
                Start New
              </Button>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-3 space-y-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">AI Parameters</h3>
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Garment Fit</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(FitType).map(f => (
                    <button 
                      key={f}
                      onClick={() => setConfig({...config, fit: f})}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${config.fit === f ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {Object.values(SleeveLength).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Realism Slider</label>
                   <span className="text-xs font-mono text-indigo-400">{(config.realism * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="1" step="0.05"
                  value={config.realism}
                  onChange={(e) => setConfig({...config, realism: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <div>
                   <p className="text-sm font-semibold">Color Match</p>
                   <p className="text-[10px] text-slate-500">Auto-balancing lighting</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, colorCorrection: !config.colorCorrection})}
                  className={`w-10 h-6 rounded-full transition-colors relative ${config.colorCorrection ? 'bg-indigo-600' : 'bg-slate-700'}`}
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
           >
             Generate Swap
           </Button>

           <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
             <div className="flex items-start gap-3">
               <div className="mt-1">✨</div>
               <div>
                  <p className="text-xs font-bold text-indigo-300">Pro Tip</p>
                  <p className="text-[11px] text-slate-400 mt-1">For best results, use high-resolution front-facing photos with consistent lighting.</p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

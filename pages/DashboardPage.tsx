
import React, { useState } from 'react';
import { Page, FitType, SleeveLength } from '../types';
import { Button } from '../components/Button';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  isAdmin?: boolean;
}

const MOCK_HISTORY = [
  {
    id: '1',
    date: '2 hours ago',
    resultUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    config: { fit: FitType.REGULAR, sleeve: SleeveLength.SHORT, realism: 0.9 }
  },
  {
    id: '2',
    date: 'Yesterday',
    resultUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400',
    config: { fit: FitType.SLIM, sleeve: SleeveLength.LONG, realism: 0.85 }
  },
  {
    id: '3',
    date: '3 days ago',
    resultUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=400',
    config: { fit: FitType.LOOSE, sleeve: SleeveLength.SLEEVELESS, realism: 0.95 }
  }
];

const MOCK_DOWNLOAD_HISTORY = [
  {
    id: 'dl-1',
    filename: 'summer_collection_01.png',
    downloadDate: 'Oct 24, 2023 • 14:20',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100',
    size: '2.4 MB',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dl-2',
    filename: 'denim_jacket_swap_final.png',
    downloadDate: 'Oct 22, 2023 • 09:15',
    thumbnail: 'https://images.unsplash.com/photo-1576905341935-4ef2443449c0?auto=format&fit=crop&q=80&w=100',
    size: '3.1 MB',
    url: 'https://images.unsplash.com/photo-1576905341935-4ef2443449c0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dl-3',
    filename: 'tk_studio_export_772.jpg',
    downloadDate: 'Oct 15, 2023 • 18:45',
    thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100',
    size: '1.8 MB',
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'
  }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<'generations' | 'downloads'>('generations');

  const handleReDownload = (url: string, filename: string) => {
    // In a real app, this would trigger a browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Studio Dashboard</h1>
          <p className="text-slate-400 font-medium">Manage your creative workspace and production history.</p>
        </div>
        <div className="flex items-center gap-4">
           {isAdmin && (
             <Button variant="outline" onClick={() => onNavigate(Page.ADMIN)} className="border-amber-500/50 text-amber-500 hover:bg-amber-500/5">
               Studio Settings
             </Button>
           )}
           <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-3 shadow-xl text-center min-w-[120px]">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Studio Credits</p>
              <p className="text-xl font-black text-amber-500">412 / 1000</p>
           </div>
           <Button onClick={() => onNavigate(Page.TOOL)} size="lg" className="shadow-amber-500/10">New Project</Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl w-fit mb-10">
        <button 
          onClick={() => setActiveTab('generations')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'generations' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Creative History
        </button>
        <button 
          onClick={() => setActiveTab('downloads')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'downloads' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Download History
        </button>
      </div>

      {activeTab === 'generations' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-white/20 transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-500/5">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                  src={item.resultUrl} 
                  alt="Generation Result" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-6 backdrop-blur-sm">
                  <Button size="sm" className="w-full" onClick={() => window.open(item.resultUrl, '_blank')}>
                    Export Asset
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-white/10 text-white hover:bg-white/5" onClick={() => onNavigate(Page.TOOL)}>
                    Open in Engine
                  </Button>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 tracking-wide">{item.date}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full uppercase font-black tracking-tighter">Rendered</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2.5 py-1.5 rounded-lg capitalize font-bold">{item.config.fit} Fit</span>
                  <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2.5 py-1.5 rounded-lg capitalize font-bold">{item.config.sleeve} Sleeves</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
          <div className="px-8 py-5 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Recent Exports</h3>
            <span className="text-xs text-slate-500">{MOCK_DOWNLOAD_HISTORY.length} Items found</span>
          </div>
          {MOCK_DOWNLOAD_HISTORY.length > 0 ? (
            MOCK_DOWNLOAD_HISTORY.map((dl) => (
              <div key={dl.id} className="p-4 px-8 flex items-center justify-between hover:bg-slate-800/20 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 shrink-0 group-hover:border-amber-500/50 transition-colors">
                    <img src={dl.thumbnail} alt={dl.filename} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 group-hover:text-amber-500 transition-colors">{dl.filename}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{dl.downloadDate} • {dl.size}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-6 border-slate-700 text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500"
                  onClick={() => handleReDownload(dl.url, dl.filename)}
                >
                  Re-download
                </Button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-medium">No download records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

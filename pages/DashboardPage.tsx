
import React, { useState, useEffect } from 'react';
import { Page, FitType, SleeveLength, GarmentCategory } from '../types';
import { Button } from '../components/Button';
import { firestoreService } from '../services/firestoreService';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  isAdmin?: boolean;
  userEmail: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, isAdmin, userEmail }) => {
  const [activeTab, setActiveTab] = useState<'generations' | 'downloads'>('generations');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      if (userEmail) {
        const data = await firestoreService.getUserHistory(userEmail);
        setHistory(data);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, [userEmail]);

  const handleReDownload = (url: string, filename: string) => {
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-[3/4] bg-slate-900/50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : activeTab === 'generations' ? (
        history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {history.map((item) => (
              <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-white/20 transition-all shadow-xl hover:shadow-2xl hover:shadow-amber-500/5">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img 
                    src={item.resultImageUrl} 
                    alt="Generation Result" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-6 backdrop-blur-sm">
                    <Button size="sm" className="w-full" onClick={() => window.open(item.resultImageUrl, '_blank')}>
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
                    {Array.isArray(item.config?.category) ? (
                      item.config.category.map((cat: string) => (
                        <span key={cat} className="text-[9px] bg-slate-800 text-amber-500 px-2 py-1 rounded-md uppercase font-black border border-amber-500/20">{cat}</span>
                      ))
                    ) : (
                      <span className="text-[9px] bg-slate-800 text-amber-500 px-2 py-1 rounded-md uppercase font-black border border-amber-500/20">{item.config?.category || 'Item'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 font-medium">No generations found yet. Start your first project!</p>
            <Button onClick={() => onNavigate(Page.TOOL)} className="mt-4" variant="outline">Launch Engine</Button>
          </div>
        )
      ) : (
        <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800 text-center py-20">
            <p className="text-slate-500 font-medium">Download history integration coming soon.</p>
        </div>
      )}
    </div>
  );
};

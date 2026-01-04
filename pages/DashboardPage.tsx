
import React from 'react';
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

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, isAdmin }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">Creative History</h1>
          <p className="text-slate-400">View and manage your studio generations.</p>
        </div>
        <div className="flex items-center gap-4">
           {isAdmin && (
             <Button variant="outline" onClick={() => onNavigate(Page.ADMIN)} className="border-amber-500/50 text-amber-500">
               Studio Settings
             </Button>
           )}
           <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-3 shadow-xl text-center min-w-[120px]">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Studio Credits</p>
              <p className="text-xl font-bold text-amber-500">412 / 1000</p>
           </div>
           <Button onClick={() => onNavigate(Page.TOOL)} size="lg">New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_HISTORY.map((item) => (
          <div key={item.id} className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden flex flex-col hover:border-white/20 transition-all shadow-xl">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={item.resultUrl} 
                alt="Generation Result" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full uppercase font-bold tracking-tighter">Rendered</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2.5 py-1.5 rounded-lg capitalize font-medium">{item.config.fit} Fit</span>
                <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2.5 py-1.5 rounded-lg capitalize font-medium">{item.config.sleeve} Sleeves</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

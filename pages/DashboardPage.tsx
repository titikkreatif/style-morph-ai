
import React from 'react';
import { Page, FitType, SleeveLength } from '../types';
import { Button } from '../components/Button';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
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
  },
  {
    id: '4',
    date: 'Oct 12, 2023',
    resultUrl: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&q=80&w=400',
    config: { fit: FitType.REGULAR, sleeve: SleeveLength.SHORT, realism: 0.9 }
  }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Generation History</h1>
          <p className="text-slate-400">Manage and download your past AI fashion swaps.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Credits Remaining</p>
              <p className="text-lg font-bold text-indigo-400">124 / 500</p>
           </div>
           <Button onClick={() => onNavigate(Page.TOOL)}>New Generation</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_HISTORY.map((item) => (
          <div key={item.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/50 transition-all">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={item.resultUrl} 
                alt="Generation Result" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                <Button size="sm" className="w-full" onClick={() => window.open(item.resultUrl, '_blank')}>
                  Download
                </Button>
                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => onNavigate(Page.TOOL)}>
                  Regenerate
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">{item.date}</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">Success</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded capitalize">{item.config.fit} Fit</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded capitalize">{item.config.sleeve} Sleeves</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Mockup if no history */}
        {MOCK_HISTORY.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">No history yet</h3>
              <p className="text-slate-500 mt-2 max-w-xs">Your past generations will appear here once you start creating.</p>
            </div>
            <Button onClick={() => onNavigate(Page.TOOL)}>Create Your First Swap</Button>
          </div>
        )}
      </div>
    </div>
  );
};

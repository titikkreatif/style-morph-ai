
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import { LandingPage } from './pages/LandingPage';
import { ToolPage } from './pages/ToolPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardPage } from './pages/DashboardPage';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING: return <LandingPage onNavigate={setCurrentPage} />;
      case Page.TOOL: return <ToolPage onNavigate={setCurrentPage} />;
      case Page.PRICING: return <PricingPage onNavigate={setCurrentPage} />;
      case Page.DASHBOARD: return <DashboardPage onNavigate={setCurrentPage} />;
      default: return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-900 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentPage(Page.LANDING)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform">S</div>
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <button onClick={() => setCurrentPage(Page.LANDING)} className={`hover:text-white transition-colors ${currentPage === Page.LANDING ? 'text-white font-bold' : ''}`}>Features</button>
            <button onClick={() => setCurrentPage(Page.TOOL)} className={`hover:text-white transition-colors ${currentPage === Page.TOOL ? 'text-white font-bold' : ''}`}>Swap Engine</button>
            <button onClick={() => setCurrentPage(Page.DASHBOARD)} className={`hover:text-white transition-colors ${currentPage === Page.DASHBOARD ? 'text-white font-bold' : ''}`}>History</button>
            <button onClick={() => setCurrentPage(Page.PRICING)} className={`hover:text-white transition-colors ${currentPage === Page.PRICING ? 'text-white font-bold' : ''}`}>Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="text-sm font-semibold text-slate-400 hover:text-white"
              onClick={() => setCurrentPage(Page.DASHBOARD)}
            >
              My Account
            </button>
            <button 
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
              onClick={() => setCurrentPage(Page.TOOL)}
            >
              Get Credits
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
                <span className="text-lg font-bold">{APP_NAME}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">The future of fashion photography. Generative AI that respects style and identity.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage(Page.TOOL)}>Try-On Tool</li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage(Page.DASHBOARD)}>History</li>
                <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage(Page.PRICING)}>Pricing</li>
                <li className="hover:text-white cursor-pointer transition-colors">API for Developers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white cursor-pointer transition-colors">AI Best Practices</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Get the latest fashion AI updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-indigo-500" />
                <button className="bg-indigo-600 px-3 py-2 rounded-lg text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-600">© 2024 StyleMorph AI. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-slate-600 font-semibold uppercase tracking-widest">
              <span className="hover:text-slate-400 cursor-pointer">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer">Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

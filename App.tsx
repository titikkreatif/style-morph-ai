
import React, { useState, useEffect } from 'react';
import { Page, WebsiteConfig } from './types';
import { LandingPage } from './pages/LandingPage';
import { ToolPage } from './pages/ToolPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { DEFAULT_CONFIG } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  
  // Website configuration state with local storage persistence
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(() => {
    const saved = localStorage.getItem('site_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateConfig = (newConfig: WebsiteConfig) => {
    setWebsiteConfig(newConfig);
    localStorage.setItem('site_config', JSON.stringify(newConfig));
    // Dynamic color update
    document.documentElement.style.setProperty('--primary-color', newConfig.primaryColor);
  };

  const handleAuthNavigation = (targetPage: Page) => {
    if (!isAuthenticated && (targetPage === Page.TOOL || targetPage === Page.DASHBOARD || targetPage === Page.ADMIN)) {
      setCurrentPage(Page.LOGIN);
    } else if (targetPage === Page.ADMIN && userRole !== 'admin') {
      setCurrentPage(Page.DASHBOARD);
    } else {
      setCurrentPage(targetPage);
    }
  };

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    if (username === 'tkproject') {
      setUserRole('admin');
      setCurrentPage(Page.ADMIN);
    } else {
      setUserRole('user');
      setCurrentPage(Page.TOOL);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING: return <LandingPage onNavigate={handleAuthNavigation} config={websiteConfig} />;
      case Page.TOOL: return <ToolPage onNavigate={handleAuthNavigation} />;
      case Page.PRICING: return <PricingPage onNavigate={handleAuthNavigation} />;
      case Page.DASHBOARD: return <DashboardPage onNavigate={handleAuthNavigation} isAdmin={userRole === 'admin'} />;
      case Page.ADMIN: return <AdminPage config={websiteConfig} onUpdateConfig={handleUpdateConfig} onNavigate={setCurrentPage} />;
      case Page.LOGIN: return (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onNavigate={handleAuthNavigation} 
        />
      );
      default: return <LandingPage onNavigate={handleAuthNavigation} config={websiteConfig} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${websiteConfig.layoutStyle}`}>
      {/* Promotion Banner */}
      {websiteConfig.showPromoBanner && (
        <div 
          className="fixed top-0 left-0 right-0 z-[60] py-2 text-center text-xs font-bold tracking-widest text-slate-950 px-4 transition-all"
          style={{ backgroundColor: websiteConfig.primaryColor }}
        >
          {websiteConfig.promoText}
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-300 ${websiteConfig.showPromoBanner ? 'top-8' : 'top-0'} ${isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage(Page.LANDING)}
          >
            <div className="h-10 w-auto flex items-center">
              <img src={websiteConfig.logoUrl} alt={websiteConfig.siteName} className="h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-white">{websiteConfig.siteName}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <button onClick={() => setCurrentPage(Page.LANDING)} className={`hover:text-white transition-colors ${currentPage === Page.LANDING ? 'text-white font-bold' : ''}`}>Studio</button>
            <button onClick={() => handleAuthNavigation(Page.TOOL)} className={`hover:text-white transition-colors ${currentPage === Page.TOOL ? 'text-white font-bold' : ''}`}>Swap Engine</button>
            <button onClick={() => handleAuthNavigation(Page.DASHBOARD)} className={`hover:text-white transition-colors ${currentPage === Page.DASHBOARD ? 'text-white font-bold' : ''}`}>History</button>
            {userRole === 'admin' && (
              <button onClick={() => setCurrentPage(Page.ADMIN)} className={`text-amber-500 font-bold hover:text-amber-400 transition-colors ${currentPage === Page.ADMIN ? 'underline underline-offset-4' : ''}`}>Admin Panel</button>
            )}
            <button onClick={() => setCurrentPage(Page.PRICING)} className={`hover:text-white transition-colors ${currentPage === Page.PRICING ? 'text-white font-bold' : ''}`}>Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button 
                className="text-sm font-semibold text-slate-400 hover:text-white"
                onClick={() => handleAuthNavigation(Page.DASHBOARD)}
              >
                Account
              </button>
            ) : (
              <button 
                className="text-sm font-semibold text-slate-400 hover:text-white"
                onClick={() => setCurrentPage(Page.LOGIN)}
              >
                Sign In
              </button>
            )}
            
            <button 
              className="px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors text-slate-950"
              style={{ backgroundColor: websiteConfig.primaryColor }}
              onClick={() => handleAuthNavigation(Page.TOOL)}
            >
              {isAuthenticated ? 'Get Credits' : 'Start Trial'}
            </button>

            {isAuthenticated && (
              <button 
                onClick={() => {
                  setIsAuthenticated(false);
                  setUserRole('user');
                  setCurrentPage(Page.LANDING);
                }}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 ${websiteConfig.showPromoBanner ? 'pt-24' : 'pt-16'}`}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={websiteConfig.logoUrl} alt={websiteConfig.siteName} className="h-8 w-auto grayscale brightness-125" />
                <span className="text-lg font-bold">{websiteConfig.siteName}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">High-fidelity virtual production powered by Creative AI.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Services</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => handleAuthNavigation(Page.TOOL)}>AI Virtual Try-On</li>
                <li className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => handleAuthNavigation(Page.DASHBOARD)}>Creative History</li>
                <li className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => setCurrentPage(Page.PRICING)}>Enterprise Plans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Studio</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="hover:text-amber-500 cursor-pointer transition-colors">Creative Blog</li>
                <li className="hover:text-amber-500 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-amber-500 cursor-pointer transition-colors" onClick={() => userRole === 'admin' ? setCurrentPage(Page.ADMIN) : null}>Admin Access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Join the Studio</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-amber-500 transition-colors" />
                <button className="px-3 py-2 rounded-lg text-sm font-bold text-slate-950" style={{ backgroundColor: websiteConfig.primaryColor }}>Join</button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-600">© 2024 {websiteConfig.siteName}. Designed for professionals.</p>
            <div className="flex gap-8 text-xs text-slate-600 font-semibold uppercase tracking-widest">
              <span className="hover:text-slate-400 cursor-pointer">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

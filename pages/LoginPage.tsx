
import React, { useState } from 'react';
import { Page } from '../types';
import { Button } from '../components/Button';
import { APP_NAME, LOGO_URL } from '../constants';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
  onNavigate: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username.trim() === 'tkproject' && password === 'Bapaklak@8') {
        onLoginSuccess(username.trim());
      } else {
        setError('Invalid credentials. Please verify your studio access.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Aesthetic decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
        
        <div className="text-center mb-10 relative">
          <div className="h-16 flex items-center justify-center mb-6">
            <img src={LOGO_URL} alt={APP_NAME} className="h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Studio Access</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Log in to your Titik Kreatif account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-white"
              placeholder="Username"
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-amber-500 font-bold hover:text-amber-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-white"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-4 text-sm uppercase tracking-widest font-bold" 
            isLoading={isLoading}
          >
            Authenticate
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Need an account? <button onClick={() => onNavigate(Page.PRICING)} className="text-amber-500 font-bold hover:underline">Request Access</button>
          </p>
        </div>
      </div>
    </div>
  );
};

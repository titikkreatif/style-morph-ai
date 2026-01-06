
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { LOGO_URL } from '../constants';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Hardcoded credentials as per request
    if (username === 'admin' && password === 'bapaklak') {
      setTimeout(() => {
        onLoginSuccess();
        setIsLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        setError('Invalid Administrative Credentials');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="h-12 flex items-center justify-center mb-6 opacity-50 grayscale">
            <img src={LOGO_URL} alt="Admin" className="h-full object-contain" />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-[0.2em]">Restricted Access</h1>
          <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Studio Administrator Gate</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-500 text-[10px] text-center font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Button 
              type="submit" 
              className="w-full py-4 text-[11px] uppercase tracking-[0.2em] font-black"
              isLoading={isLoading}
            >
              Verify Identity
            </Button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Cancel & Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

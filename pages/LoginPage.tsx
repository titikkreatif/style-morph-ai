import React, { useState } from 'react';
import { Page } from '../types';
import { Button } from '../components/Button';
import { APP_NAME, LOGO_URL } from '../constants';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onNavigate: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user.email || email);
    } catch (err: any) {
      console.error("Login error:", err);
      setError('Password or Email Incorrect');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        onLoginSuccess(result.user.email || 'google-user@example.com');
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-in is not enabled. Please enable it in the Firebase Console.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Add it to Firebase Console > Authentication > Settings.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in window was blocked. Please allow popups.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled.');
      } else {
        setError('Google login failed: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
        
        <div className="text-center mb-10 relative">
          <div className="h-14 flex items-center justify-center mb-8">
            <img src={LOGO_URL} alt={APP_NAME} className="h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Log in to your creative workspace</p>
        </div>

        <div className="space-y-6 relative">
          <button 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-slate-800"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">or continue with email</span>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-amber-500 font-bold hover:text-amber-400"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 text-xs uppercase tracking-[0.15em] font-black mt-2" 
              isLoading={isLoading}
              disabled={isGoogleLoading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account? <button onClick={() => onNavigate(Page.SIGNUP)} className="text-amber-500 font-bold hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Shield, Fingerprint, Lock, Cpu, ChevronRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setError('Biometric or passcode required for authorization.');
      return;
    }
    setError('');
    setIsAuthenticating(true);
    // Simulate auth delay for effect
    setTimeout(() => {
      if (passcode === 'admin' || passcode === '1234') {
        onLogin();
      } else {
        setError('Authorization failed. Access denied.');
        setIsAuthenticating(false);
        setPasscode('');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-[#060a12] text-slate-900 dark:text-slate-100 font-sans antialiased bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] overflow-hidden">
      {/* Background abstract elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center animate-float-in">
        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan animate-pulse">
          <Cpu className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 text-center">
          AI Industrial Copilot
        </h1>
        <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 text-center tracking-widest uppercase">
          Autonomous Plant Sentinel <br /> Tactical Decision Mesh
        </p>

        <form onSubmit={handleLogin} className="w-full mt-10 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Passcode (1234 or admin)"
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono tracking-widest text-center"
                disabled={isAuthenticating}
              />
            </div>
            {error && (
              <p className="text-xs font-mono text-red-500 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-pulse">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 group"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Authorize Access
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <Fingerprint className="w-3.5 h-3.5" />
            Biometric Scanner Standby
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
            <Shield className="w-3 h-3" />
            System Secure
          </div>
        </div>
      </div>
    </div>
  );
};

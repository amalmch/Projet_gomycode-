import React, { useEffect, useState } from 'react';
import { Cpu, Lock, User, AlertTriangle, Loader2, Fingerprint, Shield } from 'lucide-react';
import { login, takeSignOutReason } from '../services/auth';

/**
 * Sign-in gate for Industrial_Copilot. 
 * Upgraded with premium styling, light/dark mode support, and animations.
 */
export const LoginPage: React.FC<{ onSignedIn: () => void }> = ({ onSignedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setNotice(takeSignOutReason());
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await login(username.trim(), password);
      onSignedIn();
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
      setPassword('');
    } finally {
      setBusy(false);
    }
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
          Industrial_Copilot
        </h1>
        <p className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center tracking-widest uppercase">
          SENSE → REASON → ACT
        </p>

        {notice && (
          <div className="mt-4 mb-2 flex items-start gap-2 rounded-lg border border-amber-600/40 bg-amber-500/10 dark:bg-amber-950/30 px-3 py-2 w-full">
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
            <span className="text-[11px] text-amber-700 dark:text-amber-200 leading-snug font-mono">{notice}</span>
          </div>
        )}

        <form onSubmit={submit} className="w-full mt-8 space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                autoComplete="username"
                placeholder="Operator ID (e.g. owner_01)"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                disabled={busy}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Passphrase"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono tracking-widest text-sm"
                disabled={busy}
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
            disabled={busy || !username || !password}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 group mt-2"
          >
            {busy ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authorizing...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <Fingerprint className="w-3.5 h-3.5" />
            Biometric Scanner Standby
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono font-bold px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 rounded-full">
            <Shield className="w-3 h-3" />
            System Secure
          </div>
        </div>
      </div>
    </div>
  );
};

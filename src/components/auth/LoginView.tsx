import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Brain,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('demo@spendguard.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }
    login(email, password);
  };

  const handleQuickDemoLogin = () => {
    login('demo@spendguard.ai', 'demo123');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-glow-md shadow-indigo-500/30 text-white font-black">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <h1 className="text-2xl font-black text-white tracking-tight">SPENDGUARD</h1>
            <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
              AI
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Intelligent Expense Management & Explainable Anomaly Detection
          </p>
          <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-[10px] text-indigo-300 font-semibold">
            🏆 IEEE Hackathon Prototype Sandbox
          </div>
        </div>

        {/* Quick Demo Access Button (Primary for judges) */}
        <button
          onClick={handleQuickDemoLogin}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Continue with Demo Account (Instant Access)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500">
            Or Sign In Manually
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Manual demo login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Demo Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <span className="text-[10px] text-slate-500">Default: demo123</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
          >
            Log In
          </button>
        </form>

        {/* Privacy Note */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Local demo sandbox. Zero external server transmissions.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

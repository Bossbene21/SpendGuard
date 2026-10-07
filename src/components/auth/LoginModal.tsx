import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal: React.FC = () => {
  const { isAuthenticated, login } = useApp();

  const [email, setEmail] = useState('demo@spendguard.ai');
  const [password, setPassword] = useState('demo123');

  if (isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleDemoOneClick = () => {
    login('demo@spendguard.ai', 'demo123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19] overflow-y-auto">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#111827]/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-glow-md shadow-indigo-500/40">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              SPENDGUARD <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">AI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Intelligent Expense Management & Explainable Anomaly Detection
            </p>
          </div>
        </div>

        {/* Prototype Sandbox Notice */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>IEEE Hackathon Prototype Mode:</strong> Real authentication is bypassed. You can login directly or use the prefilled credentials.
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <button
          onClick={handleDemoOneClick}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-98"
        >
          <UserCheck className="w-4 h-4" />
          <span>Continue with Demo Account (Instant Access)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-[#111827] px-3 text-[10px] font-bold uppercase text-slate-500">
            Or Sign In
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Sign In with Demo Credentials
          </button>
        </form>

        {/* Local privacy footnote */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Client-Side Local Execution</span>
        </div>
      </div>
    </div>
  );
};

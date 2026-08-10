import React, { useState, useEffect, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './LoginPage.css';

/* Floating Particle System */
const Particles = ({ count = 60 }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 12,
      duration: Math.random() * 8 + 8,
      opacity: Math.random() * 0.6 + 0.15,
    })), [count]);

  return (
    <div className="ag-particles" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="ag-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

/* Floating Gradient Orbs */
const FloatingOrbs = () => (
  <div className="ag-orbs" aria-hidden="true">
    <div className="ag-orb ag-orb--cyan" />
    <div className="ag-orb ag-orb--magenta" />
    <div className="ag-orb ag-orb--purple" />
    <div className="ag-orb ag-orb--cyan-sm" />
  </div>
);

/* Animated Orbital Icon */
const OrbitalIcon = () => (
  <div className="ag-icon-wrapper">
    <div className="ag-icon">
      <div className="ag-icon__core" />
      <div className="ag-icon__ring ag-icon__ring--1" />
      <div className="ag-icon__ring ag-icon__ring--2" />
      <div className="ag-icon__ring ag-icon__ring--3" />
      <div className="ag-icon__dot ag-icon__dot--1" />
      <div className="ag-icon__dot ag-icon__dot--2" />
    </div>
  </div>
);

const LoginPage = () => {
  const { login } = useEmpire();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('ag_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe && username.trim()) {
      localStorage.setItem('ag_remembered_user', username.trim());
    } else if (!rememberMe) {
      localStorage.removeItem('ag_remembered_user');
    }
  }, [rememberMe, username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError(true);
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="ag-login-scene">
      {/* Background Layers */}
      <div className="ag-bg-gradient" />
      <div className="ag-grid-overlay" />
      <FloatingOrbs />
      <Particles count={70} />

      {/* Login Card Container */}
      <motion.div
        className="ag-card"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="ag-card__glow" />

        {/* Header */}
        <div className="ag-card__header">
          <OrbitalIcon />
          <h1 className="ag-title">Command Center</h1>
          <p className="ag-subtitle">SECURE ACCESS — PERSONAL FINANCE OS</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ag-form">
          <Input
            label="OPERATOR IDENTITY"
            id="ag-username"
            type="text"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="operator_id"
            required
            autoComplete="username"
          />

          <div className="space-y-2 relative">
            <label htmlFor="ag-password" className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">
              SECURITY CLEARANCE
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="ag-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-sm text-white placeholder-slate-600 outline-none focus:border-neon-blue focus:bg-white/5 transition-all font-medium"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="ag-checkbox-label" htmlFor="ag-remember">
              <input
                id="ag-remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="ag-checkbox-native"
              />
              <span className="ag-checkbox-custom">
                <svg viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-xs text-slate-400 font-medium">Maintain active session</span>
            </label>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-black uppercase text-center"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
              >
                ACCESS DENIED — INVALID CREDENTIALS
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
            variant="primary"
            icon={ArrowRight}
            className="w-full py-3.5 text-sm mt-2"
          >
            {loading ? 'Authenticating...' : 'Initialize Access'}
          </Button>
        </form>

        {/* Footer */}
        <div className="ag-card__footer mt-6 pt-4 border-t border-white/10 flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-neon-blue" /> LEVEL 5 CLEARANCE</span>
          <span>256-BIT ENCRYPTED</span>
          <span>V5.0</span>
        </div>
      </motion.div>

      {/* Bottom Scene Line */}
      <footer className="ag-scene-footer">
        © WIZWALLET 2026 — PERSONAL FINANCE OPERATING SYSTEM
      </footer>
    </div>
  );
};

export default LoginPage;

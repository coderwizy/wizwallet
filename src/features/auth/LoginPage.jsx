import React, { useState, useEffect, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion } from 'framer-motion';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import './LoginPage.css';

/* Floating Ambient Particle System */
const ParticleSystem = ({ count = 45 }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 8,
      opacity: Math.random() * 0.6 + 0.2,
    })), [count]);

  return (
    <div className="wz-particles" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="wz-particle"
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

/* Floating Glow Orbs Background */
const AmbientOrbs = () => (
  <div className="wz-orbs" aria-hidden="true">
    <div className="wz-orb wz-orb-1" />
    <div className="wz-orb wz-orb-2" />
    <div className="wz-orb wz-orb-3" />
  </div>
);

const LoginPage = () => {
  const { login } = useEmpire();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('wz_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  useEffect(() => {
    if (rememberMe && username.trim()) {
      localStorage.setItem('wz_remembered_user', username.trim());
    } else if (!rememberMe) {
      localStorage.removeItem('wz_remembered_user');
    }
  }, [rememberMe, username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(false);

    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="wz-login-scene">
      {/* Background FX */}
      <div className="wz-bg-gradient" />
      <div className="wz-grid-overlay" />
      <AmbientOrbs />
      <ParticleSystem count={50} />

      {/* Main Glassmorphic Card */}
      <motion.div
        className="wz-login-card"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="wz-brand-badge">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>WizWallet OS v5.0</span>
          </div>

          <h1 className="wz-card-title">
            Personal <span>Empire OS</span>
          </h1>
          <p className="wz-card-subtitle">
            Secure Authentication & Command Center Access
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="wz-input-group">
          {/* Username Field */}
          <div className="wz-field">
            <label className="wz-label" htmlFor="wz-username">
              Operator Username
            </label>
            <div className="wz-input-wrapper">
              <User className="wz-input-icon" />
              <input
                id="wz-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="wz-input"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="wz-field">
            <label className="wz-label" htmlFor="wz-password">
              Security Key
            </label>
            <div className="wz-input-wrapper">
              <Lock className="wz-input-icon" />
              <input
                id="wz-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security key"
                className="wz-input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="wz-eye-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Actions Row */}
          <div className="wz-actions-row">
            <label className="wz-remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className="wz-checkbox-custom">
                {rememberMe && <CheckCircle2 className="w-3 h-3 text-cyan-950 font-bold" />}
              </div>
              <span>Remember session</span>
            </label>
          </div>

          {/* Error Message Alert */}
          {error && (
            <motion.div
              className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Invalid clearance credentials. Please check your username and password.</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="wz-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="wz-card-footer">
          <div className="wz-footer-badge">
            <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
            <span>256-Bit Encrypted</span>
          </div>

          <div className="wz-footer-badge">
            <div className="wz-status-dot" />
            <span>System Status: Online</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

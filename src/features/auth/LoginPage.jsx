import React, { useState, useEffect, useRef } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  KeyRound,
  Sparkles
} from 'lucide-react';
import Lanyard from '../../components/ui/Lanyard';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useEmpire();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('wz_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setError(true);
      setErrorMessage('Please provide both username and master key.');
      return;
    }

    if (password.length < 6) {
      setError(true);
      setErrorMessage('Master key must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const success = login(cleanUser, password);
      if (!success) {
        setError(true);
        setErrorMessage('Invalid credentials. Check username or master key.');
        setLoading(false);
      } else {
        if (rememberMe) {
          localStorage.setItem('wz_remembered_user', cleanUser);
        } else {
          localStorage.removeItem('wz_remembered_user');
        }
      }
    }, 400);
  };

  return (
    <div className="ww-login-container">
      {/* Background Ambience */}
      <div className="ww-login-backdrop" aria-hidden="true">
        <div className="ww-login-radial" />
        <div className="ww-login-grid" />
      </div>

      <div className="ww-login-layout">
        {/* ── 3D Interactive Lanyard Section (PC Side-by-side & Mobile Top) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="ww-lanyard-stage"
        >
          <div className="ww-lanyard-wrapper">
            <Lanyard
              frontImage="/card-front.svg"
              backImage="/card-back.svg"
              strapImage="/band.svg"
              cardColor="#1E231F"
              finish="holographic"
              metal="gold"
              orientation="portrait"
              size={0.65}
              strapLength={0.42}
              strapColor="#181D19"
              breeze={0.35}
              interactive={true}
              intro={true}
            />
          </div>
          <div className="ww-lanyard-badge-caption">
            <span className="ww-lanyard-badge-pill">
              <Sparkles className="w-3 h-3 text-[#526B56]" />
              <span>Sovereign Access Pass · Drag &amp; tap to flip</span>
            </span>
          </div>
        </motion.div>

        {/* ── Login Authentication Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="ww-login-card-wrapper"
        >
          <div className="ww-login-card">
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-[#EAE8DF] shadow-[0_4px_16px_rgba(34,37,31,0.06)] mb-4 overflow-hidden">
                <img src="/logo.jpg" alt="WizWallet Logo" className="w-full h-full object-cover" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] text-[11px] font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sovereign Wealth Management</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#22251F] tracking-tight">WizWallet v5.0</h1>
              <p className="text-xs text-[#77786F] mt-1 max-w-xs mx-auto">
                Sign in to manage your private portfolio, industrial sectors, and corporate reserves.
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3 bg-[#FCEEED] border border-[#E8C5C3] text-[#C66D65] rounded-xl text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="account-identifier" className="text-xs font-bold text-[#77786F] block">
                  Account Identifier
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A3A297] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="account-identifier"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter account identifier..."
                    className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-[#22251F] placeholder-[#A3A297] outline-none font-medium focus:border-[#526B56] focus:bg-white focus:ring-2 focus:ring-[#526B56]/15 transition-all"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="security-pin" className="text-xs font-bold text-[#77786F] block">
                  Security PIN / Master Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A3A297] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="security-pin"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter master key..."
                    className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl py-2.5 pl-10 pr-10 text-sm text-[#22251F] placeholder-[#A3A297] outline-none font-medium focus:border-[#526B56] focus:bg-white focus:ring-2 focus:ring-[#526B56]/15 transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A297] hover:text-[#22251F] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#77786F] cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#526B56] border-[#D5D2C8] focus:ring-[#526B56] cursor-pointer"
                  />
                  <span>Remember this workstation</span>
                </label>
                <span className="text-[11px] text-[#A3A297] font-medium">Session: Encrypted</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#526B56] hover:bg-[#445A48] text-white text-sm font-bold tracking-tight shadow-sm hover:shadow-md transition-all active:translate-y-px cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating Vault...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Financial Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Footer */}
          <div className="text-center mt-6 text-[11px] text-[#A3A297] flex items-center justify-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-[#526B56]" />
            <span>Institutional Private Banking Architecture · 256-Bit SSL</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(LoginPage);

import React, { useState, useEffect } from 'react';
import { useEmpire } from './context/EmpireContext';
import LoginPage from './features/auth/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MainDashboard from './features/dashboard/MainDashboard';
import WalletHub from './features/wallet/WalletHub';
import BankHub from './features/bank/BankHub';
import BusinessHub from './features/business/BusinessHub';
import SectorHub from './features/sectors/SectorHub';
import TransactionHub from './features/transactions/TransactionHub';
import FamilyHub from './features/family/FamilyHub';
import SettingsHub from './features/settings/SettingsHub';

// Keyboard shortcut map
const SHORTCUTS = [
  { key: 'D', action: 'Dashboard' },
  { key: 'W', action: 'Smart Wallet' },
  { key: 'B', action: 'Global Bank' },
  { key: 'E', action: 'Business Hub' },
  { key: 'S', action: 'Advanced Sectors' },
  { key: 'F', action: 'Family Empire' },
  { key: 'L', action: 'Global Ledger' },
  { key: 'C', action: 'Control Engine' },
  { key: '?', action: 'Toggle this guide' },
];

const ShortcutModal = ({ onClose }) => (
  <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
    <div className="glass-card relative z-10 w-full max-w-md p-8 border-neon-blue/30 shadow-[0_0_80px_rgba(0,243,255,0.1)]">
      <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-neon-blue">⌨ Keyboard Shortcuts</h3>
      <div className="space-y-3">
        {SHORTCUTS.map(({ key, action }) => (
          <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-xs font-black uppercase tracking-widest text-slate-300">{action}</span>
            <kbd className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue font-black text-xs">{key}</kbd>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 uppercase font-bold mt-6 text-center">Press Escape or ? to close</p>
    </div>
  </div>
);

import MobileAppLayout from './components/mobile/MobileAppLayout';

const App = () => {
  const { user, theme, config } = useEmpire();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    document.documentElement.classList.toggle('neon-disabled', config?.neonMode === false);
    document.documentElement.classList.toggle('transparency-disabled', config?.transparency === false);
  }, [theme, config?.neonMode, config?.transparency]);

  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.key.toUpperCase()) {
        case 'D': setActiveTab('dashboard'); break;
        case 'W': setActiveTab('wallet'); break;
        case 'B': setActiveTab('bank'); break;
        case 'E': setActiveTab('business'); break;
        case 'S': setActiveTab('sectors'); break;
        case 'F': setActiveTab('family'); break;
        case 'L': setActiveTab('transactions'); break;
        case 'C': setActiveTab('settings'); break;
        case '?': setShowShortcuts(prev => !prev); break;
        case 'ESCAPE': setShowShortcuts(false); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <MainDashboard setActiveTab={setActiveTab} />;
      case 'wallet': return <WalletHub setActiveTab={setActiveTab} />;
      case 'bank': return <BankHub />;
      case 'business': return <BusinessHub />;
      case 'sectors': return <SectorHub />;
      case 'transactions': return <TransactionHub />;
      case 'family': return <FamilyHub />;
      case 'settings': return <SettingsHub />;
      default: return <MainDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* Dedicated Native Mobile Layout Shell (< 1024px / lg:hidden) */}
      <div className="block lg:hidden">
        <MobileAppLayout activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Desktop Command Center Shell (>= 1024px / hidden lg:flex) */}
      <div className="hidden lg:flex h-screen bg-dashboard-bg text-slate-100 overflow-hidden relative">
        {showShortcuts && <ShortcutModal onClose={() => setShowShortcuts(false)} />}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header activeTab={activeTab} />
          <main className="flex-1 overflow-y-auto p-8 scroll-hide pb-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
          <footer className="py-3 px-6 text-center text-xs text-cyan-200/60 border-t border-neon-cyan/15 bg-[#041a1e]/80 backdrop-blur-xl">
            © WizWallet 2026 | Personal Financial Command Center v5.0 — Press <kbd className="px-2 py-0.5 bg-neon-cyan/10 border border-neon-cyan/20 rounded text-neon-blue font-bold">?</kbd> for shortcut guide
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;

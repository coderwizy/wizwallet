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
import CommandPalette from './components/ui/CommandPalette';
import MobileAppLayout from './components/mobile/MobileAppLayout';

// Keyboard shortcut map
const SHORTCUTS = [
  { key: 'D', action: 'Portfolio Overview' },
  { key: 'W', action: 'Smart Wallet & Vault' },
  { key: 'B', action: 'Global Bank & APY' },
  { key: 'E', action: 'Corporate Ventures' },
  { key: 'S', action: '30 Industrial Sectors' },
  { key: 'F', action: 'Family Wealth Office' },
  { key: 'L', action: 'Global Ledger' },
  { key: 'C', action: 'Control Settings' },
  { key: 'K', action: 'Command Palette (Ctrl+K)' },
  { key: '?', action: 'Toggle Shortcut Guide' },
];

const ShortcutModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-[#22251F]/40 backdrop-blur-xs" onClick={onClose} />
    <div className="relative z-10 w-full max-w-sm bg-white border border-[#EAE8DF] rounded-2xl shadow-[0_20px_60px_rgba(34,37,31,0.15)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#22251F]">Keyboard Shortcuts</h3>
        <span className="text-[10px] text-[#A3A297] font-medium">Quick Access</span>
      </div>
      <div className="space-y-2">
        {SHORTCUTS.map(({ key, action }) => (
          <div key={key} className="flex justify-between items-center p-2.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
            <span className="text-xs font-medium text-[#22251F]">{action}</span>
            <kbd className="px-2 py-0.5 bg-white border border-[#EAE8DF] rounded text-[#77786F] font-mono text-xs shadow-2xs">
              {key}
            </kbd>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[#A3A297] mt-4 text-center">Press Escape or ? to close</p>
    </div>
  </div>
);

const App = () => {
  const { user } = useEmpire();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      // Don't trigger shortcuts if user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      // Handle Command Palette (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }

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
        case 'ESCAPE':
          setShowShortcuts(false);
          setShowCommandPalette(false);
          break;
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
      case 'bank': return <BankHub setActiveTab={setActiveTab} />;
      case 'business': return <BusinessHub setActiveTab={setActiveTab} />;
      case 'sectors': return <SectorHub setActiveTab={setActiveTab} />;
      case 'transactions': return <TransactionHub setActiveTab={setActiveTab} />;
      case 'family': return <FamilyHub setActiveTab={setActiveTab} />;
      case 'settings': return <SettingsHub setActiveTab={setActiveTab} />;
      default: return <MainDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        setActiveTab={setActiveTab}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && <ShortcutModal onClose={() => setShowShortcuts(false)} />}

      {/* Native Mobile Layout Shell (< 1024px / lg:hidden) */}
      <div className="block lg:hidden">
        <MobileAppLayout activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Desktop Command Center Shell (>= 1024px / hidden lg:flex) */}
      <div className="hidden lg:flex h-screen bg-[#F8F7F2] text-[#22251F] overflow-hidden relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
          />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-hide pb-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
          <footer className="py-2.5 px-6 text-center text-xs text-[#A3A297] border-t border-[#EAE8DF] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#66866A]" />
              <span>WizWallet v5.0 · Personal Wealth Management SaaS</span>
            </div>
            <div>
              Press{' '}
              <kbd className="px-1.5 py-0.5 bg-[#F1EFE7] border border-[#EAE8DF] rounded text-[#77786F] font-mono text-[10px]">?</kbd>{' '}
              for shortcuts ·{' '}
              <kbd className="px-1.5 py-0.5 bg-[#F1EFE7] border border-[#EAE8DF] rounded text-[#77786F] font-mono text-[10px]">Ctrl+K</kbd>{' '}
              command palette
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default App;

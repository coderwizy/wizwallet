import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Wallet, Landmark, Briefcase,
  Layers, Users, History, Settings, ArrowRight, Zap,
  Send, ArrowLeftRight, Download, Plus, X
} from 'lucide-react';
import { useEmpire } from '../../context/EmpireContext';

const CommandPalette = ({ isOpen, onClose, setActiveTab, onTriggerAction }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const { businesses, sectors, setSectors, transactions } = useEmpire();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const items = useMemo(() => {
    const list = [
      { id: 'nav-dashboard', category: 'Navigation', title: 'Dashboard & Overview', icon: LayoutDashboard, action: () => { setActiveTab('dashboard'); onClose(); } },
      { id: 'nav-wallet', category: 'Navigation', title: 'Smart Wallet & Liquidity Vault', icon: Wallet, action: () => { setActiveTab('wallet'); onClose(); } },
      { id: 'nav-bank', category: 'Navigation', title: 'Global Bank & APY Reserve', icon: Landmark, action: () => { setActiveTab('bank'); onClose(); } },
      { id: 'nav-business', category: 'Navigation', title: 'Business Ventures Hub', icon: Briefcase, action: () => { setActiveTab('business'); onClose(); } },
      { id: 'nav-sectors', category: 'Navigation', title: '30 Industrial Sectors', icon: Layers, action: () => { setActiveTab('sectors'); onClose(); } },
      { id: 'nav-family', category: 'Navigation', title: 'Family Wealth & Council Trust', icon: Users, action: () => { setActiveTab('family'); onClose(); } },
      { id: 'nav-ledger', category: 'Navigation', title: 'Global Ledger & Transactions', icon: History, action: () => { setActiveTab('transactions'); onClose(); } },
      { id: 'nav-settings', category: 'Navigation', title: 'Settings & Security Control', icon: Settings, action: () => { setActiveTab('settings'); onClose(); } },

      { id: 'act-transfer', category: 'Quick Action', title: 'Transfer Funds (Wallet ⇄ Bank)', icon: ArrowLeftRight, action: () => { setActiveTab('wallet'); onClose(); onTriggerAction?.('transfer'); } },
      { id: 'act-pay', category: 'Quick Action', title: 'Send P2P Payment', icon: Send, action: () => { setActiveTab('wallet'); onClose(); onTriggerAction?.('pay'); } },
      { id: 'act-add-biz', category: 'Quick Action', title: 'Launch New Corporate Venture', icon: Plus, action: () => { setActiveTab('business'); onClose(); onTriggerAction?.('add-business'); } },
      { id: 'act-optimize', category: 'Quick Action', title: 'Optimize All Industrial Sectors (+5%)', icon: Zap, action: () => {
        setSectors(prev => prev.map(s => ({ ...s, revenue: s.revenue * 1.05 })));
        onClose();
        setActiveTab('sectors');
      }},
      { id: 'act-export', category: 'Quick Action', title: 'Export Ledger to CSV', icon: Download, action: () => {
        setActiveTab('transactions');
        onClose();
        onTriggerAction?.('export-csv');
      }},
    ];

    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query, setActiveTab, onClose, onTriggerAction, setSectors]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (items.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % (items.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#22251F]/40 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-xl bg-white border border-[#EAE8DF] rounded-2xl shadow-[0_24px_70px_rgba(34,37,31,0.18)] overflow-hidden flex flex-col"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#EAE8DF]">
            <Search className="w-4 h-4 text-[#A3A297] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search views, actions, or commands... (e.g. transfer, sectors)"
              className="w-full bg-transparent text-sm text-[#22251F] placeholder-[#A3A297] outline-none font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#A3A297] hover:text-[#22251F] rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#77786F] bg-[#F1EFE7] border border-[#EAE8DF] rounded shadow-xs">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div ref={listRef} className="max-h-80 overflow-y-auto p-2 scroll-hide space-y-1">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A3A297]">
                No matching actions found for "{query}"
              </div>
            ) : (
              items.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#EDF2E9] text-[#526B56]' : 'text-[#22251F] hover:bg-[#F8F7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white text-[#526B56] shadow-xs' : 'bg-[#F8F7F2] text-[#77786F]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isSelected ? 'text-[#526B56]' : 'text-[#22251F]'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#A3A297]">{item.category}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#526B56] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 bg-[#FCFBF8] border-t border-[#EAE8DF] flex items-center justify-between text-[11px] text-[#A3A297]">
            <div className="flex items-center gap-3">
              <span>Use <kbd className="px-1 py-0.2 bg-white border border-[#EAE8DF] rounded text-[9px] font-mono">↑</kbd> <kbd className="px-1 py-0.2 bg-white border border-[#EAE8DF] rounded text-[9px] font-mono">↓</kbd> to navigate</span>
              <span><kbd className="px-1 py-0.2 bg-white border border-[#EAE8DF] rounded text-[9px] font-mono">↵</kbd> to select</span>
            </div>
            <span>WizWallet v5.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default React.memo(CommandPalette);


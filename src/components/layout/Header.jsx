import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Bell, X, Search, Plus, ArrowLeftRight, Send,
  Briefcase, ChevronDown, CheckCircle2, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TITLES = {
  dashboard: 'Portfolio Overview',
  wallet: 'Smart Wallet & Vault',
  bank: 'Global Bank & Reserves',
  business: 'Corporate Ventures',
  sectors: 'Industrial Sectors',
  family: 'Family Wealth Office',
  transactions: 'Global Ledger',
  settings: 'Control Engine & Settings',
};

const BREADCRUMBS = {
  dashboard: 'Overview / Summary',
  wallet: 'Accounts / Liquid Vault',
  bank: 'Accounts / Reserve Treasury',
  business: 'Portfolio / Ventures',
  sectors: 'Portfolio / 30 Domains',
  family: 'Governance / Sovereign Trust',
  transactions: 'Auditing / Ledger',
  settings: 'System / Configuration',
};

const Header = ({ activeTab, setActiveTab, onOpenCommandPalette }) => {
  const { wallet, bank, user, transactions } = useEmpire();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const totalWealth = useMemo(
    () => (wallet?.balance || 0) + (bank?.balance || 0),
    [wallet?.balance, bank?.balance]
  );

  const title = TITLES[activeTab] || 'Overview';
  const breadcrumb = BREADCRUMBS[activeTab] || 'WizWallet / Terminal';
  const recentTx = transactions.slice(0, 8);

  return (
    <header className="hidden lg:flex h-16 border-b border-[#EAE8DF] items-center justify-between px-6 bg-white sticky top-0 z-40">
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297] leading-none mb-1">
            {breadcrumb}
          </p>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-[#22251F] leading-none">{title}</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#EDF2E9] rounded-full border border-[#D5DFD1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#66866A] animate-pulse" />
              <span className="text-[10px] font-semibold text-[#526B56]">Live Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#F8F7F2] hover:bg-[#F1EFE7] border border-[#EAE8DF] rounded-xl text-xs text-[#A3A297] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#A3A297] group-hover:text-[#526B56] transition-colors" />
            <span className="font-medium text-[#77786F]">Search actions, hubs, or transactions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white border border-[#EAE8DF] rounded text-[10px] font-mono text-[#77786F] shadow-2xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Wealth + Quick Action + Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Wealth Summary Pill */}
        <div className="hidden xl:flex items-center gap-4 pr-4 border-r border-[#EAE8DF]">
          <div className="text-right">
            <p className="text-[10px] text-[#A3A297] font-semibold uppercase tracking-wider">Liquid Vault</p>
            <p className="text-xs font-bold text-[#22251F] tabular-nums">
              ${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#A3A297] font-semibold uppercase tracking-wider">Total Net Worth</p>
            <p className="text-xs font-bold text-[#526B56] tabular-nums">
              ${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDF2E9] hover:bg-[#E3EBDD] text-[#526B56] border border-[#D5DFD1] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Actions</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          <AnimatePresence>
            {showQuickMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EAE8DF] rounded-xl shadow-[0_8px_30px_rgba(34,37,31,0.1)] z-50 overflow-hidden p-1.5"
                >
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#22251F] hover:bg-[#F8F7F2] text-left transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#526B56]" />
                    <span>Send Payment</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#22251F] hover:bg-[#F8F7F2] text-left transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#C18A48]" />
                    <span>Transfer to Bank</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('business'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#22251F] hover:bg-[#F8F7F2] text-left transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    <span>Add Venture</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-[#77786F] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {recentTx.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#526B56] rounded-full ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-84 bg-white border border-[#EAE8DF] rounded-2xl shadow-[0_12px_40px_rgba(34,37,31,0.12)] z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAE8DF] bg-[#FCFBF8]">
                    <div>
                      <h3 className="text-xs font-bold text-[#22251F]">Financial Activity</h3>
                      <p className="text-[10px] text-[#A3A297] mt-0.5">{recentTx.length} recent events</p>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto scroll-hide divide-y divide-[#F1EFE7]">
                    {recentTx.length === 0 ? (
                      <p className="text-xs text-[#A3A297] text-center py-8">No recent activity</p>
                    ) : (
                      recentTx.map(tx => (
                        <div key={tx.id} className="px-4 py-3 hover:bg-[#F8F7F2] transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#22251F] truncate">{tx.description}</p>
                              <p className="text-[10px] text-[#A3A297] mt-0.5">
                                {tx.module} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className={`text-xs font-bold tabular-nums shrink-0 ${tx.type === 'Credit' ? 'text-[#66866A]' : 'text-[#C66D65]'}`}>
                              {tx.type === 'Credit' ? '+' : '−'}${Number(tx.amount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-[#EAE8DF] bg-[#FCFBF8] text-center">
                    <button
                      onClick={() => { setActiveTab('transactions'); setShowNotifications(false); }}
                      className="text-[11px] font-semibold text-[#526B56] hover:underline cursor-pointer"
                    >
                      View All in Global Ledger →
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Chip */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer" onClick={() => setActiveTab('settings')}>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-[#22251F]">{user?.username || 'raghav94'}</p>
            <p className="text-[10px] text-[#A3A297] font-medium">{user?.role || 'CEO'}</p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#EAE8DF] shadow-2xs">
            <img
              src={user?.profilePic?.replace('/src/assets/', '/') || '/1701611631194.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);

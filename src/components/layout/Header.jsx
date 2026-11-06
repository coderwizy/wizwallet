import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Bell, X, Search, Plus, ArrowLeftRight, Send,
  Briefcase, ChevronDown, CheckCircle2, Shield, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TITLES = {
  dashboard: 'Portfolio Overview',
  commander: 'AI Empire Commander',
  simulator: 'Future Wealth Simulator',
  goals: 'Wealth Goals & Missions',
  wallet: 'Smart Wallet & Vault',
  bank: 'Global Bank & Reserves',
  expenses: 'Expense & Budget Tracking',
  tax: 'Tax Planning Center',
  investments: 'Investment & Stock Portfolio',
  realestate: 'Real Estate & Properties',
  business: 'Corporate Ventures',
  sectors: 'Industrial Sectors',
  family: 'Family Wealth Office',
  vault: 'Document & Encrypted Vault',
  transactions: 'Global Ledger',
  settings: 'Control Engine & Settings',
};

const BREADCRUMBS = {
  dashboard: 'Overview / God Mode',
  commander: 'Intelligence / Local AI',
  simulator: 'Intelligence / Forecasting',
  goals: 'Intelligence / Progression',
  wallet: 'Accounts / Liquid Vault',
  bank: 'Accounts / Reserve Treasury',
  expenses: 'Treasury / Cash Flow',
  tax: 'Treasury / Multi-Jurisdiction',
  investments: 'Assets / Market Equities',
  realestate: 'Assets / Property Empire',
  business: 'Assets / 13 Ventures',
  sectors: 'Assets / 30 Industrial Domains',
  family: 'Governance / Sovereign Trust',
  vault: 'Governance / IndexedDB Storage',
  transactions: 'Auditing / Global Ledger',
  settings: 'System / Configuration',
};

const Header = ({ activeTab, setActiveTab, onOpenCommandPalette }) => {
  const {
    wallet, bank, user, transactions, isPulseActive, togglePulse,
    currencySymbol, toggleCurrency,
    periodicReloadEnabled, togglePeriodicReload, periodicReloadSeconds
  } = useEmpire();
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
    <header className="hidden lg:flex h-16 border-b border-ww-border items-center justify-between px-6 bg-white sticky top-0 z-40">
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted leading-none mb-1">
            {breadcrumb}
          </p>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-ww-text leading-none">{title}</h1>
            <button
              type="button"
              onClick={togglePulse}
              title={isPulseActive ? 'Pulse Heartbeat Active · Click to Stop' : 'Pulse Heartbeat Stopped · Click to Start'}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                isPulseActive
                  ? 'bg-ww-green-bg border-ww-accent/20 hover:bg-ww-green-bg'
                  : 'bg-ww-bg-alt border-ww-border-strong hover:bg-ww-border'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPulseActive ? 'bg-ww-success animate-pulse' : 'bg-ww-text-muted'}`} />
              <span className={`text-[10px] font-semibold ${isPulseActive ? 'text-ww-accent' : 'text-ww-text-secondary'}`}>
                {isPulseActive ? 'Live Engine' : 'Engine Paused'}
              </span>
            </button>
            <button
              type="button"
              onClick={toggleCurrency}
              title={`Click to switch currency to ${currencySymbol === '₹' ? 'USD ($)' : 'Rupees (₹)'} (No conversion)`}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-ww-border bg-ww-bg hover:bg-ww-bg-alt transition-colors cursor-pointer text-ww-text shadow-2xs group"
            >
              <span className="w-4 h-4 rounded-full bg-ww-green-bg text-ww-accent flex items-center justify-center font-extrabold text-[10px]">
                {currencySymbol}
              </span>
              <span className="text-[10px] font-bold text-ww-text-secondary group-hover:text-ww-accent transition-colors">
                {currencySymbol === '₹' ? 'INR (₹)' : 'USD ($)'}
              </span>
            </button>
            <button
              type="button"
              onClick={togglePeriodicReload}
              title={`Periodic auto-reload: ${periodicReloadEnabled ? `Every ${periodicReloadSeconds}s (click to turn off)` : 'Off (click to turn on)'}. Reloads safely without resetting your active page.`}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer shadow-2xs ${
                periodicReloadEnabled
                  ? 'bg-ww-green-bg border-ww-accent/20 hover:bg-ww-green-bg text-ww-accent'
                  : 'bg-ww-bg-alt border-ww-border-strong hover:bg-ww-border text-ww-text-secondary'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${periodicReloadEnabled ? 'text-ww-accent' : 'text-ww-text-muted'}`} />
              <span className="text-[10px] font-bold">
                {periodicReloadEnabled ? `Reload: ${periodicReloadSeconds}s` : 'Reload: Off'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar trigger */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-ww-bg hover:bg-ww-bg-alt border border-ww-border rounded-xl text-xs text-ww-text-muted transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-ww-text-muted group-hover:text-ww-accent transition-colors" />
            <span className="font-medium text-ww-text-secondary">Search actions, hubs, or transactions...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white border border-ww-border rounded text-[10px] font-mono text-ww-text-secondary shadow-2xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Wealth + Quick Action + Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Wealth Summary Pill */}
        <div className="hidden xl:flex items-center gap-4 pr-4 border-r border-ww-border">
          <div className="text-right">
            <p className="text-[10px] text-ww-text-muted font-semibold uppercase tracking-wider">Liquid Vault</p>
            <p className="text-xs font-bold text-ww-text tabular-nums">
              {currencySymbol}{(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-ww-text-muted font-semibold uppercase tracking-wider">Total Net Worth</p>
            <p className="text-xs font-bold text-ww-accent tabular-nums">
              {currencySymbol}{totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ww-green-bg hover:bg-ww-green-bg text-ww-accent border border-ww-accent/20 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
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
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-ww-border rounded-xl shadow-[0_8px_30px_rgba(34,37,31,0.1)] z-50 overflow-hidden p-1.5"
                >
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-ww-text hover:bg-ww-bg text-left transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-ww-accent" />
                    <span>Send Payment</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('wallet'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-ww-text hover:bg-ww-bg text-left transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-ww-warning" />
                    <span>Transfer to Bank</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('business'); setShowQuickMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-ww-text hover:bg-ww-bg text-left transition-colors cursor-pointer"
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
            className="relative p-2 rounded-xl text-ww-text-secondary hover:text-ww-text hover:bg-ww-bg-alt transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {recentTx.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ww-accent rounded-full ring-2 ring-white" />
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
                  className="absolute right-0 top-full mt-2 w-84 bg-white border border-ww-border rounded-2xl shadow-[0_12px_40px_rgba(34,37,31,0.12)] z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-ww-border bg-ww-elevated">
                    <div>
                      <h3 className="text-xs font-bold text-ww-text">Financial Activity</h3>
                      <p className="text-[10px] text-ww-text-muted mt-0.5">{recentTx.length} recent events</p>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg text-ww-text-muted hover:text-ww-text hover:bg-ww-bg-alt transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto scroll-hide divide-y divide-ww-bg-alt">
                    {recentTx.length === 0 ? (
                      <p className="text-xs text-ww-text-muted text-center py-8">No recent activity</p>
                    ) : (
                      recentTx.map(tx => (
                        <div key={tx.id} className="px-4 py-3 hover:bg-ww-bg transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-ww-text truncate">{tx.description}</p>
                              <p className="text-[10px] text-ww-text-muted mt-0.5">
                                {tx.module} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <p className={`text-xs font-bold tabular-nums shrink-0 ${tx.type === 'Credit' ? 'text-ww-success' : 'text-ww-danger'}`}>
                              {tx.type === 'Credit' ? '+' : '−'}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-ww-border bg-ww-elevated text-center">
                    <button
                      onClick={() => { setActiveTab('transactions'); setShowNotifications(false); }}
                      className="text-[11px] font-semibold text-ww-accent hover:underline cursor-pointer"
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
            <p className="text-xs font-bold text-ww-text">{user?.username || 'raghav94'}</p>
            <p className="text-[10px] text-ww-text-muted font-medium">{user?.role || 'CEO'}</p>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-ww-border shadow-2xs">
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

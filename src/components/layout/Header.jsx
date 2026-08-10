import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { Bell, Search, User, TrendingUp, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ activeTab }) => {
  const { wallet, bank, user, transactions } = useEmpire();
  const [showNotifications, setShowNotifications] = useState(false);

  const totalWealth = useMemo(() => (wallet?.balance || 0) + (bank?.balance || 0), [wallet?.balance, bank?.balance]);

  const getTitle = () => {
    if (!activeTab) return 'Dashboard';
    const titles = {
      dashboard: 'Control Center',
      wallet: 'Smart Wallet',
      bank: 'Global Bank',
      business: 'Business Hub',
      sectors: 'Advanced Sectors',
      family: 'Family Empire',
      transactions: 'Global Ledger',
      settings: 'Control Engine',
    };
    return titles[activeTab] || activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ');
  };

  return (
    <header className="hidden lg:flex h-20 border-b border-neon-cyan/15 items-center justify-between px-8 bg-[#041a1e]/85 backdrop-blur-2xl sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-xl font-black uppercase tracking-wider text-slate-100 truncate">{getTitle()}</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Markets Live</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Liquid Vault</p>
            <p className="text-sm font-black text-neon-blue tabular-nums">${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="text-right hidden xl:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Net Wealth</p>
            <p className="text-sm font-black text-white tabular-nums">${(totalWealth || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 border-l border-white/10 pl-4 md:pl-6">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View System Notifications"
              className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all relative focus-visible:outline-none"
            >
              <Bell className="w-5 h-5" />
              {transactions.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-neon-blue rounded-full border-2 border-slate-950 animate-pulse shadow-[0_0_8px_#00f3ff]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-75 md:w-88 glass-card p-5 z-50 border-neon-blue/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white italic">Activity Stream</h3>
                      <span className="text-[10px] font-black text-neon-blue bg-neon-blue/10 border border-neon-blue/20 px-2.5 py-0.5 rounded-full">{transactions.length} New</span>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto scroll-hide pr-1">
                      {transactions.length === 0 ? (
                        <p className="text-[11px] text-slate-500 uppercase text-center py-8 font-bold">No Active Alerts</p>
                      ) : (
                        transactions.slice(0, 6).map(tx => (
                          <div key={tx.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/15 transition-all text-left space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-neon-blue uppercase tracking-wider">{tx.module}</span>
                              <span className="text-[8px] text-slate-400 font-bold">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-200 leading-snug">{tx.description}</p>
                            <p className={`text-xs font-black tabular-nums ${tx.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-white/10">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black uppercase tracking-tight text-slate-200">{user?.username || 'Raghav94'}</p>
              <p className="text-[10px] text-neon-blue font-bold uppercase tracking-wider">{user?.role || 'CEO'}</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-neon-blue/40 p-0.5 overflow-hidden shadow-[0_0_12px_rgba(0,243,255,0.2)]">
              <img 
                src={user?.profilePic?.replace('/src/assets/', '/') || "/1701611631194.jpg"} 
                alt="User Profile" 
                className="w-full h-full rounded-full object-cover text-xs text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);

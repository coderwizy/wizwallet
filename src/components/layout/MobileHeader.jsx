import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { Bell, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileHeader = ({ activeTab }) => {
  const { wallet, user, transactions } = useEmpire();
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    if (!activeTab) return 'Control Center';
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
    <header className="lg:hidden sticky top-0 z-40 h-16 bg-[#F5F0E6]/95 backdrop-blur-2xl border-b border-[#E5DFD1] px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#D6CDB8] p-0.5 bg-white shrink-0 shadow-xs">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-black uppercase tracking-wider text-[#1C1917] truncate">{getTitle()}</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-[#0284C7] font-black uppercase tracking-widest tabular-nums">
              ${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="p-2 text-[#57534E] hover:text-[#1C1917] rounded-xl hover:bg-[#EAE3D2] transition-all relative focus-visible:outline-none cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {transactions.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0284C7] rounded-full border-2 border-white animate-pulse shadow-sm" />
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
                  className="absolute right-0 mt-2 w-72 bg-white p-4 z-50 border border-[#E5DFD1] rounded-2xl shadow-[0_20px_50px_rgba(28,25,23,0.12)] text-[#1C1917]"
                >
                  <div className="flex justify-between items-center mb-3 border-b border-[#E5DFD1] pb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1C1917] italic">Activity Stream</h3>
                    <span className="text-[9px] font-black text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">{transactions.length} New</span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto scroll-hide pr-1">
                    {transactions.length === 0 ? (
                      <p className="text-[10px] text-[#78716C] uppercase text-center py-6 font-bold">No Active Alerts</p>
                    ) : (
                      transactions.slice(0, 5).map(tx => (
                        <div key={tx.id} className="p-2.5 bg-[#F9F7F1] rounded-xl border border-[#E8E2D5] text-left space-y-1">
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="font-black text-[#0284C7] uppercase">{tx.module}</span>
                            <span className="text-[#78716C] font-medium">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs font-bold text-[#1C1917] leading-snug truncate">{tx.description}</p>
                          <p className={`text-xs font-black tabular-nums ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
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

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full border-2 border-[#0284C7]/40 p-0.5 overflow-hidden shadow-xs bg-white">
          <img
            src={user?.profilePic?.replace('/src/assets/', '/') || "/1701611631194.jpg"}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover text-xs text-slate-500"
          />
        </div>
      </div>
    </header>
  );
};

export default React.memo(MobileHeader);

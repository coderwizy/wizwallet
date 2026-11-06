import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TITLES = {
  dashboard: 'Overview',
  wallet: 'Smart Wallet',
  bank: 'Global Bank',
  business: 'Ventures',
  sectors: 'Sectors',
  family: 'Family',
  transactions: 'Ledger',
  settings: 'Settings',
};

const MobileHeader = ({ activeTab }) => {
  const { wallet, user, transactions, isPulseActive, togglePulse, currencySymbol, toggleCurrency } = useEmpire();
  const [showNotifications, setShowNotifications] = useState(false);

  const title = TITLES[activeTab] || 'Overview';
  const recentTx = transactions.slice(0, 5);

  return (
    <header className="lg:hidden sticky top-0 z-40 h-14 bg-white border-b border-[#EAE8DF] px-4 flex items-center justify-between shadow-[0_1px_3px_rgba(34,37,31,0.05)]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#EAE8DF] shrink-0">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[#22251F] truncate">{title}</h1>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[#526B56] tabular-nums">
              {currencySymbol}{(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <button
              type="button"
              onClick={togglePulse}
              title={isPulseActive ? 'Pulse Active · Tap to Stop' : 'Pulse Stopped · Tap to Start'}
              className="flex items-center p-0.5 rounded cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isPulseActive ? 'bg-[#66866A] animate-pulse' : 'bg-[#A3A297]'} shrink-0`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* 1-Click Currency Toggle */}
        <button
          type="button"
          onClick={toggleCurrency}
          title={`Switch Currency to ${currencySymbol === '₹' ? 'USD ($)' : 'INR (₹)'} (No conversion)`}
          className="px-2 py-1 rounded-lg border border-[#EAE8DF] bg-[#FCFBF8] text-xs font-bold text-[#526B56] hover:bg-[#EDF2E9] transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
        >
          <span className="font-extrabold">{currencySymbol}</span>
          <span className="text-[10px] text-[#77786F]">{currencySymbol === '₹' ? 'INR' : 'USD'}</span>
        </button>
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-[#77786F] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {recentTx.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#526B56] rounded-full" />
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
                  className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#EAE8DF] rounded-xl shadow-[0_8px_24px_rgba(34,37,31,0.12)] z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAE8DF]">
                    <h3 className="text-sm font-semibold text-[#22251F]">Activity</h3>
                    <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg text-[#A3A297] hover:bg-[#F1EFE7] transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto scroll-hide divide-y divide-[#F1EFE7]">
                    {recentTx.length === 0 ? (
                      <p className="text-xs text-[#A3A297] text-center py-6">No recent activity</p>
                    ) : (
                      recentTx.map(tx => (
                        <div key={tx.id} className="px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-[#22251F] truncate">{tx.description}</p>
                              <p className="text-[10px] text-[#A3A297] mt-0.5">{tx.module}</p>
                            </div>
                            <p className={`text-xs font-semibold tabular-nums shrink-0 ${tx.type === 'Credit' ? 'text-[#66866A]' : 'text-[#C66D65]'}`}>
                              {tx.type === 'Credit' ? '+' : '−'}{currencySymbol}{tx.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#EAE8DF]">
          <img
            src={user?.profilePic?.replace('/src/assets/', '/') || '/1701611631194.jpg'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default React.memo(MobileHeader);

import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  LayoutDashboard, Wallet, Landmark, History,
  MoreHorizontal, Briefcase, Layers, Users, Settings, X, LogOut, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const { logout } = useEmpire();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'bank', label: 'Bank', icon: Landmark },
    { id: 'transactions', label: 'Ledger', icon: History },
  ];

  const secondaryNavItems = [
    { id: 'business', label: 'Ventures', icon: Briefcase, desc: 'Corporate ventures & yield' },
    { id: 'sectors', label: 'Sectors', icon: Layers, desc: '30 industrial domain nodes' },
    { id: 'family', label: 'Family', icon: Users, desc: 'Governance & wealth council' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Configuration & security' },
  ];

  return (
    <>
      {/* Bottom Nav */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EAE8DF] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setShowMoreMenu(false); }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all focus-visible:outline-none cursor-pointer min-w-0 ${isActive ? 'text-[#526B56]' : 'text-[#A3A297]'}`}
              >
                <item.icon className={`w-5 h-5 transition-all ${isActive ? 'text-[#526B56]' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#526B56] font-semibold' : ''}`}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute -bottom-0 w-5 h-0.5 bg-[#526B56] rounded-full"
                  />
                )}
              </button>
            );
          })}

          {/* More */}
          <button
            onClick={() => setShowMoreMenu(p => !p)}
            aria-label="More"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all focus-visible:outline-none cursor-pointer ${showMoreMenu || ['business', 'sectors', 'family', 'settings'].includes(activeTab) ? 'text-[#526B56]' : 'text-[#A3A297]'}`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More menu bottom sheet */}
      <AnimatePresence>
        {showMoreMenu && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="absolute inset-0 bg-[#22251F]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="relative z-10 w-full bg-white rounded-t-2xl border-t border-[#EAE8DF] p-5 shadow-[0_-10px_40px_rgba(34,37,31,0.12)] max-h-[80vh] overflow-y-auto scroll-hide pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
              <div className="w-10 h-1 bg-[#D5D2C8] rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#22251F]">More</h3>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 mb-4">
                {secondaryNavItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setShowMoreMenu(false); }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${activeTab === item.id ? 'border-[#526B56]/30 bg-[#EDF2E9] text-[#526B56]' : 'border-[#EAE8DF] bg-white text-[#22251F] hover:bg-[#F8F7F2]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${activeTab === item.id ? 'bg-[#526B56] border-[#526B56] text-white' : 'bg-[#F1EFE7] border-[#EAE8DF] text-[#77786F]'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-[10px] text-[#A3A297] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A3A297]" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setShowMoreMenu(false); logout(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FCEEED] border border-[#E8C5C3] text-[#C66D65] text-xs font-semibold hover:bg-[#C66D65] hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(MobileBottomNav);

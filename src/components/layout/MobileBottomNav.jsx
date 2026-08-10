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
    { id: 'business', label: 'Business Hub', icon: Briefcase, desc: 'Corporate ventures & yield analytics' },
    { id: 'sectors', label: 'Advanced Sectors', icon: Layers, desc: '30 industrial control domain nodes' },
    { id: 'family', label: 'Family Empire', icon: Users, desc: 'Sovereign trust & council governance' },
    { id: 'settings', label: 'Control Engine', icon: Settings, desc: 'System calibration & security' },
  ];

  return (
    <>
      {/* Sticky Bottom Navigation Bar */}
      <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-2xl border-t border-[#E5DFD1] px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(28,25,23,0.06)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMoreMenu(false);
                }}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-14 py-1 rounded-xl transition-all relative cursor-pointer focus-visible:outline-none ${
                  isActive ? 'text-[#0284C7] font-black' : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeMobileTab"
                    className="absolute -bottom-1 w-6 h-0.5 bg-[#0284C7] rounded-full shadow-xs"
                  />
                )}
              </button>
            );
          })}

          {/* More Tab */}
          <button
            onClick={() => setShowMoreMenu(prev => !prev)}
            aria-label="More Menu"
            className={`flex flex-col items-center justify-center min-w-14 py-1 rounded-xl transition-all relative cursor-pointer focus-visible:outline-none ${
              showMoreMenu || ['business', 'sectors', 'family', 'settings'].includes(activeTab)
                ? 'text-[#0284C7] font-black'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <MoreHorizontal className={`w-5 h-5 transition-transform ${showMoreMenu ? 'scale-110 stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider mt-1">More</span>
          </button>
        </div>
      </nav>

      {/* Secondary Bottom Sheet Menu */}
      <AnimatePresence>
        {showMoreMenu && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-10 w-full bg-[#F7F4EC] rounded-t-3xl border-t border-[#E5DFD1] p-6 shadow-[0_-20px_50px_rgba(28,25,23,0.15)] max-h-[85vh] overflow-y-auto scroll-hide pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
              <div className="w-12 h-1 bg-[#D6CDB8] rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5DFD1]">
                <div>
                  <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tight italic">WizWallet Hubs</h3>
                  <p className="text-[10px] text-[#0284C7] font-bold uppercase tracking-widest mt-0.5">Secondary Navigation</p>
                </div>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-2 rounded-xl bg-white border border-[#E5DFD1] text-[#78716C] hover:text-[#1C1917] transition-all cursor-pointer shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                      activeTab === item.id
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#1C1917] shadow-sm font-black'
                        : 'border-[#E5DFD1] bg-white text-[#1C1917] hover:bg-[#F9F7F1]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl border ${activeTab === item.id ? 'bg-[#0284C7] border-[#0284C7] text-white' : 'bg-[#F4EFE6] border-[#E2DAC8] text-[#57534E]'}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[#1C1917]">{item.label}</p>
                        <p className="text-[10px] text-[#78716C] font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A8A29E] group-hover:text-[#0284C7] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-black uppercase text-xs tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                End Session
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(MobileBottomNav);

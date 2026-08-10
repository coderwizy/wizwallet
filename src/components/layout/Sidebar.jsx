import React from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { 
  LayoutDashboard, Wallet, Landmark, Briefcase, Layers, 
  Users, History, Settings, LogOut, ChevronRight, X
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useEmpire();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
    { id: 'wallet', icon: Wallet, label: 'Smart Wallet' },
    { id: 'bank', icon: Landmark, label: 'Global Bank' },
    { id: 'business', icon: Briefcase, label: 'Business Hub' },
    { id: 'sectors', icon: Layers, label: 'Advanced Sectors' },
    { id: 'family', icon: Users, label: 'Family Empire' },
    { id: 'transactions', icon: History, label: 'Global Ledger' },
    { id: 'settings', icon: Settings, label: 'Control Engine' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 bg-[#04191d]/80 backdrop-blur-2xl border-r border-neon-cyan/15 p-6 h-screen sticky top-0">
      <div className="flex items-center gap-3.5 mb-8 px-2 mt-1">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.3)] border border-neon-blue/30 p-0.5 bg-slate-900 shrink-0">
            <img src="/logo.jpg" alt="WizWallet Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight neon-text-blue leading-none italic uppercase truncate">WizWallet</h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold block mt-1">Financial OS 5.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto scroll-hide pr-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group relative overflow-hidden focus-visible:outline-none ${
                activeTab === item.id 
                  ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30 shadow-[0_0_20px_rgba(0,243,255,0.15)] font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'stroke-[2.5px] text-neon-blue' : 'stroke-2'}`} />
                <span className="font-bold text-xs tracking-wider uppercase">{item.label}</span>
              </div>
              {activeTab === item.id && <div className="absolute left-0 top-0 w-1.5 h-full bg-neon-blue shadow-[0_0_12px_rgba(0,243,255,1)]" />}
              {activeTab === item.id && <ChevronRight className="w-4 h-4 text-neon-blue relative z-10" />}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="bg-linear-to-br from-neon-blue/10 via-white/5 to-neon-purple/10 border border-white/10 rounded-2xl p-4 mb-4">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">Network Security</p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">256-Bit SSL Encrypted</span>
            </div>
          </div>
          <button 
            onClick={logout}
            aria-label="Sign out of your session"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest shadow-sm focus-visible:outline-none"
          >
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </div>
      </aside>
    );
};

export default React.memo(Sidebar);

import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  LayoutDashboard, Wallet, Landmark, Briefcase, Layers,
  Users, History, Settings, LogOut, ChevronLeft, ChevronRight,
  Sparkles, TrendingUp, Trophy, Receipt, Scale, BarChart3,
  Building2, FolderLock
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useEmpire();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    // Group 1: Command & Intelligence
    { id: 'dashboard', icon: LayoutDashboard, label: 'Command Center', group: 'command' },
    { id: 'commander', icon: Sparkles, label: 'AI Commander', group: 'command' },
    { id: 'simulator', icon: TrendingUp, label: 'Wealth Simulator', group: 'command' },
    { id: 'goals', icon: Trophy, label: 'Goals & Missions', group: 'command' },

    // Group 2: Liquid & Treasury
    { id: 'wallet', icon: Wallet, label: 'Smart Wallet', group: 'treasury' },
    { id: 'bank', icon: Landmark, label: 'Global Bank', group: 'treasury' },
    { id: 'expenses', icon: Receipt, label: 'Expense Manager', group: 'treasury' },
    { id: 'tax', icon: Scale, label: 'Tax Center', group: 'treasury' },

    // Group 3: Empire Assets
    { id: 'business', icon: Briefcase, label: 'Business Empire', group: 'assets' },
    { id: 'sectors', icon: Layers, label: 'Industrial Sectors', group: 'assets' },
    { id: 'investments', icon: BarChart3, label: 'Investments', group: 'assets' },
    { id: 'realestate', icon: Building2, label: 'Real Estate', group: 'assets' },

    // Group 4: Governance & System
    { id: 'family', icon: Users, label: 'Family Empire', group: 'governance' },
    { id: 'vault', icon: FolderLock, label: 'Document Vault', group: 'governance' },
    { id: 'transactions', icon: History, label: 'Global Ledger', group: 'governance' },
    { id: 'settings', icon: Settings, label: 'Control Settings', group: 'governance' },
  ];

  const groups = [
    { id: 'command', label: 'Command & Intelligence' },
    { id: 'treasury', label: 'Liquid & Treasury' },
    { id: 'assets', label: 'Empire Assets' },
    { id: 'governance', label: 'Governance & System' },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#EAE8DF] h-screen sticky top-0 transition-all duration-300 z-30 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-[#EAE8DF] h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-[#EAE8DF]">
              <img src="/logo.jpg" alt="WizWallet" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#22251F] leading-none tracking-tight">WizWallet 3.0</h2>
              <p className="text-[10px] text-[#A3A297] mt-0.5 font-medium">Empire Command Center</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#EAE8DF]">
            <img src="/logo.jpg" alt="WizWallet" className="w-full h-full object-cover" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all focus-visible:outline-none cursor-pointer ${collapsed ? 'mt-3' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scroll-hide py-3 px-2 space-y-4">
        {groups.map(group => {
          const items = menuItems.filter(i => i.group === group.id);
          return (
            <div key={group.id}>
              {!collapsed && (
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#A3A297] px-3 mb-1">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all focus-visible:outline-none text-left group cursor-pointer
                        ${isActive
                          ? 'bg-[#EDF2E9] text-[#526B56]'
                          : 'text-[#77786F] hover:text-[#22251F] hover:bg-[#F8F7F2]'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#526B56]' : 'text-[#A3A297] group-hover:text-[#22251F]'}`} />
                      {!collapsed && (
                        <span className={`text-xs font-medium truncate ${isActive ? 'text-[#526B56] font-bold' : ''}`}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User profile & sign out */}
      <div className={`p-3 border-t border-[#EAE8DF] flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#EDF2E9] border border-[#D5DFD1] shrink-0">
              <img
                src={user?.profilePic || '/1701611631194.jpg'}
                alt={user?.username || 'User'}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = '/logo.jpg'; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#22251F] truncate leading-none">{user?.username || 'raghav94'}</p>
              <p className="text-[10px] text-[#A3A297] truncate mt-0.5 font-medium">{user?.role || 'Sovereign'}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="Sign out"
          className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] transition-colors cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);

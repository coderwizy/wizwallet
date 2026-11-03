import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  LayoutDashboard, Wallet, Landmark, Briefcase, Layers,
  Users, History, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useEmpire();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview', group: 'main' },
    { id: 'wallet', icon: Wallet, label: 'Smart Wallet', group: 'main' },
    { id: 'bank', icon: Landmark, label: 'Global Bank', group: 'main' },
    { id: 'business', icon: Briefcase, label: 'Ventures', group: 'portfolio' },
    { id: 'sectors', icon: Layers, label: 'Sectors', group: 'portfolio' },
    { id: 'family', icon: Users, label: 'Family', group: 'portfolio' },
    { id: 'transactions', icon: History, label: 'Ledger', group: 'tools' },
    { id: 'settings', icon: Settings, label: 'Settings', group: 'tools' },
  ];

  const groups = [
    { id: 'main', label: 'Accounts' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'tools', label: 'Tools' },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#EAE8DF] h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-[#EAE8DF] h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-[#EAE8DF]">
              <img src="/logo.jpg" alt="WizWallet" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#22251F] leading-none tracking-tight">WizWallet</h2>
              <p className="text-[10px] text-[#A3A297] mt-0.5 font-medium">Wealth Management</p>
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
          className={`p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all focus-visible:outline-none ${collapsed ? 'mt-3' : ''}`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scroll-hide py-4 px-2 space-y-5">
        {groups.map(group => {
          const items = menuItems.filter(i => i.group === group.id);
          return (
            <div key={group.id}>
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A297] px-3 mb-1">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all focus-visible:outline-none text-left group
                        ${isActive
                          ? 'bg-[#EDF2E9] text-[#526B56]'
                          : 'text-[#77786F] hover:text-[#22251F] hover:bg-[#F8F7F2]'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#526B56]' : 'text-[#A3A297] group-hover:text-[#22251F]'}`} />
                      {!collapsed && (
                        <span className={`text-sm font-medium truncate ${isActive ? 'text-[#526B56] font-semibold' : ''}`}>
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

      {/* Footer */}
      <div className={`border-t border-[#EAE8DF] p-3 space-y-2`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#EAE8DF] shrink-0">
              <img
                src={user?.profilePic?.replace('/src/assets/', '/') || '/1701611631194.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#22251F] truncate">{user?.username || 'raghav94'}</p>
              <p className="text-[10px] text-[#A3A297]">{user?.role || 'CEO'}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          aria-label="Sign out"
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#C66D65] hover:bg-[#FCEEED] transition-all focus-visible:outline-none ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);

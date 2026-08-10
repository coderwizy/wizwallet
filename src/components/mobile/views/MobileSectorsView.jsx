import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { Search, Zap, Layers, BarChart3 } from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';

const MobileSectorsView = () => {
  const { sectors, setSectors } = useEmpire();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [selectedSector, setSelectedSector] = useState(null);

  const filteredSectors = useMemo(() => {
    return sectors
      .filter(sec => sec.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'expense') return (b.expense || 0) - (a.expense || 0);
        return 0;
      });
  }, [sectors, search, sortBy]);

  const optimizeSector = (id) => {
    setSectors(prev => prev.map(sec =>
      sec.id === id ? { ...sec, revenue: sec.revenue * 1.05 } : sec
    ));
    if (selectedSector?.id === id) {
      setSelectedSector(prev => prev ? { ...prev, revenue: prev.revenue * 1.05 } : null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Search & Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search 30 domain nodes..."
            className="w-full bg-[#F9F7F1] border border-[#E5DFD1] rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-[#1C1917] outline-none"
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-[10px] font-black uppercase text-[#78716C]">Sort By:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-[#F4EFE6] border border-[#E2DAC8] rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-[#1C1917] outline-none cursor-pointer"
          >
            <option value="revenue">Revenue</option>
            <option value="name">Name</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Nodes 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredSectors.map(sec => (
          <div
            key={sec.id}
            onClick={() => setSelectedSector(sec)}
            className="bg-white p-3.5 rounded-2xl border border-[#E5DFD1] shadow-xs cursor-pointer hover:border-[#0284C7] transition-all space-y-2"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-[11px] font-black text-[#1C1917] uppercase truncate max-w-24">{sec.name}</h4>
              <span className="text-[8px] font-black text-[#0284C7] bg-[#E0F2FE] px-1.5 py-0.5 rounded-md">
                {sec.growth ? `${sec.growth}x` : '1.0x'}
              </span>
            </div>

            <p className="text-sm font-black text-[#0284C7] tabular-nums">
              ${Math.round(sec.revenue || 0).toLocaleString()}
            </p>

            <div className="pt-2 border-t border-[#E5DFD1] flex justify-between items-center text-[8px] font-bold text-[#78716C] uppercase">
              <span>Expense</span>
              <span className="text-[#1C1917] tabular-nums">${Math.round(sec.expense || 0).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DOMAIN INSPECTOR SHEET */}
      <MobileActionSheet
        isOpen={!!selectedSector}
        onClose={() => setSelectedSector(null)}
        title={selectedSector?.name || 'Sector Details'}
        subtitle="Industrial Domain Control Node"
      >
        {selectedSector && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-[#E5DFD1] rounded-2xl space-y-2.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#78716C] uppercase">Gross Revenue</span>
                <span className="font-black text-[#0284C7] tabular-nums">${Math.round(selectedSector.revenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#78716C] uppercase">Operational Expense</span>
                <span className="font-black text-rose-600 tabular-nums">${Math.round(selectedSector.expense || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-2 border-t border-[#E5DFD1]">
                <span className="text-[#78716C] uppercase">Net Profit Margin</span>
                <span className="font-black text-emerald-600 tabular-nums">
                  ${Math.round((selectedSector.revenue || 0) - (selectedSector.expense || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => optimizeSector(selectedSector.id)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md"
            >
              <Zap className="w-4 h-4" />
              Optimize Domain Node (+5%)
            </button>
          </div>
        )}
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileSectorsView);

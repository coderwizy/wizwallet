import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { Search, Zap, Layers, BarChart3, X, CheckCircle2 } from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

const MobileSectorsView = () => {
  const { sectors, setSectors, currencySymbol } = useEmpire();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [selectedSector, setSelectedSector] = useState(null);
  const [optimizedId, setOptimizedId] = useState(null);

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
    setOptimizedId(id);
    setTimeout(() => setOptimizedId(null), 1500);
    if (selectedSector?.id === id) {
      setSelectedSector(prev => prev ? { ...prev, revenue: prev.revenue * 1.05 } : null);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* ── Search & Filter Card ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A3A297] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search 30 domain nodes..."
            className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-[#22251F] placeholder-[#A3A297] outline-none focus:border-[#526B56]"
          />
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#77786F]">Sort Nodes:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#22251F] outline-none"
          >
            <option value="revenue">By Revenue</option>
            <option value="expense">By Expense</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </Card>

      {/* ── Sectors List ── */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297]">
            Domain Nodes ({filteredSectors.length})
          </h3>
          <span className="text-[10px] text-[#526B56] font-semibold">+5% yield boost active</span>
        </div>

        {filteredSectors.map(sec => {
          const net = (sec.revenue || 0) - (sec.expense || 0);
          const isOptimized = optimizedId === sec.id;
          return (
            <Card
              key={sec.id}
              className="p-3.5 border border-[#EAE8DF] bg-white transition-all cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedSector(sec)}
            >
              <div className="flex justify-between items-start mb-1.5">
                <h4 className="text-xs font-bold uppercase text-[#22251F] truncate mr-2">
                  {sec.name}
                </h4>
                <Badge variant="accent">
                  {sec.growth ? `${sec.growth}×` : '1.0×'}
                </Badge>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-[#A3A297]">Gross Revenue</p>
                  <p className="text-base font-bold text-[#526B56] tabular-nums">
                    {currencySymbol}{Math.round(sec.revenue || 0).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    optimizeSector(sec.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#526B56] hover:text-white transition-all"
                >
                  <Zap className="w-3 h-3" />
                  <span>+5% Boost</span>
                </button>
              </div>

              {isOptimized && (
                <div className="absolute inset-0 bg-[#EDF2E9]/95 flex items-center justify-center text-xs font-bold text-[#526B56] gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>+5% Optimization Applied</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── BOTTOM SHEET: SECTOR DETAILS ── */}
      <MobileActionSheet
        isOpen={!!selectedSector}
        onClose={() => setSelectedSector(null)}
        title={selectedSector?.name}
        subtitle="Industrial Domain Node Metrics"
      >
        {selectedSector && (
          <div className="space-y-4">
            <div className="p-4 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#77786F]">Gross Revenue:</span>
                <span className="font-bold text-[#526B56] tabular-nums">{currencySymbol}{Math.round(selectedSector.revenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77786F]">Operational Burn:</span>
                <span className="font-bold text-[#C66D65] tabular-nums">{currencySymbol}{Math.round(selectedSector.expense || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#EAE8DF]">
                <span className="text-[#22251F] font-bold">Net Profit Margin:</span>
                <span className="font-bold text-[#526B56] tabular-nums">
                  {currencySymbol}{Math.round((selectedSector.revenue || 0) - (selectedSector.expense || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              icon={Zap}
              className="w-full py-3"
              onClick={() => optimizeSector(selectedSector.id)}
            >
              Optimize Yield (+5%)
            </Button>
          </div>
        )}
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileSectorsView);

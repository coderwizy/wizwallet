import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, TrendingUp, Layers,
  BarChart3, RefreshCw, ChevronRight, Zap, X,
  ArrowUpRight, CheckCircle2, Shield
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const SectorHub = () => {
  const {sectors, setSectors, currencySymbol } = useEmpire();
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
        if (sortBy === 'profit') return ((b.revenue || 0) - (b.expense || 0)) - ((a.revenue || 0) - (a.expense || 0));
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

  const optimizeAll = () => {
    setSectors(prev => prev.map(sec => ({
      ...sec,
      revenue: sec.revenue * 1.05
    })));
  };

  const totalSectorRevenue = useMemo(() => sectors.reduce((s, sec) => s + (sec.revenue || 0), 0), [sectors]);
  const totalSectorExpense = useMemo(() => sectors.reduce((s, sec) => s + (sec.expense || 0), 0), [sectors]);
  const totalSectorNet = totalSectorRevenue - totalSectorExpense;
  const profitableCount = useMemo(() => sectors.filter(s => (s.revenue || 0) > (s.expense || 0)).length, [sectors]);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Industrial Control & Domain Nodes
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Industrial Sectors
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={Zap}
            onClick={optimizeAll}
            title="Increase all sector yields by 5%"
          >
            Optimize All (+5%)
          </Button>
          <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] rounded-xl text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>{sectors.length} Domain Nodes</span>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Gross Domain Revenue</p>
          <h3 className="text-2xl font-bold text-[#526B56] tabular-nums mt-1">
            {currencySymbol}{Math.round(totalSectorRevenue).toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Across 30 industrial domains</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Combined Expense</p>
          <h3 className="text-2xl font-bold text-[#C66D65] tabular-nums mt-1">
            {currencySymbol}{Math.round(totalSectorExpense).toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Operational overhead</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net Operating Yield</p>
          <h3 className={`text-2xl font-bold tabular-nums mt-1 ${totalSectorNet >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
            {currencySymbol}{Math.round(totalSectorNet).toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Net industry earnings</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Profitable Nodes</p>
          <h3 className="text-2xl font-bold text-[#22251F] tabular-nums mt-1">
            {profitableCount} / {sectors.length}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Positive yield ratio</p>
        </Card>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-2xl border border-[#EAE8DF]">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#A3A297] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all 30 industrial domain nodes..."
            className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#22251F] placeholder-[#A3A297] outline-none focus:border-[#526B56]"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#77786F] uppercase tracking-wider hidden sm:inline">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#22251F] outline-none"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="profit">Sort by Net Profit</option>
            <option value="expense">Sort by Expense</option>
            <option value="name">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      {/* ── Sectors Grid & Detail Inspection Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Nodes Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredSectors.map(sec => {
              const net = (sec.revenue || 0) - (sec.expense || 0);
              const isSelected = selectedSector?.id === sec.id;
              const isJustOptimized = optimizedId === sec.id;

              return (
                <Card
                  key={sec.id}
                  onClick={() => setSelectedSector(sec)}
                  className={`p-4 border transition-all cursor-pointer relative overflow-hidden bg-white ${
                    isSelected ? 'border-[#526B56] ring-2 ring-[#526B56]/20' : 'border-[#EAE8DF] hover:border-[#D5D2C8]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-[#22251F] uppercase truncate mr-2">
                      {sec.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#EDF2E9] text-[#526B56] shrink-0 tabular-nums">
                      {sec.growth ? `${sec.growth}×` : '1.0×'}
                    </span>
                  </div>

                  <p className="text-lg font-extrabold text-[#526B56] tabular-nums mb-2">
                    {currencySymbol}{Math.round(sec.revenue || 0).toLocaleString()}
                  </p>

                  <div className="pt-2 border-t border-[#EAE8DF] flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-[#A3A297] uppercase">Net Margin</span>
                    <span className={`font-bold tabular-nums ${net >= 0 ? 'text-[#66866A]' : 'text-[#C66D65]'}`}>
                      {currencySymbol}{Math.round(net).toLocaleString()}
                    </span>
                  </div>

                  {isJustOptimized && (
                    <div className="absolute inset-0 bg-[#EDF2E9]/90 flex items-center justify-center text-xs font-bold text-[#526B56] gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>+5% Boosted</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredSectors.length === 0 && (
            <div className="py-16 text-center text-[#A3A297] bg-white rounded-2xl border border-[#EAE8DF]">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#22251F]">No sectors found</p>
              <p className="text-[11px] text-[#77786F] mt-1">Try clearing the search query</p>
            </div>
          )}
        </div>

        {/* Detail Inspection Panel */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between border border-[#EAE8DF] bg-white">
            {selectedSector ? (
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#526B56] mb-0.5">
                      Selected Domain Node
                    </p>
                    <h3 className="text-lg font-bold text-[#22251F] uppercase tracking-tight">
                      {selectedSector.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedSector(null)}
                    className="p-1 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 p-4 rounded-xl border border-[#EAE8DF] bg-[#FCFBF8]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#77786F] font-medium">Gross Revenue</span>
                    <span className="font-bold text-[#526B56] tabular-nums">
                      {currencySymbol}{Math.round(selectedSector.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#77786F] font-medium">Operational Cost</span>
                    <span className="font-bold text-[#C66D65] tabular-nums">
                      {currencySymbol}{Math.round(selectedSector.expense || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-[#EAE8DF]">
                    <span className="text-[#22251F] font-bold">Net Yield</span>
                    <span className="font-extrabold text-[#526B56] tabular-nums">
                      {currencySymbol}{Math.round((selectedSector.revenue || 0) - (selectedSector.expense || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#EDF2E9] border border-[#D5DFD1] rounded-xl text-xs text-[#526B56] flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Sector compounding active in unified simulation pulse engine.</span>
                </div>

                <Button
                  variant="primary"
                  icon={BarChart3}
                  className="w-full py-2.5"
                  onClick={() => optimizeSector(selectedSector.id)}
                >
                  Optimize (+5% Revenue)
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-60">
                <Layers className="w-10 h-10 mb-3 text-[#D5D2C8]" />
                <p className="text-xs font-bold text-[#22251F]">Select an Industrial Domain</p>
                <p className="text-[11px] text-[#A3A297] mt-1">
                  Click any node to calibrate its revenue, review margins, and trigger 5% yield optimization.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SectorHub);

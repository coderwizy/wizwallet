import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, TrendingUp, Layers, 
  BarChart3, RefreshCw, ChevronRight, Zap
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const SectorHub = () => {
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
  };

  const totalSectorRevenue = useMemo(() => sectors.reduce((s, sec) => s + (sec.revenue || 0), 0), [sectors]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Industrial Control</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Advanced Sectors</h2>
        </div>
        <Badge variant="cyan" className="py-2 px-4">
          <Zap className="w-3.5 h-3.5" />
          <span>30 Active Domain Nodes</span>
        </Badge>
      </div>

      {/* Toolbar */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-80">
            <Input
              icon={Search}
              placeholder="Search Global Sectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-neon-blue text-white cursor-pointer w-full sm:w-auto"
            >
              <option value="revenue">By Revenue</option>
              <option value="name">By Name</option>
              <option value="expense">By Expense</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sectors Grid & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nodes Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredSectors.map(sec => {
              const net = (sec.revenue || 0) - (sec.expense || 0);
              const isSelected = selectedSector?.id === sec.id;
              return (
                <Card
                  key={sec.id}
                  onClick={() => setSelectedSector(sec)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-neon-blue bg-neon-blue/10 shadow-[0_0_20px_rgba(0,243,255,0.15)]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-tight truncate mr-2">{sec.name}</h4>
                    <Badge variant={sec.revenue > 30000 ? 'emerald' : 'cyan'}>
                      {sec.growth ? `${sec.growth}x` : '1.0x'}
                    </Badge>
                  </div>
                  <p className="text-lg font-black text-neon-blue tabular-nums">${Math.round(sec.revenue || 0).toLocaleString()}</p>
                  <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Expense</span>
                    <span className="font-bold text-slate-300 tabular-nums">${Math.round(sec.expense || 0).toLocaleString()}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Detail Inspection Panel */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between">
            {selectedSector ? (
              <div className="space-y-6">
                <div>
                  <Badge variant="cyan" className="mb-2">Selected Domain</Badge>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{selectedSector.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Multi-domain industrial node operational status.</p>
                </div>

                <div className="space-y-3 p-4 bg-black/40 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Gross Revenue</span>
                    <span className="font-black text-neon-blue tabular-nums">${Math.round(selectedSector.revenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Operational Expense</span>
                    <span className="font-black text-rose-400 tabular-nums">${Math.round(selectedSector.expense || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <span className="text-slate-400 font-bold uppercase">Net Profit Margin</span>
                    <span className="font-black text-emerald-400 tabular-nums">${Math.round((selectedSector.revenue || 0) - (selectedSector.expense || 0)).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  icon={BarChart3}
                  onClick={() => optimizeSector(selectedSector.id)}
                  className="w-full py-3.5"
                >
                  Optimize Node (+5%)
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-60">
                <Layers className="w-12 h-12 text-slate-500 mb-3" />
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Select a sector node to inspect details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SectorHub);

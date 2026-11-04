import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Video, ShoppingBag, BookOpen, Cpu,
  Palette, Share2, Globe2, Plus, Briefcase,
  Factory, Truck, Car, Building2, Gamepad2, Store,
  X, Trash2, Edit3, TrendingUp, TrendingDown,
  Search, Filter, CheckCircle2, PauseCircle, PlayCircle,
  PieChart as PieIcon, Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const iconMap = {
  BarChart: BarChart3, Video, ShoppingBag, BookOpen, Cpu, Palette, Share2,
  Globe2, Factory, Truck, Car, Building2, Gamepad2, Store
};

const FINTECH_PALETTE = [
  '#526B56', // Primary Forest Sage
  '#82977B', // Soft Muted Sage
  '#C18A48', // Warm Ochre
  '#4A7C8A', // Slate Blue
  '#7C5ABF', // Imperial Lilac
  '#C66D65', // Terracotta Wine
  '#8B7355', // Rich Khaki
  '#5F8575', // Forest Mint
];

const BusinessHub = () => {
  const {businesses, setBusinesses, addBusiness, removeBusiness, wallet, setWallet, addTransaction, privacyMode, currencySymbol } = useEmpire();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);
  const [detailBiz, setDetailBiz] = useState(null);
  const [deleteConfirmBiz, setDeleteConfirmBiz] = useState(null);
  const [hoveredVenture, setHoveredVenture] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('revenue');

  // Form states
  const [addForm, setAddForm] = useState({ name: '', income: 5000, expense: 2000, desc: '' });
  const [editForm, setEditForm] = useState({ name: '', income: 0, expense: 0, desc: '', notes: '' });

  const totalIncome  = useMemo(() => businesses.reduce((s, b) => s + (b.income  || 0), 0), [businesses]);
  const totalExpense = useMemo(() => businesses.reduce((s, b) => s + (b.expense || 0), 0), [businesses]);
  const netMargin    = totalIncome - totalExpense;
  const activeBusinesses = useMemo(() => businesses.filter(b => b.status === 'Active'), [businesses]);
  const activeCount  = activeBusinesses.length;

  const activeTotalIncome = useMemo(() => {
    return activeBusinesses.reduce((s, b) => s + (b.income || 0), 0);
  }, [activeBusinesses]);

  const pieData = useMemo(() => {
    return activeBusinesses
      .sort((a, b) => (b.income || 0) - (a.income || 0))
      .slice(0, 8)
      .map((b, idx) => {
        const pct = activeTotalIncome > 0 ? (((b.income || 0) / activeTotalIncome) * 100).toFixed(1) : '0';
        return {
          id: b.id,
          name: b.name,
          value: b.income || 0,
          percentage: pct,
          color: FINTECH_PALETTE[idx % FINTECH_PALETTE.length]
        };
      });
  }, [activeBusinesses, activeTotalIncome]);

  const topVenture = pieData[0] || null;

  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
          (b.desc || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue') return (b.income || 0) - (a.income || 0);
        if (sortBy === 'profit') return ((b.income || 0) - (b.expense || 0)) - ((a.income || 0) - (a.expense || 0));
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [businesses, search, filterStatus, sortBy]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addBusiness({
      id: `biz-${Date.now()}`,
      name: addForm.name.trim(),
      income: parseFloat(addForm.income) || 0,
      expense: parseFloat(addForm.expense) || 0,
      desc: addForm.desc || 'New Venture',
      status: 'Active',
      icon: 'Cpu',
      growth: 1.05,
      notes: ''
    });
    setAddForm({ name: '', income: 5000, expense: 2000, desc: '' });
    setIsAddOpen(false);
  };

  const handleEditClick = (biz) => {
    setEditingBiz(biz);
    setEditForm({
      name: biz.name,
      income: biz.income,
      expense: biz.expense,
      desc: biz.desc || '',
      notes: biz.notes || ''
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBiz) return;
    setBusinesses(prev => prev.map(b => b.id === editingBiz.id ? { ...b, ...editForm } : b));
    setEditingBiz(null);
  };

  const confirmDelete = () => {
    if (!deleteConfirmBiz) return;
    removeBusiness(deleteConfirmBiz.id);
    if (editingBiz?.id === deleteConfirmBiz.id) {
      setEditingBiz(null);
    }
    setDeleteConfirmBiz(null);
  };

  const toggleStatus = (id) => {
    setBusinesses(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' } : b
    ));
  };

  const handleUpgradeCapacity = (biz) => {
    const upgradeCost = 25000;
    if ((wallet?.balance || 0) < upgradeCost) {
      alert('Insufficient liquid funds in Smart Wallet ($25,000 required).');
      return;
    }
    setWallet(prev => ({ ...prev, balance: prev.balance - upgradeCost }));
    setBusinesses(prev => prev.map(b => {
      if (b.id !== biz.id) return b;
      const newIncome = Math.round((b.income || 0) * 1.15);
      const newEmployees = (b.employees || 10) + 4;
      const newValuation = Math.round((b.valuation || (b.income * 30)) * 1.2);
      return {
        ...b,
        income: newIncome,
        employees: newEmployees,
        valuation: newValuation
      };
    }));
    addTransaction('Business Hub', 'Debit', upgradeCost, `Capital Expansion: ${biz.name}`);
    if (detailBiz && detailBiz.id === biz.id) {
      setDetailBiz(prev => ({
        ...prev,
        income: Math.round((prev.income || 0) * 1.15),
        employees: (prev.employees || 10) + 4,
        valuation: Math.round((prev.valuation || (prev.income * 30)) * 1.2)
      }));
    }
  };

  const handleSellEnterprise = (biz) => {
    const val = Number(biz.valuation) || Math.round((Number(biz.income || 0) - Number(biz.expense || 0)) * 12 * 5);
    setWallet(prev => ({ ...prev, balance: prev.balance + val }));
    removeBusiness(biz.id);
    addTransaction('Business Hub', 'Credit', val, `Divested Enterprise: ${biz.name}`);
    setDetailBiz(null);
  };

  const netMarginPct = totalIncome > 0 ? Math.round((netMargin / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmBiz}
        onClose={() => setDeleteConfirmBiz(null)}
        onConfirm={confirmDelete}
        title={`Terminate ${deleteConfirmBiz?.name || 'Venture'}?`}
        description="Are you sure you want to permanently divest and terminate this corporate venture? All historical metrics for this entity will be removed."
        confirmText="Terminate Venture"
        variant="danger"
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Corporate Ventures & Yield Holdings
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Business Hub
          </h2>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Add Venture
        </Button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Combined Revenue</p>
          <h3 className="text-2xl font-bold text-[#526B56] tabular-nums mt-1">
            {currencySymbol}{totalIncome.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Monthly enterprise income</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Operating Costs</p>
          <h3 className="text-2xl font-bold text-[#C66D65] tabular-nums mt-1">
            {currencySymbol}{totalExpense.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Monthly operational burn</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net Profit</p>
          <h3 className={`text-2xl font-bold tabular-nums mt-1 ${netMargin >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
            ${netMargin.toLocaleString()}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">{netMarginPct}% net margin</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Active Ventures</p>
          <h3 className="text-2xl font-bold text-[#22251F] tabular-nums mt-1">
            {activeCount} / {businesses.length}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Commercial entities</p>
        </Card>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Venture Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-2xl border border-[#EAE8DF]">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#A3A297] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ventures by name or description..."
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#22251F] placeholder-[#A3A297] outline-none focus:border-[#526B56]"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#22251F] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Paused">Paused Only</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#22251F] outline-none"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="profit">Sort by Profit</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBusinesses.map(biz => {
              const IconComponent = iconMap[biz.icon] || Briefcase;
              const net = (biz.income || 0) - (biz.expense || 0);
              const isActive = biz.status === 'Active';
              const marginPct = biz.income > 0 ? Math.round((net / biz.income) * 100) : 0;
              return (
                <Card
                  key={biz.id}
                  className={`p-5 flex flex-col justify-between transition-all border border-[#EAE8DF] bg-white ${
                    !isActive ? 'opacity-65' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={isActive ? 'success' : 'default'}>
                          {biz.status}
                        </Badge>
                        <button
                          onClick={() => handleEditClick(biz)}
                          className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all cursor-pointer"
                          title="Edit venture details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmBiz(biz)}
                          className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] transition-all cursor-pointer"
                          title="Delete venture"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-[#22251F] tracking-tight">{biz.name}</h4>
                    <p className="text-xs text-[#77786F] line-clamp-2 mt-1 leading-relaxed">{biz.desc}</p>
                    {biz.notes && (
                      <p className="text-[10px] text-[#A3A297] bg-[#FCFBF8] p-2 rounded-lg border border-[#EAE8DF] mt-2 italic">
                        "{biz.notes}"
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#EAE8DF] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Monthly Net Profit</p>
                      <p className={`text-base font-bold tabular-nums ${net >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
                        {net >= 0 ? '+' : '−'}${Math.abs(net).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[#A3A297] font-medium">{marginPct}% margin</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDetailBiz(biz)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-[#D5DFD1] text-[#526B56] bg-[#EDF2E9] hover:bg-[#D5DFD1] transition-all cursor-pointer"
                        title="Manage Enterprise Dashboard"
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(biz.id)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'border-[#EAE8DF] text-[#77786F] hover:bg-[#F1EFE7]'
                            : 'border-[#526B56] text-[#526B56] bg-[#EDF2E9]'
                        }`}
                      >
                        {isActive ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        <span>{isActive ? 'Pause' : 'Resume'}</span>
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {filteredBusinesses.length === 0 && (
              <div className="col-span-2 py-16 text-center text-[#A3A297] bg-white rounded-2xl border border-[#EAE8DF]">
                <Briefcase className="w-10 h-10 mx-auto mb-2.5 opacity-40" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#22251F]">No ventures match criteria</p>
                <p className="text-[11px] text-[#77786F] mt-1">Try resetting search or status filters</p>
              </div>
            )}
          </div>
        </div>

        {/* ── ELEVATED YIELD BREAKDOWN CARD (DESKTOP) ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between border border-[#EAE8DF] bg-white shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <PieIcon className="w-3.5 h-3.5 text-[#526B56]" />
                    <h3 className="text-sm font-bold text-[#22251F]">Yield Breakdown</h3>
                  </div>
                  <p className="text-[11px] text-[#77786F] mt-0.5">Top revenue contributors</p>
                </div>
                <Badge variant="accent">
                  ${activeTotalIncome.toLocaleString()} / mo
                </Badge>
              </div>

              {/* Donut Chart with Center Metric */}
              <div className="relative flex items-center justify-center my-3">
                <div className="h-56 w-full max-w-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={88}
                        innerRadius={60}
                        paddingAngle={3}
                        cornerRadius={3}
                        isAnimationActive={true}
                        onMouseEnter={(_, index) => setHoveredVenture(pieData[index])}
                        onMouseLeave={() => setHoveredVenture(null)}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.id || index}`}
                            fill={entry.color}
                            className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Center Badge */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297] line-clamp-1">
                    {hoveredVenture ? hoveredVenture.name : 'Total Yield'}
                  </span>
                  <span className="text-lg font-extrabold text-[#22251F] tabular-nums leading-tight mt-0.5">
                    ${(hoveredVenture ? hoveredVenture.value : activeTotalIncome).toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#526B56] tabular-nums">
                    {hoveredVenture ? `${hoveredVenture.percentage}% share` : `${activeCount} Active`}
                  </span>
                </div>
              </div>

              {/* Segment Breakdown with proportional bars */}
              <div className="space-y-2 mt-2 pt-3 border-t border-[#EAE8DF] max-h-56 overflow-y-auto scroll-hide">
                {pieData.map((item) => {
                  const isHovered = hoveredVenture?.name === item.name;
                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredVenture(item)}
                      onMouseLeave={() => setHoveredVenture(null)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isHovered ? 'bg-[#EDF2E9]' : 'hover:bg-[#FCFBF8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 truncate mr-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className={`font-semibold truncate ${isHovered ? 'text-[#526B56]' : 'text-[#22251F]'}`}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-semibold text-[#77786F] tabular-nums">
                            {item.percentage}%
                          </span>
                          <span className="font-bold text-[#22251F] tabular-nums">
                            ${item.value.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-[#F1EFE7] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Contributor Summary Callout */}
            {topVenture && (
              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#C18A48] shrink-0" />
                  <p className="text-[11px] text-[#77786F] truncate">
                    Top Contributor: <strong className="text-[#22251F] font-bold">{topVenture.name}</strong> ({topVenture.percentage}%)
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#526B56] shrink-0">
                  ${topVenture.value.toLocaleString()}
                </span>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── ADD VENTURE MODAL ── */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Corporate Venture"
        subtitle="Establish a new enterprise revenue node"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Venture Name"
            required
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g. Autonomous Logistics Fleet"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Monthly Income (USD)"
              type="number"
              value={addForm.income}
              onChange={(e) => setAddForm({ ...addForm, income: e.target.value })}
              min="0"
            />
            <Input
              label="Monthly Expense (USD)"
              type="number"
              value={addForm.expense}
              onChange={(e) => setAddForm({ ...addForm, expense: e.target.value })}
              min="0"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#77786F] block mb-1.5">Description</label>
            <textarea
              value={addForm.desc}
              onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })}
              placeholder="Operational capabilities, customer profile, and revenue model..."
              rows={3}
              className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-3 text-sm text-[#22251F] outline-none resize-none focus:border-[#526B56]"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Establish Venture
          </Button>
        </form>
      </Modal>

      {/* ── EDIT VENTURE MODAL ── */}
      <Modal
        isOpen={!!editingBiz}
        onClose={() => setEditingBiz(null)}
        title="Edit Corporate Venture"
        subtitle="Calibrate venture parameters and operating margins"
      >
        {editingBiz && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Venture Name"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Monthly Income (USD)"
                type="number"
                value={editForm.income}
                onChange={(e) => setEditForm({ ...editForm, income: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Monthly Expense (USD)"
                type="number"
                value={editForm.expense}
                onChange={(e) => setEditForm({ ...editForm, expense: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Executive Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                placeholder="Strategic priorities, expansion plans, contract milestones..."
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-3 text-sm text-[#22251F] outline-none resize-none focus:border-[#526B56]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={() => setDeleteConfirmBiz(editingBiz)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── ENTERPRISE DRILLDOWN & ACQUISITION MODAL ── */}
      {detailBiz && (
        <Modal
          isOpen={true}
          onClose={() => setDetailBiz(null)}
          title={`Enterprise Command: ${detailBiz.name}`}
          subtitle="Corporate structure, valuation metrics, and expansion simulations"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
                <span className="text-[10px] font-bold uppercase text-[#A3A297]">Enterprise Valuation</span>
                <p className="text-base font-extrabold text-[#22251F] tabular-nums mt-0.5">
                  ${(detailBiz.valuation || (Math.max(0, (detailBiz.income || 0) - (detailBiz.expense || 0)) * 60)).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
                <span className="text-[10px] font-bold uppercase text-[#A3A297]">Workforce Headcount</span>
                <p className="text-base font-extrabold text-[#526B56] tabular-nums mt-0.5">
                  {detailBiz.employees || 14} Employees
                </p>
              </div>

              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase text-[#A3A297]">Operational Branches</span>
                <p className="text-base font-extrabold text-[#4A7C8A] tabular-nums mt-0.5">
                  {detailBiz.branches || 2} Commercial Nodes
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#77786F]">Monthly Gross Income:</span>
                <span className="font-bold text-[#526B56] tabular-nums">+${(detailBiz.income || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#77786F]">Operating Burn & Payroll:</span>
                <span className="font-bold text-[#C66D65] tabular-nums">-${(detailBiz.expense || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EAE8DF]">
                <span className="font-bold text-[#22251F]">Monthly Operating Net:</span>
                <span className="font-extrabold text-sm text-[#526B56] tabular-nums">
                  +${((detailBiz.income || 0) - (detailBiz.expense || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Strategic Expansion Controls */}
            <div className="p-3.5 bg-[#EDF2E9] border border-[#D5DFD1] rounded-xl space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[#526B56]">Strategic Expansion & Reinvestment</h4>
                <p className="text-[11px] text-[#77786F] mt-0.5">
                  Inject $25,000 from Smart Wallet to scale workforce and boost monthly yields by 15%.
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                className="w-full py-2 text-xs"
                onClick={() => handleUpgradeCapacity(detailBiz)}
              >
                Execute $25k Capital Expansion (+15% Yield)
              </Button>
            </div>

            {/* Divestment Simulation */}
            <div className="pt-2 flex justify-between items-center border-t border-[#EAE8DF]">
              <span className="text-xs text-[#77786F]">Divest and liquidate enterprise:</span>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleSellEnterprise(detailBiz)}
              >
                Liquidate Venture into Vault
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default React.memo(BusinessHub);

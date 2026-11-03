import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import {
  Briefcase, Plus, Trash2, Edit3,
  PieChart as PieIcon, Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';
import ConfirmationDialog from '../../ui/ConfirmationDialog';

const FINTECH_PALETTE = [
  '#526B56', // Primary Forest Sage
  '#82977B', // Muted Sage
  '#C18A48', // Warm Ochre
  '#4A7C8A', // Slate Blue
  '#7C5ABF', // Imperial Lilac
  '#C66D65', // Terracotta
  '#8B7355', // Rich Khaki
  '#5F8575', // Forest Mint
];

const MobileBusinessView = () => {
  const { businesses, setBusinesses, addBusiness, removeBusiness } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);
  const [deleteConfirmBiz, setDeleteConfirmBiz] = useState(null);
  const [hoveredVenture, setHoveredVenture] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', income: '5000', expense: '2000', desc: '' });
  const [editForm, setEditForm] = useState({ name: '', income: '', expense: '', desc: '' });

  const totalIncome  = useMemo(() => businesses.reduce((s, b) => s + (b.income  || 0), 0), [businesses]);
  const totalExpense = useMemo(() => businesses.reduce((s, b) => s + (b.expense || 0), 0), [businesses]);
  const netMargin    = totalIncome - totalExpense;

  const activeBusinesses = useMemo(() => {
    return businesses.filter(b => b.status === 'Active');
  }, [businesses]);

  const activeTotalIncome = useMemo(() => {
    return activeBusinesses.reduce((s, b) => s + (b.income || 0), 0);
  }, [activeBusinesses]);

  const pieData = useMemo(() => {
    return activeBusinesses
      .sort((a, b) => (b.income || 0) - (a.income || 0))
      .slice(0, 6)
      .map((b, i) => {
        const pct = activeTotalIncome > 0 ? (((b.income || 0) / activeTotalIncome) * 100).toFixed(1) : '0';
        return {
          id: b.id,
          name: b.name,
          value: b.income || 0,
          percentage: pct,
          color: FINTECH_PALETTE[i % FINTECH_PALETTE.length]
        };
      });
  }, [activeBusinesses, activeTotalIncome]);

  const topVenture = pieData[0] || null;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addBusiness({
      id: `biz-${Date.now()}`,
      name: addForm.name.trim(),
      income: parseFloat(addForm.income) || 0,
      expense: parseFloat(addForm.expense) || 0,
      desc: addForm.desc || 'Corporate Node',
      status: 'Active',
      icon: 'Briefcase',
    });
    setAddForm({ name: '', income: '5000', expense: '2000', desc: '' });
    setShowAddSheet(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBiz) return;
    setBusinesses(prev => prev.map(b => b.id === editingBiz.id ? {
      ...b,
      name: editForm.name.trim() || b.name,
      income: parseFloat(editForm.income) || 0,
      expense: parseFloat(editForm.expense) || 0,
      desc: editForm.desc
    } : b));
    setEditingBiz(null);
  };

  const confirmDelete = () => {
    if (!deleteConfirmBiz) return;
    removeBusiness(deleteConfirmBiz.id);
    if (editingBiz?.id === deleteConfirmBiz.id) setEditingBiz(null);
    setDeleteConfirmBiz(null);
  };

  const toggleStatus = (id) => {
    setBusinesses(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' } : b
    ));
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmBiz}
        onClose={() => setDeleteConfirmBiz(null)}
        onConfirm={confirmDelete}
        title={`Terminate ${deleteConfirmBiz?.name || 'Venture'}?`}
        description="Permanently remove this corporate venture from your portfolio."
        confirmText="Terminate"
        variant="danger"
      />

      {/* ── Overview Card ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Monthly Corporate Net</p>
            <h2 className="text-3xl font-extrabold text-[#22251F] tracking-tight tabular-nums mt-0.5">
              ${netMargin.toLocaleString()}
            </h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddSheet(true)}
          >
            Add Venture
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#EAE8DF]">
          <div className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
            <p className="text-[10px] font-semibold text-[#66866A] uppercase">Gross Yield</p>
            <p className="text-sm font-bold text-[#22251F] tabular-nums mt-0.5">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
            <p className="text-[10px] font-semibold text-[#C66D65] uppercase">Operating Burn</p>
            <p className="text-sm font-bold text-[#22251F] tabular-nums mt-0.5">${totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* ── ELEVATED YIELD BREAKDOWN CARD ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-4 shadow-sm">
        {/* Card Header with Badges */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-[#526B56]" />
              <h3 className="text-sm font-bold text-[#22251F]">Yield Breakdown</h3>
            </div>
            <p className="text-[11px] text-[#77786F] mt-0.5">Revenue distribution across active ventures</p>
          </div>
          <Badge variant="accent">
            ${activeTotalIncome.toLocaleString()} / mo
          </Badge>
        </div>

        {/* Donut Chart with Center Display */}
        <div className="relative flex items-center justify-center my-2">
          <div className="h-52 w-full max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={78}
                  innerRadius={54}
                  paddingAngle={3}
                  cornerRadius={3}
                  isAnimationActive={true}
                  onMouseEnter={(_, index) => setHoveredVenture(pieData[index])}
                  onMouseLeave={() => setHoveredVenture(null)}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={`cell-${entry.id || i}`}
                      fill={entry.color}
                      className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Donut Metric Badge */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#A3A297] line-clamp-1">
              {hoveredVenture ? hoveredVenture.name : 'Total Yield'}
            </span>
            <span className="text-base font-extrabold text-[#22251F] tabular-nums leading-tight mt-0.5">
              ${(hoveredVenture ? hoveredVenture.value : activeTotalIncome).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-[#526B56] tabular-nums">
              {hoveredVenture ? `${hoveredVenture.percentage}% share` : `${activeBusinesses.length} Active`}
            </span>
          </div>
        </div>

        {/* Segment Breakdown List & Proportional Bars */}
        <div className="space-y-2.5 pt-2 border-t border-[#EAE8DF]">
          {pieData.map((item) => {
            const isHovered = hoveredVenture?.name === item.name;
            return (
              <div
                key={item.id || item.name}
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

                {/* Progress Proportion Bar */}
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

        {/* Top Contributor Summary Callout */}
        {topVenture && (
          <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C18A48] shrink-0" />
              <p className="text-[11px] text-[#77786F] truncate">
                Top Generator: <strong className="text-[#22251F] font-bold">{topVenture.name}</strong> ({topVenture.percentage}%)
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#526B56] shrink-0">
              ${topVenture.value.toLocaleString()}
            </span>
          </div>
        )}
      </Card>

      {/* ── Venture Cards List ── */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297] px-1">
          Active Corporate Ventures ({businesses.length})
        </h3>
        {businesses.map(biz => {
          const net = (biz.income || 0) - (biz.expense || 0);
          const isActive = biz.status === 'Active';
          return (
            <Card
              key={biz.id}
              className={`p-4 border border-[#EAE8DF] bg-white space-y-3 ${!isActive ? 'opacity-65' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#22251F] truncate">{biz.name}</h4>
                    <p className="text-[10px] text-[#77786F] truncate">{biz.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBiz(biz);
                      setEditForm({ name: biz.name, income: String(biz.income || 0), expense: String(biz.expense || 0), desc: biz.desc || '' });
                    }}
                    className="p-1 rounded-md text-[#A3A297] hover:text-[#22251F] hover:bg-[#F8F7F2] cursor-pointer"
                    aria-label="Edit venture"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmBiz(biz)}
                    className="p-1 rounded-md text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] cursor-pointer"
                    aria-label="Delete venture"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#EAE8DF] flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-[#A3A297] block">Net Income</span>
                  <span className={`font-bold tabular-nums ${net >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
                    ${net.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isActive ? 'success' : 'default'}>{biz.status}</Badge>
                  <button
                    type="button"
                    onClick={() => toggleStatus(biz.id)}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[#EAE8DF] bg-[#FCFBF8] text-[#77786F] hover:bg-[#F1EFE7] cursor-pointer"
                  >
                    {isActive ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── BOTTOM SHEET: ADD VENTURE ── */}
      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Add Corporate Venture"
        subtitle="Establish a new commercial node"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Venture Name"
            required
            value={addForm.name}
            onChange={e => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g. NextGen Logistics"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Income ($)"
              type="number"
              value={addForm.income}
              onChange={e => setAddForm({ ...addForm, income: e.target.value })}
            />
            <Input
              label="Expense ($)"
              type="number"
              value={addForm.expense}
              onChange={e => setAddForm({ ...addForm, expense: e.target.value })}
            />
          </div>
          <Input
            label="Description"
            value={addForm.desc}
            onChange={e => setAddForm({ ...addForm, desc: e.target.value })}
            placeholder="Operational capabilities..."
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Establish Venture
          </Button>
        </form>
      </MobileActionSheet>

      {/* ── BOTTOM SHEET: EDIT VENTURE ── */}
      <MobileActionSheet
        isOpen={!!editingBiz}
        onClose={() => setEditingBiz(null)}
        title="Edit Corporate Venture"
        subtitle="Calibrate operational parameters"
      >
        {editingBiz && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Venture Name"
              required
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Income ($)"
                type="number"
                value={editForm.income}
                onChange={e => setEditForm({ ...editForm, income: e.target.value })}
              />
              <Input
                label="Expense ($)"
                type="number"
                value={editForm.expense}
                onChange={e => setEditForm({ ...editForm, expense: e.target.value })}
              />
            </div>
            <Input
              label="Description"
              value={editForm.desc}
              onChange={e => setEditForm({ ...editForm, desc: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full py-3 mt-2">
              Save Changes
            </Button>
          </form>
        )}
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileBusinessView);

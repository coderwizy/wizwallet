import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { 
  Briefcase, Plus, TrendingUp, DollarSign, 
  Trash2, Edit3, Cpu, BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import MobileActionSheet from '../MobileActionSheet';

const COLORS = ['#0284C7', '#7C3AED', '#059669', '#E11D48', '#D97706', '#06B6D4'];

const MobileBusinessView = () => {
  const { businesses, setBusinesses, addBusiness, removeBusiness } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', income: 5000, expense: 2000, desc: '' });
  const [editForm, setEditForm] = useState({ name: '', income: 0, expense: 0, desc: '' });

  const totalIncome  = useMemo(() => businesses.reduce((s, b) => s + (b.income  || 0), 0), [businesses]);
  const totalExpense = useMemo(() => businesses.reduce((s, b) => s + (b.expense || 0), 0), [businesses]);
  const netMargin    = totalIncome - totalExpense;

  const pieData = useMemo(() => {
    return businesses
      .filter(b => b.status === 'Active')
      .slice(0, 6)
      .map(b => ({ name: b.name, value: b.income }));
  }, [businesses]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addBusiness({
      id: `biz-${Date.now()}`,
      name: addForm.name,
      income: parseFloat(addForm.income) || 0,
      expense: parseFloat(addForm.expense) || 0,
      desc: addForm.desc || 'Corporate Node',
      status: 'Active',
      icon: 'Cpu',
    });
    setAddForm({ name: '', income: 5000, expense: 2000, desc: '' });
    setShowAddSheet(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBiz) return;
    setBusinesses(prev => prev.map(b => b.id === editingBiz.id ? { ...b, ...editForm } : b));
    setEditingBiz(null);
  };

  const toggleStatus = (id) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' } : b));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-[0_8px_30px_rgba(28,25,23,0.06)] text-[#1C1917] space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Monthly Corporate Net</p>
            <h2 className="text-3xl font-black text-[#1C1917] tracking-tight tabular-nums mt-0.5">
              ${netMargin.toLocaleString()}
            </h2>
          </div>
          <button
            onClick={() => setShowAddSheet(true)}
            className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Venture
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5DFD1]">
          <div className="p-3 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0]">
            <p className="text-[9px] font-black text-emerald-800 uppercase">Gross Yield</p>
            <p className="text-base font-black text-emerald-600 tabular-nums mt-0.5">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-[#FFF1F2] rounded-2xl border border-[#FECDD3]">
            <p className="text-[9px] font-black text-rose-800 uppercase">Overhead Expense</p>
            <p className="text-base font-black text-rose-600 tabular-nums mt-0.5">${totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Yield Breakdown Pie Chart */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Yield Distribution</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={40} paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Income']} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DFD1', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Venture Cards List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#1C1917] uppercase tracking-wider px-1">Active Corporate Nodes ({businesses.length})</h3>
        {businesses.map(biz => {
          const net = (biz.income || 0) - (biz.expense || 0);
          const isActive = biz.status === 'Active';
          return (
            <div key={biz.id} className={`bg-white p-4 rounded-2xl border border-[#E5DFD1] shadow-xs space-y-3 ${!isActive ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#1C1917] tracking-tight">{biz.name}</h4>
                    <p className="text-[10px] text-[#78716C] font-medium line-clamp-1">{biz.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(biz.id)}
                  className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border cursor-pointer ${
                    isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {biz.status}
                </button>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#E5DFD1]">
                <div>
                  <p className="text-[9px] font-black text-[#78716C] uppercase">Monthly Net</p>
                  <p className={`text-sm font-black tabular-nums ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {net >= 0 ? '+' : ''}${net.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingBiz(biz); setEditForm({ name: biz.name, income: biz.income, expense: biz.expense, desc: biz.desc || '' }); }}
                    className="p-2 rounded-xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBusiness(biz.id)}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD VENTURE SHEET */}
      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Initiate Venture"
        subtitle="Establish New Business Node"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Venture Name</label>
            <input
              required
              value={addForm.name}
              onChange={e => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="Designation..."
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Yield ($)</label>
              <input
                type="number"
                value={addForm.income}
                onChange={e => setAddForm({ ...addForm, income: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Expense ($)</label>
              <input
                type="number"
                value={addForm.expense}
                onChange={e => setAddForm({ ...addForm, expense: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Establish Node
          </button>
        </form>
      </MobileActionSheet>

      {/* EDIT VENTURE SHEET */}
      <MobileActionSheet
        isOpen={!!editingBiz}
        onClose={() => setEditingBiz(null)}
        title="Edit Venture"
        subtitle="Calibrate Venture Metrics"
      >
        {editingBiz && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Venture Name</label>
              <input
                required
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Yield ($)</label>
                <input
                  type="number"
                  value={editForm.income}
                  onChange={e => setEditForm({ ...editForm, income: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Expense ($)</label>
                <input
                  type="number"
                  value={editForm.expense}
                  onChange={e => setEditForm({ ...editForm, expense: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
            >
              Save Changes
            </button>
          </form>
        )}
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileBusinessView);

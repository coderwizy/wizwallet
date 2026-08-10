import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Video, ShoppingBag, BookOpen, Cpu, 
  Palette, Share2, Globe2, Plus, Briefcase,
  Factory, Truck, Car, Building2, Gamepad2, Store,
  X, Trash2, Edit3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const iconMap = {
  BarChart: BarChart3, Video, ShoppingBag, BookOpen, Cpu, Palette, Share2,
  Globe2, Factory, Truck, Car, Building2, Gamepad2, Store
};

const COLORS = ['#00f3ff', '#a855f7', '#10b981', '#f43f5e', '#3b82f6', '#eab308', '#ec4899', '#06b6d4'];

const BusinessHub = () => {
  const { businesses, setBusinesses, addBusiness, removeBusiness } = useEmpire();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState(null);

  // Form states
  const [addForm, setAddForm] = useState({ name: '', income: 5000, expense: 2000, desc: '' });
  const [editForm, setEditForm] = useState({ name: '', income: 0, expense: 0, desc: '', notes: '' });

  const totalIncome  = useMemo(() => businesses.reduce((s, b) => s + (b.income  || 0), 0), [businesses]);
  const totalExpense = useMemo(() => businesses.reduce((s, b) => s + (b.expense || 0), 0), [businesses]);
  const netMargin    = totalIncome - totalExpense;

  const pieData = useMemo(() => {
    return businesses
      .filter(b => b.status === 'Active')
      .slice(0, 8)
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
    setEditForm({ name: biz.name, income: biz.income, expense: biz.expense, desc: biz.desc || '', notes: biz.notes || '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBiz) return;
    setBusinesses(prev => prev.map(b => b.id === editingBiz.id ? { ...b, ...editForm } : b));
    setEditingBiz(null);
  };

  const handleDelete = (id) => {
    removeBusiness(id);
    setEditingBiz(null);
  };

  const toggleStatus = (id) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' } : b));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Corporate Ventures</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Business Hub</h2>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
          Initiate Venture
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Monthly Yield</p>
          <p className="text-2xl md:text-3xl font-black text-emerald-400 tabular-nums mt-1">${totalIncome.toLocaleString()}</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Overhead Expense</p>
          <p className="text-2xl md:text-3xl font-black text-rose-400 tabular-nums mt-1">${totalExpense.toLocaleString()}</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Net Profit Margin</p>
          <p className="text-2xl md:text-3xl font-black text-neon-blue tabular-nums mt-1">${netMargin.toLocaleString()}</p>
        </Card>
      </div>

      {/* Grid of Ventures & Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Venture Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Active Ventures ({businesses.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {businesses.map(biz => {
              const IconComponent = iconMap[biz.icon] || Briefcase;
              const net = (biz.income || 0) - (biz.expense || 0);
              const isActive = biz.status === 'Active';
              return (
                <Card key={biz.id} className={`p-5 flex flex-col justify-between ${!isActive ? 'opacity-60' : ''}`}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-neon-blue">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isActive ? 'emerald' : 'rose'}>{biz.status}</Badge>
                        <button
                          onClick={() => handleEditClick(biz)}
                          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-base font-black text-white uppercase tracking-tight">{biz.name}</h4>
                    <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-1">{biz.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Net</p>
                      <p className={`text-base font-black tabular-nums ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {net >= 0 ? '+' : ''}${net.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isActive ? 'ghost' : 'outline'}
                      onClick={() => toggleStatus(biz.id)}
                    >
                      {isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Revenue Pie Chart */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Yield Breakdown</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Top Revenue Generators</p>
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={4}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`$${val.toLocaleString()}`, 'Income']}
                      contentStyle={{ backgroundColor: '#041a1e', borderColor: 'rgba(0,243,255,0.3)', borderRadius: '0.75rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-white/10 max-h-40 overflow-y-auto scroll-hide">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate mr-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="font-bold text-slate-300 truncate">{entry.name}</span>
                  </div>
                  <span className="font-black text-white tabular-nums">${entry.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ADD VENTURE MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Initiate Venture"
        subtitle="Establish New Business Node"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Venture Designation"
            required
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="Designation Alpha..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Yield (Monthly)"
              type="number"
              value={addForm.income}
              onChange={(e) => setAddForm({ ...addForm, income: e.target.value })}
            />
            <Input
              label="Overhead Cap (Monthly)"
              type="number"
              value={addForm.expense}
              onChange={(e) => setAddForm({ ...addForm, expense: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Description</label>
            <textarea
              value={addForm.desc}
              onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })}
              placeholder="Venture operational details..."
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-600 outline-none focus:border-neon-blue resize-none font-medium"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm mt-2">
            Establish Node
          </Button>
        </form>
      </Modal>

      {/* EDIT VENTURE MODAL */}
      <Modal
        isOpen={!!editingBiz}
        onClose={() => setEditingBiz(null)}
        title="Edit Venture"
        subtitle="Calibrate Operational Metrics"
      >
        {editingBiz && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Venture Name"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Monthly Income"
                type="number"
                value={editForm.income}
                onChange={(e) => setEditForm({ ...editForm, income: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Monthly Expense"
                type="number"
                value={editForm.expense}
                onChange={(e) => setEditForm({ ...editForm, expense: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-600 outline-none focus:border-neon-blue resize-none font-medium"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="danger" icon={Trash2} onClick={() => handleDelete(editingBiz.id)} className="flex-1">
                Delete
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(BusinessHub);

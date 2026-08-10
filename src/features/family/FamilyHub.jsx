import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, Heart, Target, LifeBuoy, 
  Wallet, ShieldCheck, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const Option = ({ children, value }) => <option value={value} className="bg-slate-900">{children}</option>;
const COLORS = ['#00f3ff', '#a855f7', '#10b981', '#f43f5e', '#3b82f6'];

const FamilyHub = () => {
  const { wallet, bank, members, addFamilyMember, updateFamilyMember } = useEmpire();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', role: 'Strategist', goal: '', wealth: 5 });
  const [editForm, setEditForm] = useState({ name: '', role: '', goal: '', wealth: 0 });

  const totalWealth = (wallet?.balance || 0) + (bank?.balance || 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addFamilyMember({
      id: Date.now(),
      name: addForm.name,
      role: addForm.role,
      goal: addForm.goal || 'Legacy Trust',
      wealth: parseInt(addForm.wealth) || 5,
      status: 'Active'
    });
    setAddForm({ name: '', role: 'Strategist', goal: '', wealth: 5 });
    setIsAddOpen(false);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({ name: member.name, role: member.role, goal: member.goal, wealth: member.wealth });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    updateFamilyMember(editingMember.id, editForm);
    setEditingMember(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Trust Governance</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Family Empire</h2>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setIsAddOpen(true)}>
          Add Council Member
        </Button>
      </div>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card variant="accent" className="p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300/80">Sovereign Family Trust</p>
                    <p className="text-xs text-slate-300 font-bold uppercase">Council Estate Governance</p>
                  </div>
                </div>
                <Badge variant="violet">Trust Active</Badge>
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 mb-1">Total Protected Trust Capital</p>
              <h1 className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
                ${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h1>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Council Members</p>
                <p className="text-lg font-black text-purple-300 tabular-nums mt-0.5">{members.length}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Allocated Capital</p>
                <p className="text-lg font-black text-emerald-400 tabular-nums mt-0.5">
                  {members.reduce((s, m) => s + (m.wealth || 0), 0)}%
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Legacy Status</p>
                <p className="text-lg font-black text-cyan-300 uppercase mt-0.5">Sovereign</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Wealth Allocation Pie */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Wealth Distribution</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Council Share Percentage</p>
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie data={members} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="wealth">
                      {members.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val}%`, 'Wealth Share']}
                      contentStyle={{ backgroundColor: '#041a1e', borderColor: 'rgba(168,85,247,0.3)', borderRadius: '0.75rem' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Council Members List & Financial Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Members Cards */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Family Council Members</h3>
          {members.map(member => (
            <Card key={member.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-tight text-base">{member.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.role} • Wealth Share: {member.wealth}%</p>
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Goal: {member.goal}</span>
                  <span>{member.wealth}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-700" style={{ width: `${member.wealth}%` }} />
                </div>
              </div>

              <Button variant="ghost" size="sm" icon={ChevronRight} onClick={() => openEdit(member)} />
            </Card>
          ))}
        </div>

        {/* Strategic Financial Tools */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {[
            { label: 'Allowances', icon: Wallet, value: 'AUTOMATED', sub: '$5,000 Total Monthly' },
            { label: 'Emergency Fund', icon: LifeBuoy, value: '$250,000', sub: 'Target: $500,000' },
            { label: 'Legacy Goals', icon: Target, value: '12 ACTIVE', sub: 'Projected Completion: 2028' },
            { label: 'Tax Strategy', icon: ShieldCheck, value: 'OPTIMIZED', sub: 'Zero-Liability Mode' }
          ].map((item, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-300 mb-3 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-lg font-black text-white italic">{item.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{item.sub}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Council Member"
        subtitle="Enshrine Family Member into Trust"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Member Name"
            required
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="Full Name..."
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Role</label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-neon-blue font-bold"
              >
                <Option value="Strategist">Strategist</Option>
                <Option value="Analyst">Analyst</Option>
                <Option value="Guardian">Guardian</Option>
                <Option value="Apprentice">Apprentice</Option>
              </select>
            </div>
            <Input
              label="Wealth Share (%)"
              type="number"
              value={addForm.wealth}
              onChange={(e) => setAddForm({ ...addForm, wealth: e.target.value })}
            />
          </div>
          <Input
            label="Legacy Goal"
            value={addForm.goal}
            onChange={(e) => setAddForm({ ...addForm, goal: e.target.value })}
            placeholder="e.g. Education Fund..."
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm mt-2">
            Enshrine Member
          </Button>
        </form>
      </Modal>

      {/* EDIT MEMBER MODAL */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Council Member"
        subtitle="Calibrate Member Goal & Share"
      >
        {editingMember && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Member Name"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              />
              <Input
                label="Wealth Share (%)"
                type="number"
                value={editForm.wealth}
                onChange={(e) => setEditForm({ ...editForm, wealth: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Input
              label="Legacy Goal"
              value={editForm.goal}
              onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full py-3.5 text-sm mt-2">
              Save Changes
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(FamilyHub);

import React, { useState } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, Heart, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import MobileActionSheet from '../MobileActionSheet';

const COLORS = ['#0284C7', '#7C3AED', '#059669', '#E11D48', '#D97706'];

const MobileFamilyView = () => {
  const { wallet, bank, members, addFamilyMember, updateFamilyMember } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', role: 'Strategist', goal: '', wealth: 5 });
  const [editForm, setEditForm] = useState({ name: '', role: '', goal: '', wealth: 0 });

  const totalTrustWealth = (wallet?.balance || 0) + (bank?.balance || 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addFamilyMember({
      id: Date.now(),
      name: addForm.name,
      role: addForm.role,
      goal: addForm.goal || 'Legacy Goal',
      wealth: parseInt(addForm.wealth) || 5,
      status: 'Active'
    });
    setAddForm({ name: '', role: 'Strategist', goal: '', wealth: 5 });
    setShowAddSheet(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    updateFamilyMember(editingMember.id, editForm);
    setEditingMember(null);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Hero Sovereign Trust Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-[0_8px_30px_rgba(28,25,23,0.06)] text-[#1C1917] space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Family Trust</p>
              <p className="text-[10px] text-purple-600 font-bold uppercase">Council Governance</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddSheet(true)}
            className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md shadow-sky-600/20"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase text-[#78716C]">Protected Trust Capital</p>
          <h2 className="text-3xl font-black text-[#1C1917] tracking-tight tabular-nums mt-0.5">
            ${totalTrustWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5DFD1] text-center">
          <div className="p-2.5 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5]">
            <p className="text-[8px] font-black text-[#78716C] uppercase">Members</p>
            <p className="text-sm font-black text-purple-600 tabular-nums mt-0.5">{members.length}</p>
          </div>
          <div className="p-2.5 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5]">
            <p className="text-[8px] font-black text-[#78716C] uppercase">Allocated Share</p>
            <p className="text-sm font-black text-emerald-600 tabular-nums mt-0.5">
              {members.reduce((s, m) => s + (m.wealth || 0), 0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Wealth Share Pie Chart */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Share Allocation</h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={members} dataKey="wealth" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4}>
                {members.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, 'Wealth Share']} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DFD1', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Council Members List */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#1C1917] uppercase tracking-wider px-1">Council Members</h3>
        {members.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-2xl border border-[#E5DFD1] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-[#1C1917]">{member.name}</h4>
                  <p className="text-[9px] text-[#78716C] font-bold uppercase">{member.role} • {member.wealth}% Share</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingMember(member); setEditForm({ name: member.name, role: member.role, goal: member.goal, wealth: member.wealth }); }}
                className="p-2 rounded-xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#57534E]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-black uppercase text-[#78716C]">
                <span>Goal: {member.goal}</span>
                <span>{member.wealth}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F4EFE6] rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${member.wealth}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MEMBER SHEET */}
      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Add Council Member"
        subtitle="Enshrine Member into Sovereign Trust"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Member Name</label>
            <input
              required
              value={addForm.name}
              onChange={e => setAddForm({ ...addForm, name: e.target.value })}
              placeholder="Full Name..."
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Role</label>
              <input
                value={addForm.role}
                onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Share (%)</label>
              <input
                type="number"
                value={addForm.wealth}
                onChange={e => setAddForm({ ...addForm, wealth: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Legacy Goal</label>
            <input
              value={addForm.goal}
              onChange={e => setAddForm({ ...addForm, goal: e.target.value })}
              placeholder="e.g. Trust Allocation"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Enshrine Member
          </button>
        </form>
      </MobileActionSheet>

      {/* EDIT MEMBER SHEET */}
      <MobileActionSheet
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Council Member"
        subtitle="Calibrate Member Goal & Share"
      >
        {editingMember && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Member Name</label>
              <input
                required
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Role</label>
                <input
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Share (%)</label>
                <input
                  type="number"
                  value={editForm.wealth}
                  onChange={e => setEditForm({ ...editForm, wealth: parseInt(e.target.value) || 0 })}
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

export default React.memo(MobileFamilyView);

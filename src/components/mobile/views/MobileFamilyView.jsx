import React, { useState } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, Heart, ChevronRight, Edit3, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';

const COLORS = ['#526B56', '#82977B', '#C18A48', '#7C5ABF', '#4A90A4'];

const MobileFamilyView = () => {
  const { wallet, bank, members, addFamilyMember, updateFamilyMember, currencySymbol } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', role: 'Strategist', goal: '', wealth: 5 });
  const [editForm, setEditForm] = useState({ name: '', role: '', goal: '', wealth: 0 });

  const totalTrustWealth = (wallet?.balance || 0) + (bank?.balance || 0);
  const totalAllocated = members.reduce((s, m) => s + (m.wealth || 0), 0);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addFamilyMember({
      id: Date.now(),
      name: addForm.name.trim(),
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
    <div className="space-y-4 pb-8">
      {/* ── Hero Sovereign Trust Card ── */}
      <Card className="p-5 border border-ww-border bg-white space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ww-violet-bg border border-ww-violet/30 text-ww-violet flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Family Office</p>
              <p className="text-xs font-bold text-ww-text">Council Governance</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowAddSheet(true)}
          >
            Add Member
          </Button>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Protected Trust Capital</p>
          <h2 className="text-3xl font-extrabold text-ww-text tracking-tight tabular-nums mt-0.5">
            {currencySymbol}{totalTrustWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-ww-border text-center">
          <div className="p-2.5 bg-ww-elevated rounded-xl border border-ww-border">
            <p className="text-[9px] font-semibold text-ww-text-muted uppercase">Members</p>
            <p className="text-sm font-bold text-ww-violet tabular-nums mt-0.5">{members.length}</p>
          </div>
          <div className="p-2.5 bg-ww-elevated rounded-xl border border-ww-border">
            <p className="text-[9px] font-semibold text-ww-text-muted uppercase">Allocated Share</p>
            <p className="text-sm font-bold text-ww-accent tabular-nums mt-0.5">
              {totalAllocated}%
            </p>
          </div>
        </div>
      </Card>

      {/* ── Wealth Share Donut Chart ── */}
      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-ww-text">Share Allocation</h3>
          <Badge variant="violet">{totalAllocated}% Allocated</Badge>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="h-48 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={members}
                  dataKey="wealth"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  cornerRadius={3}
                  onMouseEnter={(_, idx) => setHoveredMember(members[idx])}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  {members.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-ww-text-muted truncate max-w-[120px]">
              {hoveredMember ? hoveredMember.name : 'Trust Share'}
            </span>
            <span className="text-base font-extrabold text-ww-text tabular-nums mt-0.5">
              {hoveredMember ? `${hoveredMember.wealth}%` : `${totalAllocated}%`}
            </span>
            <span className="text-[10px] font-bold text-ww-violet">
              {hoveredMember ? 'Allocated' : `${members.length} Members`}
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-ww-border">
          {members.map((member, i) => {
            const isHovered = hoveredMember?.id === member.id;
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={member.id}
                onMouseEnter={() => setHoveredMember(member)}
                onMouseLeave={() => setHoveredMember(null)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isHovered ? 'bg-ww-violet-bg' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className={`font-semibold text-xs truncate ${isHovered ? 'text-ww-violet' : 'text-ww-text'}`}>
                      {member.name}
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-xs text-ww-text">{member.wealth}%</span>
                </div>
                <div className="w-full h-1 bg-ww-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${member.wealth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Members List ── */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ww-text-muted px-1">
          Council Members ({members.length})
        </h3>
        {members.map(member => (
          <Card
            key={member.id}
            className="p-4 border border-ww-border bg-white space-y-2.5 cursor-pointer hover:border-ww-border-strong transition-all"
            onClick={() => {
              setEditingMember(member);
              setEditForm({ name: member.name, role: member.role, goal: member.goal, wealth: member.wealth });
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-ww-violet-bg border border-ww-violet/30 text-ww-violet flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ww-text">{member.name}</h4>
                  <p className="text-[10px] text-ww-text-secondary">{member.role} · Goal: {member.goal}</p>
                </div>
              </div>
              <Badge variant="violet">{member.wealth}%</Badge>
            </div>

            <div className="w-full h-1.5 bg-ww-bg-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-ww-violet rounded-full transition-all duration-500"
                style={{ width: `${Math.min(member.wealth, 100)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* ── BOTTOM SHEET: ADD MEMBER ── */}
      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Add Council Member"
        subtitle="Enshrine into Sovereign Trust"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={addForm.name}
            onChange={e => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g. Jordan (Associate)"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-ww-text-secondary block mb-1">Role</label>
              <select
                value={addForm.role}
                onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full bg-ww-elevated border border-ww-border rounded-xl p-2.5 text-xs font-semibold text-ww-text outline-none"
              >
                <option value="Strategist">Strategist</option>
                <option value="Analyst">Analyst</option>
                <option value="Guardian">Guardian</option>
                <option value="Apprentice">Apprentice</option>
              </select>
            </div>
            <Input
              label="Share (%)"
              type="number"
              value={addForm.wealth}
              onChange={e => setAddForm({ ...addForm, wealth: e.target.value })}
              min="0"
              max="100"
            />
          </div>
          <Input
            label="Legacy Goal"
            value={addForm.goal}
            onChange={e => setAddForm({ ...addForm, goal: e.target.value })}
            placeholder="e.g. Tech Venture Fund"
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Enshrine Member
          </Button>
        </form>
      </MobileActionSheet>

      {/* ── BOTTOM SHEET: EDIT MEMBER ── */}
      <MobileActionSheet
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Council Member"
        subtitle="Update Trust Allocation"
      >
        {editingMember && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Role"
                value={editForm.role}
                onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              />
              <Input
                label="Share (%)"
                type="number"
                value={editForm.wealth}
                onChange={e => setEditForm({ ...editForm, wealth: parseInt(e.target.value) || 0 })}
                min="0"
                max="100"
              />
            </div>
            <Input
              label="Legacy Goal"
              value={editForm.goal}
              onChange={e => setEditForm({ ...editForm, goal: e.target.value })}
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

export default React.memo(MobileFamilyView);

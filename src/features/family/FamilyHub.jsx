import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Users, UserPlus, Heart, Target, LifeBuoy,
  Wallet, ShieldCheck, Edit3,
  PieChart as PieIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const COLORS = ['#526B56', '#82977B', '#C18A48', '#7C5ABF', '#4A90A4', '#C66D65'];

const FamilyHub = () => {
  const { wallet, bank, members, addFamilyMember, updateFamilyMember } = useEmpire();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const [addForm, setAddForm] = useState({ name: '', role: 'Strategist', goal: '', wealth: '5' });
  const [editForm, setEditForm] = useState({ name: '', role: '', goal: '', wealth: '' });

  const totalWealth = (wallet?.balance || 0) + (bank?.balance || 0);
  const totalAllocated = useMemo(() => members.reduce((s, m) => s + (m.wealth || 0), 0), [members]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    addFamilyMember({
      id: Date.now(),
      name: addForm.name.trim(),
      role: addForm.role,
      goal: addForm.goal || 'Legacy Trust',
      wealth: parseInt(addForm.wealth, 10) || 0,
      status: 'Active'
    });
    setAddForm({ name: '', role: 'Strategist', goal: '', wealth: '5' });
    setIsAddOpen(false);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      role: member.role,
      goal: member.goal,
      wealth: String(member.wealth || 0)
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingMember) return;
    updateFamilyMember(editingMember.id, {
      name: editForm.name.trim() || editingMember.name,
      role: editForm.role,
      goal: editForm.goal,
      wealth: parseInt(editForm.wealth, 10) || 0
    });
    setEditingMember(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Private Family Office & Estate Governance
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Family Empire
          </h2>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={() => setIsAddOpen(true)}>
          Add Council Member
        </Button>
      </div>

      {/* ── Hero Overview & Wealth Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Total Trust Capital Card */}
        <div className="lg:col-span-8">
          <Card className="p-7 md:p-8 flex flex-col justify-between h-full border border-[#EAE8DF] bg-white">
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#F3EEF8] border border-[#DECDEE] flex items-center justify-center text-[#7C5ABF]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">
                      Sovereign Family Trust
                    </p>
                    <p className="text-xs font-bold text-[#22251F]">
                      Council Estate Governance
                    </p>
                  </div>
                </div>
                <Badge variant="violet">Trust Active</Badge>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297] mb-1">
                Total Protected Trust Capital
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#22251F] tabular-nums tracking-tight">
                ${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h1>
              <p className="text-xs text-[#77786F] mt-1.5 font-medium">
                Combined liquid vault and institutional bank reserve allocated across family council.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#EAE8DF] grid grid-cols-3 gap-4 text-center">
              <div className="p-2.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
                <p className="text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">Council Members</p>
                <p className="text-base font-bold text-[#7C5ABF] tabular-nums mt-0.5">{members.length} Enshrined</p>
              </div>
              <div className="p-2.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
                <p className="text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">Allocated Share</p>
                <p className="text-base font-bold text-[#526B56] tabular-nums mt-0.5">{totalAllocated}% of Trust</p>
              </div>
              <div className="p-2.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
                <p className="text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">Legacy Status</p>
                <p className="text-base font-bold text-[#C18A48] mt-0.5">Generational</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Wealth Allocation Donut Chart */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between border border-[#EAE8DF] bg-white space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="w-3.5 h-3.5 text-[#7C5ABF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297]">Distribution</h3>
                </div>
                <Badge variant="violet">{totalAllocated}% Allocated</Badge>
              </div>
              <p className="text-sm font-bold text-[#22251F]">Council Wealth Allocation</p>

              <div className="relative flex items-center justify-center my-3">
                <div className="h-52 w-full max-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={members}
                        cx="50%"
                        cy="50%"
                        innerRadius={54}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="wealth"
                        cornerRadius={3}
                        isAnimationActive={true}
                        onMouseEnter={(_, idx) => setHoveredMember(members[idx])}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        {members.map((member, index) => (
                          <Cell
                            key={`cell-${member?.id || index}`}
                            fill={COLORS[index % COLORS.length]}
                            className="cursor-pointer transition-opacity duration-200 hover:opacity-85"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Center Badge */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297] truncate max-w-[120px]">
                    {hoveredMember ? hoveredMember.name : 'Trust Share'}
                  </span>
                  <span className="text-base font-extrabold text-[#22251F] tabular-nums mt-0.5">
                    {hoveredMember ? `${hoveredMember.wealth}%` : `${totalAllocated}%`}
                  </span>
                  <span className="text-[10px] font-bold text-[#7C5ABF]">
                    {hoveredMember ? 'Council Share' : `${members.length} Members`}
                  </span>
                </div>
              </div>

              {/* Segment Breakdown */}
              <div className="space-y-2 mt-2 pt-3 border-t border-[#EAE8DF] max-h-40 overflow-y-auto scroll-hide">
                {members.map((member, i) => {
                  const isHovered = hoveredMember?.id === member.id;
                  const color = COLORS[i % COLORS.length];
                  return (
                    <div
                      key={member.id}
                      onMouseEnter={() => setHoveredMember(member)}
                      onMouseLeave={() => setHoveredMember(null)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isHovered ? 'bg-[#F3EEF8]' : 'hover:bg-[#FCFBF8]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2 truncate mr-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <span className={`font-semibold truncate ${isHovered ? 'text-[#7C5ABF]' : 'text-[#22251F]'}`}>
                            {member.name}
                          </span>
                        </div>
                        <span className="font-bold tabular-nums text-[#22251F]">{member.wealth}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F1EFE7] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${member.wealth}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Council Members List & Financial Tools ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Members Cards */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297]">
              Family Council Members ({members.length})
            </h3>
            <span className="text-[11px] text-[#77786F]">Click any member to adjust share</span>
          </div>

          {members.map(member => (
            <Card
              key={member.id}
              className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[#EAE8DF] bg-white hover:border-[#D5D2C8] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#F3EEF8] border border-[#DECDEE] flex items-center justify-center text-[#7C5ABF] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#22251F] text-sm truncate">{member.name}</h4>
                  <p className="text-[10px] text-[#77786F] font-semibold mt-0.5">
                    {member.role} · Wealth Share: <span className="text-[#526B56] font-bold">{member.wealth}%</span> (~${Math.round((totalWealth * member.wealth) / 100).toLocaleString()})
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full sm:max-w-xs space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-[#77786F]">
                  <span className="truncate mr-2">Goal: {member.goal}</span>
                  <span className="tabular-nums text-[#22251F] font-bold">{member.wealth}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1EFE7] rounded-full overflow-hidden border border-[#EAE8DF]">
                  <div
                    className="h-full bg-[#526B56] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(member.wealth, 100)}%` }}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={Edit3}
                onClick={() => openEdit(member)}
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>

        {/* Strategic Financial Tools */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {[
            { label: 'Allowances', icon: Wallet, value: 'AUTOMATED', sub: '$5,000 Total Monthly Disbursed' },
            { label: 'Emergency Fund', icon: LifeBuoy, value: '$250,000', sub: 'Target: $500,000 in liquid reserve' },
            { label: 'Legacy Goals', icon: Target, value: '12 ACTIVE', sub: 'Projected Target: 2028' },
            { label: 'Tax Governance', icon: ShieldCheck, value: 'OPTIMIZED', sub: 'Zero-Liability Trust Mode' }
          ].map((item) => (
            <Card key={item.label} className="p-4 border border-[#EAE8DF] bg-white flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">{item.label}</p>
                <p className="text-xs font-bold text-[#22251F]">{item.value}</p>
                <p className="text-[10px] text-[#77786F] truncate mt-0.5">{item.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── ADD MEMBER MODAL ── */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Council Member"
        subtitle="Enshrine a new family member into the Sovereign Trust"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Member Name"
            required
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g. Elena (Associate)"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Council Role</label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Strategist">Strategist</option>
                <option value="Analyst">Analyst</option>
                <option value="Guardian">Guardian</option>
                <option value="Apprentice">Apprentice</option>
                <option value="Beneficiary">Beneficiary</option>
              </select>
            </div>
            <Input
              label="Wealth Share (%)"
              type="number"
              value={addForm.wealth}
              onChange={(e) => setAddForm({ ...addForm, wealth: e.target.value })}
              min="0"
              max="100"
            />
          </div>
          <Input
            label="Legacy Goal"
            value={addForm.goal}
            onChange={(e) => setAddForm({ ...addForm, goal: e.target.value })}
            placeholder="e.g. NextGen Innovation Fund"
          />
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Enshrine Member
          </Button>
        </form>
      </Modal>

      {/* ── EDIT MEMBER MODAL ── */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Edit Council Member"
        subtitle="Calibrate member allocation share and goal"
      >
        {editingMember && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Member Name"
              required
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Role"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              />
              <Input
                label="Wealth Share (%)"
                type="number"
                value={editForm.wealth}
                onChange={(e) => setEditForm({ ...editForm, wealth: e.target.value })}
                min="0"
                max="100"
              />
            </div>
            <Input
              label="Legacy Goal"
              value={editForm.goal}
              onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
              Save Changes
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default React.memo(FamilyHub);

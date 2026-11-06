import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Award, Target, CheckCircle2, Trophy, Star,
  Zap, Plus, Shield, Sparkles, Flame, Crown
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const RANKS = [
  { level: 1, title: 'Apprentice Trader', minXP: 0 },
  { level: 2, title: 'Vault Custodian', minXP: 1000 },
  { level: 3, title: 'Syndicate Partner', minXP: 2000 },
  { level: 4, title: 'Corporate Baron', minXP: 3000 },
  { level: 5, title: 'Capital Tycoon', minXP: 4000 },
  { level: 6, title: 'Industrial Sovereign', minXP: 5000 },
  { level: 7, title: 'Global Hegemon', minXP: 7000 },
  { level: 8, title: 'Dynasty Emperor', minXP: 10000 }
];

const BADGES = [
  { id: 'b1', name: 'Quarter Millionaire', desc: 'Achieved $250,000+ Net Worth', icon: '💰', unlocked: true },
  { id: 'b2', name: 'Fleet Commander', desc: 'Expanded to 10+ Corporate Ventures', icon: '🚀', unlocked: true },
  { id: 'b3', name: 'Council Patriarch', desc: 'Enshrined 4+ Family Members', icon: '🏛️', unlocked: true },
  { id: 'b4', name: 'Sovereign Landlord', desc: 'Acquired 3+ Prime Real Estate Assets', icon: '🏰', unlocked: true },
  { id: 'b5', name: 'Half Million Sovereign', desc: 'Reach $500,000 Total Net Worth', icon: '👑', unlocked: false },
  { id: 'b6', name: 'Zero-Burn Master', desc: 'Maintain 65%+ Net Profit Margin', icon: '⚡', unlocked: false }
];

const GoalsHub = () => {
  const {goals, completeMission, portfolioNetWorth,
    cashFlowMetrics, businesses, members, currencySymbol } = useEmpire();

  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    target: '500000',
    metric: 'netWorth'
  });

  const currentLevelInfo = useMemo(() => {
    const xp = goals.xp || 4850;
    const currentRank = [...RANKS].reverse().find(r => xp >= r.minXP) || RANKS[0];
    const nextRank = RANKS.find(r => r.minXP > xp) || null;
    const progressInLevel = nextRank
      ? Math.min(100, Math.round(((xp - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100))
      : 100;

    return {
      currentRank,
      nextRank,
      progressInLevel,
      xp
    };
  }, [goals.xp]);

  // Dynamic progress evaluation for milestones
  const evaluatedMilestones = useMemo(() => {
    return (goals.milestones || []).map(m => {
      let currentVal = 0;
      if (m.metric === 'netWorth') currentVal = portfolioNetWorth?.netWorth || 0;
      else if (m.metric === 'passiveIncome') currentVal = cashFlowMetrics?.passiveIncome || 0;
      else if (m.metric === 'activeVentures') currentVal = (businesses || []).filter(b => b.status === 'Active').length;
      else if (m.metric === 'familyMembers') currentVal = (members || []).length;
      else currentVal = m.current || 0;

      const progress = m.target > 0 ? Math.min(100, Math.round((currentVal / m.target) * 100)) : 0;
      const isCompleted = currentVal >= m.target;

      return {
        ...m,
        currentVal,
        progress,
        isCompleted
      };
    });
  }, [goals.milestones, portfolioNetWorth, cashFlowMetrics, businesses, members]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ww-text-muted mb-1">
            Dynasty Milestones & Gamification Engine
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ww-text tracking-tight">
            Wealth Goals & Mission Center
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Level {currentLevelInfo.currentRank.level} Sovereign</Badge>
        </div>
      </div>

      {/* Dynasty Progression Banner */}
      <Card className="p-6 border border-ww-border bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-ww-text-muted">Current Dynasty Rank</p>
              <h3 className="text-xl font-extrabold text-ww-text">{currentLevelInfo.currentRank.title}</h3>
              <p className="text-xs text-ww-text-secondary">Level {currentLevelInfo.currentRank.level} · {currentLevelInfo.xp} Total Empire XP</p>
            </div>
          </div>
          {currentLevelInfo.nextRank && (
            <div className="text-right">
              <span className="text-[11px] font-semibold text-ww-text-secondary">Next Rank: <strong>{currentLevelInfo.nextRank.title}</strong></span>
              <p className="text-[10px] text-ww-text-muted mt-0.5">{currentLevelInfo.nextRank.minXP - currentLevelInfo.xp} XP to promote</p>
            </div>
          )}
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-bold text-ww-text-secondary">
            <span>Rank Progress</span>
            <span>{currentLevelInfo.progressInLevel}%</span>
          </div>
          <div className="w-full h-3 bg-ww-bg-alt rounded-full overflow-hidden border border-ww-border">
            <div
              className="h-full bg-ww-accent rounded-full transition-all duration-700"
              style={{ width: `${currentLevelInfo.progressInLevel}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Daily Tactical Missions */}
      <Card className="p-5 border border-ww-border bg-white space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-ww-border">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-ww-warning" />
            <h3 className="text-sm font-bold text-ww-text">Daily Tactical Missions</h3>
          </div>
          <Badge variant="success">Refreshes Daily</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(goals.missions || []).map(m => (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 ${
                m.completed
                  ? 'bg-ww-green-bg/40 border-ww-accent/20'
                  : 'bg-ww-elevated border-ww-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-ww-text">{m.title}</span>
                  <span className="text-[10px] font-extrabold text-ww-warning tabular-nums">+{m.reward} XP</span>
                </div>
                <p className="text-[11px] text-ww-text-secondary">Strategic calibration task</p>
              </div>

              <button
                type="button"
                onClick={() => completeMission(m.id)}
                disabled={m.completed}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  m.completed
                    ? 'bg-ww-green-bg text-ww-accent cursor-default'
                    : 'bg-ww-accent text-white hover:bg-ww-accent-hover cursor-pointer'
                }`}
              >
                {m.completed ? '✓ Mission Completed' : 'Claim Mission Reward'}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Sovereign Milestones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ww-text-muted">
            Dynasty Milestones ({evaluatedMilestones.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluatedMilestones.map(m => (
            <Card key={m.id} className="p-4 border border-ww-border bg-white space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-ww-text">{m.title}</h4>
                  <p className="text-[11px] text-ww-text-secondary mt-0.5">
                    Target: {m.metric === 'netWorth' || m.metric === 'passiveIncome' ? `$${m.target.toLocaleString()}` : `${m.target} Units`}
                  </p>
                </div>
                <Badge variant={m.isCompleted ? 'success' : 'default'}>
                  {m.isCompleted ? 'Enshrined' : `${m.progress}%`}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-ww-text-secondary tabular-nums font-semibold">
                  <span>Current: {m.metric === 'netWorth' || m.metric === 'passiveIncome' ? `${currencySymbol}${Math.round(m.currentVal).toLocaleString()}` : m.currentVal}</span>
                  <span>+{m.xp} XP</span>
                </div>
                <div className="w-full h-2 bg-ww-bg-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ww-accent rounded-full transition-all duration-500"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <Card className="p-5 border border-ww-border bg-white space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ww-border">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-ww-warning" />
            <h3 className="text-sm font-bold text-ww-text">Imperial Achievement Badges</h3>
          </div>
          <span className="text-xs text-ww-text-secondary font-semibold">{BADGES.filter(b => b.unlocked).length} / {BADGES.length} Unlocked</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map(b => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                b.unlocked
                  ? 'bg-ww-elevated border-ww-border'
                  : 'bg-ww-bg/60 border-dashed border-ww-border-strong opacity-50'
              }`}
            >
              <span className="text-2xl block">{b.icon}</span>
              <p className="text-xs font-bold text-ww-text leading-tight">{b.name}</p>
              <p className="text-[9px] text-ww-text-secondary leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(GoalsHub);


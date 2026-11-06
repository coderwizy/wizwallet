import React from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { Crown, Zap, Trophy } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileGoalsView = () => {
  const { goals, completeMission } = useEmpire();

  const xp = goals.xp || 4850;
  const level = goals.level || 6;

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-ww-text">Wealth Goals & XP</h2>
        <Badge variant="accent">Level {level}</Badge>
      </div>

      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ww-green-bg text-ww-accent flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-ww-text-muted">Current Rank</span>
            <h3 className="text-base font-extrabold text-ww-text">Industrial Sovereign</h3>
            <p className="text-[10px] text-ww-text-secondary">{xp} Empire XP Earned</p>
          </div>
        </div>
      </Card>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ww-text-muted px-1">Daily Missions</h3>
        {(goals.missions || []).map(m => (
          <Card key={m.id} className="p-3.5 border border-ww-border bg-white flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-bold text-ww-text truncate">{m.title}</h4>
              <span className="text-[10px] text-ww-warning font-bold">+{m.reward} XP</span>
            </div>
            <button
              type="button"
              onClick={() => completeMission(m.id)}
              disabled={m.completed}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                m.completed ? 'bg-ww-green-bg text-ww-accent' : 'bg-ww-accent text-white'
              }`}
            >
              {m.completed ? 'Done' : 'Claim'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default React.memo(MobileGoalsView);


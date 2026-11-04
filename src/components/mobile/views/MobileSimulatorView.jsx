import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { generateWealthForecasts } from '../../../utils/financialCalculations';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileSimulatorView = () => {
  const { wallet, bank, portfolioNetWorth, cashFlowMetrics, privacyMode } = useEmpire();
  const [years, setYears] = useState(5);

  const actualNetWorth = portfolioNetWorth?.netWorth ?? ((wallet?.balance || 0) + (bank?.balance || 0));
  const startingCapital = actualNetWorth > 0 ? actualNetWorth : 100000;

  const forecast = useMemo(() => {
    return generateWealthForecasts({
      currentNetWorth: startingCapital,
      monthlyContribution: 5000,
      annualBusinessCashflow: (cashFlowMetrics?.netMonthlyCashflow || 0) * 12,
      inflationRate: 0.03,
      years
    });
  }, [startingCapital, cashFlowMetrics?.netMonthlyCashflow, years]);

  const finalYear = forecast?.finalYearData || {};

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-ww-text">Future Wealth Simulator</h2>
        <Badge variant="accent">{years} Year Horizon</Badge>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scroll-hide">
        {[1, 3, 5, 10, 20].map(y => (
          <button
            key={y}
            type="button"
            onClick={() => setYears(y)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              years === y ? 'bg-ww-accent text-white' : 'bg-white border border-ww-border text-ww-text-secondary'
            }`}
          >
            {y}y
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Card className="p-4 border border-ww-border bg-white space-y-1">
          <span className="text-[10px] font-semibold text-ww-accent-light uppercase">Conservative Scenario (6%)</span>
          <h3 className="text-2xl font-extrabold text-ww-text tabular-nums">
            ${mask((finalYear.Conservative || 0).toLocaleString())}
          </h3>
          <p className="text-[10px] text-ww-text-secondary">Capital preservation with low risk</p>
        </Card>

        <Card className="p-4 border border-ww-accent/40 bg-ww-green-bg/40 space-y-1">
          <span className="text-[10px] font-semibold text-ww-accent uppercase">Balanced Scenario (11%)</span>
          <h3 className="text-2xl font-extrabold text-ww-accent tabular-nums">
            ${mask((finalYear.Balanced || 0).toLocaleString())}
          </h3>
          <p className="text-[10px] text-ww-accent">
            Inflation adjusted real power: <strong>${mask((finalYear.Balanced_Real || 0).toLocaleString())}</strong>
          </p>
        </Card>

        <Card className="p-4 border border-ww-border bg-white space-y-1">
          <span className="text-[10px] font-semibold text-ww-warning uppercase">Aggressive Expansion (19%)</span>
          <h3 className="text-2xl font-extrabold text-ww-warning tabular-nums">
            ${mask((finalYear.Aggressive || 0).toLocaleString())}
          </h3>
          <p className="text-[10px] text-ww-text-secondary">High-velocity reinvestment</p>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(MobileSimulatorView);

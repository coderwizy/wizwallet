import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { generateWealthForecasts } from '../../../utils/financialCalculations';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip
} from 'recharts';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileSimulatorView = () => {
  const { wallet, bank, portfolioNetWorth, cashFlowMetrics, privacyMode } = useEmpire();
  const [years, setYears] = useState(5);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [activeScenario, setActiveScenario] = useState('Balanced');

  const actualNetWorth = portfolioNetWorth?.netWorth ?? ((wallet?.balance || 0) + (bank?.balance || 0));
  const startingCapital = actualNetWorth > 0 ? actualNetWorth : 10000;

  const forecast = useMemo(() => {
    return generateWealthForecasts({
      currentNetWorth: startingCapital,
      monthlyContribution: Number(monthlyContribution) || 0,
      annualBusinessCashflow: (cashFlowMetrics?.netMonthlyCashflow || 0) * 12,
      inflationRate: (Number(inflationRate) || 3) / 100,
      years: Number(years) || 5
    });
  }, [startingCapital, monthlyContribution, cashFlowMetrics?.netMonthlyCashflow, inflationRate, years]);

  const finalYear = forecast?.finalYearData || {};
  const conservativeFinal = finalYear?.Conservative || 0;
  const balancedFinal = finalYear?.Balanced || 0;
  const aggressiveFinal = finalYear?.Aggressive || 0;
  const realBalancedFinal = finalYear?.Balanced_Real || 0;

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-bold text-[#22251F]">Wealth Simulator</h2>
          <p className="text-[10px] text-[#77786F]">Compound Growth Forecast</p>
        </div>
        <Badge variant="accent">{years}y Horizon</Badge>
      </div>

      {/* Horizon Selector */}
      <div className="flex gap-1.5 overflow-x-auto scroll-hide pb-1">
        {[1, 3, 5, 10, 15, 20].map(y => (
          <button
            key={y}
            type="button"
            onClick={() => setYears(y)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              years === y
                ? 'bg-[#526B56] text-white shadow-xs'
                : 'bg-white border border-[#EAE8DF] text-[#77786F]'
            }`}
          >
            {y}y
          </button>
        ))}
      </div>

      {/* Mini Visual Area Chart on Mobile */}
      <Card className="p-3.5 border border-[#EAE8DF] bg-white space-y-2">
        <div className="flex justify-between items-center text-xs pb-1 border-b border-[#EAE8DF]">
          <span className="font-bold text-[#22251F]">Projected Curve</span>
          <div className="flex gap-1 text-[10px]">
            {['Conservative', 'Balanced', 'Aggressive'].map(sc => (
              <button
                key={sc}
                type="button"
                onClick={() => setActiveScenario(sc)}
                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                  activeScenario === sc ? 'bg-[#526B56] text-white' : 'text-[#77786F]'
                }`}
              >
                {sc.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-44 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.timeline} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mobileColorScenario" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeScenario === 'Aggressive' ? '#C18A48' : activeScenario === 'Conservative' ? '#82977B' : '#526B56'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={activeScenario === 'Aggressive' ? '#C18A48' : activeScenario === 'Conservative' ? '#82977B' : '#526B56'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#A3A297" fontSize={10} />
              <Tooltip
                formatter={(val) => [`$${Number(val).toLocaleString()}`, activeScenario]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Area
                type="monotone"
                dataKey={activeScenario}
                stroke={activeScenario === 'Aggressive' ? '#C18A48' : activeScenario === 'Conservative' ? '#82977B' : '#526B56'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mobileColorScenario)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Contribution & Inflation inputs */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 border border-[#EAE8DF] bg-white space-y-1">
          <label className="text-[9px] font-bold uppercase text-[#A3A297] block">Monthly Inflow</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={e => setMonthlyContribution(Number(e.target.value) || 0)}
            className="w-full text-sm font-bold text-[#22251F] bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-2 py-1 outline-none focus:border-[#526B56]"
          />
        </Card>

        <Card className="p-3 border border-[#EAE8DF] bg-white space-y-1">
          <label className="text-[9px] font-bold uppercase text-[#A3A297] block">Inflation Rate %</label>
          <input
            type="number"
            step="0.5"
            value={inflationRate}
            onChange={e => setInflationRate(Number(e.target.value) || 0)}
            className="w-full text-sm font-bold text-[#22251F] bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-2 py-1 outline-none focus:border-[#526B56]"
          />
        </Card>
      </div>

      {/* Target Outcome Cards */}
      <div className="space-y-2.5">
        <Card className="p-3.5 border border-[#EAE8DF] bg-white space-y-1">
          <span className="text-[10px] font-semibold text-[#82977B] uppercase">Conservative Scenario (6%)</span>
          <h3 className="text-xl font-extrabold text-[#22251F] tabular-nums">
            ${mask(conservativeFinal.toLocaleString())}
          </h3>
          <p className="text-[10px] text-[#77786F]">Capital preservation with low risk</p>
        </Card>

        <Card className="p-3.5 border border-[#526B56]/40 bg-[#EDF2E9]/40 space-y-1">
          <span className="text-[10px] font-semibold text-[#526B56] uppercase">Balanced Scenario (11%)</span>
          <h3 className="text-xl font-extrabold text-[#526B56] tabular-nums">
            ${mask(balancedFinal.toLocaleString())}
          </h3>
          <p className="text-[10px] text-[#526B56]">
            Inflation adjusted real power: <strong>${mask(realBalancedFinal.toLocaleString())}</strong>
          </p>
        </Card>

        <Card className="p-3.5 border border-[#EAE8DF] bg-white space-y-1">
          <span className="text-[10px] font-semibold text-[#C18A48] uppercase">Aggressive Expansion (19%)</span>
          <h3 className="text-xl font-extrabold text-[#C18A48] tabular-nums">
            ${mask(aggressiveFinal.toLocaleString())}
          </h3>
          <p className="text-[10px] text-[#77786F]">High-velocity reinvestment</p>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(MobileSimulatorView);

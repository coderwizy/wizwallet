 import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { generateWealthForecasts } from '../../utils/financialCalculations';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Calendar, Sliders, DollarSign, ShieldAlert,
  Percent, ArrowRight, BarChart3, Info
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const FutureSimulatorHub = () => {
  const { portfolioNetWorth, cashFlowMetrics, privacyMode } = useEmpire();

  const [years, setYears] = useState(10);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [activeScenario, setActiveScenario] = useState('Balanced');

  // Starting net worth defaulted to actual state
  const startingCapital = Math.max(100000, portfolioNetWorth.netWorth);

  // Forecast engine
  const forecast = useMemo(() => {
    return generateWealthForecasts({
      currentNetWorth: startingCapital,
      monthlyContribution: Number(monthlyContribution) || 0,
      annualBusinessCashflow: (cashFlowMetrics.netMonthlyCashflow || 0) * 12,
      inflationRate: (Number(inflationRate) || 3) / 100,
      years: Number(years) || 10
    });
  }, [startingCapital, monthlyContribution, cashFlowMetrics.netMonthlyCashflow, inflationRate, years]);

  const finalYear = forecast.finalYearData || {};
  const conservativeFinal = finalYear.Conservative || 0;
  const balancedFinal = finalYear.Balanced || 0;
  const aggressiveFinal = finalYear.Aggressive || 0;
  const realBalancedFinal = finalYear.Balanced_Real || 0;

  const totalAddedCapital = (Number(monthlyContribution) || 0) * 12 * years;
  const compoundGains = Math.max(0, (finalYear[activeScenario] || 0) - startingCapital - totalAddedCapital);

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Predictive Financial Modeling & Compound Engine
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Future Wealth Simulator
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">Deterministic Projections</Badge>
        </div>
      </div>

      {/* Projection Horizon Selector */}
      <Card className="p-4 border border-[#EAE8DF] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#526B56]" />
          <span className="text-xs font-bold text-[#22251F]">Simulation Horizon:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[1, 3, 5, 10, 15, 20].map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setYears(y)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                years === y
                  ? 'bg-[#526B56] text-white shadow-2xs'
                  : 'bg-[#FCFBF8] border border-[#EAE8DF] text-[#77786F] hover:text-[#22251F]'
              }`}
            >
              {y} {y === 1 ? 'Year' : 'Years'}
            </button>
          ))}
        </div>
      </Card>

      {/* Calibration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border border-[#EAE8DF] bg-white space-y-2">
          <label className="text-[10px] font-bold uppercase text-[#A3A297] block">Base Capital Starting Point</label>
          <div className="text-xl font-extrabold text-[#22251F] tabular-nums">
            ${mask(startingCapital.toLocaleString())}
          </div>
          <p className="text-[10px] text-[#77786F]">Synchronized with actual Empire Net Worth</p>
        </Card>

        <Card className="p-4 border border-[#EAE8DF] bg-white space-y-2">
          <label className="text-[10px] font-bold uppercase text-[#A3A297] block">Monthly Capital Inflow ($)</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={e => setMonthlyContribution(Number(e.target.value) || 0)}
            className="w-full text-lg font-bold text-[#22251F] bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3 py-1.5 outline-none focus:border-[#526B56]"
          />
          <p className="text-[10px] text-[#77786F]">Monthly capital contributed from surplus cash</p>
        </Card>

        <Card className="p-4 border border-[#EAE8DF] bg-white space-y-2">
          <label className="text-[10px] font-bold uppercase text-[#A3A297] block">Estimated Inflation (% / Year)</label>
          <input
            type="number"
            step="0.1"
            value={inflationRate}
            onChange={e => setInflationRate(Number(e.target.value) || 0)}
            className="w-full text-lg font-bold text-[#22251F] bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3 py-1.5 outline-none focus:border-[#526B56]"
          />
          <p className="text-[10px] text-[#77786F]">Discount rate for real purchasing power calculations</p>
        </Card>
      </div>

      {/* Primary Forecast Display Chart */}
      <Card className="p-6 border border-[#EAE8DF] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#EAE8DF]">
          <div>
            <h3 className="text-sm font-bold text-[#22251F]">Wealth Trajectory Over {years} Years</h3>
            <p className="text-xs text-[#77786F]">Comparing Conservative (6%), Balanced (11%), and Aggressive (19%) compound curves</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FCFBF8] p-1 rounded-xl border border-[#EAE8DF]">
            {['Conservative', 'Balanced', 'Aggressive'].map(sc => (
              <button
                key={sc}
                type="button"
                onClick={() => setActiveScenario(sc)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  activeScenario === sc ? 'bg-[#526B56] text-white shadow-2xs' : 'text-[#77786F]'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C18A48" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C18A48" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBalanced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#526B56" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#526B56" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82977B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#82977B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE8DF" />
              <XAxis dataKey="year" stroke="#A3A297" fontSize={11} />
              <YAxis
                stroke="#A3A297"
                fontSize={11}
                tickFormatter={val => `$${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(val, name) => [`$${Number(val).toLocaleString()}`, name]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Area
                type="monotone"
                dataKey="Aggressive"
                stroke="#C18A48"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAggressive)"
              />
              <Area
                type="monotone"
                dataKey="Balanced"
                stroke="#526B56"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBalanced)"
              />
              <Area
                type="monotone"
                dataKey="Conservative"
                stroke="#82977B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConservative)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Target Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#82977B]">Conservative Target ({years}y)</span>
          <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums">
            ${mask(conservativeFinal.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F]">Based on 6% annual preservation CAGR</p>
        </Card>

        <Card className="p-5 border border-[#526B56]/30 bg-[#EDF2E9]/40 space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#526B56]">Balanced Scenario ({years}y)</span>
          <h3 className="text-2xl font-extrabold text-[#526B56] tabular-nums">
            ${mask(balancedFinal.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#526B56]">
            Real purchasing power (after {inflationRate}% inflation): <strong>${mask(realBalancedFinal.toLocaleString())}</strong>
          </p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C18A48]">Aggressive Expansion ({years}y)</span>
          <h3 className="text-2xl font-extrabold text-[#C18A48] tabular-nums">
            ${mask(aggressiveFinal.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F]">Aggressive 19% commercial reinvestment CAGR</p>
        </Card>
      </div>

      {/* Compound Breakdown Callout */}
      <Card className="p-4 border border-[#EAE8DF] bg-[#FCFBF8] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-[#526B56] shrink-0" />
          <p className="text-[#77786F]">
            In the <strong>{activeScenario}</strong> scenario, your new contributions total <strong className="text-[#22251F]">${mask(totalAddedCapital.toLocaleString())}</strong> while compound interest and reinvested returns generate <strong className="text-[#526B56]">+${mask(compoundGains.toLocaleString())}</strong> in wealth acceleration.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(FutureSimulatorHub);

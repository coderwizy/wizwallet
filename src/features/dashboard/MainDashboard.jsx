import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  BarChart3, Zap, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck,
  Wallet, Landmark, Briefcase, Layers, ChevronRight, Sliders,
  Sparkles, Building2, PieChart as PieIcon, Plus, Eye, EyeOff
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#EAE8DF] rounded-xl p-3 shadow-lg">
        <p className="text-[10px] font-bold text-[#A3A297] uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-extrabold text-[#22251F] tabular-nums">
          ${Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const MainDashboard = ({ setActiveTab }) => {
  const {
    wallet, bank, businesses, sectors, transactions, balanceHistory, user,
    investments, properties, portfolioNetWorth, cashFlowMetrics,
    privacyMode, togglePrivacyMode, isPulseActive, widgetConfig, setWidgetConfig
  } = useEmpire();

  const [chartRange, setChartRange] = useState('7d');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const totalNetWorth = portfolioNetWorth?.netWorth || 0;
  const breakdown = portfolioNetWorth?.breakdown || {};
  const previousNetWorth = balanceHistory.length > 1
    ? (balanceHistory[balanceHistory.length - 2]?.value ?? totalNetWorth)
    : (balanceHistory[0]?.value ?? totalNetWorth);
  const netWorthChange = previousNetWorth > 0
    ? (((totalNetWorth - previousNetWorth) / previousNetWorth) * 100).toFixed(2)
    : '0.00';
  const isNetWorthUp = parseFloat(netWorthChange) >= 0;

  const chartData = useMemo(() => {
    const limit = chartRange === '7d' ? 7 : 30;
    if (balanceHistory.length === 0) {
      return [{ name: 'Current', income: totalNetWorth }];
    }
    const slice = balanceHistory.slice(-limit);
    return slice.map((entry, i) => ({
      name: i === slice.length - 1 ? 'Current' : `T-${slice.length - 1 - i}`,
      income: Math.round(entry.value),
    }));
  }, [balanceHistory, chartRange, totalNetWorth]);

  const mask = (val) => privacyMode ? '••••••' : val;

  // Toggle widget visibility
  const toggleWidget = (id) => {
    setWidgetConfig(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const isWidgetVisible = (id) => {
    const w = widgetConfig.find(x => x.id === id);
    return w ? w.visible : true;
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            WizWallet 3.0 · Sovereign Command Center
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            {user?.username ? `Empire Command · ${user.username}` : 'Imperial Overview'}
          </h2>
          <p className="text-sm text-[#77786F] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={privacyMode ? EyeOff : Eye}
            onClick={togglePrivacyMode}
          >
            {privacyMode ? 'Privacy: Masked' : 'Privacy: Visible'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Sliders}
            onClick={() => setIsCustomizeOpen(true)}
          >
            Customize Layout
          </Button>
        </div>
      </div>

      {/* ── AI Commander Strategic Alert Strip ── */}
      {isWidgetVisible('aiInsights') && (
        <Card className="p-4 border border-[#526B56]/30 bg-[#EDF2E9]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#526B56] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#22251F]">
                AI Intelligence Briefing: Portfolio Net Worth is ${mask(totalNetWorth.toLocaleString())}
              </p>
              <p className="text-[11px] text-[#526B56] mt-0.5 font-medium">
                Generating +${mask(cashFlowMetrics.netMonthlyCashflow.toLocaleString())}/mo net cashflow across all assets. All 13 corporate ventures operational.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={ChevronRight}
            onClick={() => setActiveTab('commander')}
            className="shrink-0"
          >
            Launch Commander
          </Button>
        </Card>
      )}

      {/* ── Consolidated KPI Overview ── */}
      {isWidgetVisible('kpiOverview') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#EDF2E9] text-[#526B56]">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                isNetWorthUp ? 'text-[#66866A] bg-[#EDF2E9]' : 'text-[#C66D65] bg-[#FCEEED]'
              }`}>
                {isNetWorthUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isNetWorthUp ? '+' : ''}{netWorthChange}%
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Total Sovereign Net Worth</p>
            <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
              ${mask(totalNetWorth.toLocaleString())}
            </h3>
            <div className="mt-3 pt-3 border-t border-[#EAE8DF] grid grid-cols-2 gap-2 text-center text-[10px]">
              <div className="p-1.5 bg-[#FCFBF8] rounded-lg">
                <span className="text-[#A3A297] block font-semibold">Liquid Vault</span>
                <span className="font-bold text-[#526B56] tabular-nums">${mask((wallet?.balance || 0).toLocaleString())}</span>
              </div>
              <div className="p-1.5 bg-[#FCFBF8] rounded-lg">
                <span className="text-[#A3A297] block font-semibold">Bank Reserves</span>
                <span className="font-bold text-[#526B56] tabular-nums">${mask((bank?.balance || 0).toLocaleString())}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#F3EEF8] text-[#7C5ABF]">
                <BarChart3 className="w-4 h-4" />
              </div>
              <Badge variant="violet">Securities</Badge>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Investment Portfolio</p>
            <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
              ${mask((breakdown.investmentsValue || 0).toLocaleString())}
            </h3>
            <p className="text-[11px] text-[#77786F] mt-1">{investments.length} active market positions</p>
          </Card>

          <Card className="p-5 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#FDF3E3] text-[#C18A48]">
                <Building2 className="w-4 h-4" />
              </div>
              <Badge variant="accent">Real Estate</Badge>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Real Estate Equity</p>
            <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
              ${mask(((breakdown.realEstateValue || 0) - (breakdown.realEstateDebt || 0)).toLocaleString())}
            </h3>
            <p className="text-[11px] text-[#77786F] mt-1">Gross assets: ${mask((breakdown.realEstateValue || 0).toLocaleString())}</p>
          </Card>

          <Card className="p-5 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#EDF2E9] text-[#526B56]">
                <Briefcase className="w-4 h-4" />
              </div>
              <Badge variant="success">13 Ventures</Badge>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Monthly Net Cash Flow</p>
            <h3 className="text-2xl font-extrabold text-[#526B56] tabular-nums mt-1">
              +${mask(cashFlowMetrics.netMonthlyCashflow.toLocaleString())}/mo
            </h3>
            <p className="text-[11px] text-[#77786F] mt-1">Gross income: ${mask(cashFlowMetrics.totalMonthlyIncome.toLocaleString())}</p>
          </Card>
        </div>
      )}

      {/* ── Net Worth Trajectory Area Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 border border-[#EAE8DF] bg-white h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#22251F]">Imperial Net Worth Trajectory</h3>
                <p className="text-xs text-[#77786F]">Audited real-time compounding valuation snapshots</p>
              </div>
              <div className="flex items-center gap-1 bg-[#FCFBF8] p-1 rounded-xl border border-[#EAE8DF]">
                {['7d', '30d'].map(range => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setChartRange(range)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartRange === range ? 'bg-[#526B56] text-white shadow-2xs' : 'text-[#77786F]'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashNetWorth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#526B56" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#526B56" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE8DF" />
                  <XAxis dataKey="name" stroke="#A3A297" fontSize={11} />
                  <YAxis
                    stroke="#A3A297"
                    fontSize={11}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#526B56"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#dashNetWorth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── Asset Allocation Quick View ── */}
        <div className="lg:col-span-4">
          <Card className="p-6 border border-[#EAE8DF] bg-white h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#526B56]" />
                  <h3 className="text-sm font-bold text-[#22251F]">Asset Allocation</h3>
                </div>
                <Badge variant="accent">6 Classes</Badge>
              </div>
              <p className="text-xs text-[#77786F]">Portfolio distribution across sovereign categories</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { label: 'Liquid Wallet & Vault', val: breakdown.liquidWallet || 0, color: '#526B56' },
                { label: 'Global Bank Deposits', val: breakdown.bankBalance || 0, color: '#82977B' },
                { label: 'Securities & Equities', val: breakdown.investmentsValue || 0, color: '#7C5ABF' },
                { label: 'Real Estate Holdings', val: breakdown.realEstateValue || 0, color: '#C18A48' },
                { label: 'Corporate Ventures', val: breakdown.businessValuation || 0, color: '#4A7C8A' },
                { label: 'Industrial Sectors', val: breakdown.sectorsValuation || 0, color: '#C66D65' }
              ].map(item => {
                const total = portfolioNetWorth?.totalAssets || 1;
                const pct = Math.round((item.val / total) * 100);
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#22251F]">{item.label}</span>
                      <span className="font-bold tabular-nums text-[#22251F]">${mask(item.val.toLocaleString())} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F1EFE7] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#EAE8DF] flex justify-between items-center text-xs">
              <span className="text-[#77786F]">Total Debt Liabilities:</span>
              <span className="font-bold text-[#C66D65] tabular-nums">-${mask((portfolioNetWorth?.totalLiabilities || 0).toLocaleString())}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Quick Action Command Launchpad ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297]">Tactical Command Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Button variant="outline" size="sm" icon={DollarSign} onClick={() => setActiveTab('wallet')}>
            Manage Vault
          </Button>
          <Button variant="outline" size="sm" icon={Landmark} onClick={() => setActiveTab('bank')}>
            Bank Treasury
          </Button>
          <Button variant="outline" size="sm" icon={BarChart3} onClick={() => setActiveTab('investments')}>
            Investments
          </Button>
          <Button variant="outline" size="sm" icon={Building2} onClick={() => setActiveTab('realestate')}>
            Real Estate
          </Button>
          <Button variant="outline" size="sm" icon={Briefcase} onClick={() => setActiveTab('business')}>
            Ventures Hub
          </Button>
          <Button variant="outline" size="sm" icon={TrendingUp} onClick={() => setActiveTab('simulator')}>
            Future Simulator
          </Button>
        </div>
      </Card>

      {/* ── Layout Customization Modal ── */}
      <Modal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        title="Customize Command Center Layout"
        subtitle="Toggle visibility of dashboard intelligence modules"
      >
        <div className="space-y-3">
          {widgetConfig.map(widget => (
            <div key={widget.id} className="flex items-center justify-between p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
              <span className="text-xs font-bold text-[#22251F]">{widget.title}</span>
              <button
                type="button"
                onClick={() => toggleWidget(widget.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  widget.visible
                    ? 'bg-[#526B56] text-white'
                    : 'bg-[#EAE8DF] text-[#77786F]'
                }`}
              >
                {widget.visible ? 'Visible' : 'Hidden'}
              </button>
            </div>
          ))}
          <Button variant="primary" className="w-full py-2.5 mt-2" onClick={() => setIsCustomizeOpen(false)}>
            Save Dashboard Preferences
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(MainDashboard);

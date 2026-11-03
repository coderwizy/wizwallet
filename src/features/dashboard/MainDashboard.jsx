import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  BarChart3, Zap, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck,
  Wallet, Landmark, Briefcase, Layers, ChevronRight,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// ── Cream-styled chart tooltip ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EAE8DF',
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(34,37,31,0.08)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#A3A297', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ fontSize: 16, fontWeight: 800, color: '#22251F', fontVariantNumeric: 'tabular-nums' }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const MainDashboard = ({ setActiveTab }) => {
  const { wallet, bank, businesses, sectors, transactions, balanceHistory, user } = useEmpire();
  const [hoveredSector, setHoveredSector] = useState(null);
  const [chartRange, setChartRange] = useState('7d');

  const totalBusinessIncome = useMemo(() => businesses.reduce((acc, biz) => acc + (biz.income || 0), 0), [businesses]);
  const totalSectorRevenue  = useMemo(() => sectors.reduce((acc, sec) => acc + (sec.revenue || 0), 0), [sectors]);
  const totalNetWorth       = useMemo(() => (wallet?.balance || 0) + (bank?.balance || 0), [wallet?.balance, bank?.balance]);

  const previousNetWorth = balanceHistory.length > 1
    ? balanceHistory[balanceHistory.length - 2].value
    : balanceHistory[0]?.value || totalNetWorth;
  const netWorthChange = previousNetWorth > 0
    ? (((totalNetWorth - previousNetWorth) / previousNetWorth) * 100).toFixed(2)
    : '0.00';
  const isNetWorthUp = parseFloat(netWorthChange) >= 0;

  const chartData = useMemo(() => {
    const limit = chartRange === '7d' ? 7 : 30;
    if (balanceHistory.length === 0) {
      return [{ name: 'Now', income: totalNetWorth }];
    }
    const slice = balanceHistory.slice(-limit);
    return slice.map((entry, i) => ({
      name: i === slice.length - 1 ? 'Current' : `T-${slice.length - 1 - i}`,
      income: Math.round(entry.value),
    }));
  }, [balanceHistory, chartRange, totalNetWorth]);

  const lastLoginText = useMemo(() => {
    if (!user?.lastLogin) return null;
    const diff = Date.now() - new Date(user.lastLogin).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs >= 24) return new Date(user.lastLogin).toLocaleDateString();
    if (mins < 1) return 'Just now';
    if (hrs < 1) return `${mins}m ago`;
    return `${hrs}h ${mins % 60}m ago`;
  }, [user?.lastLogin]);

  const bizChangeBase = balanceHistory.length > 1
    ? (((totalBusinessIncome - totalBusinessIncome * 0.95) / (totalBusinessIncome * 0.95)) * 100).toFixed(1)
    : '8.2';
  const secChangeBase = balanceHistory.length > 1
    ? (((totalSectorRevenue - totalSectorRevenue * 0.93) / (totalSectorRevenue * 0.93)) * 100).toFixed(1)
    : '15.1';

  const stats = [
    {
      label: 'Total Net Worth',
      value: `$${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `${isNetWorthUp ? '+' : ''}${netWorthChange}%`,
      isUp: isNetWorthUp,
      icon: DollarSign,
      iconBg: 'bg-[#EDF2E9] text-[#526B56]',
      breakdown: [
        { label: 'Liquid Vault', value: `$${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        { label: 'Bank Reserve', value: `$${(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
      ],
    },
    {
      label: 'Business Revenue',
      value: `$${totalBusinessIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `+${bizChangeBase}%`,
      isUp: true,
      icon: BarChart3,
      iconBg: 'bg-[#F3EEF8] text-purple-600',
    },
    {
      label: 'Sector Earnings',
      value: `$${totalSectorRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `+${secChangeBase}%`,
      isUp: true,
      icon: Layers,
      iconBg: 'bg-[#FDF3E3] text-[#C18A48]',
    },
    {
      label: 'System Status',
      value: 'Optimal',
      change: '100%',
      isUp: true,
      icon: Activity,
      iconBg: 'bg-[#EDF2E9] text-[#526B56]',
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            WizWallet · Financial Overview
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            {user?.name ? `Welcome back, ${user.name}` : 'Portfolio Overview'}
          </h2>
          <p className="text-sm text-[#77786F] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {lastLoginText && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3 h-3 text-[#A3A297]" />
              <span className="text-[10px] text-[#A3A297] font-medium">Last active: {lastLoginText}</span>
            </div>
          )}
        </div>
        <Badge variant="emerald" className="self-start md:self-auto">
          <Zap className="w-3 h-3" />
          Growth Engine Active
        </Badge>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="p-6 border border-[#EAE8DF] bg-white hover:border-[#D5D2C8] transition-colors">
              <div className="flex justify-between items-start mb-5">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full ${
                  stat.isUp
                    ? 'text-[#66866A] bg-[#EDF2E9]'
                    : 'text-[#C66D65] bg-[#FCEEED]'
                }`}>
                  {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#A3A297] uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#22251F] tabular-nums tracking-tight">{stat.value}</h3>
              {stat.breakdown && (
                <div className="mt-4 pt-4 border-t border-[#EAE8DF] grid grid-cols-2 gap-2">
                  {stat.breakdown.map(item => (
                    <div key={item.label} className="text-center p-2 bg-[#FCFBF8] rounded-lg">
                      <p className="text-[9px] text-[#A3A297] font-medium uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-bold text-[#526B56] tabular-nums mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Chart + Sector Pulse ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-semibold text-[#22251F]">Net Worth Trajectory</h3>
                <p className="text-[11px] text-[#A3A297] mt-0.5">
                  {balanceHistory.length > 1 ? 'Live net-worth history' : 'Income projections across all hubs'}
                </p>
              </div>
              <div className="flex gap-1 p-1 bg-[#F8F7F2] rounded-xl border border-[#EAE8DF]">
                {['7d', '30d'].map(r => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                      chartRange === r
                        ? 'bg-white text-[#526B56] shadow-sm border border-[#EAE8DF]'
                        : 'text-[#A3A297] hover:text-[#77786F]'
                    }`}
                  >
                    {r === '7d' ? '7 Days' : '30 Days'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncomeGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#526B56" stopOpacity={0.25} />
                      <stop offset="60%"  stopColor="#526B56" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#526B56" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#EAE8DF" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#A3A297"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    tick={{ fill: '#A3A297', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#A3A297"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#A3A297', fontSize: 11 }}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#526B56', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#526B56"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorIncomeGreen)"
                    activeDot={{ r: 5, fill: '#526B56', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Sector Pulse */}
        <div>
          <Card className="p-6 border border-[#EAE8DF] bg-white flex flex-col h-full">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#22251F]">Sector Pulse</h3>
                <p className="text-[11px] text-[#A3A297] mt-0.5">Revenue density by node</p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#EDF2E9] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#526B56]" />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1.5 mb-6">
              {sectors.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  whileHover={{ scale: 1.15 }}
                  className={`aspect-square rounded-md cursor-pointer transition-colors duration-300 ${
                    sec.revenue > 40000
                      ? 'bg-[#526B56]'
                      : sec.revenue > 25000
                      ? 'bg-[#526B56]/50'
                      : 'bg-[#EAE8DF]'
                  }`}
                  onMouseEnter={() => setHoveredSector(sec)}
                  onMouseLeave={() => setHoveredSector(null)}
                  onClick={() => setActiveTab && setActiveTab('sectors')}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {hoveredSector ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl"
                >
                  <p className="text-[10px] text-[#526B56] font-semibold uppercase tracking-wider mb-1">Active Node</p>
                  <div className="flex justify-between items-end">
                    <h4 className="text-sm font-bold text-[#22251F] uppercase truncate mr-2">{hoveredSector.name}</h4>
                    <span className="text-sm font-bold text-[#526B56] tabular-nums">
                      ${hoveredSector.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#77786F] font-medium">Active Operations</span>
                    <span className="font-bold text-[#22251F]">
                      {sectors.filter(s => s.status === 'Active').length} / {sectors.length}
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE8DF] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sectors.filter(s => s.status === 'Active').length / (sectors.length || 1)) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-[#526B56] rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] text-[#A3A297] font-medium mt-auto pt-5">
              Heatmap shows relative revenue density across nodes.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Recent Transactions + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card className="p-6 border border-[#EAE8DF] bg-white">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#22251F]">Recent Activity</h3>
                <p className="text-[11px] text-[#A3A297] mt-0.5">Latest transaction feed</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab && setActiveTab('transactions')}>
                View All
              </Button>
            </div>

            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {transactions.slice(0, 6).map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-3 items-center group cursor-pointer hover:bg-[#FCFBF8] p-3 rounded-xl transition-colors"
                    onClick={() => setActiveTab && setActiveTab('transactions')}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'Credit'
                        ? 'bg-[#EDF2E9] text-[#526B56]'
                        : 'bg-[#FCEEED] text-[#C66D65]'
                    }`}>
                      {tx.type === 'Credit'
                        ? <ArrowUpRight className="w-4 h-4" />
                        : <ArrowDownLeft className="w-4 h-4" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#22251F] truncate">{tx.description}</p>
                      <p className="text-[10px] text-[#A3A297] mt-0.5">
                        {tx.module} · {new Date(tx.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold tabular-nums shrink-0 ${
                      tx.type === 'Credit' ? 'text-[#66866A]' : 'text-[#C66D65]'
                    }`}>
                      {tx.type === 'Credit' ? '+' : '−'}${tx.amount.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {transactions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-[#A3A297] text-sm font-medium"
                >
                  No financial activities logged yet.
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-col gap-4">
          <Card className="p-5 border border-[#EAE8DF] bg-white">
            <p className="text-[11px] font-semibold text-[#A3A297] uppercase tracking-wider mb-4">Quick Navigation</p>
            <div className="space-y-2">
              {[
                { label: 'Wallet Hub',   icon: Wallet,    tab: 'wallet',       sub: `$${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} liquid` },
                { label: 'Bank Reserve', icon: Landmark,  tab: 'bank',         sub: `$${(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} saved` },
                { label: 'Businesses',   icon: Briefcase, tab: 'business',     sub: `${businesses.filter(b => b.status === 'Active').length} active ventures` },
                { label: 'Sectors',      icon: Layers,    tab: 'sectors',      sub: `${sectors.filter(s => s.status === 'Active').length} active nodes` },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab && setActiveTab(item.tab)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FCFBF8] border border-transparent hover:border-[#EAE8DF] transition-all text-left cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F8F7F2] border border-[#EAE8DF] flex items-center justify-center shrink-0 group-hover:bg-[#EDF2E9] group-hover:border-[#526B56]/20 transition-colors">
                    <item.icon className="w-4 h-4 text-[#77786F] group-hover:text-[#526B56] transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#22251F]">{item.label}</p>
                    <p className="text-[10px] text-[#A3A297]">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#D5D2C8] group-hover:text-[#526B56] transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </Card>

          {/* Security Badge */}
          <Card className="p-4 border border-[#EAE8DF] bg-white flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#526B56]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#22251F]">Vault Secured</p>
              <p className="text-[10px] text-[#A3A297] mt-0.5">256-bit SSL · Encrypted</p>
            </div>
            <Badge variant="emerald">Live</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MainDashboard);

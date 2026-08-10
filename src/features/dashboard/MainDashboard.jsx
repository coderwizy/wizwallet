import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  BarChart3, Globe, Zap, ArrowUpRight, Clock, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Option = ({ children, value }) => <option value={value} className="bg-slate-900">{children}</option>;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border-neon-blue/30 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)] ring-1 ring-white/10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label} Snapshot</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-black text-white italic tabular-nums">
            ${payload[0].value.toLocaleString()}
          </span>
          <span className="text-[10px] font-black text-neon-blue uppercase mb-1">USD</span>
        </div>
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified by Financial Engine</p>
        </div>
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
      borderStyle: 'border-l-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      breakdown: [
        { label: 'Liquid Vault', value: `$${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        { label: 'Bank Vault',   value: `$${(bank?.balance || 0).toLocaleString(undefined,  { maximumFractionDigits: 0 })}` },
      ],
    },
    {
      label: 'Business Revenue',
      value: `$${totalBusinessIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `+${bizChangeBase}%`,
      isUp: true,
      icon: BarChart3,
      borderStyle: 'border-l-purple-500',
      badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
    },
    {
      label: 'Sector Earnings',
      value: `$${totalSectorRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `+${secChangeBase}%`,
      isUp: true,
      icon: Globe,
      borderStyle: 'border-l-teal-400',
      badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-300'
    },
    {
      label: 'System Pulse',
      value: 'OPTIMAL',
      change: '100%',
      isUp: true,
      icon: Activity,
      borderStyle: 'border-l-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
  ];

  return (
    <div className="space-y-8 max-w-400 mx-auto pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">Financial Overview</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Real-time Portfolio & Capital Metrics</p>
          {lastLoginText && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last active: {lastLoginText}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="cyan" className="py-2 px-4 shadow-[0_0_15px_rgba(0,243,255,0.15)]">
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Growth Pulse Engine Active (10s Pulse)</span>
            <span className="sm:hidden">Active</span>
          </Badge>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`border-l-4 ${stat.borderStyle} p-6`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${stat.badgeBg}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-black flex items-center gap-1 px-2.5 py-1 rounded-full ${stat.isUp ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                  {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1 tabular-nums tracking-tight">{stat.value}</h3>
              {stat.breakdown && (
                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                  {stat.breakdown.map(item => (
                    <div key={item.label} className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
                      <p className="text-xs font-black text-neon-blue tabular-nums mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart & Sector Pulse Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Area Chart */}
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest">Growth Analytics</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {balanceHistory.length > 1 ? 'Live net-worth history' : 'Income projections across all hubs'}
                </p>
              </div>
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-xs font-black uppercase tracking-widest focus:border-neon-blue outline-none cursor-pointer hover:border-white/20 transition-all text-white"
              >
                <Option value="7d">Last 7 Snapshots</Option>
                <Option value="30d">Last 30 Snapshots</Option>
              </select>
            </div>
            <div className="h-87.5 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.4}/>
                      <stop offset="40%" stopColor="#00f3ff" stopOpacity={0.1}/>
                      <stop offset="100%" stopColor="#00f3ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1a1a1c" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#334155" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#334155" 
                    fontSize={10} 
                    fontWeight="bold"
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={v => `$${(v/1000).toFixed(0)}K`} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#00f3ff', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#00f3ff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorIncome)"
                    activeDot={{ 
                      r: 6, 
                      fill: '#00f3ff', 
                      stroke: '#0a0a0c', 
                      strokeWidth: 3,
                      className: "filter drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]"
                    }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Sector Pulse Heatmap */}
        <div>
          <Card className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest">Sector Pulse</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Node Status</p>
              </div>
              <Zap className="w-5 h-5 text-neon-blue animate-pulse" />
            </div>

            <div className="grid grid-cols-6 gap-2 mb-8">
              {sectors.map((sec, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.4 }}
                  whileHover={{ scale: 1.2, zIndex: 10, boxShadow: "0 0 15px rgba(0, 243, 255, 0.8)" }}
                  className={`aspect-square rounded-xs cursor-crosshair transition-colors duration-500 ${
                    sec.revenue > 40000 ? 'bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.4)]' :
                    sec.revenue > 25000 ? 'bg-neon-blue/60' :
                    'bg-neon-blue/20'
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <p className="text-[10px] text-neon-blue font-black uppercase tracking-tighter mb-1">Active Monitoring</p>
                  <div className="flex justify-between items-end">
                    <h4 className="text-sm font-black uppercase truncate mr-2">{hoveredSector.name}</h4>
                    <span className="text-xs font-black tabular-nums">${hoveredSector.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Active Operations</span>
                    <span className="font-black">{sectors.filter(s => s.status === 'Active').length} / {sectors.length}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sectors.filter(s => s.status === 'Active').length / sectors.length) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] text-slate-500 font-bold uppercase mt-auto pt-6">
              * Heatmap displays relative revenue density across global nodes.
            </p>
          </Card>
        </div>
      </div>

      {/* Activity Stream Feed */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest">Recent Activity Stream</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Live Transaction Feed</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab && setActiveTab('transactions')}>
            View All Ledger
          </Button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {transactions.slice(0, 5).map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 items-center group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors"
                onClick={() => setActiveTab && setActiveTab('transactions')}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${tx.type === 'Credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <ArrowUpRight className={`w-5 h-5 ${tx.type === 'Debit' ? 'rotate-90' : ''}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black uppercase tracking-tight group-hover:text-neon-blue transition-colors truncate">{tx.description}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tx.module} • {new Date(tx.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className={`text-sm font-black tabular-nums ${tx.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {transactions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 opacity-30 italic font-bold uppercase tracking-[0.2em] text-xs"
            >
              No financial activities logged yet.
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(MainDashboard);

import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Zap, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, Briefcase, Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MobileDashboardView = ({ setActiveTab }) => {
  const { wallet, bank, businesses, sectors, transactions, balanceHistory } = useEmpire();
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
    if (balanceHistory.length === 0) return [{ name: 'Now', income: totalNetWorth }];
    const slice = balanceHistory.slice(-limit);
    return slice.map((entry, i) => ({
      name: i === slice.length - 1 ? 'Now' : `T-${slice.length - 1 - i}`,
      income: Math.round(entry.value),
    }));
  }, [balanceHistory, chartRange, totalNetWorth]);

  return (
    <div className="space-y-5 pb-8">
      {/* Hero Net Worth Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-[0_8px_30px_rgba(28,25,23,0.06)] text-[#1C1917]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Total Portfolio Capital</p>
            <h2 className="text-3xl font-black text-[#1C1917] tracking-tight tabular-nums mt-1">
              ${totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h2>
          </div>
          <span className={`text-xs font-black flex items-center gap-1 px-3 py-1 rounded-full ${
            isNetWorthUp ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
          }`}>
            {isNetWorthUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isNetWorthUp ? '+' : ''}{netWorthChange}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5DFD1]">
          <div 
            onClick={() => setActiveTab('wallet')}
            className="p-3 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5] cursor-pointer hover:bg-[#F4EFE6] transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="text-[9px] font-black text-[#78716C] uppercase tracking-wider">Liquid Vault</span>
            </div>
            <p className="text-sm font-black text-[#0284C7] tabular-nums">
              ${(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('bank')}
            className="p-3 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5] cursor-pointer hover:bg-[#F4EFE6] transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Landmark className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="text-[9px] font-black text-[#78716C] uppercase tracking-wider">Bank Reserve</span>
            </div>
            <p className="text-sm font-black text-[#0284C7] tabular-nums">
              ${(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Yield Stats */}
      <div className="grid grid-cols-2 gap-3.5">
        <div 
          onClick={() => setActiveTab('business')}
          className="bg-white p-4 rounded-2xl border border-[#E5DFD1] shadow-xs cursor-pointer hover:border-[#D6CDB8] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-[#78716C] uppercase tracking-wider">Ventures</span>
          </div>
          <p className="text-lg font-black text-[#1C1917] tabular-nums">
            ${totalBusinessIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[9px] text-emerald-600 font-bold uppercase mt-1">Monthly Yield</p>
        </div>

        <div 
          onClick={() => setActiveTab('sectors')}
          className="bg-white p-4 rounded-2xl border border-[#E5DFD1] shadow-xs cursor-pointer hover:border-[#D6CDB8] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-[#78716C] uppercase tracking-wider">Sectors</span>
          </div>
          <p className="text-lg font-black text-[#1C1917] tabular-nums">
            ${totalSectorRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[9px] text-amber-600 font-bold uppercase mt-1">30 Active Domains</p>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Portfolio Trajectory</h3>
            <p className="text-[9px] font-bold text-[#78716C] uppercase">Capital Snapshot</p>
          </div>
          <div className="flex gap-1 bg-[#F4EFE6] p-1 rounded-xl border border-[#E2DAC8]">
            <button
              onClick={() => setChartRange('7d')}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                chartRange === '7d' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#78716C]'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartRange('30d')}
              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                chartRange === '30d' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#78716C]'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mobileCreamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#A8A29E" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#A8A29E" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip
                formatter={v => [`$${v.toLocaleString()}`, 'Portfolio']}
                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DFD1', borderRadius: '12px', color: '#1C1917', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="income" stroke="#0284C7" strokeWidth={2.5} fillOpacity={1} fill="url(#mobileCreamGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Recent Activity</h3>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className="text-[10px] font-black text-[#0284C7] uppercase hover:underline"
          >
            View Ledger →
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 4).map(tx => {
            const isCredit = tx.type === 'Credit';
            return (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCredit ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#1C1917] uppercase truncate">{tx.description}</p>
                    <p className="text-[9px] font-bold text-[#78716C] uppercase">{tx.module} • {new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-black tabular-nums shrink-0 ml-2 ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isCredit ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileDashboardView);

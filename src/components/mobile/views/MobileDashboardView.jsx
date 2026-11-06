import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  Zap, ArrowUpRight, ArrowDownLeft, Wallet, Landmark, Briefcase, Layers,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileDashboardView = ({ setActiveTab }) => {
  const { wallet, bank, businesses, sectors, transactions, balanceHistory, user, currencySymbol } = useEmpire();
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
    <div className="space-y-4 pb-8">
      {/* ── Hero Net Worth Card ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">
              Total Portfolio Capital
            </p>
            <h2 className="text-3xl font-extrabold text-[#22251F] tracking-tight tabular-nums mt-0.5">
              {currencySymbol}{totalNetWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h2>
          </div>
          <Badge variant={isNetWorthUp ? 'success' : 'danger'}>
            {isNetWorthUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isNetWorthUp ? '+' : ''}{netWorthChange}%</span>
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-[#EAE8DF]">
          <div
            onClick={() => setActiveTab('wallet')}
            className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] cursor-pointer hover:border-[#526B56]/30 transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-[#526B56]" />
              <span className="text-[10px] font-semibold text-[#77786F] uppercase">Liquid Vault</span>
            </div>
            <p className="text-sm font-bold text-[#22251F] tabular-nums">
              {currencySymbol}{(wallet?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div
            onClick={() => setActiveTab('bank')}
            className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] cursor-pointer hover:border-[#526B56]/30 transition-all"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Landmark className="w-3.5 h-3.5 text-[#526B56]" />
              <span className="text-[10px] font-semibold text-[#77786F] uppercase">Bank Reserve</span>
            </div>
            <p className="text-sm font-bold text-[#22251F] tabular-nums">
              {currencySymbol}{(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </Card>

      {/* ── 2-Column Yield Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card
          onClick={() => setActiveTab('business')}
          className="p-4 border border-[#EAE8DF] bg-white cursor-pointer hover:border-[#D5D2C8] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#F3EEF8] text-[#7C5ABF] border border-[#DECDEE]">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-semibold text-[#77786F] uppercase">Ventures</span>
          </div>
          <p className="text-base font-bold text-[#22251F] tabular-nums">
            {currencySymbol}{totalBusinessIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[#66866A] font-semibold mt-0.5">Monthly Yield</p>
        </Card>

        <Card
          onClick={() => setActiveTab('sectors')}
          className="p-4 border border-[#EAE8DF] bg-white cursor-pointer hover:border-[#D5D2C8] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#FDF3E3] text-[#C18A48] border border-[#E8D5B0]">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-semibold text-[#77786F] uppercase">Sectors</span>
          </div>
          <p className="text-base font-bold text-[#22251F] tabular-nums">
            {currencySymbol}{totalSectorRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[#C18A48] font-semibold mt-0.5">30 Active Domains</p>
        </Card>
      </div>

      {/* ── Portfolio Trajectory Chart ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-[#22251F]">Portfolio Trajectory</h3>
            <p className="text-[10px] text-[#A3A297]">Net worth progression</p>
          </div>
          <div className="flex gap-1 bg-[#F8F7F2] p-1 rounded-xl border border-[#EAE8DF]">
            {['7d', '30d'].map(r => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase transition-all cursor-pointer ${
                  chartRange === r
                    ? 'bg-white text-[#526B56] shadow-2xs font-bold'
                    : 'text-[#A3A297]'
                }`}
              >
                {r === '7d' ? '7D' : '30D'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="mobGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#526B56" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#526B56" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#A3A297" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#A3A297"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#EAE8DF',
                  borderRadius: 10,
                  fontSize: 11,
                  padding: '6px 10px'
                }}
                formatter={v => [`${currencySymbol}${Number(v).toLocaleString()}`, 'Net Worth']}
              />
              <Area type="monotone" dataKey="income" stroke="#526B56" strokeWidth={2} fill="url(#mobGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Recent Activity ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#22251F]">Recent Activity</h3>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-[10px] font-semibold text-[#526B56] hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 4).map(tx => (
            <div
              key={tx.id}
              onClick={() => setActiveTab('transactions')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCFBF8] border border-[#EAE8DF] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'Credit' ? 'bg-[#EDF2E9] text-[#66866A]' : 'bg-[#FCEEED] text-[#C66D65]'
                }`}>
                  {tx.type === 'Credit' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#22251F] truncate">{tx.description}</p>
                  <p className="text-[9px] text-[#A3A297]">{tx.module} · {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <span className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${
                tx.type === 'Credit' ? 'text-[#66866A]' : 'text-[#C66D65]'
              }`}>
                {tx.type === 'Credit' ? '+' : '−'}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(MobileDashboardView);

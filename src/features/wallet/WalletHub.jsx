import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Wallet, ArrowUpRight, ArrowDownRight,
  ArrowLeftRight, AlertCircle, TrendingUp, TrendingDown,
  Zap, Shield, BarChart3, Plus, ChevronRight, Briefcase,
  Car, Building2, Factory, Gem, Clock, Eye, EyeOff, Layers,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

// --- Animated Count-Up Hook ---
const useCountUp = (target, duration = 1000) => {
  const [display, setDisplay] = useState(0);
  const prevTarget = useRef(target);
  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(tick);
      else prevTarget.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return display;
};

const GROWTH_TIERS = [
  { id: 'Slow',        label: 'Stable',      mult: '1×',   color: 'text-slate-400',  bar: 'bg-slate-600' },
  { id: 'Founder',     label: 'Founder',     mult: '5×',   color: 'text-blue-400',   bar: 'bg-blue-500' },
  { id: 'CEO',         label: 'CEO',         mult: '10×',  color: 'text-violet-400', bar: 'bg-violet-500' },
  { id: 'Tycoon',      label: 'Tycoon',      mult: '50×',  color: 'text-amber-400',  bar: 'bg-amber-500' },
  { id: 'Billionaire', label: 'Billionaire', mult: '100×', color: 'text-neon-blue',  bar: 'bg-neon-blue' },
];

const GROWTH_MULTIPLIERS = { Slow: 1, Founder: 5, CEO: 10, Tycoon: 50, Billionaire: 100 };

const WalletHub = ({ setActiveTab }) => {
  const {
    wallet, setWallet, addTransaction, transferFunds,
    transactions, businesses, sectors, config,
  } = useEmpire();

  const [showPayModal,      setShowPayModal]      = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [payData,           setPayData]           = useState({ recipient: '', amount: '', purpose: '' });
  const [payError,          setPayError]          = useState('');
  const [transferDir,       setTransferDir]       = useState('wallet-to-bank');
  const [transferAmount,    setTransferAmount]    = useState('');
  const [transferError,     setTransferError]     = useState('');
  const [isEditing,         setIsEditing]         = useState(false);
  const [editValue,         setEditValue]         = useState(wallet.balance);
  const [balanceHidden,     setBalanceHidden]     = useState(false);

  // ── Dividend Toast ──
  const [toastVisible, setToastVisible] = useState(false);
  const [toastAmount,  setToastAmount]  = useState(0);
  const prevDividendRef = useRef(wallet.lastDividend || 0);

  useEffect(() => {
    const incoming = wallet.lastDividend || 0;
    if (incoming > 0 && incoming !== prevDividendRef.current) {
      setToastAmount(incoming);
      setToastVisible(true);
      prevDividendRef.current = incoming;
      const t = setTimeout(() => setToastVisible(false), 3500);
      return () => clearTimeout(t);
    }
  }, [wallet.lastDividend]);

  const animatedBalance = useCountUp(wallet.balance);

  // ── Derived Stats ──
  const activeBizCount    = useMemo(() => businesses.filter(b => b.status === 'Active').length, [businesses]);
  const activeSectorCount = useMemo(() => sectors.filter(s => s.status === 'Active').length, [sectors]);
  const transportCount    = useMemo(() => businesses.filter(b => b.status === 'Active' && ['transport', 'tata-deal'].includes(b.id)).length, [businesses]);
  const topSectorCount    = useMemo(() => sectors.filter(s => s.status === 'Active' && s.revenue > 35000).length, [sectors]);

  const estimatedDividend = useMemo(() => {
    const bizIncome  = businesses.filter(b => b.status === 'Active').reduce((s, b)   => s + (b.income   || 0), 0);
    const secRevenue = sectors.filter(s => s.status === 'Active').reduce((s, sec) => s + (sec.revenue || 0), 0);
    const mult = GROWTH_MULTIPLIERS[wallet.growthRate] || 1;
    return Math.floor((bizIncome + secRevenue) * 0.001 * mult);
  }, [businesses, sectors, wallet.growthRate]);

  const pulseSeconds = (config?.simulationSpeed || 10000) / 1000;

  // ── Category definitions ──
  const CATEGORIES = useMemo(() => [
    { id: 'business',     label: 'Business',    icon: Briefcase, cls: 'bg-sky-500/15 border-sky-500/30 text-sky-300',          count: activeBizCount,                       unit: 'ventures',  tab: 'business' },
    { id: 'transport',    label: 'Transport',   icon: Car,       cls: 'bg-violet-500/15 border-violet-500/30 text-violet-300',  count: transportCount,                       unit: 'nodes',     tab: 'business' },
    { id: 'subsidiaries', label: 'Subsidiaries',icon: Building2, cls: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',        count: activeSectorCount,                    unit: 'sectors',   tab: 'sectors'  },
    { id: 'concessions',  label: 'Concessions', icon: Factory,   cls: 'bg-rose-500/15 border-rose-500/30 text-rose-300',        count: topSectorCount,                       unit: 'top nodes', tab: 'sectors'  },
    { id: 'resources',    label: 'Resources',   icon: Gem,       cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',count: Math.ceil(activeSectorCount / 3),    unit: 'active',    tab: 'sectors'  },
  ], [activeBizCount, transportCount, activeSectorCount, topSectorCount]);

  const recentTx = useMemo(() =>
    transactions.filter(tx => tx.module === 'Wallet').slice(0, 5),
  [transactions]);

  const activeGrowthTier = GROWTH_TIERS.find(t => t.id === wallet.growthRate) || GROWTH_TIERS[0];

  const handleBalanceBlur = (val) => {
    const diff = val - wallet.balance;
    if (Math.abs(diff) > 0.01) {
      addTransaction('Wallet', diff > 0 ? 'Credit' : 'Debit', Math.abs(diff), 'Manual Balance Adjustment');
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setPayError('');
    const amt = parseFloat(payData.amount);
    if (isNaN(amt) || amt <= 0) { setPayError('Enter a valid positive amount.'); return; }
    if (wallet.balance < amt) { setPayError(`Insufficient funds — balance is $${wallet.balance.toLocaleString()}`); return; }
    setWallet(prev => ({ ...prev, balance: prev.balance - amt }));
    addTransaction('Wallet', 'Debit', amt, `Payment to ${payData.recipient}: ${payData.purpose}`);
    setShowPayModal(false);
    setPayData({ recipient: '', amount: '', purpose: '' });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    setTransferError('');
    const from = transferDir === 'wallet-to-bank' ? 'wallet' : 'bank';
    const result = transferFunds(from, from === 'wallet' ? 'bank' : 'wallet', transferAmount);
    if (!result.success) { setTransferError(result.error); return; }
    setShowTransferModal(false);
    setTransferAmount('');
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Smart Wallet</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Liquidity Hub</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={ArrowLeftRight}
            onClick={() => { setShowTransferModal(true); setTransferError(''); }}
          >
            Transfer
          </Button>
          <Button
            variant="primary"
            icon={Send}
            onClick={() => { setShowPayModal(true); setPayError(''); }}
          >
            Send Payment
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* HERO BALANCE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7"
        >
          <Card variant="accent" className="relative overflow-hidden rounded-2xl p-7 md:p-9 flex flex-col justify-between min-h-64">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-600/10 rounded-full blur-[70px] pointer-events-none" />

            {/* Top Row */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">Liquid Capital</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">USD Vault Account</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBalanceHidden(h => !h)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                  title={balanceHidden ? 'Reveal balance' : 'Hide balance'}
                >
                  {balanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Badge variant="emerald">Active</Badge>
              </div>
            </div>

            {/* Balance Display / Edit */}
            <div className="relative z-10 mt-6">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-4xl md:text-5xl font-black text-white/60">$</span>
                  <input
                    autoFocus
                    type="number"
                    value={editValue}
                    onChange={e => setEditValue(parseFloat(e.target.value) || 0)}
                    onBlur={() => {
                      handleBalanceBlur(editValue);
                      setWallet(prev => ({ ...prev, balance: editValue }));
                      setIsEditing(false);
                    }}
                    className="bg-transparent text-4xl md:text-5xl font-black tracking-tight outline-none border-b-2 border-neon-blue text-white w-full max-w-xs"
                  />
                </div>
              ) : (
                <h1
                  onClick={() => { setEditValue(wallet.balance); setIsEditing(true); }}
                  title="Click to edit balance"
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white cursor-text select-none"
                >
                  {balanceHidden
                    ? <span className="tracking-wider text-3xl text-slate-400">●●●●●●●</span>
                    : <><span className="text-white/50 mr-1">$</span>{animatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                  }
                </h1>
              )}
              <p className="text-xs text-cyan-400/60 mt-2 font-medium">Tap balance to calibrate manually</p>
            </div>

            {/* Stats Footer Row */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Inflow</p>
                  <p className="text-xs font-black text-emerald-400">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Outflow</p>
                  <p className="text-xs font-black text-rose-400">Monitored</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Multiplier</p>
                  <p className={`text-xs font-black ${activeGrowthTier.color}`}>{activeGrowthTier.mult}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Send',     icon: Send,           action: () => { setShowPayModal(true); setPayError(''); },                  color: 'from-cyan-600/20 to-teal-700/20 border-cyan-500/25 text-cyan-300' },
                  { label: 'Transfer', icon: ArrowLeftRight, action: () => { setShowTransferModal(true); setTransferError(''); },         color: 'from-violet-600/20 to-indigo-700/20 border-violet-500/25 text-violet-300' },
                  { label: 'Ledger',   icon: BarChart3,      action: () => setActiveTab && setActiveTab('transactions'),                  color: 'from-emerald-600/20 to-teal-700/20 border-emerald-500/25 text-emerald-300' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-linear-to-br border ${item.color} hover:scale-105 transition-all font-bold cursor-pointer`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider font-black">{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Security Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <Card className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/25 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-neon-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-wider">Vault Security</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">256-Bit SSL · Encrypted Protocol</p>
              </div>
              <Badge variant="emerald">Secure</Badge>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* LIVE STATS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Active Businesses', value: activeBizCount,                             icon: Briefcase, color: 'text-blue-400' },
          { label: 'Active Sectors',    value: activeSectorCount,                           icon: Layers,    color: 'text-cyan-400' },
          { label: 'Dividend / Pulse',  value: `+$${estimatedDividend.toLocaleString()}`,   icon: Zap,       color: 'text-emerald-400' },
          { label: 'Pulse Interval',    value: `${pulseSeconds}s`,                          icon: Clock,     color: 'text-violet-400' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 truncate">{stat.label}</p>
              <p className={`text-base font-black tabular-nums ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Growth Engine + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Growth Tier Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="lg:col-span-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Growth Engine</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Dividend multiplier per pulse</p>
              </div>
              <Badge variant="cyan">{activeGrowthTier.mult} mult</Badge>
            </div>
            <div className="space-y-2.5">
              {GROWTH_TIERS.map((tier, idx) => {
                const isActive = wallet.growthRate === tier.id;
                const barWidths = ['20%', '40%', '60%', '80%', '100%'];
                return (
                  <button
                    key={tier.id}
                    onClick={() => setWallet(prev => ({ ...prev, growthRate: tier.id }))}
                    className={`w-full p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                      isActive
                        ? 'border-neon-blue/40 bg-neon-blue/10 shadow-[0_0_20px_rgba(0,243,255,0.12)]'
                        : 'border-white/8 hover:border-neon-cyan/20 hover:bg-neon-cyan/5'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? tier.bar : 'bg-slate-600'}`} />
                    <span className={`font-black text-xs uppercase tracking-wider flex-1 ${isActive ? tier.color : 'text-slate-400'}`}>
                      {tier.label}
                    </span>
                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${tier.bar}`}
                        style={{ width: isActive ? barWidths[idx] : '0%' }}
                      />
                    </div>
                    <span className={`text-[10px] font-black min-w-8 text-right ${isActive ? tier.color : 'text-slate-600'}`}>{tier.mult}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="lg:col-span-7">
          <Card className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction History</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Wallet activity stream</p>
              </div>
              <Button size="sm" variant="outline" icon={BarChart3} onClick={() => setActiveTab && setActiveTab('transactions')}>
                View All
              </Button>
            </div>

            {recentTx.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 opacity-50">
                <Clock className="w-8 h-8 text-slate-500" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No wallet transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1">
                <AnimatePresence initial={false}>
                  {recentTx.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-neon-cyan/5 border border-transparent hover:border-neon-cyan/10 transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                        tx.type === 'Credit'
                          ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                          : 'bg-rose-500/15 border-rose-500/25 text-rose-400'
                      }`}>
                        {tx.type === 'Credit'
                          ? <ArrowUpRight className="w-4 h-4" />
                          : <ArrowDownRight className="w-4 h-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{tx.description}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {new Date(tx.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-black tabular-nums ${tx.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'Credit' ? '+' : '−'}${tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">{tx.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Asset Categories */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Categories</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Capital deployment channels — click to navigate</p>
          </div>
          <Button size="sm" variant="ghost" icon={Plus} onClick={() => setActiveTab && setActiveTab('business')}>
            Add Venture
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => setActiveTab && setActiveTab(cat.tab)}
              className="w-full text-left cursor-pointer"
            >
              <Card className="p-5 flex flex-col items-center text-center group hover:border-neon-blue/35">
                <div className={`p-3.5 rounded-2xl border ${cat.cls} mb-3 transition-transform duration-200 group-hover:scale-110`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 leading-tight">{cat.label}</h4>
                <p className="text-xl font-black text-white mt-1.5 tabular-nums leading-none">{cat.count}</p>
                <p className="text-[10px] font-bold mt-0.5 text-slate-500 uppercase tracking-wider">{cat.unit}</p>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 mt-2.5 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* PAY MODAL */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Send Payment"
        subtitle="Secure Transfer Protocol"
      >
        {payError && (
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {payError}
          </div>
        )}

        <form onSubmit={handlePay} className="space-y-4">
          <Input
            label="Recipient Address"
            required
            value={payData.recipient}
            onChange={e => setPayData({ ...payData, recipient: e.target.value })}
            placeholder="@handle or account ID"
          />
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">$</span>
              <input
                type="number"
                required
                value={payData.amount}
                onChange={e => { setPayData({ ...payData, amount: e.target.value }); setPayError(''); }}
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 outline-none focus:border-neon-blue focus:bg-white/5 transition-all font-black text-2xl"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
              Available: <span className="text-cyan-400/80 font-black">${wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Purpose / Note</label>
            <textarea
              value={payData.purpose}
              onChange={e => setPayData({ ...payData, purpose: e.target.value })}
              placeholder="Describe transaction purpose..."
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 outline-none focus:border-neon-blue focus:bg-white/5 transition-all resize-none text-sm font-medium"
            />
          </div>
          <Button type="submit" variant="primary" icon={Send} className="w-full py-3.5 text-sm mt-2">
            Confirm & Send
          </Button>
        </form>
      </Modal>

      {/* TRANSFER MODAL */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Fund Transfer"
        subtitle="Internal Capital Movement"
      >
        {transferError && (
          <div className="flex items-center gap-3 mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {transferError}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-white/5 rounded-xl">
            {[
              { val: 'wallet-to-bank', label: '💳 → 🏦', sub: 'Wallet to Bank' },
              { val: 'bank-to-wallet', label: '🏦 → 💳', sub: 'Bank to Wallet' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => { setTransferDir(opt.val); setTransferError(''); }}
                className={`py-3 rounded-lg transition-all font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer ${
                  transferDir === opt.val
                    ? 'bg-neon-blue text-[#021417] font-black shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{opt.label}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-80">{opt.sub}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-black/40 rounded-xl border border-white/10">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="text-lg font-black text-neon-blue tabular-nums">${wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Bank Account</p>
              <p className="text-lg font-black text-violet-400">Protected</p>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Transfer Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">$</span>
              <input
                type="number"
                required
                value={transferAmount}
                onChange={e => { setTransferAmount(e.target.value); setTransferError(''); }}
                placeholder="0.00"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 outline-none focus:border-neon-blue focus:bg-white/5 transition-all font-black text-2xl"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" icon={ArrowLeftRight} className="w-full py-3.5 text-sm">
            Execute Transfer
          </Button>
        </form>
      </Modal>

      {/* DIVIDEND PULSE TOAST */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-xl bg-white max-lg:border-[#E5DFD1] max-lg:shadow-lg max-lg:text-[#1C1917] lg:bg-[#041a1e]/95 lg:border-emerald-500/30 lg:text-white"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 lg:bg-emerald-500/20 lg:border-emerald-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-600 lg:text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-700 lg:text-emerald-400/80 uppercase tracking-widest">Growth Pulse</p>
              <p className="text-sm font-black text-emerald-700 lg:text-emerald-300">+${toastAmount.toLocaleString()} dividend received</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(WalletHub);

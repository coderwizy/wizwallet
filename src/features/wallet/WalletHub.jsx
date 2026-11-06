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

// ── Animated Count-Up Hook ──
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
  { id: 'Slow', label: 'Stable', mult: '1×', desc: 'Conservative yield' },
  { id: 'Founder', label: 'Founder', mult: '5×', desc: 'Steady compounding' },
  { id: 'CEO', label: 'CEO', mult: '10×', desc: 'Accelerated growth' },
  { id: 'Tycoon', label: 'Tycoon', mult: '50×', desc: 'High-velocity gains' },
  { id: 'Billionaire', label: 'Billionaire', mult: '100×', desc: 'Maximum multiplier' },
];

const GROWTH_MULTIPLIERS = { Slow: 1, Founder: 5, CEO: 10, Tycoon: 50, Billionaire: 100 };

const WalletHub = ({ setActiveTab }) => {
  const { wallet, setWallet, addTransaction, transferFunds,
    transactions, businesses, sectors, config, currencySymbol } = useEmpire();

  const [showPayModal, setShowPayModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [payData, setPayData] = useState({ recipient: '', amount: '', purpose: '' });
  const [payError, setPayError] = useState('');
  const [transferDir, setTransferDir] = useState('wallet-to-bank');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferError, setTransferError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(wallet.balance);
  const [balanceHidden, setBalanceHidden] = useState(false);

  // ── Dividend Toast ──
  const [toastVisible, setToastVisible] = useState(false);
  const [toastAmount, setToastAmount] = useState(0);
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
  const activeBizCount = useMemo(() => businesses.filter(b => b.status === 'Active').length, [businesses]);
  const activeSectorCount = useMemo(() => sectors.filter(s => s.status === 'Active').length, [sectors]);
  const transportCount = useMemo(() => businesses.filter(b => b.status === 'Active' && ['transport', 'tata-deal'].includes(b.id)).length, [businesses]);
  const topSectorCount = useMemo(() => sectors.filter(s => s.status === 'Active' && s.revenue > 35000).length, [sectors]);

  const estimatedDividend = useMemo(() => {
    const bizIncome = businesses.filter(b => b.status === 'Active').reduce((s, b) => s + (b.income || 0), 0);
    const secRevenue = sectors.filter(s => s.status === 'Active').reduce((s, sec) => s + (sec.revenue || 0), 0);
    const mult = GROWTH_MULTIPLIERS[wallet.growthRate] || 1;
    return Math.floor((bizIncome + secRevenue) * 0.001 * mult);
  }, [businesses, sectors, wallet.growthRate]);

  const pulseSeconds = (config?.simulationSpeed || 10000) / 1000;

  // ── Category definitions ──
  const CATEGORIES = useMemo(() => [
    { id: 'business', label: 'Business', icon: Briefcase, iconBg: 'bg-ww-green-bg text-ww-accent', count: activeBizCount, unit: 'ventures', tab: 'business' },
    { id: 'transport', label: 'Transport', icon: Car, iconBg: 'bg-ww-violet-bg text-purple-600', count: transportCount, unit: 'nodes', tab: 'business' },
    { id: 'subsidiaries', label: 'Subsidiaries', icon: Building2, iconBg: 'bg-ww-blue-bg text-blue-600', count: activeSectorCount, unit: 'sectors', tab: 'sectors' },
    { id: 'concessions', label: 'Concessions', icon: Factory, iconBg: 'bg-ww-warning-bg text-ww-warning', count: topSectorCount, unit: 'top nodes', tab: 'sectors' },
    { id: 'resources', label: 'Resources', icon: Gem, iconBg: 'bg-ww-danger-bg text-ww-danger', count: Math.ceil(activeSectorCount / 3), unit: 'active', tab: 'sectors' },
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
    if (wallet.balance < amt) { setPayError(`Insufficient funds — balance is ${currencySymbol}${wallet.balance.toLocaleString()}`); return; }
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

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ww-text-muted mb-1">Smart Wallet</p>
          <h2 className="text-2xl md:text-3xl font-bold text-ww-text tracking-tight">Liquidity Hub</h2>
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

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* HERO BALANCE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7"
        >
          <Card className="relative overflow-hidden p-7 md:p-9 flex flex-col justify-between min-h-64 border border-ww-border bg-white">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-ww-accent/40 to-transparent" />

            {/* Header row */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-widest">Liquid Capital</p>
                <p className="text-[10px] text-ww-text-muted mt-0.5">Smart Wallet · USD Vault</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBalanceHidden(h => !h)}
                  className="p-1.5 rounded-lg text-ww-text-muted hover:text-ww-text hover:bg-ww-bg transition-all cursor-pointer"
                  title={balanceHidden ? 'Reveal balance' : 'Hide balance'}
                >
                  {balanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Badge variant="emerald">Active</Badge>
              </div>
            </div>

            {/* Balance Display / Edit */}
            <div className="mt-6">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-ww-text-muted">{currencySymbol}</span>
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
                    className="bg-transparent text-4xl md:text-5xl font-bold tracking-tight outline-none border-b-2 border-ww-accent text-ww-text w-full max-w-xs"
                  />
                </div>
              ) : (
                <h1
                  onClick={() => { setEditValue(wallet.balance); setIsEditing(true); }}
                  title="Click to edit balance"
                  className="text-4xl md:text-5xl font-bold tracking-tight text-ww-text cursor-text select-none tabular-nums"
                >
                  {balanceHidden
                    ? <span className="tracking-widest text-ww-border-strong">••••••••</span>
                    : <><span className="text-ww-text-muted text-3xl mr-1">{currencySymbol}</span>{animatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                  }
                </h1>
              )}
              <p className="text-[10px] text-ww-text-muted mt-2">Click balance to calibrate manually</p>
            </div>

            {/* Stats Footer Row */}
            <div className="mt-6 pt-5 border-t border-ww-border flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-ww-green-bg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-ww-success" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-semibold text-ww-text-muted tracking-widest">Inflow</p>
                  <p className="text-xs font-semibold text-ww-success">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-ww-danger-bg flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-ww-danger" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-semibold text-ww-text-muted tracking-widest">Outflow</p>
                  <p className="text-xs font-semibold text-ww-danger">Monitored</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-7 h-7 rounded-lg bg-ww-green-bg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-ww-accent" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-semibold text-ww-text-muted tracking-widest">Multiplier</p>
                  <p className="text-xs font-semibold text-ww-accent">{activeGrowthTier.mult}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Card className="p-5 border border-ww-border bg-white">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted mb-4">Quick Actions</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Send', icon: Send, action: () => { setShowPayModal(true); setPayError(''); }, bg: 'bg-ww-green-bg text-ww-accent hover:bg-ww-accent/20' },
                  { label: 'Transfer', icon: ArrowLeftRight, action: () => { setShowTransferModal(true); setTransferError(''); }, bg: 'bg-ww-violet-bg text-purple-600 hover:bg-purple-100' },
                  { label: 'Ledger', icon: BarChart3, action: () => setActiveTab && setActiveTab('transactions'), bg: 'bg-ww-warning-bg text-ww-warning hover:bg-ww-warning/20' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${item.bg} transition-all hover:scale-105 font-medium cursor-pointer border border-ww-border`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Security Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <Card className="p-5 border border-ww-border bg-white flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-ww-green-bg flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-ww-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ww-text">Vault Security</p>
                <p className="text-[10px] text-ww-text-muted font-medium mt-0.5">256-Bit SSL · Encrypted Protocol</p>
              </div>
              <Badge variant="emerald">Secure</Badge>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── Live Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Active Businesses', value: activeBizCount, icon: Briefcase, color: 'text-ww-accent', bg: 'bg-ww-green-bg' },
          { label: 'Active Sectors', value: activeSectorCount, icon: Layers, color: 'text-blue-600', bg: 'bg-ww-blue-bg' },
          { label: 'Dividend / Pulse', value: `+${currencySymbol}${estimatedDividend.toLocaleString()}`, icon: Zap, color: 'text-ww-success', bg: 'bg-ww-green-bg' },
          { label: 'Pulse Interval', value: `${pulseSeconds}s`, icon: Clock, color: 'text-ww-warning', bg: 'bg-ww-warning-bg' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border border-ww-border bg-white flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-ww-text-muted truncate">{stat.label}</p>
              <p className={`text-base font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* ── Growth Engine + Recent Transactions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Growth Tier Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="lg:col-span-5">
          <Card className="p-6 border border-ww-border bg-white">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Growth Engine</p>
                <p className="text-xs text-ww-text-secondary mt-0.5">Dividend multiplier per pulse</p>
              </div>
              <Badge variant="emerald">{activeGrowthTier.mult} mult</Badge>
            </div>
            <div className="space-y-2">
              {GROWTH_TIERS.map((tier, idx) => {
                const isActive = wallet.growthRate === tier.id;
                const barWidths = ['20%', '40%', '60%', '80%', '100%'];
                return (
                  <button
                    key={tier.id}
                    onClick={() => setWallet(prev => ({ ...prev, growthRate: tier.id }))}
                    className={`w-full p-3.5 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${isActive
                        ? 'border-ww-accent/40 bg-ww-green-bg'
                        : 'border-ww-border hover:border-ww-border-strong hover:bg-ww-elevated'
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-ww-accent' : 'bg-ww-border-strong'}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-xs uppercase tracking-wider ${isActive ? 'text-ww-accent' : 'text-ww-text-secondary'}`}>
                        {tier.label}
                      </span>
                      <p className={`text-[9px] mt-0.5 ${isActive ? 'text-ww-accent/70' : 'text-ww-text-muted'}`}>{tier.desc}</p>
                    </div>
                    <div className="w-16 h-1.5 bg-ww-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isActive ? 'bg-ww-accent' : 'bg-transparent'}`}
                        style={{ width: isActive ? barWidths[idx] : '0%' }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold min-w-8 text-right ${isActive ? 'text-ww-accent' : 'text-ww-text-muted'}`}>
                      {tier.mult}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="lg:col-span-7">
          <Card className="p-6 border border-ww-border bg-white flex flex-col h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Transaction History</p>
                <p className="text-xs text-ww-text-secondary mt-0.5">Wallet activity stream</p>
              </div>
              <Button size="sm" variant="outline" icon={BarChart3} onClick={() => setActiveTab && setActiveTab('transactions')}>
                View All
              </Button>
            </div>

            {recentTx.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
                <Clock className="w-8 h-8 text-ww-border-strong" />
                <p className="text-xs font-medium text-ww-text-muted">No wallet transactions yet</p>
              </div>
            ) : (
              <div className="space-y-1 flex-1">
                <AnimatePresence initial={false}>
                  {recentTx.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-ww-elevated border border-transparent hover:border-ww-border transition-all"
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'Credit'
                          ? 'bg-ww-green-bg text-ww-accent'
                          : 'bg-ww-danger-bg text-ww-danger'
                        }`}>
                        {tx.type === 'Credit'
                          ? <ArrowUpRight className="w-4 h-4" />
                          : <ArrowDownRight className="w-4 h-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ww-text truncate">{tx.description}</p>
                        <p className="text-[10px] text-ww-text-muted mt-0.5">
                          {new Date(tx.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold tabular-nums ${tx.type === 'Credit' ? 'text-ww-success' : 'text-ww-danger'}`}>
                          {tx.type === 'Credit' ? '+' : '−'}{currencySymbol}{tx.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-ww-text-muted font-medium uppercase mt-0.5">{tx.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Asset Categories ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Asset Categories</p>
            <p className="text-xs text-ww-text-secondary mt-0.5">Capital deployment channels — click to navigate</p>
          </div>
          <Button size="sm" variant="ghost" icon={Plus} onClick={() => setActiveTab && setActiveTab('business')}>
            Add Venture
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => setActiveTab && setActiveTab(cat.tab)}
              className="w-full text-left cursor-pointer"
            >
              <Card className="p-5 flex flex-col items-center text-center border border-ww-border bg-white hover:border-ww-accent/30 hover:bg-ww-elevated transition-all group">
                <div className={`p-3.5 rounded-2xl ${cat.iconBg} mb-3 transition-transform duration-200 group-hover:scale-110`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-ww-text leading-tight">{cat.label}</h4>
                <p className="text-xl font-bold text-ww-text mt-1.5 tabular-nums leading-none">{cat.count}</p>
                <p className="text-[10px] font-medium mt-0.5 text-ww-text-muted uppercase tracking-wide">{cat.unit}</p>
                <ChevronRight className="w-3.5 h-3.5 text-ww-border-strong mt-2.5 group-hover:text-ww-accent group-hover:translate-x-1 transition-all" />
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── PAY MODAL ── */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Send Payment"
        subtitle="Secure Transfer Protocol"
      >
        {payError && (
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-ww-danger-bg border border-ww-danger/30 rounded-xl text-ww-danger text-xs font-medium">
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
            <label className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-widest mb-2 block">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-ww-text-muted">{currencySymbol}</span>
              <input
                type="number"
                required
                value={payData.amount}
                onChange={e => { setPayData({ ...payData, amount: e.target.value }); setPayError(''); }}
                placeholder="0.00"
                className="w-full bg-ww-bg border border-ww-border rounded-xl py-3.5 pl-10 pr-4 text-ww-text placeholder-ww-text-muted outline-none focus:border-ww-accent focus:bg-white transition-all font-bold text-xl"
              />
            </div>
            <p className="text-[10px] text-ww-text-muted mt-1.5">
              Available: <span className="text-ww-accent font-semibold">{currencySymbol}{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-widest mb-2 block">Purpose / Note</label>
            <textarea
              value={payData.purpose}
              onChange={e => setPayData({ ...payData, purpose: e.target.value })}
              placeholder="Describe transaction purpose..."
              rows={3}
              className="w-full bg-ww-bg border border-ww-border rounded-xl py-3 px-4 text-ww-text placeholder-ww-text-muted outline-none focus:border-ww-accent focus:bg-white transition-all resize-none text-sm"
            />
          </div>
          <Button type="submit" variant="primary" icon={Send} className="w-full py-3.5 text-sm mt-2">
            Confirm & Send
          </Button>
        </form>
      </Modal>

      {/* ── TRANSFER MODAL ── */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Fund Transfer"
        subtitle="Internal Capital Movement"
      >
        {transferError && (
          <div className="flex items-center gap-3 mb-4 p-3.5 bg-ww-danger-bg border border-ww-danger/30 rounded-xl text-ww-danger text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {transferError}
          </div>
        )}
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-ww-bg rounded-xl border border-ww-border">
            {[
              { val: 'wallet-to-bank', label: '💳 → 🏦', sub: 'Wallet to Bank' },
              { val: 'bank-to-wallet', label: '🏦 → 💳', sub: 'Bank to Wallet' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => { setTransferDir(opt.val); setTransferError(''); }}
                className={`py-3 rounded-lg transition-all font-medium text-xs flex flex-col items-center gap-0.5 cursor-pointer ${transferDir === opt.val
                    ? 'bg-ww-accent text-white shadow-sm'
                    : 'text-ww-text-secondary hover:text-ww-text hover:bg-white'
                  }`}
              >
                <span className="text-base">{opt.label}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-80">{opt.sub}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 bg-ww-elevated rounded-xl border border-ww-border">
            <div className="text-center">
              <p className="text-[9px] font-semibold text-ww-text-muted uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="text-lg font-bold text-ww-accent tabular-nums">{currencySymbol}{wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-semibold text-ww-text-muted uppercase tracking-widest mb-1">Bank Account</p>
              <p className="text-lg font-bold text-ww-text-secondary">Protected</p>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-widest mb-2 block">Transfer Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-ww-text-muted">{currencySymbol}</span>
              <input
                type="number"
                required
                value={transferAmount}
                onChange={e => { setTransferAmount(e.target.value); setTransferError(''); }}
                placeholder="0.00"
                className="w-full bg-ww-bg border border-ww-border rounded-xl py-3.5 pl-10 pr-4 text-ww-text placeholder-ww-text-muted outline-none focus:border-ww-accent focus:bg-white transition-all font-bold text-xl"
              />
            </div>
          </div>
          <Button type="submit" variant="primary" icon={ArrowLeftRight} className="w-full py-3.5 text-sm">
            Execute Transfer
          </Button>
        </form>
      </Modal>

      {/* ── DIVIDEND PULSE TOAST ── */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white border border-ww-border shadow-[0_8px_30px_rgba(34,37,31,0.12)]"
          >
            <div className="w-9 h-9 rounded-xl bg-ww-green-bg border border-ww-accent/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-ww-accent" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-ww-accent uppercase tracking-widest">Growth Pulse</p>
              <p className="text-sm font-bold text-ww-text">+{currencySymbol}{toastAmount.toLocaleString()} dividend received</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(WalletHub);

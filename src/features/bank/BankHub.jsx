import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, ArrowDownCircle, ArrowUpCircle, TrendingUp,
  Coins, PieChart, Shield, ChevronRight, AlertCircle,
  CheckCircle, ArrowLeftRight, Percent, RefreshCw,
  Building, DollarSign, Wallet
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const useCountUp = (target, duration = 1000) => {
  const [display, setDisplay] = useState(0);
  const prevTarget = useRef(target);
  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (Math.abs(diff) < 1) return;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * ease);
      if (progress < 1) requestAnimationFrame(tick);
      else prevTarget.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return display;
};

const RATES = {
  Safe: 0.01,
  Moderate: 0.02,
  'High Yield': 0.05,
  Tycoon: 0.08,
  Imperial: 0.12,
};

const BankHub = ({ setActiveTab }) => {
  const {bank, setBank, addTransaction, currencySymbol } = useEmpire();
  const [modal, setModal] = useState({ show: false, type: '' });
  const [amount, setAmount] = useState('');
  const [txError, setTxError] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanSuccess, setLoanSuccess] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');

  // Forex Converter state
  const [forexAmount,    setForexAmount]    = useState('1000');
  const [forexCurrency,  setForexCurrency]  = useState('inr');
  const [forexConverted, setForexConverted] = useState(null);

  // Asset manager state
  const [assetInput, setAssetInput] = useState('');

  const currentRate = RATES[bank.interestTier] || 0.02;
  const monthlyAccrual = (bank.balance * currentRate) / 12;
  const animatedBalance = useCountUp(bank.balance);

  const handleTransaction = (e) => {
    e.preventDefault();
    setTxError('');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setTxError('Please enter a valid positive amount.');
      return;
    }

    if (modal.type === 'Deposit') {
      setBank(prev => ({ ...prev, balance: prev.balance + amt }));
      addTransaction('Bank', 'Credit', amt, 'Global Bank Treasury Deposit');
    } else {
      if (bank.balance < amt) {
        setTxError(`Insufficient funds. Available balance: $${bank.balance.toLocaleString()}`);
        return;
      }
      setBank(prev => ({ ...prev, balance: prev.balance - amt }));
      addTransaction('Bank', 'Debit', amt, 'Global Bank Treasury Withdrawal');
    }
    setModal({ show: false, type: '' });
    setAmount('');
  };

  const handleLoan = (e) => {
    e.preventDefault();
    const amt = parseFloat(loanAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBank(prev => ({ ...prev, balance: prev.balance + amt, loans: (prev.loans || 0) + amt }));
    addTransaction('Bank', 'Credit', amt, 'Credit Line Facility Drawdown');
    setLoanSuccess(true);
    setTimeout(() => {
      setLoanSuccess(false);
      setLoanAmount('');
      setModal({ show: false, type: '' });
    }, 1500);
  };

  const handleRepay = (e) => {
    e.preventDefault();
    const amt = parseFloat(repayAmount);
    if (isNaN(amt) || amt <= 0 || amt > (bank.loans || 0)) return;
    if (bank.balance < amt) {
      setTxError('Insufficient balance to repay this amount.');
      return;
    }
    setBank(prev => ({ ...prev, balance: prev.balance - amt, loans: Math.max(0, (prev.loans || 0) - amt) }));
    addTransaction('Bank', 'Debit', amt, 'Credit Line Facility Repayment');
    setRepayAmount('');
    setModal({ show: false, type: '' });
  };

  const handleForexConvert = (e) => {
    e.preventDefault();
    const amt = parseFloat(forexAmount);
    if (isNaN(amt) || amt <= 0) return;
    const rates = {
      inr: bank?.forex?.inr || 83.5,
      aed: bank?.forex?.aed || 3.67,
      usd: 1,
      eur: 0.92,
      gbp: 0.79
    };
    const rate = rates[forexCurrency] || 1;
    setForexConverted((amt * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleUpdateAssets = (e) => {
    e.preventDefault();
    const val = parseFloat(assetInput);
    if (isNaN(val) || val < 0) return;
    setBank(prev => ({ ...prev, assets: val }));
    addTransaction('Bank', 'Credit', 0, `Asset Reserve Revalued to $${val.toLocaleString()}`);
    setAssetInput('');
    setModal({ show: false, type: '' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ww-text-muted mb-1">
            Global Bank & Institutional Treasury
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ww-text tracking-tight">
            Reserve Banking
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={ArrowUpCircle}
            onClick={() => { setModal({ show: true, type: 'Withdraw' }); setTxError(''); }}
          >
            Withdraw
          </Button>
          <Button
            variant="primary"
            icon={ArrowDownCircle}
            onClick={() => { setModal({ show: true, type: 'Deposit' }); setTxError(''); }}
          >
            Deposit Capital
          </Button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* HERO RESERVE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8"
        >
          <Card className="relative overflow-hidden p-7 md:p-9 min-h-72 flex flex-col justify-between border border-ww-border bg-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-ww-green-bg border border-ww-accent/20 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-ww-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Institutional Vault</p>
                  <p className="text-xs text-ww-text font-bold">Compound Interest Treasury</p>
                </div>
              </div>
              <Badge variant="accent">
                {bank.interestTier || 'Moderate'} Tier ({(currentRate * 100).toFixed(0)}% APY)
              </Badge>
            </div>

            <div className="my-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted mb-1">
                Available Reserve Balance
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-ww-text tabular-nums tracking-tight">
                {currencySymbol}{animatedBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h1>
              <p className="text-xs text-ww-text-secondary mt-1.5 flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-ww-success" />
                <span>Est. monthly compounding yield:</span>
                <span className="font-bold text-ww-success tabular-nums">+{currencySymbol}{monthlyAccrual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </p>
            </div>

            {/* Bottom 3 metrics */}
            <div className="pt-5 border-t border-ww-border grid grid-cols-3 gap-4 text-center">
              <div className="p-2.5 bg-ww-elevated rounded-xl border border-ww-border">
                <p className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-wider">Annual Yield</p>
                <p className="text-sm font-bold text-ww-accent tabular-nums mt-0.5">
                  {(currentRate * 100).toFixed(1)}% APY
                </p>
              </div>
              <div className="p-2.5 bg-ww-elevated rounded-xl border border-ww-border">
                <p className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-wider">Active Credit Line</p>
                <p className="text-sm font-bold text-ww-warning tabular-nums mt-0.5">
                  {currencySymbol}{(bank.loans || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-ww-elevated rounded-xl border border-ww-border">
                <p className="text-[10px] font-semibold text-ww-text-muted uppercase tracking-wider">Reserve Assets</p>
                <p className="text-sm font-bold text-ww-text tabular-nums mt-0.5">
                  {currencySymbol}{(bank.assets || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SIDE ACTIONS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-6 flex-1 flex flex-col justify-between border border-ww-border bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ww-text-muted">Treasury Facilities</h3>
                <p className="text-sm font-bold text-ww-text mt-0.5">Banking Operations</p>
              </div>
              <Coins className="w-4 h-4 text-ww-accent" />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setModal({ show: true, type: 'CreditLine' })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-ww-elevated hover:bg-ww-bg-alt border border-ww-border transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-ww-text">Drawdown Credit Line</p>
                  <p className="text-[10px] text-ww-text-muted">Access low-interest credit facility</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ww-text-muted group-hover:text-ww-accent transition-colors" />
              </button>

              {bank.loans > 0 && (
                <button
                  onClick={() => setModal({ show: true, type: 'RepayLoan' })}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-ww-danger-bg hover:bg-ww-danger-subtle border border-ww-danger/30 transition-all text-left cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-bold text-ww-danger">Repay Credit Line</p>
                    <p className="text-[10px] text-ww-danger/80">Outstanding: {currencySymbol}{(bank.loans || 0).toLocaleString()}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ww-danger" />
                </button>
              )}

              <button
                onClick={() => setModal({ show: true, type: 'Forex' })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-ww-elevated hover:bg-ww-bg-alt border border-ww-border transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-ww-text">Forex Converter</p>
                  <p className="text-[10px] text-ww-text-muted">Live institutional foreign exchange</p>
                </div>
                <ArrowLeftRight className="w-4 h-4 text-ww-text-muted group-hover:text-ww-accent transition-colors" />
              </button>

              <button
                onClick={() => setModal({ show: true, type: 'AssetManager' })}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-ww-elevated hover:bg-ww-bg-alt border border-ww-border transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-ww-text">Asset Valuation</p>
                  <p className="text-[10px] text-ww-text-muted">Manage physical asset reserves</p>
                </div>
                <PieChart className="w-4 h-4 text-ww-text-muted group-hover:text-ww-accent transition-colors" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── APY Interest Tier Calibration ── */}
      <Card className="p-6 md:p-8 border border-ww-border bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-ww-text">APY Interest Tier Calibration</h3>
            <p className="text-xs text-ww-text-secondary mt-0.5">
              Select your compounding reserve tier. Earnings automatically compound into bank balance on simulation pulses.
            </p>
          </div>
          <Badge variant="success">Auto-Compounding Pulse</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(RATES).map(([tier, rate]) => {
            const isActive = bank.interestTier === tier;
            return (
              <button
                key={tier}
                onClick={() => setBank(prev => ({ ...prev, interestTier: tier }))}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                  isActive
                    ? 'border-ww-accent bg-ww-green-bg shadow-xs'
                    : 'border-ww-border bg-ww-elevated hover:border-ww-border-strong hover:bg-ww-bg-alt'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-ww-accent' : 'text-ww-text-secondary'}`}>
                  {tier}
                </span>
                <span className={`text-xl font-extrabold mt-1.5 tabular-nums ${isActive ? 'text-ww-accent' : 'text-ww-text'}`}>
                  {(rate * 100).toFixed(0)}% APY
                </span>
                <span className="text-[10px] text-ww-text-muted mt-1">
                  ~{currencySymbol}{Math.round((bank.balance * rate) / 12).toLocaleString()}/mo
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── MODALS ── */}

      {/* 1. Deposit / Withdraw Modal */}
      <Modal
        isOpen={modal.show && (modal.type === 'Deposit' || modal.type === 'Withdraw')}
        onClose={() => setModal({ show: false, type: '' })}
        title={`${modal.type} Treasury Funds`}
        subtitle="Global Bank Vault Facility"
      >
        {txError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-ww-danger-bg border border-ww-danger/30 rounded-xl text-ww-danger text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{txError}</span>
          </div>
        )}
        <form onSubmit={handleTransaction} className="space-y-4">
          <Input
            label="Amount (USD)"
            type="number"
            required
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setTxError(''); }}
            placeholder="e.g. 25000"
            min="1"
            step="any"
          />
          <div className="flex justify-between text-xs text-ww-text-secondary pt-1">
            <span>Available Bank Balance:</span>
            <span className="font-bold text-ww-text">{currencySymbol}{(bank.balance || 0).toLocaleString()}</span>
          </div>
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Confirm {modal.type}
          </Button>
        </form>
      </Modal>

      {/* 2. Credit Line Drawdown Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'CreditLine'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Drawdown Credit Line"
        subtitle="Low-interest institutional liquidity facility"
      >
        {loanSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-ww-green-bg border border-ww-success/30 rounded-xl text-ww-success text-xs font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Credit facility approved and deposited into reserve.</span>
          </div>
        )}
        <form onSubmit={handleLoan} className="space-y-4">
          <Input
            label="Requested Credit Amount (USD)"
            type="number"
            required
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="e.g. 50000"
            min="1"
          />
          <div className="p-3 bg-ww-elevated border border-ww-border rounded-xl text-xs text-ww-text-secondary space-y-1">
            <div className="flex justify-between">
              <span>Facility Rate:</span>
              <span className="font-semibold text-ww-text">2.5% Fixed APR</span>
            </div>
            <div className="flex justify-between">
              <span>Current Outstanding:</span>
              <span className="font-semibold text-ww-warning">{currencySymbol}{(bank.loans || 0).toLocaleString()}</span>
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Confirm Drawdown
          </Button>
        </form>
      </Modal>

      {/* 3. Loan Repay Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'RepayLoan'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Repay Credit Line"
        subtitle="Settle outstanding facility debt"
      >
        <form onSubmit={handleRepay} className="space-y-4">
          <div className="p-3 bg-ww-elevated border border-ww-border rounded-xl text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ww-text-secondary">Total Outstanding Debt:</span>
              <span className="font-bold text-ww-danger">{currencySymbol}{(bank.loans || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ww-text-secondary">Available Balance:</span>
              <span className="font-bold text-ww-text">{currencySymbol}{(bank.balance || 0).toLocaleString()}</span>
            </div>
          </div>
          <Input
            label="Repayment Amount (USD)"
            type="number"
            required
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            placeholder="e.g. 10000"
            max={bank.loans || 0}
            min="1"
          />
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Confirm Repayment
          </Button>
        </form>
      </Modal>

      {/* 4. Forex Converter Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'Forex'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Forex Currency Converter"
        subtitle="Institutional exchange rates"
      >
        <form onSubmit={handleForexConvert} className="space-y-4">
          <Input
            label="USD Amount to Convert"
            type="number"
            required
            value={forexAmount}
            onChange={(e) => { setForexAmount(e.target.value); setForexConverted(null); }}
            placeholder="1000"
            min="1"
          />
          <div>
            <label className="text-xs font-bold text-ww-text-secondary block mb-1.5">Target Currency</label>
            <select
              value={forexCurrency}
              onChange={(e) => { setForexCurrency(e.target.value); setForexConverted(null); }}
              className="w-full bg-ww-elevated border border-ww-border rounded-xl p-2.5 text-sm text-ww-text font-semibold outline-none focus:border-ww-accent"
            >
              <option value="inr">INR — Indian Rupee (₹83.50)</option>
              <option value="aed">AED — UAE Dirham (3.67 AED)</option>
              <option value="eur">EUR — Euro (€0.92)</option>
              <option value="gbp">GBP — British Pound (£0.79)</option>
              <option value="usd">USD — United States Dollar ($1.00)</option>
            </select>
          </div>
          <Button type="submit" variant="primary" icon={RefreshCw} className="w-full py-2.5">
            Calculate Exchange Rate
          </Button>
          {forexConverted && (
            <div className="p-4 bg-ww-green-bg border border-ww-success/30 rounded-xl text-center mt-3">
              <p className="text-[10px] font-semibold uppercase text-ww-accent tracking-wider">Converted Value</p>
              <p className="text-2xl font-black text-ww-text mt-1 tabular-nums">
                {forexConverted} <span className="text-sm font-bold text-ww-accent">{forexCurrency.toUpperCase()}</span>
              </p>
            </div>
          )}
        </form>
      </Modal>

      {/* 5. Asset Manager Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'AssetManager'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Asset Reserve Valuation"
        subtitle="Update total physical asset balance"
      >
        <form onSubmit={handleUpdateAssets} className="space-y-4">
          <div className="p-3 bg-ww-elevated border border-ww-border rounded-xl text-xs text-ww-text-secondary flex justify-between">
            <span>Current Asset Reserve:</span>
            <span className="font-bold text-ww-text">{currencySymbol}{(bank.assets || 0).toLocaleString()}</span>
          </div>
          <Input
            label="New Total Asset Valuation (USD)"
            type="number"
            required
            value={assetInput}
            onChange={(e) => setAssetInput(e.target.value)}
            placeholder="e.g. 500000"
            min="0"
          />
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Save Valuation
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(BankHub);

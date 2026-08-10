import React, { useState, useEffect, useRef } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, ArrowDownCircle, ArrowUpCircle, TrendingUp, 
  Coins, PieChart, Shield, ChevronRight, AlertCircle,
  CheckCircle, ArrowLeftRight, Percent, RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const useCountUp = (target, duration = 1200) => {
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

const RATES = { Safe: 0.01, Moderate: 0.02, 'High Yield': 0.05, Tycoon: 0.08, Imperial: 0.12 };

const BankHub = () => {
  const { bank, setBank, addTransaction } = useEmpire();
  const [modal, setModal] = useState({ show: false, type: '' });
  const [amount, setAmount] = useState('');
  const [txError, setTxError] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanSuccess, setLoanSuccess] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');

  // Forex Converter state
  const [forexAmount,    setForexAmount]    = useState('');
  const [forexCurrency,  setForexCurrency]  = useState('inr');
  const [forexConverted, setForexConverted] = useState(null);

  // Asset manager state
  const [assetInput, setAssetInput] = useState('');

  const monthlyAccrual = (bank.balance * (RATES[bank.interestTier] || 0.02)) / 12;
  const animatedBalance = useCountUp(bank.balance);

  const handleTransaction = (e) => {
    e.preventDefault();
    setTxError('');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setTxError('Enter a valid amount.'); return; }

    if (modal.type === 'Deposit') {
      setBank(prev => ({ ...prev, balance: prev.balance + amt }));
      addTransaction('Bank', 'Credit', amt, 'Global Bank Deposit');
    } else {
      if (bank.balance < amt) {
        setTxError(`Insufficient funds. Available: $${bank.balance.toLocaleString()}`);
        return;
      }
      setBank(prev => ({ ...prev, balance: prev.balance - amt }));
      addTransaction('Bank', 'Debit', amt, 'Global Bank Withdrawal');
    }
    setModal({ show: false, type: '' });
    setAmount('');
  };

  const handleLoan = (e) => {
    e.preventDefault();
    const amt = parseFloat(loanAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBank(prev => ({ ...prev, balance: prev.balance + amt, loans: (prev.loans || 0) + amt }));
    addTransaction('Bank', 'Credit', amt, 'Credit Line Drawdown');
    setLoanSuccess(true);
    setTimeout(() => {
      setLoanSuccess(false);
      setLoanAmount('');
      setModal({ show: false, type: '' });
    }, 1800);
  };

  const handleRepay = (e) => {
    e.preventDefault();
    const amt = parseFloat(repayAmount);
    if (isNaN(amt) || amt <= 0 || amt > (bank.loans || 0)) return;
    if (bank.balance < amt) return;
    setBank(prev => ({ ...prev, balance: prev.balance - amt, loans: Math.max(0, (prev.loans || 0) - amt) }));
    addTransaction('Bank', 'Debit', amt, 'Credit Line Repayment');
    setRepayAmount('');
    setModal({ show: false, type: '' });
  };

  const handleForexConvert = (e) => {
    e.preventDefault();
    const amt = parseFloat(forexAmount);
    if (isNaN(amt) || amt <= 0) return;
    const rate = bank?.forex?.[forexCurrency] || 1;
    setForexConverted((amt * rate).toFixed(2));
  };

  const handleUpdateAssets = (e) => {
    e.preventDefault();
    const val = parseFloat(assetInput);
    if (isNaN(val) || val < 0) return;
    setBank(prev => ({ ...prev, assets: val }));
    setAssetInput('');
    setModal({ show: false, type: '' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Vault & Credit Management</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Global Bank</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={ArrowDownCircle} onClick={() => setModal({ show: true, type: 'Deposit' })}>
            Deposit
          </Button>
          <Button variant="outline" icon={ArrowUpCircle} onClick={() => setModal({ show: true, type: 'Withdraw' })}>
            Withdraw
          </Button>
        </div>
      </div>

      {/* Main Grid: Vault Balance Hero & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8">
          <Card variant="accent" className="relative overflow-hidden p-8 md:p-10 min-h-72 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">Institutional Vault</p>
                  <p className="text-xs text-slate-300 font-bold uppercase">Compound Savings Engine</p>
                </div>
              </div>
              <Badge variant="cyan">{bank.interestTier || 'Moderate'} Tier APY</Badge>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available Reserve Balance</p>
              <h1 className="text-4xl md:text-6xl font-black text-white tabular-nums tracking-tight">
                ${animatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Monthly Interest</p>
                <p className="text-sm font-black text-emerald-400 tabular-nums mt-0.5">+${monthlyAccrual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Credit Line</p>
                <p className="text-sm font-black text-violet-400 tabular-nums mt-0.5">${(bank.loans || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Physical Assets</p>
                <p className="text-sm font-black text-cyan-300 tabular-nums mt-0.5">${(bank.assets || 0).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Credit & Facility</h3>
              <Coins className="w-4 h-4 text-neon-blue" />
            </div>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-between" onClick={() => setModal({ show: true, type: 'CreditLine' })}>
                <span>Drawdown Credit Line</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              {bank.loans > 0 && (
                <Button variant="outline" className="w-full justify-between text-rose-300 border-rose-500/30 hover:bg-rose-500/10" onClick={() => setModal({ show: true, type: 'RepayLoan' })}>
                  <span>Repay Credit Line</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              <Button variant="secondary" className="w-full justify-between" onClick={() => setModal({ show: true, type: 'Forex' })}>
                <span>Forex Currency Converter</span>
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" className="w-full justify-between" onClick={() => setModal({ show: true, type: 'AssetManager' })}>
                <span>Asset Reserve Manager</span>
                <PieChart className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* APY Interest Tier Calibration */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest">APY Interest Tier Calibration</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Select vault yield tier</p>
          </div>
          <Badge variant="emerald">Auto-Compounding</Badge>
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
                    ? 'border-neon-blue bg-neon-blue/10 shadow-[0_0_20px_rgba(0,243,255,0.15)]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tier}</span>
                <span className={`text-xl font-black mt-1 ${isActive ? 'text-neon-blue' : 'text-white'}`}>{(rate * 100).toFixed(0)}% APY</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* MODALS */}
      {/* Deposit / Withdraw Modal */}
      <Modal
        isOpen={modal.show && (modal.type === 'Deposit' || modal.type === 'Withdraw')}
        onClose={() => setModal({ show: false, type: '' })}
        title={`${modal.type} Capital`}
        subtitle="Global Bank Vault Facility"
      >
        {txError && (
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />{txError}
          </div>
        )}
        <form onSubmit={handleTransaction} className="space-y-5">
          <Input
            label="Amount (USD)"
            type="number"
            required
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setTxError(''); }}
            placeholder="0.00"
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm">
            {modal.type} Now
          </Button>
        </form>
      </Modal>

      {/* Credit Line Drawdown Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'CreditLine'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Drawdown Credit Line"
        subtitle="Imperial Credit Line Facility"
      >
        {loanSuccess && (
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
            <CheckCircle className="w-4 h-4 shrink-0" />Credit facility extended successfully.
          </div>
        )}
        <form onSubmit={handleLoan} className="space-y-5">
          <Input
            label="Requested Credit Amount (USD)"
            type="number"
            required
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="50,000"
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm">
            Confirm Drawdown
          </Button>
        </form>
      </Modal>

      {/* Loan Repay Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'RepayLoan'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Repay Credit Line"
        subtitle="Outstanding Debt Facility"
      >
        <form onSubmit={handleRepay} className="space-y-5">
          <p className="text-xs text-slate-400 font-bold uppercase">Outstanding Debt: <span className="text-rose-400 font-black">${(bank.loans || 0).toLocaleString()}</span></p>
          <Input
            label="Repayment Amount (USD)"
            type="number"
            required
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
            placeholder="10,000"
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm">
            Confirm Repayment
          </Button>
        </form>
      </Modal>

      {/* Forex Converter Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'Forex'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Forex Currency Converter"
        subtitle="Institutional Exchange Rates"
      >
        <form onSubmit={handleForexConvert} className="space-y-4">
          <Input
            label="USD Amount"
            type="number"
            required
            value={forexAmount}
            onChange={(e) => { setForexAmount(e.target.value); setForexConverted(null); }}
            placeholder="1,000"
          />
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Target Currency</label>
            <select
              value={forexCurrency}
              onChange={(e) => { setForexCurrency(e.target.value); setForexConverted(null); }}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-neon-blue"
            >
              <Option value="inr">INR (Indian Rupee - ₹83.5)</Option>
              <Option value="aed">AED (UAE Dirham - 3.67 AED)</Option>
              <Option value="usd">USD (US Dollar - $1.00)</Option>
            </select>
          </div>
          <Button type="submit" variant="primary" icon={RefreshCw} className="w-full py-3">
            Calculate Conversion
          </Button>
          {forexConverted && (
            <div className="p-4 bg-white/5 border border-neon-cyan/20 rounded-xl text-center mt-3">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Converted Value</p>
              <p className="text-2xl font-black text-neon-blue mt-1">{forexConverted} {forexCurrency.toUpperCase()}</p>
            </div>
          )}
        </form>
      </Modal>

      {/* Asset Manager Modal */}
      <Modal
        isOpen={modal.show && modal.type === 'AssetManager'}
        onClose={() => setModal({ show: false, type: '' })}
        title="Asset Reserve Manager"
        subtitle="Update Total Asset Valuation"
      >
        <form onSubmit={handleUpdateAssets} className="space-y-5">
          <Input
            label="Total Asset Valuation (USD)"
            type="number"
            required
            value={assetInput}
            onChange={(e) => setAssetInput(e.target.value)}
            placeholder="450,000"
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm">
            Save Valuation
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(BankHub);

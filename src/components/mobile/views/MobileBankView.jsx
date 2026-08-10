import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { 
  Landmark, ArrowDownLeft, ArrowUpRight, ShieldCheck, 
  TrendingUp, CreditCard, RefreshCw, Plus, DollarSign
} from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';

const APY_RATES = [
  { tier: 'Standard', apy: 3.5, label: '3.5% APY' },
  { tier: 'Prime',    apy: 5.2, label: '5.2% APY' },
  { tier: 'Imperial', apy: 8.0, label: '8.0% APY' },
];

const MobileBankView = () => {
  const { bank, setBank, wallet, setWallet, addTransaction } = useEmpire();
  const [selectedApy, setSelectedApy] = useState(5.2);

  // Forex state
  const [forexAmt, setForexAmt] = useState(1000);
  const [currency, setCurrency] = useState('INR');

  // Bottom sheets
  const [showDepositSheet, setShowDepositSheet] = useState(false);
  const [showLoanSheet, setShowLoanSheet] = useState(false);

  const [depositAmt, setDepositAmt] = useState('');
  const [loanAmt, setLoanAmt] = useState('');

  const monthlyAccrual = useMemo(() => {
    return Math.round(((bank?.balance || 0) * (selectedApy / 100)) / 12);
  }, [bank?.balance, selectedApy]);

  const convertedValue = useMemo(() => {
    const rates = { INR: 86.5, AED: 3.67, EUR: 0.92, GBP: 0.79 };
    return (parseFloat(forexAmt) || 0) * (rates[currency] || 1);
  }, [forexAmt, currency]);

  const handleDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmt);
    if (!amt || amt <= 0) return;
    if ((wallet?.balance || 0) < amt) return;
    setWallet(w => ({ ...w, balance: w.balance - amt }));
    setBank(b => ({ ...b, balance: b.balance + amt }));
    addTransaction('Bank', 'Credit', amt, 'Direct Institutional Deposit');
    setShowDepositSheet(false);
    setDepositAmt('');
  };

  const handleDrawLoan = (e) => {
    e.preventDefault();
    const amt = parseFloat(loanAmt);
    if (!amt || amt <= 0) return;
    setBank(b => ({ ...b, balance: b.balance + amt }));
    addTransaction('Bank', 'Credit', amt, 'Credit Line Drawdown');
    setShowLoanSheet(false);
    setLoanAmt('');
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Hero Bank Vault Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-[0_8px_30px_rgba(28,25,23,0.06)] text-[#1C1917] space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Institutional Reserve</p>
              <p className="text-[10px] text-[#0284C7] font-bold uppercase">Sovereign Treasury</p>
            </div>
          </div>
          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
            {selectedApy}% APY Active
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-black text-[#1C1917] tracking-tight tabular-nums">
            ${(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
          <p className="text-[9px] text-[#57534E] font-bold uppercase mt-1">
            Est. Monthly Yield: <span className="text-emerald-600 font-black">+${monthlyAccrual.toLocaleString()}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5DFD1]">
          <button
            onClick={() => setShowDepositSheet(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            Deposit Funds
          </button>
          <button
            onClick={() => setShowLoanSheet(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#1C1917] font-black uppercase text-xs tracking-wider cursor-pointer shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-[#0284C7]" />
            Draw Loan
          </button>
        </div>
      </div>

      {/* APY Rate Selector */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Treasury APY Rate</h3>
        <div className="grid grid-cols-3 gap-2">
          {APY_RATES.map((rate) => (
            <button
              key={rate.tier}
              onClick={() => setSelectedApy(rate.apy)}
              className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedApy === rate.apy
                  ? 'border-[#0284C7] bg-[#E0F2FE] text-[#1C1917] font-black shadow-xs'
                  : 'border-[#E5DFD1] bg-[#F9F7F1] text-[#57534E]'
              }`}
            >
              <p className="text-xs font-black">{rate.label}</p>
              <p className="text-[8px] uppercase font-bold tracking-wider mt-0.5">{rate.tier}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Forex Converter */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Multi-Currency Forex</h3>
          <span className="text-[9px] font-black text-[#0284C7] uppercase">Live Exchange</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={forexAmt}
              onChange={e => setForexAmt(e.target.value)}
              className="flex-1 bg-[#F9F7F1] border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
            <span className="text-xs font-black text-[#1C1917] px-3">USD</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F4EFE6] rounded-2xl border border-[#E2DAC8]">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-black uppercase text-[#1C1917] outline-none cursor-pointer"
            >
              <option value="INR">INR (₹)</option>
              <option value="AED">AED (Dh)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            <span className="text-base font-black text-[#0284C7] tabular-nums">
              {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* DEPOSIT SHEET */}
      <MobileActionSheet
        isOpen={showDepositSheet}
        onClose={() => setShowDepositSheet(false)}
        title="Institutional Deposit"
        subtitle="Move Liquid Vault to Bank Reserve"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Deposit Amount ($)</label>
            <input
              type="number"
              required
              value={depositAmt}
              onChange={e => setDepositAmt(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Confirm Deposit
          </button>
        </form>
      </MobileActionSheet>

      {/* LOAN DRAW SHEET */}
      <MobileActionSheet
        isOpen={showLoanSheet}
        onClose={() => setShowLoanSheet(false)}
        title="Credit Line Drawdown"
        subtitle="Draw Credit to Treasury"
      >
        <form onSubmit={handleDrawLoan} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Loan Amount ($)</label>
            <input
              type="number"
              required
              value={loanAmt}
              onChange={e => setLoanAmt(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Drawdown Credit
          </button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileBankView);

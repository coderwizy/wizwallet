import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import {
  Landmark, ArrowDownLeft, ArrowUpRight, ShieldCheck,
  TrendingUp, CreditCard, RefreshCw, Plus, DollarSign
} from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';

const APY_RATES = [
  { tier: 'Safe',       apy: 1.0, label: '1.0% APY' },
  { tier: 'Moderate',   apy: 2.0, label: '2.0% APY' },
  { tier: 'High Yield', apy: 5.0, label: '5.0% APY' },
  { tier: 'Tycoon',     apy: 8.0, label: '8.0% APY' },
  { tier: 'Imperial',   apy: 12.0, label: '12.0% APY' },
];

const MobileBankView = () => {
  const { bank, setBank, wallet, setWallet, addTransaction } = useEmpire();
  const [selectedApy, setSelectedApy] = useState(bank.interestTier === 'Safe' ? 1.0 : bank.interestTier === 'High Yield' ? 5.0 : bank.interestTier === 'Imperial' ? 12.0 : 2.0);

  // Forex state
  const [forexAmt, setForexAmt] = useState('1000');
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
    const rates = { INR: 83.5, AED: 3.67, EUR: 0.92, GBP: 0.79, USD: 1.0 };
    return ((parseFloat(forexAmt) || 0) * (rates[currency] || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    setBank(b => ({ ...b, balance: b.balance + amt, loans: (b.loans || 0) + amt }));
    addTransaction('Bank', 'Credit', amt, 'Credit Line Drawdown');
    setShowLoanSheet(false);
    setLoanAmt('');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* ── Hero Bank Vault Card ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Institutional Reserve</p>
              <p className="text-xs font-bold text-[#22251F]">Sovereign Treasury</p>
            </div>
          </div>
          <Badge variant="accent">
            {selectedApy}% APY Active
          </Badge>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-[#22251F] tracking-tight tabular-nums">
            ${(bank?.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h2>
          <p className="text-xs text-[#77786F] mt-1 font-medium">
            Est. Monthly Compounding: <span className="text-[#66866A] font-bold">+${monthlyAccrual.toLocaleString()}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-[#EAE8DF]">
          <Button
            variant="primary"
            icon={Plus}
            size="md"
            className="w-full py-2.5 text-xs"
            onClick={() => setShowDepositSheet(true)}
          >
            Deposit Funds
          </Button>
          <Button
            variant="secondary"
            icon={CreditCard}
            size="md"
            className="w-full py-2.5 text-xs"
            onClick={() => setShowLoanSheet(true)}
          >
            Draw Credit Line
          </Button>
        </div>
      </Card>

      {/* ── APY Rate Selector ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-2.5">
        <h3 className="text-xs font-bold text-[#22251F]">Treasury Yield Tier</h3>
        <div className="grid grid-cols-5 gap-1.5">
          {APY_RATES.map((rate) => {
            const isSelected = selectedApy === rate.apy;
            return (
              <button
                key={rate.tier}
                onClick={() => {
                  setSelectedApy(rate.apy);
                  setBank(prev => ({ ...prev, interestTier: rate.tier }));
                }}
                className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#526B56] bg-[#EDF2E9] shadow-2xs font-bold'
                    : 'border-[#EAE8DF] bg-[#FCFBF8] text-[#77786F]'
                }`}
              >
                <p className={`text-[8px] uppercase tracking-wider truncate ${isSelected ? 'text-[#526B56]' : 'text-[#A3A297]'}`}>
                  {rate.tier}
                </p>
                <p className={`text-xs font-extrabold mt-0.5 ${isSelected ? 'text-[#526B56]' : 'text-[#22251F]'}`}>
                  {rate.apy}%
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── Forex Currency Converter ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#22251F]">Forex Converter</h3>
          <Badge variant="default">FX Rate</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-[#77786F] block mb-1">USD Amount</label>
            <input
              type="number"
              value={forexAmt}
              onChange={e => setForexAmt(e.target.value)}
              className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2 text-xs font-bold text-[#22251F] outline-none focus:border-[#526B56]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#77786F] block mb-1">Target Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2 text-xs font-bold text-[#22251F] outline-none"
            >
              <option value="INR">INR (₹83.5)</option>
              <option value="AED">AED (3.67)</option>
              <option value="EUR">EUR (€0.92)</option>
              <option value="GBP">GBP (£0.79)</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex justify-between items-center text-xs">
          <span className="text-[#77786F]">Converted Value:</span>
          <span className="font-extrabold text-[#526B56] tabular-nums text-sm">
            {convertedValue} {currency}
          </span>
        </div>
      </Card>

      {/* ── BOTTOM SHEET: DEPOSIT ── */}
      <MobileActionSheet
        isOpen={showDepositSheet}
        onClose={() => setShowDepositSheet(false)}
        title="Deposit to Treasury"
        subtitle="Transfer funds from Liquid Vault to Bank Reserve"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <Input
            label="Deposit Amount (USD)"
            type="number"
            required
            value={depositAmt}
            onChange={e => setDepositAmt(e.target.value)}
            placeholder="0.00"
            min="1"
          />
          <p className="text-[10px] text-[#77786F]">
            Available in Wallet: <span className="font-bold text-[#526B56]">${(wallet?.balance || 0).toLocaleString()}</span>
          </p>
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Confirm Deposit
          </Button>
        </form>
      </MobileActionSheet>

      {/* ── BOTTOM SHEET: DRAW LOAN ── */}
      <MobileActionSheet
        isOpen={showLoanSheet}
        onClose={() => setShowLoanSheet(false)}
        title="Draw Credit Line"
        subtitle="Institutional liquidity drawdown"
      >
        <form onSubmit={handleDrawLoan} className="space-y-4">
          <Input
            label="Requested Credit Amount (USD)"
            type="number"
            required
            value={loanAmt}
            onChange={e => setLoanAmt(e.target.value)}
            placeholder="0.00"
            min="1"
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Approve Drawdown
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileBankView);

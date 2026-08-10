import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Wallet, ArrowLeftRight, Eye, EyeOff, Zap, Plus, 
  Briefcase, Car, Building2, Factory, Gem
} from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';

const GROWTH_TIERS = [
  { id: 'Slow',        label: 'Stable',      mult: '1×' },
  { id: 'Founder',     label: 'Founder',     mult: '5×' },
  { id: 'CEO',         label: 'CEO',         mult: '10×' },
  { id: 'Tycoon',      label: 'Tycoon',      mult: '50×' },
  { id: 'Billionaire', label: 'Billionaire', mult: '100×' },
];

const MobileWalletView = ({ setActiveTab }) => {
  const { wallet, setWallet, addTransaction, transferFunds, businesses, sectors } = useEmpire();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(wallet.balance);

  // Bottom sheets
  const [showPaySheet, setShowPaySheet] = useState(false);
  const [showTransferSheet, setShowTransferSheet] = useState(false);

  const [payData, setPayData] = useState({ recipient: '', amount: '', purpose: '' });
  const [payError, setPayError] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDir, setTransferDir] = useState('wallet-to-bank');
  const [transferError, setTransferError] = useState('');

  const handlePay = (e) => {
    e.preventDefault();
    setPayError('');
    const amt = parseFloat(payData.amount);
    if (isNaN(amt) || amt <= 0) { setPayError('Enter a valid positive amount.'); return; }
    if (wallet.balance < amt) { setPayError(`Insufficient balance ($${wallet.balance.toLocaleString()})`); return; }
    setWallet(prev => ({ ...prev, balance: prev.balance - amt }));
    addTransaction('Wallet', 'Debit', amt, `Payment to ${payData.recipient}: ${payData.purpose}`);
    setShowPaySheet(false);
    setPayData({ recipient: '', amount: '', purpose: '' });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    setTransferError('');
    const from = transferDir === 'wallet-to-bank' ? 'wallet' : 'bank';
    const result = transferFunds(from, from === 'wallet' ? 'bank' : 'wallet', transferAmount);
    if (!result.success) { setTransferError(result.error); return; }
    setShowTransferSheet(false);
    setTransferAmount('');
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Hero Vault Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5DFD1] shadow-[0_8px_30px_rgba(28,25,23,0.06)] text-[#1C1917] space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#78716C]">Liquid Vault</p>
              <p className="text-[10px] text-[#0284C7] font-bold uppercase">USD Vault Account</p>
            </div>
          </div>
          <button
            onClick={() => setBalanceHidden(h => !h)}
            className="p-2 rounded-xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#57534E] hover:text-[#1C1917] transition-all cursor-pointer"
          >
            {balanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Balance Display / Inline Edit */}
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#A8A29E]">$</span>
              <input
                autoFocus
                type="number"
                value={editValue}
                onChange={e => setEditValue(parseFloat(e.target.value) || 0)}
                onBlur={() => {
                  const diff = editValue - wallet.balance;
                  if (Math.abs(diff) > 0.01) {
                    addTransaction('Wallet', diff > 0 ? 'Credit' : 'Debit', Math.abs(diff), 'Manual Balance Adjustment');
                  }
                  setWallet(prev => ({ ...prev, balance: editValue }));
                  setIsEditing(false);
                }}
                className="bg-[#F9F7F1] border-b-2 border-[#0284C7] text-3xl font-black text-[#1C1917] outline-none px-2 py-1 rounded-lg w-full"
              />
            </div>
          ) : (
            <div onClick={() => { setEditValue(wallet.balance); setIsEditing(true); }} className="cursor-pointer">
              <h2 className="text-3xl font-black text-[#1C1917] tracking-tight tabular-nums">
                {balanceHidden ? '••••••••••' : `$${wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </h2>
              <p className="text-[9px] text-[#0284C7] font-bold uppercase mt-1">Tap to calibrate balance</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E5DFD1]">
          <button
            onClick={() => { setShowTransferSheet(true); setTransferError(''); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#1C1917] font-black uppercase text-xs tracking-wider cursor-pointer shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#0284C7]" />
            Transfer
          </button>

          <button
            onClick={() => { setShowPaySheet(true); setPayError(''); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md shadow-sky-600/20"
          >
            <Send className="w-4 h-4" />
            Send Payment
          </button>
        </div>
      </div>

      {/* Growth Multipliers */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-[#1C1917] uppercase tracking-tight italic">Growth Multipliers</h3>
          <span className="text-[9px] font-black text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full uppercase">
            Active: {wallet.growthRate}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E2DAC8]">
          {GROWTH_TIERS.map((tier) => {
            const isActive = wallet.growthRate === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setWallet(prev => ({ ...prev, growthRate: tier.id }))}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0284C7] text-white shadow-xs font-black'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <p className="text-[10px] font-black">{tier.mult}</p>
                <p className="text-[8px] uppercase font-bold tracking-tighter truncate">{tier.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEND PAYMENT BOTTOM SHEET */}
      <MobileActionSheet
        isOpen={showPaySheet}
        onClose={() => setShowPaySheet(false)}
        title="Send Payment"
        subtitle="Disburse Liquid Funds"
      >
        {payError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
            {payError}
          </div>
        )}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Recipient</label>
            <input
              required
              value={payData.recipient}
              onChange={e => setPayData({ ...payData, recipient: e.target.value })}
              placeholder="e.g. Apex Holdings..."
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Amount ($)</label>
            <input
              type="number"
              required
              value={payData.amount}
              onChange={e => setPayData({ ...payData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Purpose</label>
            <input
              value={payData.purpose}
              onChange={e => setPayData({ ...payData, purpose: e.target.value })}
              placeholder="e.g. Dividend Distribution"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Confirm & Send
          </button>
        </form>
      </MobileActionSheet>

      {/* TRANSFER BOTTOM SHEET */}
      <MobileActionSheet
        isOpen={showTransferSheet}
        onClose={() => setShowTransferSheet(false)}
        title="Internal Transfer"
        subtitle="Move Capital Between Vaults"
      >
        {transferError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
            {transferError}
          </div>
        )}
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E2DAC8]">
            <button
              type="button"
              onClick={() => setTransferDir('wallet-to-bank')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                transferDir === 'wallet-to-bank' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#57534E]'
              }`}
            >
              Wallet → Bank
            </button>
            <button
              type="button"
              onClick={() => setTransferDir('bank-to-wallet')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                transferDir === 'bank-to-wallet' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#57534E]'
              }`}
            >
              Bank → Wallet
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Transfer Amount ($)</label>
            <input
              type="number"
              required
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Execute Transfer
          </button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileWalletView);

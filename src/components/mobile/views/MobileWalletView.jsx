import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Wallet, ArrowLeftRight, Eye, EyeOff, Zap, Plus,
  Briefcase, Car, Building2, Factory, Gem, AlertCircle
} from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';

const GROWTH_TIERS = [
  { id: 'Slow',        label: 'Stable',      mult: '1×' },
  { id: 'Founder',     label: 'Founder',     mult: '5×' },
  { id: 'CEO',         label: 'CEO',         mult: '10×' },
  { id: 'Tycoon',      label: 'Tycoon',      mult: '50×' },
  { id: 'Billionaire', label: 'Billionaire', mult: '100×' },
];

const MobileWalletView = ({ setActiveTab }) => {
  const { wallet, setWallet, addTransaction, transferFunds, businesses, sectors, currencySymbol } = useEmpire();
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
    <div className="space-y-4 pb-8">
      {/* ── Hero Vault Card ── */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] flex items-center justify-center text-[#526B56]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Liquid Capital</p>
              <p className="text-xs font-bold text-[#22251F]">Smart Wallet · USD Vault</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBalanceHidden(!balanceHidden)}
              className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F8F7F2] cursor-pointer"
            >
              {balanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <Badge variant="accent">Live</Badge>
          </div>
        </div>

        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#A3A297]">{currencySymbol}</span>
              <input
                autoFocus
                type="number"
                value={editValue}
                onChange={e => setEditValue(parseFloat(e.target.value) || 0)}
                onBlur={() => {
                  const diff = editValue - wallet.balance;
                  if (Math.abs(diff) > 0.01) {
                    addTransaction('Wallet', diff > 0 ? 'Credit' : 'Debit', Math.abs(diff), 'Manual Balance Calibration');
                  }
                  setWallet(w => ({ ...w, balance: editValue }));
                  setIsEditing(false);
                }}
                className="text-3xl font-extrabold text-[#22251F] bg-transparent border-b-2 border-[#526B56] outline-none w-full"
              />
            </div>
          ) : (
            <h2
              onClick={() => { setEditValue(wallet.balance); setIsEditing(true); }}
              className="text-3xl font-extrabold text-[#22251F] tracking-tight tabular-nums cursor-pointer"
            >
              {balanceHidden ? '••••••••' : `$${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
          )}
          <p className="text-[10px] text-[#A3A297] mt-1">Tap balance to calibrate manually</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-[#EAE8DF]">
          <Button
            variant="primary"
            icon={Send}
            size="md"
            className="w-full py-2.5 text-xs"
            onClick={() => { setShowPaySheet(true); setPayError(''); }}
          >
            Send Payment
          </Button>
          <Button
            variant="secondary"
            icon={ArrowLeftRight}
            size="md"
            className="w-full py-2.5 text-xs"
            onClick={() => { setShowTransferSheet(true); setTransferError(''); }}
          >
            Transfer Funds
          </Button>
        </div>
      </Card>

      {/* ── Growth Engine Tier Selector ── */}
      <Card className="p-4 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#22251F]">Growth Multiplier Tier</h3>
          <Badge variant="accent">
            <Zap className="w-3 h-3 mr-1" />
            {wallet.growthRate || 'Stable'} Tier
          </Badge>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {GROWTH_TIERS.map(tier => {
            const isActive = wallet.growthRate === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setWallet(w => ({ ...w, growthRate: tier.id }))}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#526B56] bg-[#EDF2E9] shadow-2xs font-bold'
                    : 'border-[#EAE8DF] bg-[#FCFBF8] text-[#77786F]'
                }`}
              >
                <p className={`text-[9px] uppercase tracking-wider truncate ${isActive ? 'text-[#526B56]' : 'text-[#A3A297]'}`}>
                  {tier.label}
                </p>
                <p className={`text-xs font-extrabold mt-0.5 ${isActive ? 'text-[#526B56]' : 'text-[#22251F]'}`}>
                  {tier.mult}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ── BOTTOM SHEET: SEND PAYMENT ── */}
      <MobileActionSheet
        isOpen={showPaySheet}
        onClose={() => setShowPaySheet(false)}
        title="Send Payment"
        subtitle="Direct P2P Settlement"
      >
        {payError && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-[#FCEEED] border border-[#E8C5C3] rounded-xl text-[#C66D65] text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{payError}</span>
          </div>
        )}
        <form onSubmit={handlePay} className="space-y-4">
          <Input
            label="Recipient Account / Handle"
            required
            value={payData.recipient}
            onChange={e => setPayData({ ...payData, recipient: e.target.value })}
            placeholder="@recipient"
          />
          <Input
            label="Amount (USD)"
            type="number"
            required
            value={payData.amount}
            onChange={e => setPayData({ ...payData, amount: e.target.value })}
            placeholder="0.00"
            min="1"
          />
          <Input
            label="Transfer Purpose"
            value={payData.purpose}
            onChange={e => setPayData({ ...payData, purpose: e.target.value })}
            placeholder="e.g. Dividend distribution"
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Confirm & Send
          </Button>
        </form>
      </MobileActionSheet>

      {/* ── BOTTOM SHEET: TRANSFER ── */}
      <MobileActionSheet
        isOpen={showTransferSheet}
        onClose={() => setShowTransferSheet(false)}
        title="Internal Transfer"
        subtitle="Wallet ⇄ Bank Treasury"
      >
        {transferError && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-[#FCEEED] border border-[#E8C5C3] rounded-xl text-[#C66D65] text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{transferError}</span>
          </div>
        )}
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
            {[
              { val: 'wallet-to-bank', label: 'Wallet → Bank' },
              { val: 'bank-to-wallet', label: 'Bank → Wallet' },
            ].map(dir => (
              <button
                key={dir.val}
                type="button"
                onClick={() => setTransferDir(dir.val)}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  transferDir === dir.val ? 'bg-[#526B56] text-white shadow-2xs' : 'text-[#77786F]'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>
          <Input
            label="Transfer Amount (USD)"
            type="number"
            required
            value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)}
            placeholder="0.00"
            min="1"
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Execute Transfer
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileWalletView);

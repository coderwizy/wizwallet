import React from 'react';
import { useEmpire } from '../../context/EmpireContext';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { ArrowUpRight, ArrowDownLeft, Calendar, User, Layers, Hash, CheckCircle2 } from 'lucide-react';

const TransactionDetailModal = ({ tx, isOpen, onClose }) => {
  const { currencySymbol } = useEmpire();
  if (!tx) return null;
  const isCredit = tx.type === 'Credit';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" subtitle={`ID: ${String(tx.id).slice(0, 16)}`}>
      <div className="space-y-5">
        {/* Top Receipt Amount Banner */}
        <div className={`p-5 rounded-2xl border text-center ${
          isCredit ? 'bg-ww-green-bg border-ww-success/30' : 'bg-ww-danger-bg border-ww-danger/30'
        }`}>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 bg-white shadow-xs">
            {isCredit ? (
              <ArrowUpRight className="w-5 h-5 text-ww-success" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-ww-danger" />
            )}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-secondary">
            {isCredit ? 'Settlement Inflow' : 'Capital Outflow'}
          </p>
          <h2 className={`text-3xl font-extrabold tabular-nums tracking-tight mt-0.5 ${
            isCredit ? 'text-ww-success' : 'text-ww-danger'
          }`}>
            {isCredit ? '+' : '−'}{currencySymbol}{Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <Badge variant={isCredit ? 'success' : 'danger'} className="mt-2">
            <CheckCircle2 className="w-3 h-3" />
            Verified Ledger Record
          </Badge>
        </div>

        {/* Detailed Breakdown Rows */}
        <div className="bg-ww-elevated border border-ww-border rounded-2xl p-4 divide-y divide-[#EAE8DF] space-y-3">
          <div className="flex items-center justify-between text-xs pb-3">
            <span className="text-ww-text-secondary flex items-center gap-1.5 font-medium">
              <Hash className="w-3.5 h-3.5 text-ww-text-muted" /> Description
            </span>
            <span className="font-semibold text-ww-text text-right max-w-[240px] truncate">
              {tx.description}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-3">
            <span className="text-ww-text-secondary flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-ww-text-muted" /> Hub Module
            </span>
            <span className="font-semibold text-ww-accent bg-white px-2.5 py-0.5 rounded-full border border-ww-border">
              {tx.module || 'System'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-3">
            <span className="text-ww-text-secondary flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-ww-text-muted" /> Timestamp
            </span>
            <span className="font-medium text-ww-text tabular-nums">
              {new Date(tx.timestamp).toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-3">
            <span className="text-ww-text-secondary flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-ww-text-muted" /> Authorized By
            </span>
            <span className="font-semibold text-ww-text">
              {tx.user || 'raghav94'}
            </span>
          </div>
        </div>

        <Button variant="secondary" size="md" className="w-full" onClick={onClose}>
          Close Details
        </Button>
      </div>
    </Modal>
  );
};

export default React.memo(TransactionDetailModal);


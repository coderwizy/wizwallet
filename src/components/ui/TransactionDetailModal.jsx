import React from 'react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { ArrowUpRight, ArrowDownLeft, Calendar, User, Layers, Hash, CheckCircle2 } from 'lucide-react';

const TransactionDetailModal = ({ tx, isOpen, onClose }) => {
  if (!tx) return null;
  const isCredit = tx.type === 'Credit';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" subtitle={`ID: ${String(tx.id).slice(0, 16)}`}>
      <div className="space-y-5">
        {/* Top Receipt Amount Banner */}
        <div className={`p-5 rounded-2xl border text-center ${
          isCredit ? 'bg-[#EDF2E9] border-[#C8D9CA]' : 'bg-[#FCEEED] border-[#E8C5C3]'
        }`}>
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 bg-white shadow-xs">
            {isCredit ? (
              <ArrowUpRight className="w-5 h-5 text-[#66866A]" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-[#C66D65]" />
            )}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#77786F]">
            {isCredit ? 'Settlement Inflow' : 'Capital Outflow'}
          </p>
          <h2 className={`text-3xl font-extrabold tabular-nums tracking-tight mt-0.5 ${
            isCredit ? 'text-[#66866A]' : 'text-[#C66D65]'
          }`}>
            {isCredit ? '+' : '−'}${Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <Badge variant={isCredit ? 'success' : 'danger'} className="mt-2">
            <CheckCircle2 className="w-3 h-3" />
            Verified Ledger Record
          </Badge>
        </div>

        {/* Detailed Breakdown Rows */}
        <div className="bg-[#FCFBF8] border border-[#EAE8DF] rounded-2xl p-4 divide-y divide-[#EAE8DF] space-y-3">
          <div className="flex items-center justify-between text-xs pb-3">
            <span className="text-[#77786F] flex items-center gap-1.5 font-medium">
              <Hash className="w-3.5 h-3.5 text-[#A3A297]" /> Description
            </span>
            <span className="font-semibold text-[#22251F] text-right max-w-[240px] truncate">
              {tx.description}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-3">
            <span className="text-[#77786F] flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-[#A3A297]" /> Hub Module
            </span>
            <span className="font-semibold text-[#526B56] bg-white px-2.5 py-0.5 rounded-full border border-[#EAE8DF]">
              {tx.module || 'System'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-3">
            <span className="text-[#77786F] flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#A3A297]" /> Timestamp
            </span>
            <span className="font-medium text-[#22251F] tabular-nums">
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
            <span className="text-[#77786F] flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-[#A3A297]" /> Authorized By
            </span>
            <span className="font-semibold text-[#22251F]">
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


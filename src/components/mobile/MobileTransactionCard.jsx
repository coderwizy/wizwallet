import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, Wallet, Landmark, Briefcase, Layers, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getModuleIcon = (module) => {
  switch (module) {
    case 'Wallet': return Wallet;
    case 'Bank': return Landmark;
    case 'Business': return Briefcase;
    case 'Sectors': return Layers;
    default: return Wallet;
  }
};

const MobileTransactionCard = ({ tx }) => {
  if (!tx) return null;
  const [expanded, setExpanded] = useState(false);
  const isCredit = tx.type === 'Credit';
  const ModuleIcon = getModuleIcon(tx.module || 'System');
  const desc = tx.description || tx.desc || 'Transaction';

  return (
    <div className="bg-white p-4 border border-[#E5DFD1] rounded-2xl transition-all shadow-xs text-[#1C1917]">
      <div 
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isCredit ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            {isCredit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black uppercase text-[#1C1917] truncate tracking-tight">{desc}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#0284C7] uppercase bg-[#E0F2FE] border border-[#BAE6FD] px-2 py-0.5 rounded-full">
                <ModuleIcon className="w-2.5 h-2.5" />
                {tx.module || 'System'}
              </span>
              <span className="text-[9px] text-[#78716C] font-bold uppercase">{tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 flex items-center gap-2">
          <div>
            <p className={`text-sm font-black tabular-nums ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isCredit ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] font-bold text-[#A8A29E] uppercase text-right">{tx.type}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#A8A29E] transition-transform ${expanded ? 'rotate-180 text-[#0284C7]' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-[#E5DFD1] space-y-2 overflow-hidden"
          >
            <div className="flex justify-between items-center text-[10px] text-[#78716C] uppercase font-bold">
              <span>Timestamp</span>
              <span className="text-[#1C1917]">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#78716C] uppercase font-bold">
              <span>Operator</span>
              <span className="text-[#0284C7] font-black">{tx.user || 'Raghav94'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#78716C] uppercase font-bold">
              <span>Transaction ID</span>
              <span className="text-[#A8A29E] font-mono text-[9px] truncate max-w-36">{tx.id}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(MobileTransactionCard);

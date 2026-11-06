import React, { useState } from 'react';
import { useEmpire } from '../../context/EmpireContext';
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
  const { currencySymbol } = useEmpire();
  if (!tx) return null;
  const [expanded, setExpanded] = useState(false);
  const isCredit = tx.type === 'Credit';
  const ModuleIcon = getModuleIcon(tx.module || 'System');
  const desc = tx.description || tx.desc || 'Transaction';

  return (
    <div className="bg-white p-4 border border-ww-border rounded-xl transition-all shadow-[0_1px_3px_rgba(34,37,31,0.05)] text-ww-text">
      <div 
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isCredit
              ? 'bg-ww-green-bg border-ww-success/30 text-ww-success'
              : 'bg-ww-danger-bg border-ww-danger/30 text-ww-danger'
          }`}>
            {isCredit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-ww-text truncate">{desc}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-ww-accent bg-ww-green-bg border border-ww-success/30 px-2 py-0.5 rounded-full">
                <ModuleIcon className="w-2.5 h-2.5" />
                {tx.module || 'System'}
              </span>
              <span className="text-[9px] text-ww-text-muted font-medium">{tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'Today'}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 flex items-center gap-2">
          <div>
            <p className={`text-sm font-semibold tabular-nums ${isCredit ? 'text-ww-success' : 'text-ww-danger'}`}>
              {isCredit ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[9px] font-medium text-ww-text-muted uppercase text-right">{tx.type}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-ww-text-muted transition-transform ${expanded ? 'rotate-180 text-ww-accent' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-ww-border space-y-2 overflow-hidden"
          >
            <div className="flex justify-between items-center text-[10px] text-ww-text-muted font-medium">
              <span>Timestamp</span>
              <span className="text-ww-text font-semibold">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-ww-text-muted font-medium">
              <span>Operator</span>
              <span className="text-ww-accent font-semibold">{tx.user || 'Raghav94'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-ww-text-muted font-medium">
              <span>Transaction ID</span>
              <span className="text-ww-text-muted font-mono text-[9px] truncate max-w-36">{tx.id}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(MobileTransactionCard);

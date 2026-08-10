import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { 
  Search, Download, ArrowUpRight, ArrowDownLeft, 
  Wallet, Landmark, Briefcase, Layers, Calendar, X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import MobileTransactionCard from '../../components/mobile/MobileTransactionCard';

const TransactionHub = () => {
  const { transactions } = useEmpire();
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { filtered, totalCredit, totalDebit } = useMemo(() => {
    if (!Array.isArray(transactions)) return { filtered: [], totalCredit: 0, totalDebit: 0 };
    const f = transactions.filter(tx => {
      if (!tx) return false;
      const desc = tx.description || tx.desc || 'Transaction';
      const matchesSearch = desc.toLowerCase().includes((search || '').toLowerCase());
      const matchesModule = filterModule === 'All' || tx.module === filterModule;
      const matchesType   = filterType === 'All' || tx.type === filterType;
      
      let matchesFrom = true;
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        if (!isNaN(fromTime)) {
          matchesFrom = new Date(tx.timestamp).getTime() >= fromTime;
        }
      }

      let matchesTo = true;
      if (dateTo) {
        const toTime = new Date(dateTo + 'T23:59:59').getTime();
        if (!isNaN(toTime)) {
          matchesTo = new Date(tx.timestamp).getTime() <= toTime;
        }
      }

      return matchesSearch && matchesModule && matchesType && matchesFrom && matchesTo;
    });
    const credit = f.filter(t => t?.type === 'Credit').reduce((s, t) => s + (t.amount || 0), 0);
    const debit  = f.filter(t => t?.type === 'Debit').reduce((s, t) => s + (t.amount || 0), 0);
    return { filtered: f, totalCredit: credit, totalDebit: debit };
  }, [transactions, search, filterModule, filterType, dateFrom, dateTo]);

  const getModuleIcon = (module) => {
    switch (module) {
      case 'Wallet': return Wallet;
      case 'Bank': return Landmark;
      case 'Business': return Briefcase;
      case 'Sectors': return Layers;
      default: return Wallet;
    }
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Description', 'Module', 'Type', 'Amount', 'User'];
    const rows = filtered.map(tx => [
      new Date(tx.timestamp).toLocaleString(),
      tx.description, tx.module, tx.type, tx.amount, tx.user
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `WizWallet_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runAudit = () => {
    setFilterType(prev => prev === 'Credit' ? 'All' : 'Credit');
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">Executive Transaction Auditor</p>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">Global Ledger</h2>
        </div>

        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <Button variant="secondary" icon={Download} onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button
            variant={filterType === 'Credit' ? 'primary' : 'outline'}
            icon={FileText}
            onClick={runAudit}
          >
            {filterType === 'Credit' ? 'Clear Audit' : 'Audit Reports'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Visible Items</span>
          <span className="text-lg font-black text-white tabular-nums">{filtered.length}</span>
        </Card>
        <Card className="p-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Credits</span>
          <span className="text-lg font-black text-emerald-400 tabular-nums">+${totalCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </Card>
        <Card className="p-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Debits</span>
          <span className="text-lg font-black text-rose-400 tabular-nums">-${totalDebit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </Card>
      </div>

      {/* Table Container */}
      <Card className="overflow-hidden p-0 border-white/10">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-white/10 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Filter by description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-neon-blue text-white cursor-pointer"
              >
                <option value="All">All Modules</option>
                <option value="Wallet">Wallet</option>
                <option value="Bank">Bank</option>
                <option value="Business">Business</option>
                <option value="Sectors">Sectors</option>
                <option value="Transfer">Transfers</option>
              </select>
              <Button
                variant={showDateFilter ? 'outline' : 'secondary'}
                icon={Calendar}
                onClick={() => setShowDateFilter(p => !p)}
              >
                Date Filter
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showDateFilter && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex flex-col sm:flex-row flex-wrap gap-4 p-4 bg-white/5 border border-white/10 rounded-xl items-start sm:items-end">
                <div className="w-full sm:w-auto">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">From Date</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-neon-blue text-white" />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">To Date</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-neon-blue text-white" />
                </div>
                {(dateFrom || dateTo) && (
                  <Button variant="danger" size="sm" icon={X} onClick={clearDateFilter}>
                    Clear Dates
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile View: Touch-Friendly Transaction Cards (< 768px) */}
        <div className="block md:hidden p-4 space-y-3">
          {filtered.map((tx) => (
            <MobileTransactionCard key={tx.id} tx={tx} />
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500 uppercase tracking-widest text-xs font-bold italic">No transactions match current criteria.</div>
          )}
        </div>

        {/* Desktop View: Full Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto scroll-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Module</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tx) => {
                const Icon = getModuleIcon(tx.module);
                const isCredit = tx.type === 'Credit';
                return (
                  <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-300 tabular-nums">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      <p className="text-[10px] font-black text-slate-500 mt-0.5 uppercase">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight group-hover:text-neon-blue transition-colors">{tx.description}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.user}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="cyan" className="gap-1.5">
                        <Icon className="w-3 h-3" />
                        <span>{tx.module}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>{tx.type}</span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black tabular-nums text-base ${isCredit ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {isCredit ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold italic">No transactions match current criteria.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(TransactionHub);

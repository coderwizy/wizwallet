import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Search, Download, ArrowUpRight, ArrowDownLeft,
  Wallet, Landmark, Briefcase, Layers, Calendar, X,
  FileText, Filter, ArrowLeftRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import MobileTransactionCard from '../../components/mobile/MobileTransactionCard';
import TransactionDetailModal from '../../components/ui/TransactionDetailModal';

const TransactionHub = () => {
  const { transactions } = useEmpire();
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

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
      case 'Transfer': return ArrowLeftRight;
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

  const netCashFlow = totalCredit - totalDebit;

  return (
    <div className="space-y-6 pb-12">
      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        tx={selectedTx}
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
      />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Executive Ledger & Transaction Auditor
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Global Ledger
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={Download} onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button
            variant={filterType === 'Credit' ? 'primary' : 'outline'}
            icon={FileText}
            onClick={runAudit}
          >
            {filterType === 'Credit' ? 'Show All' : 'Audit Credits'}
          </Button>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Total Entries</p>
          <h3 className="text-2xl font-bold text-[#22251F] tabular-nums mt-1">{filtered.length} Records</h3>
          <p className="text-[10px] text-[#77786F] mt-1">Live synchronized ledger</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Total Credits</p>
          <h3 className="text-2xl font-bold text-[#66866A] tabular-nums mt-1">
            +${totalCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Yields, dividends, and deposits</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Total Debits</p>
          <h3 className="text-2xl font-bold text-[#C66D65] tabular-nums mt-1">
            -${totalDebit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Venture costs & payments</p>
        </Card>
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net Cash Flow</p>
          <h3 className={`text-2xl font-bold tabular-nums mt-1 ${netCashFlow >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
            {netCashFlow >= 0 ? '+' : '−'}${Math.abs(netCashFlow).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </h3>
          <p className="text-[10px] text-[#77786F] mt-1">Net portfolio retention</p>
        </Card>
      </div>

      {/* ── Table & Filter Container ── */}
      <Card className="overflow-hidden p-0 border border-[#EAE8DF] bg-white">
        {/* Filter Toolbar */}
        <div className="p-4 md:p-5 border-b border-[#EAE8DF] bg-[#FCFBF8] space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search description, recipient, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="bg-white border border-[#EAE8DF] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#22251F] outline-none focus:border-[#526B56] cursor-pointer"
              >
                <option value="All">All Modules</option>
                <option value="Wallet">Wallet Hub</option>
                <option value="Bank">Global Bank</option>
                <option value="Business">Business</option>
                <option value="Sectors">Sectors</option>
                <option value="Transfer">Transfers</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-[#EAE8DF] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#22251F] outline-none focus:border-[#526B56] cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Credit">Credits (+)</option>
                <option value="Debit">Debits (−)</option>
              </select>

              <Button
                variant={showDateFilter ? 'primary' : 'secondary'}
                size="md"
                icon={Calendar}
                onClick={() => setShowDateFilter(p => !p)}
              >
                Dates
              </Button>
            </div>
          </div>

          {/* Expandable Date Filter Bar */}
          <AnimatePresence>
            {showDateFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-2"
              >
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-3.5 bg-white border border-[#EAE8DF] rounded-xl items-start sm:items-end">
                  <div className="w-full sm:w-auto">
                    <label className="text-[10px] font-bold text-[#77786F] uppercase tracking-wider block mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-3 py-1.5 text-xs font-medium text-[#22251F] outline-none focus:border-[#526B56]"
                    />
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="text-[10px] font-bold text-[#77786F] uppercase tracking-wider block mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-3 py-1.5 text-xs font-medium text-[#22251F] outline-none focus:border-[#526B56]"
                    />
                  </div>
                  {(dateFrom || dateTo) && (
                    <Button variant="danger" size="sm" icon={X} onClick={clearDateFilter}>
                      Clear Range
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile View (< 768px): MobileTransactionCards */}
        <div className="block md:hidden p-4 space-y-2.5">
          {filtered.map((tx) => (
            <div key={tx.id} onClick={() => setSelectedTx(tx)}>
              <MobileTransactionCard tx={tx} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[#A3A297] text-xs font-medium">
              No transactions match current filter criteria.
            </div>
          )}
        </div>

        {/* Desktop View (>= 768px): Financial Data Table */}
        <div className="hidden md:block overflow-x-auto scroll-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FCFBF8] border-b border-[#EAE8DF]">
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A297]">Timestamp</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A297]">Description</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A297]">Hub Module</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A297]">Type</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A297] text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE7]">
              {filtered.map((tx) => {
                const Icon = getModuleIcon(tx.module);
                const isCredit = tx.type === 'Credit';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-[#FCFBF8] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-semibold text-[#22251F] tabular-nums">
                        {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-[#A3A297] mt-0.5">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isCredit
                            ? 'bg-[#EDF2E9] border-[#C8D9CA] text-[#66866A]'
                            : 'bg-[#FCEEED] border-[#E8C5C3] text-[#C66D65]'
                        }`}>
                          {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#22251F] truncate group-hover:text-[#526B56] transition-colors">
                            {tx.description}
                          </p>
                          <p className="text-[10px] text-[#A3A297]">Authorized by {tx.user || 'raghav94'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="accent">
                        <Icon className="w-3 h-3" />
                        <span>{tx.module || 'System'}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={isCredit ? 'success' : 'danger'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-right font-extrabold tabular-nums text-sm whitespace-nowrap ${
                      isCredit ? 'text-[#66866A]' : 'text-[#22251F]'
                    }`}>
                      {isCredit ? '+' : '−'}${Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#A3A297] text-xs font-medium">
              No financial activities match the selected filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(TransactionHub);

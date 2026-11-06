import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { Search, Download, FileText, Calendar, Filter } from 'lucide-react';
import MobileTransactionCard from '../MobileTransactionCard';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const MobileLedgerView = () => {
  const { transactions, currencySymbol } = useEmpire();
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const { filtered, totalCredit, totalDebit } = useMemo(() => {
    if (!Array.isArray(transactions)) return { filtered: [], totalCredit: 0, totalDebit: 0 };
    const f = transactions.filter(tx => {
      if (!tx) return false;
      const desc = tx.description || tx.desc || 'Transaction';
      const matchesSearch = desc.toLowerCase().includes((search || '').toLowerCase());
      const matchesModule = filterModule === 'All' || tx.module === filterModule;
      const matchesType   = filterType === 'All' || tx.type === filterType;
      return matchesSearch && matchesModule && matchesType;
    });
    const credit = f.filter(t => t?.type === 'Credit').reduce((s, t) => s + (t.amount || 0), 0);
    const debit  = f.filter(t => t?.type === 'Debit').reduce((s, t) => s + (t.amount || 0), 0);
    return { filtered: f, totalCredit: credit, totalDebit: debit };
  }, [transactions, search, filterModule, filterType]);

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

  return (
    <div className="space-y-4 pb-8">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="p-3 border border-ww-border bg-white">
          <p className="text-[9px] font-semibold text-ww-text-muted uppercase">Items</p>
          <p className="text-sm font-bold text-ww-text tabular-nums mt-0.5">{filtered.length}</p>
        </Card>
        <Card className="p-3 border border-ww-border bg-white">
          <p className="text-[9px] font-semibold text-ww-success uppercase">Credits</p>
          <p className="text-sm font-bold text-ww-success tabular-nums mt-0.5">
            +{currencySymbol}{totalCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
        <Card className="p-3 border border-ww-border bg-white">
          <p className="text-[9px] font-semibold text-ww-danger uppercase">Debits</p>
          <p className="text-sm font-bold text-ww-danger tabular-nums mt-0.5">
            -{currencySymbol}{totalDebit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <Card className="p-3.5 border border-ww-border bg-white space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-ww-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-ww-elevated border border-ww-border rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-ww-text placeholder-ww-text-muted outline-none focus:border-ww-accent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="flex-1 bg-ww-elevated border border-ww-border rounded-xl p-2 text-xs font-semibold text-ww-text outline-none"
          >
            <option value="All">All Hubs</option>
            <option value="Wallet">Wallet</option>
            <option value="Bank">Bank</option>
            <option value="Business">Business</option>
            <option value="Sectors">Sectors</option>
            <option value="Transfer">Transfers</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="flex-1 bg-ww-elevated border border-ww-border rounded-xl p-2 text-xs font-semibold text-ww-text outline-none"
          >
            <option value="All">All Types</option>
            <option value="Credit">Credits (+)</option>
            <option value="Debit">Debits (−)</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={exportToCSV}
            title="Export CSV"
          >
            CSV
          </Button>
        </div>
      </Card>

      {/* ── Transaction Cards Feed ── */}
      <div className="space-y-2.5">
        {filtered.map((tx) => (
          <MobileTransactionCard key={tx.id} tx={tx} />
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-ww-text-muted bg-white rounded-2xl border border-ww-border text-xs font-medium">
            No transactions match criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileLedgerView);

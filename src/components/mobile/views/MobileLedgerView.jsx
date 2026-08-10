import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { Search, Download, FileText, Calendar, Filter } from 'lucide-react';
import MobileTransactionCard from '../MobileTransactionCard';

const MobileLedgerView = () => {
  const { transactions } = useEmpire();
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
      {/* Summary Pills */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-[#E5DFD1] shadow-xs">
          <p className="text-[8px] font-black text-[#78716C] uppercase">Items</p>
          <p className="text-sm font-black text-[#1C1917] tabular-nums mt-0.5">{filtered.length}</p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#E5DFD1] shadow-xs">
          <p className="text-[8px] font-black text-[#78716C] uppercase">Credits</p>
          <p className="text-sm font-black text-emerald-600 tabular-nums mt-0.5">+${Math.round(totalCredit / 1000)}k</p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#E5DFD1] shadow-xs">
          <p className="text-[8px] font-black text-[#78716C] uppercase">Debits</p>
          <p className="text-sm font-black text-rose-600 tabular-nums mt-0.5">-${Math.round(totalDebit / 1000)}k</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transaction stream..."
            className="w-full bg-[#F9F7F1] border border-[#E5DFD1] rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-[#1C1917] outline-none"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="flex-1 bg-[#F4EFE6] border border-[#E2DAC8] rounded-xl px-3 py-2 text-[10px] font-black uppercase text-[#1C1917] outline-none cursor-pointer"
          >
            <option value="All">All Modules</option>
            <option value="Wallet">Wallet</option>
            <option value="Bank">Bank</option>
            <option value="Business">Business</option>
            <option value="Sectors">Sectors</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0284C7] text-white text-[10px] font-black uppercase shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Mobile Transaction List */}
      <div className="space-y-2.5">
        {filtered.map(tx => (
          <MobileTransactionCard key={tx.id} tx={tx} />
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#78716C] uppercase text-xs font-bold italic">
            No matching transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileLedgerView);

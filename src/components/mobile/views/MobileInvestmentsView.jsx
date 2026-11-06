import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import {
  TrendingUp, TrendingDown, DollarSign, Plus,
  Search, Trash2, Edit3, PieChart as PieIcon, ArrowRight
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';
import MobileActionSheet from '../MobileActionSheet';
import ConfirmationDialog from '../../ui/ConfirmationDialog';

const MobileInvestmentsView = () => {
  const { investments, addInvestment, removeInvestment, updateInvestment, privacyMode } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    symbol: '',
    name: '',
    type: 'Stock',
    quantity: '10',
    purchasePrice: '100',
    currentPrice: '100',
    dividendYield: '0.02'
  });

  const totalValue = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const q = Number(inv.quantity) || 0;
      const p = Number(inv.currentPrice || inv.purchasePrice || 0);
      return sum + (q * p);
    }, 0);
  }, [investments]);

  const filtered = useMemo(() => {
    return investments.filter(inv =>
      inv.symbol.toLowerCase().includes(search.toLowerCase()) ||
      inv.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [investments, search]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.symbol.trim() || !form.name.trim()) return;

    addInvestment({
      symbol: form.symbol.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      quantity: parseFloat(form.quantity) || 1,
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      currentPrice: parseFloat(form.currentPrice) || parseFloat(form.purchasePrice) || 0,
      dividendYield: parseFloat(form.dividendYield) || 0,
      date: new Date().toISOString().split('T')[0]
    });

    setForm({ symbol: '', name: '', type: 'Stock', quantity: '10', purchasePrice: '100', currentPrice: '100', dividendYield: '0.02' });
    setShowAddSheet(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingInv) return;

    updateInvestment(editingInv.id, {
      symbol: form.symbol.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      quantity: parseFloat(form.quantity) || editingInv.quantity,
      purchasePrice: parseFloat(form.purchasePrice) || editingInv.purchasePrice,
      currentPrice: parseFloat(form.currentPrice) || editingInv.currentPrice
    });
    setEditingInv(null);
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) removeInvestment(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title={`Liquidate ${deleteConfirm?.symbol}?`}
        description="Proceeds will be credited to your Smart Wallet."
        confirmText="Liquidate"
        variant="danger"
      />

      {/* Summary Card */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Portfolio Valuation</p>
            <h2 className="text-3xl font-extrabold text-[#22251F] tabular-nums mt-0.5">
              {currencySymbol}{mask(totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
            </h2>
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddSheet(true)}>
            Add Asset
          </Button>
        </div>
      </Card>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#A3A297] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search symbol (e.g. AAPL)..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EAE8DF] rounded-xl outline-none focus:border-[#526B56]"
        />
      </div>

      {/* Assets List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297] px-1">
          Positions ({filtered.length})
        </h3>
        {filtered.map(inv => {
          const qty = Number(inv.quantity) || 0;
          const cur = Number(inv.currentPrice || inv.purchasePrice || 0);
          const buy = Number(inv.purchasePrice || 0);
          const posVal = qty * cur;
          const pnl = posVal - (qty * buy);

          return (
            <Card key={inv.id} className="p-4 border border-[#EAE8DF] bg-white space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#22251F]">{inv.symbol}</span>
                    <Badge variant="default">{inv.type}</Badge>
                  </div>
                  <p className="text-[10px] text-[#77786F] truncate">{inv.name}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#22251F] tabular-nums block">
                    {currencySymbol}{mask(posVal.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
                  </span>
                  <span className={`text-[10px] font-bold tabular-nums ${pnl >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
                    {pnl >= 0 ? '+' : ''}{currencySymbol}{mask(Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 }))}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE8DF] flex justify-between items-center text-xs">
                <span className="text-[10px] text-[#77786F]">
                  {qty} Units @ ${cur.toFixed(2)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInv(inv);
                      setForm({
                        symbol: inv.symbol,
                        name: inv.name,
                        type: inv.type,
                        quantity: String(inv.quantity),
                        purchasePrice: String(inv.purchasePrice),
                        currentPrice: String(inv.currentPrice),
                        dividendYield: String(inv.dividendYield || 0)
                      });
                    }}
                    className="p-1 rounded text-[#A3A297] hover:text-[#22251F] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(inv)}
                    className="p-1 rounded text-[#A3A297] hover:text-[#C66D65] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Sheet */}
      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Acquire Investment Position"
        subtitle="Record stocks, ETFs, or gold holdings"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Symbol (e.g. NVDA, VOO)"
            required
            value={form.symbol}
            onChange={e => setForm({ ...form, symbol: e.target.value })}
          />
          <Input
            label="Asset Full Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
            />
            <Input
              label="Purchase Price ($)"
              type="number"
              value={form.purchasePrice}
              onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Confirm Purchase
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileInvestmentsView);


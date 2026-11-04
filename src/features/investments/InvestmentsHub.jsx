import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  TrendingUp, TrendingDown, DollarSign, Plus, ArrowUpRight,
  PieChart as PieIcon, Search, Filter, ShieldCheck, RefreshCw,
  BarChart3, Award, Layers, Trash2, Edit3, ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const ASSET_COLORS = {
  Stock: '#526B56',
  ETF: '#82977B',
  Commodity: '#C18A48',
  Bond: '#4A7C8A',
  Crypto: '#7C5ABF'
};

const PALETTE = ['#526B56', '#82977B', '#C18A48', '#4A7C8A', '#7C5ABF', '#C66D65'];

const InvestmentsHub = () => {
  const {investments, addInvestment, removeInvestment, updateInvestment,
    wallet, privacyMode, currencySymbol } = useEmpire();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form State
  const [form, setForm] = useState({
    symbol: '',
    name: '',
    type: 'Stock',
    quantity: '10',
    purchasePrice: '100',
    currentPrice: '100',
    dividendYield: '0.02'
  });

  // Aggregated Portfolio Calculations
  const portfolioMetrics = useMemo(() => {
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalAnnualDividends = 0;

    investments.forEach(inv => {
      const qty = Number(inv.quantity) || 0;
      const buyPrice = Number(inv.purchasePrice) || 0;
      const curPrice = Number(inv.currentPrice) || buyPrice;
      const divRate = Number(inv.dividendYield) || 0;

      totalInvested += qty * buyPrice;
      totalCurrentValue += qty * curPrice;
      totalAnnualDividends += (qty * curPrice) * divRate;
    });

    const totalPnL = totalCurrentValue - totalInvested;
    const totalPnLPct = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : '0.00';

    return {
      totalInvested,
      totalCurrentValue,
      totalPnL,
      totalPnLPct,
      monthlyDividends: Math.round(totalAnnualDividends / 12)
    };
  }, [investments]);

  // Asset Allocation for Recharts
  const allocationData = useMemo(() => {
    const map = {};
    investments.forEach(inv => {
      const type = inv.type || 'Other';
      const val = (Number(inv.quantity) || 0) * (Number(inv.currentPrice) || Number(inv.purchasePrice) || 0);
      map[type] = (map[type] || 0) + val;
    });

    const total = Object.values(map).reduce((a, b) => a + b, 0);
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
      color: ASSET_COLORS[name] || PALETTE[i % PALETTE.length]
    }));
  }, [investments]);

  // Filtered Assets List
  const filteredInvestments = useMemo(() => {
    return investments.filter(inv => {
      const matchesSearch = inv.symbol.toLowerCase().includes(search.toLowerCase()) ||
                            inv.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || inv.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [investments, search, filterType]);

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

    setForm({
      symbol: '',
      name: '',
      type: 'Stock',
      quantity: '10',
      purchasePrice: '100',
      currentPrice: '100',
      dividendYield: '0.02'
    });
    setIsAddOpen(false);
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
      currentPrice: parseFloat(form.currentPrice) || editingInv.currentPrice,
      dividendYield: parseFloat(form.dividendYield) || 0
    });

    setEditingInv(null);
  };

  const openEdit = (inv) => {
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
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) removeInvestment(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title={`Liquidate Position: ${deleteConfirm?.symbol}?`}
        description="Proceeds will be credited directly to your liquid Smart Wallet vault."
        confirmText="Liquidate Position"
        variant="danger"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Global Capital Markets & Securities
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Investment Portfolio
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Add Position
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Portfolio Value</span>
          <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
            ${mask(portfolioMetrics.totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Across {investments.length} active holdings</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Unrealized P&L</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className={`text-2xl font-extrabold tabular-nums ${portfolioMetrics.totalPnL >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
              {portfolioMetrics.totalPnL >= 0 ? '+' : ''}${mask(Math.abs(portfolioMetrics.totalPnL).toLocaleString(undefined, { maximumFractionDigits: 0 }))}
            </h3>
            <span className={`text-xs font-bold ${portfolioMetrics.totalPnL >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
              ({portfolioMetrics.totalPnLPct}%)
            </span>
          </div>
          <p className="text-[11px] text-[#77786F] mt-1">Cost basis: ${mask(portfolioMetrics.totalInvested.toLocaleString())}</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Est. Monthly Dividends</span>
          <h3 className="text-2xl font-extrabold text-[#C18A48] tabular-nums mt-1">
            +${mask(portfolioMetrics.monthlyDividends.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Passive securities cash flow</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Liquid Buying Power</span>
          <h3 className="text-2xl font-extrabold text-[#4A7C8A] tabular-nums mt-1">
            ${mask((wallet?.balance || 0).toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Available in Smart Wallet</p>
        </Card>
      </div>

      {/* Allocation & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <Card className="p-6 border border-[#EAE8DF] bg-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#526B56]" />
                  <h3 className="text-sm font-bold text-[#22251F]">Asset Allocation</h3>
                </div>
                <Badge variant="accent">{allocationData.length} Classes</Badge>
              </div>
              <p className="text-xs text-[#77786F]">Diversification profile across equities, commodities, and bonds</p>
            </div>

            <div className="h-48 my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#EAE8DF]">
              {allocationData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-[#22251F]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#77786F]">{item.percentage}%</span>
                    <span className="font-bold text-[#22251F] tabular-nums">${mask(item.value.toLocaleString())}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="p-6 border border-[#EAE8DF] bg-white h-full flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-[#22251F]">Simulated Market Engine</h3>
                <Badge variant="success">Auto-Fluctuation Active</Badge>
              </div>
              <p className="text-xs text-[#77786F]">
                Holding prices dynamically adjust in real time during heartbeat pulses based on market volatility simulations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
                <span className="text-[10px] text-[#A3A297] font-semibold uppercase">Largest Holding</span>
                <p className="text-sm font-bold text-[#22251F] mt-0.5">
                  {investments[0]?.symbol || 'N/A'} · {investments[0]?.name || ''}
                </p>
              </div>
              <div className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
                <span className="text-[10px] text-[#A3A297] font-semibold uppercase">Dividend Yield</span>
                <p className="text-sm font-bold text-[#526B56] mt-0.5">
                  ~2.4% Weighted APY
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#EDF2E9] border border-[#D5DFD1] rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#526B56] shrink-0" />
              <p className="text-[11px] text-[#526B56] leading-relaxed">
                <strong>Local Simulation Guarantee:</strong> WizWallet 3.0 never presents synthetic sandbox data as official financial advice. All trades are executed against your local Smart Wallet vault.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Holdings Table */}
      <Card className="overflow-hidden border border-[#EAE8DF] bg-white p-0">
        <div className="p-4 border-b border-[#EAE8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#22251F]">Portfolio Positions ({filteredInvestments.length})</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A3A297] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search symbol..."
                className="pl-8 pr-3 py-1.5 text-xs bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg outline-none focus:border-[#526B56] w-36 sm:w-48"
              />
            </div>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-2.5 py-1.5 outline-none font-semibold text-[#22251F]"
            >
              <option value="All">All Asset Types</option>
              <option value="Stock">Stocks</option>
              <option value="ETF">ETFs</option>
              <option value="Commodity">Commodities / Gold</option>
              <option value="Bond">Bonds</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCFBF8] border-b border-[#EAE8DF] text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3 text-right">Holdings</th>
                <th className="py-3 px-3 text-right">Buy Price</th>
                <th className="py-3 px-3 text-right">Market Price</th>
                <th className="py-3 px-3 text-right">Position Value</th>
                <th className="py-3 px-3 text-right">Profit / Loss</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8DF]">
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#A3A297]">
                    No investment positions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvestments.map(inv => {
                  const qty = Number(inv.quantity) || 0;
                  const buyPrice = Number(inv.purchasePrice) || 0;
                  const curPrice = Number(inv.currentPrice) || buyPrice;
                  const totalVal = qty * curPrice;
                  const pnl = totalVal - (qty * buyPrice);
                  const pnlPct = buyPrice > 0 ? ((pnl / (qty * buyPrice)) * 100).toFixed(2) : '0';

                  return (
                    <tr key={inv.id} className="hover:bg-[#FCFBF8] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#22251F]">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-[#EDF2E9] text-[#526B56] font-extrabold flex items-center justify-center text-xs border border-[#D5DFD1]">
                            {inv.symbol.slice(0, 3)}
                          </span>
                          <div>
                            <p className="font-bold text-[#22251F]">{inv.symbol}</p>
                            <p className="text-[10px] text-[#77786F] truncate max-w-[140px]">{inv.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge variant="default">{inv.type}</Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-[#22251F] tabular-nums">
                        {mask(qty.toLocaleString())}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#77786F] tabular-nums">
                        ${mask(buyPrice.toFixed(2))}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#22251F] tabular-nums">
                        ${mask(curPrice.toFixed(2))}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#22251F] tabular-nums">
                        ${mask(totalVal.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold tabular-nums">
                        <span className={pnl >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}>
                          {pnl >= 0 ? '+' : ''}${mask(Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 }))}
                          <span className="text-[10px] block opacity-85">({pnlPct}%)</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(inv)}
                            className="p-1 rounded text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] cursor-pointer"
                            title="Edit / Rebalance"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(inv)}
                            className="p-1 rounded text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] cursor-pointer"
                            title="Liquidate Position"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Position Modal */}
      <Modal
        isOpen={isAddOpen || !!editingInv}
        onClose={() => { setIsAddOpen(false); setEditingInv(null); }}
        title={editingInv ? `Edit Position: ${editingInv.symbol}` : 'Acquire Investment Asset'}
        subtitle="Calibrate securities units, cost basis, and dividend yield"
      >
        <form onSubmit={editingInv ? handleEditSubmit : handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Symbol / Ticker"
              required
              value={form.symbol}
              onChange={e => setForm({ ...form, symbol: e.target.value })}
              placeholder="e.g. NVDA, VOO"
            />
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Asset Class</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Stock">Stock / Equity</option>
                <option value="ETF">Index ETF</option>
                <option value="Commodity">Commodity / Gold</option>
                <option value="Bond">Sovereign Bond</option>
                <option value="Crypto">Crypto Asset</option>
              </select>
            </div>
          </div>

          <Input
            label="Asset Full Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. NVIDIA Corporation"
          />

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Quantity (Units)"
              type="number"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              min="0.01"
              step="any"
              required
            />
            <Input
              label="Purchase Price ($)"
              type="number"
              value={form.purchasePrice}
              onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
              min="0.01"
              step="any"
              required
            />
            <Input
              label="Market Price ($)"
              type="number"
              value={form.currentPrice}
              onChange={e => setForm({ ...form, currentPrice: e.target.value })}
              min="0.01"
              step="any"
              required
            />
          </div>

          <Input
            label="Annual Dividend Yield Rate (Decimal, e.g. 0.02 = 2%)"
            type="number"
            step="0.001"
            value={form.dividendYield}
            onChange={e => setForm({ ...form, dividendYield: e.target.value })}
          />

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            {editingInv ? 'Save Position Changes' : 'Confirm Asset Purchase'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(InvestmentsHub);


import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Building2, Home, Landmark, Plus, Trash2, Edit3,
  DollarSign, TrendingUp, Percent, MapPin, ShieldCheck,
  Search, Filter
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const RealEstateHub = () => {
  const {
    properties, addProperty, updateProperty, removeProperty,
    bank, privacyMode
  } = useEmpire();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    type: 'Residential',
    address: '',
    purchasePrice: '1000000',
    currentValuation: '1250000',
    monthlyRent: '8000',
    maintenanceMonthly: '1000',
    taxMonthly: '800',
    loanBalance: '400000',
    mortgagePaymentMonthly: '2500',
    status: 'Occupied'
  });

  const portfolioMetrics = useMemo(() => {
    let totalValue = 0;
    let totalDebt = 0;
    let totalGrossRent = 0;
    let totalMonthlyBurn = 0;

    properties.forEach(p => {
      totalValue += Number(p.currentValuation || p.purchasePrice || 0);
      totalDebt += Number(p.loanBalance || 0);
      totalGrossRent += Number(p.monthlyRent || 0);
      totalMonthlyBurn += Number(p.maintenanceMonthly || 0) + Number(p.taxMonthly || 0) + Number(p.mortgagePaymentMonthly || 0);
    });

    const netEquity = totalValue - totalDebt;
    const netMonthlyIncome = totalGrossRent - totalMonthlyBurn;
    const grossYieldAnnualPct = totalValue > 0 ? (((totalGrossRent * 12) / totalValue) * 100).toFixed(2) : '0.00';

    return {
      totalValue,
      totalDebt,
      netEquity,
      totalGrossRent,
      netMonthlyIncome,
      grossYieldAnnualPct
    };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            (p.address || '').toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'All' || p.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [properties, search, filterType]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addProperty({
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim() || 'Prime Location',
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      currentValuation: parseFloat(form.currentValuation) || parseFloat(form.purchasePrice) || 0,
      monthlyRent: parseFloat(form.monthlyRent) || 0,
      maintenanceMonthly: parseFloat(form.maintenanceMonthly) || 0,
      taxMonthly: parseFloat(form.taxMonthly) || 0,
      loanBalance: parseFloat(form.loanBalance) || 0,
      mortgagePaymentMonthly: parseFloat(form.mortgagePaymentMonthly) || 0,
      status: form.status
    });

    setForm({
      name: '',
      type: 'Residential',
      address: '',
      purchasePrice: '1000000',
      currentValuation: '1250000',
      monthlyRent: '8000',
      maintenanceMonthly: '1000',
      taxMonthly: '800',
      loanBalance: '400000',
      mortgagePaymentMonthly: '2500',
      status: 'Occupied'
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProp) return;

    updateProperty(editingProp.id, {
      name: form.name.trim() || editingProp.name,
      type: form.type,
      address: form.address,
      purchasePrice: parseFloat(form.purchasePrice) || editingProp.purchasePrice,
      currentValuation: parseFloat(form.currentValuation) || editingProp.currentValuation,
      monthlyRent: parseFloat(form.monthlyRent) || 0,
      maintenanceMonthly: parseFloat(form.maintenanceMonthly) || 0,
      taxMonthly: parseFloat(form.taxMonthly) || 0,
      loanBalance: parseFloat(form.loanBalance) || 0,
      mortgagePaymentMonthly: parseFloat(form.mortgagePaymentMonthly) || 0,
      status: form.status
    });

    setEditingProp(null);
  };

  const openEdit = (p) => {
    setEditingProp(p);
    setForm({
      name: p.name,
      type: p.type,
      address: p.address || '',
      purchasePrice: String(p.purchasePrice || 0),
      currentValuation: String(p.currentValuation || 0),
      monthlyRent: String(p.monthlyRent || 0),
      maintenanceMonthly: String(p.maintenanceMonthly || 0),
      taxMonthly: String(p.taxMonthly || 0),
      loanBalance: String(p.loanBalance || 0),
      mortgagePaymentMonthly: String(p.mortgagePaymentMonthly || 0),
      status: p.status || 'Occupied'
    });
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) removeProperty(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title={`Liquidate Asset: ${deleteConfirm?.name}?`}
        description="Net equity (market value minus remaining mortgage) will be credited directly to your Global Bank reserve."
        confirmText="Dispose Property"
        variant="danger"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Real Estate Sovereignty & Property Holdings
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Real Estate Empire
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Acquire Property
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Gross Portfolio Value</span>
          <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
            ${mask(portfolioMetrics.totalValue.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Across {properties.length} prime properties</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net Property Equity</span>
          <h3 className="text-2xl font-extrabold text-[#526B56] tabular-nums mt-1">
            ${mask(portfolioMetrics.netEquity.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Total debt: ${mask(portfolioMetrics.totalDebt.toLocaleString())}</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Monthly Rental Inflow</span>
          <h3 className="text-2xl font-extrabold text-[#C18A48] tabular-nums mt-1">
            +${mask(portfolioMetrics.totalGrossRent.toLocaleString())}/mo
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Gross cash flow</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net Monthly Cashflow</span>
          <h3 className="text-2xl font-extrabold text-[#4A7C8A] tabular-nums mt-1">
            +${mask(portfolioMetrics.netMonthlyIncome.toLocaleString())}/mo
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">After mortgages, tax & maintenance</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297]">
            Holdings Directory ({filteredProperties.length})
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A3A297] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg outline-none focus:border-[#526B56] w-36 sm:w-48"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-xs bg-[#FCFBF8] border border-[#EAE8DF] rounded-lg px-2.5 py-1.5 outline-none font-semibold text-[#22251F]"
          >
            <option value="All">All Property Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Land">Land</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProperties.map(p => {
          const appreciation = (Number(p.currentValuation) || 0) - (Number(p.purchasePrice) || 0);
          const appreciationPct = p.purchasePrice > 0 ? ((appreciation / p.purchasePrice) * 100).toFixed(1) : 0;
          const netYield = Number(p.monthlyRent || 0) - (Number(p.maintenanceMonthly || 0) + Number(p.taxMonthly || 0) + Number(p.mortgagePaymentMonthly || 0));

          return (
            <Card key={p.id} className="p-5 border border-[#EAE8DF] bg-white space-y-4 hover:border-[#D5D2C8] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center shrink-0">
                      {p.type === 'Commercial' ? <Landmark className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#22251F] truncate">{p.name}</h4>
                      <p className="text-[10px] text-[#77786F] flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#A3A297]" />
                        {p.address}
                      </p>
                    </div>
                  </div>
                  <Badge variant="accent">{p.type}</Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE8DF] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-[#A3A297] block">Market Valuation</span>
                    <span className="font-extrabold text-[#22251F] tabular-nums text-sm">
                      ${mask(Number(p.currentValuation || 0).toLocaleString())}
                    </span>
                    <span className={`text-[10px] block font-semibold ${appreciation >= 0 ? 'text-[#526B56]' : 'text-[#C66D65]'}`}>
                      {appreciation >= 0 ? '+' : ''}${mask(Math.abs(appreciation).toLocaleString())} ({appreciationPct}%)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[#A3A297] block">Net Monthly Rent</span>
                    <span className="font-extrabold text-[#526B56] tabular-nums text-sm">
                      +${mask(netYield.toLocaleString())}
                    </span>
                    <span className="text-[10px] text-[#77786F] block">
                      Gross: ${mask(Number(p.monthlyRent || 0).toLocaleString())}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl flex items-center justify-between text-[11px]">
                  <span className="text-[#77786F]">Mortgage Liability:</span>
                  <span className="font-bold text-[#C66D65] tabular-nums">
                    ${mask(Number(p.loanBalance || 0).toLocaleString())}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE8DF] flex items-center justify-between">
                <Badge variant={p.status === 'Occupied' ? 'success' : 'default'}>{p.status || 'Active'}</Badge>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] cursor-pointer"
                    title="Edit Property"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(p)}
                    className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] cursor-pointer"
                    title="Dispose Property"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingProp}
        onClose={() => { setIsAddOpen(false); setEditingProp(null); }}
        title={editingProp ? `Calibrate Asset: ${editingProp.name}` : 'Acquire Real Estate Asset'}
        subtitle="Configure physical valuation, rental yield, and mortgage debt"
      >
        <form onSubmit={editingProp ? handleEditSubmit : handleAddSubmit} className="space-y-3.5">
          <Input
            label="Property Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sovereign Tech Tower"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Asset Classification</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Residential">Residential Luxury</option>
                <option value="Commercial">Commercial Office</option>
                <option value="Industrial">Industrial & Warehousing</option>
                <option value="Land">Prime Land</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Tenancy Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Occupied">Fully Occupied</option>
                <option value="Vacant">Vacant / Available</option>
                <option value="Renovating">Under Renovation</option>
              </select>
            </div>
          </div>

          <Input
            label="Location / Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. Manhattan, New York"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Purchase Price ($)"
              type="number"
              value={form.purchasePrice}
              onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
              required
            />
            <Input
              label="Current Valuation ($)"
              type="number"
              value={form.currentValuation}
              onChange={e => setForm({ ...form, currentValuation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              label="Monthly Rent ($)"
              type="number"
              value={form.monthlyRent}
              onChange={e => setForm({ ...form, monthlyRent: e.target.value })}
            />
            <Input
              label="Maintenance ($)"
              type="number"
              value={form.maintenanceMonthly}
              onChange={e => setForm({ ...form, maintenanceMonthly: e.target.value })}
            />
            <Input
              label="Monthly Tax ($)"
              type="number"
              value={form.taxMonthly}
              onChange={e => setForm({ ...form, taxMonthly: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Mortgage Loan Balance ($)"
              type="number"
              value={form.loanBalance}
              onChange={e => setForm({ ...form, loanBalance: e.target.value })}
            />
            <Input
              label="Monthly Mortgage Payment ($)"
              type="number"
              value={form.mortgagePaymentMonthly}
              onChange={e => setForm({ ...form, mortgagePaymentMonthly: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            {editingProp ? 'Update Real Estate Asset' : 'Confirm Property Acquisition'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(RealEstateHub);

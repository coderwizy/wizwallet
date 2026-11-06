import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import {
  Building2, Home, Landmark, Plus, Trash2, Edit3,
  MapPin, ShieldCheck
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';
import MobileActionSheet from '../MobileActionSheet';
import ConfirmationDialog from '../../ui/ConfirmationDialog';

const MobileRealEstateView = () => {
  const { properties, addProperty, removeProperty, privacyMode, currencySymbol } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    name: '',
    type: 'Residential',
    address: '',
    purchasePrice: '1000000',
    currentValuation: '1250000',
    monthlyRent: '8000',
    loanBalance: '400000'
  });

  const totalValue = useMemo(() => {
    return properties.reduce((acc, p) => acc + Number(p.currentValuation || p.purchasePrice || 0), 0);
  }, [properties]);

  const totalRent = useMemo(() => {
    return properties.reduce((acc, p) => acc + Number(p.monthlyRent || 0), 0);
  }, [properties]);

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
      loanBalance: parseFloat(form.loanBalance) || 0,
      maintenanceMonthly: 800,
      taxMonthly: 600,
      status: 'Occupied'
    });

    setForm({ name: '', type: 'Residential', address: '', purchasePrice: '1000000', currentValuation: '1250000', monthlyRent: '8000', loanBalance: '400000' });
    setShowAddSheet(false);
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) removeProperty(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title={`Dispose ${deleteConfirm?.name}?`}
        description="Net equity proceeds will be deposited into your Global Bank reserve."
        confirmText="Dispose"
        variant="danger"
      />

      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Property Valuation</p>
            <h2 className="text-3xl font-extrabold text-[#22251F] tabular-nums mt-0.5">
              {currencySymbol}{mask(totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
            </h2>
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddSheet(true)}>
            Acquire
          </Button>
        </div>
        <div className="pt-2 border-t border-[#EAE8DF] flex justify-between items-center text-xs">
          <span className="text-[#77786F]">Monthly Gross Rent:</span>
          <span className="font-bold text-[#526B56] tabular-nums">+{currencySymbol}{mask(totalRent.toLocaleString())}/mo</span>
        </div>
      </Card>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297] px-1">
          Holdings ({properties.length})
        </h3>
        {properties.map(p => (
          <Card key={p.id} className="p-4 border border-[#EAE8DF] bg-white space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-[#22251F]">{p.name}</h4>
                <p className="text-[10px] text-[#77786F] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#A3A297]" />
                  {p.address}
                </p>
              </div>
              <Badge variant="accent">{p.type}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#EAE8DF]">
              <div>
                <span className="text-[10px] text-[#A3A297] block">Market Value</span>
                <span className="font-bold text-[#22251F] tabular-nums">{currencySymbol}{mask(Number(p.currentValuation || 0).toLocaleString())}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A3A297] block">Rent Yield</span>
                <span className="font-bold text-[#526B56] tabular-nums">+{currencySymbol}{mask(Number(p.monthlyRent || 0).toLocaleString())}/mo</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAE8DF] flex justify-between items-center text-xs">
              <span className="text-[10px] text-[#C66D65] font-semibold">
                Debt: {currencySymbol}{mask(Number(p.loanBalance || 0).toLocaleString())}
              </span>
              <button
                type="button"
                onClick={() => setDeleteConfirm(p)}
                className="p-1 rounded text-[#A3A297] hover:text-[#C66D65] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <MobileActionSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title="Acquire Real Estate Property"
        subtitle="Establish prime property holding"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Property Name"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Marina Luxury Tower"
          />
          <Input
            label="Address / Location"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. Dubai Marina"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Valuation ($)"
              type="number"
              value={form.currentValuation}
              onChange={e => setForm({ ...form, currentValuation: e.target.value })}
            />
            <Input
              label="Monthly Rent ($)"
              type="number"
              value={form.monthlyRent}
              onChange={e => setForm({ ...form, monthlyRent: e.target.value })}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Confirm Acquisition
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileRealEstateView);


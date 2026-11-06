import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  TAX_JURISDICTIONS, estimateTaxLiability
} from '../../utils/financialCalculations';
import {
  Landmark, DollarSign, Plus, CheckCircle2, AlertCircle,
  ShieldCheck, FileText, Calendar, Trash2, Info, ArrowUpRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const TaxHub = () => {
  const {taxSettings, updateTaxSettings, logTaxPayment,
    cashFlowMetrics, privacyMode, currencySymbol } = useEmpire();

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '25000',
    quarter: 'Q3 Estimated Tax',
    notes: 'Direct Electronic Payment'
  });

  const jurisdictionKey = taxSettings?.jurisdiction || 'US';
  const customDeductions = taxSettings?.customDeductions || 25000;

  // Annual gross income calculation based on business + property yields
  const annualGross = useMemo(() => {
    return Math.max(120000, Math.round(cashFlowMetrics.totalMonthlyIncome * 12));
  }, [cashFlowMetrics.totalMonthlyIncome]);

  // Tax calculation
  const taxReport = useMemo(() => {
    return estimateTaxLiability({
      jurisdictionKey,
      annualGrossIncome: annualGross,
      customDeductions
    });
  }, [jurisdictionKey, annualGross, customDeductions]);

  const handleJurisdictionChange = (key) => {
    updateTaxSettings({ jurisdiction: key });
  };

  const handleDeductionsChange = (val) => {
    updateTaxSettings({ customDeductions: Number(val) || 0 });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.amount) return;

    logTaxPayment({
      amount: parseFloat(paymentForm.amount) || 0,
      quarter: paymentForm.quarter,
      notes: paymentForm.notes
    });

    setPaymentForm({
      amount: '25000',
      quarter: 'Q3 Estimated Tax',
      notes: 'Direct Electronic Payment'
    });
    setIsAddPaymentOpen(false);
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Fiscal Compliance & Liability Estimation
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Tax & Financial Management Center
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setIsAddPaymentOpen(true)}>
            Record Tax Payment
          </Button>
        </div>
      </div>

      {/* Jurisdiction Selector */}
      <Card className="p-4 border border-[#EAE8DF] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#526B56]" />
          <span className="text-xs font-bold text-[#22251F]">Tax Jurisdiction:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(TAX_JURISDICTIONS).map(([key, reg]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleJurisdictionChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                jurisdictionKey === key
                  ? 'bg-[#526B56] text-white shadow-2xs'
                  : 'bg-[#FCFBF8] border border-[#EAE8DF] text-[#77786F] hover:text-[#22251F]'
              }`}
            >
              {key} · {reg.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Annual Gross Income</span>
          <h3 className="text-2xl font-extrabold text-[#22251F] tabular-nums mt-1">
            {currencySymbol}{mask(taxReport.annualGrossIncome.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Derived from active cash flow</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Estimated Tax Liability</span>
          <h3 className="text-2xl font-extrabold text-[#C66D65] tabular-nums mt-1">
            {currencySymbol}{mask(taxReport.estimatedTax.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#C66D65] font-semibold mt-1">Effective Rate: {taxReport.effectiveRate}%</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Standard + Custom Deductions</span>
          <h3 className="text-2xl font-extrabold text-[#526B56] tabular-nums mt-1">
            {currencySymbol}{mask(taxReport.totalDeductions.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Taxable base: {currencySymbol}{mask(taxReport.taxableIncome.toLocaleString())}</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Net After-Tax Retained</span>
          <h3 className="text-2xl font-extrabold text-[#4A7C8A] tabular-nums mt-1">
            {currencySymbol}{mask(taxReport.netAfterTaxIncome.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Annual sovereign net liquidity</p>
        </Card>
      </div>

      {/* Deductions Calibration Card */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#22251F]">Deductions & Offsets Calibration</h3>
          <Badge variant="accent">{taxReport.jurisdiction}</Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
          <div>
            <p className="text-xs font-bold text-[#22251F]">Corporate & Personal Deductions</p>
            <p className="text-[11px] text-[#77786F]">Enter qualifying write-offs, depreciation, and business expense deductions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#A3A297]">{currencySymbol}</span>
            <input
              type="number"
              value={customDeductions}
              onChange={e => handleDeductionsChange(e.target.value)}
              className="text-sm font-bold text-[#22251F] bg-white border border-[#EAE8DF] rounded-xl px-3 py-1.5 outline-none focus:border-[#526B56] w-36"
            />
          </div>
        </div>
      </Card>

      {/* Tax Remittance Ledger History */}
      <Card className="overflow-hidden border border-[#EAE8DF] bg-white p-0">
        <div className="p-4 border-b border-[#EAE8DF] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#22251F]">Tax Payment Remittance Records</h3>
          <Badge variant="default">{(taxSettings?.paymentsHistory || []).length} Payments Recorded</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCFBF8] border-b border-[#EAE8DF] text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Fiscal Period</th>
                <th className="py-3 px-3">Date Remitted</th>
                <th className="py-3 px-3">Reference / Notes</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8DF]">
              {(taxSettings?.paymentsHistory || []).length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-[#A3A297]">
                    No tax remittances recorded yet.
                  </td>
                </tr>
              ) : (
                (taxSettings?.paymentsHistory || []).map(p => (
                  <tr key={p.id} className="hover:bg-[#FCFBF8]">
                    <td className="py-3 px-4 font-bold text-[#22251F]">{p.quarter}</td>
                    <td className="py-3 px-3 text-[#77786F]">{p.date}</td>
                    <td className="py-3 px-3 text-[#77786F]">{p.notes}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#526B56] tabular-nums">
                      {currencySymbol}{mask(Number(p.amount || 0).toLocaleString())}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Disclaimer Banner */}
      <Card className="p-4 border border-[#EAE8DF] bg-[#FCFBF8] flex items-center gap-3 text-xs">
        <Info className="w-5 h-5 text-[#C18A48] shrink-0" />
        <p className="text-[#77786F] leading-relaxed">
          <strong>Notice:</strong> Tax calculations provided are simulation estimates based on current jurisdiction brackets and declared deductions. WizWallet 3.0 does not provide certified legal or tax advisory services. Always consult an accredited tax attorney or CPA for statutory filings.
        </p>
      </Card>

      {/* Record Tax Payment Modal */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Record Tax Remittance"
        subtitle="Log quarterly advance or final tax settlement"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
          <Input
            label="Fiscal Quarter / Period"
            required
            value={paymentForm.quarter}
            onChange={e => setPaymentForm({ ...paymentForm, quarter: e.target.value })}
            placeholder="e.g. Q3 Estimated Tax 2026"
          />

          <Input
            label="Payment Amount ($)"
            type="number"
            required
            value={paymentForm.amount}
            onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
          />

          <Input
            label="Notes / Payment Method"
            value={paymentForm.notes}
            onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
            placeholder="e.g. Electronic Federal Tax Payment System"
          />

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Confirm Tax Remittance
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(TaxHub);


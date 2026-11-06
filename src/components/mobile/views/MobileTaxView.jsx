import React, { useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { TAX_JURISDICTIONS, estimateTaxLiability } from '../../../utils/financialCalculations';
import { Landmark, ShieldCheck } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileTaxView = () => {
  const { taxSettings, updateTaxSettings, cashFlowMetrics, privacyMode, currencySymbol } = useEmpire();

  const jurisdictionKey = taxSettings?.jurisdiction || 'US';
  const customDeductions = taxSettings?.customDeductions || 25000;

  const annualGross = useMemo(() => {
    return Math.max(120000, Math.round(cashFlowMetrics.totalMonthlyIncome * 12));
  }, [cashFlowMetrics.totalMonthlyIncome]);

  const taxReport = useMemo(() => {
    return estimateTaxLiability({
      jurisdictionKey,
      annualGrossIncome: annualGross,
      customDeductions
    });
  }, [jurisdictionKey, annualGross, customDeductions]);

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-ww-text">Tax & Fiscal Center</h2>
        <Badge variant="accent">{jurisdictionKey}</Badge>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scroll-hide">
        {Object.keys(TAX_JURISDICTIONS).map(key => (
          <button
            key={key}
            type="button"
            onClick={() => updateTaxSettings({ jurisdiction: key })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              jurisdictionKey === key ? 'bg-ww-accent text-white' : 'bg-white border border-ww-border text-ww-text-secondary'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 border border-ww-border bg-white">
          <span className="text-[10px] uppercase font-semibold text-ww-text-muted">Gross Inflows</span>
          <h3 className="text-xl font-extrabold text-ww-text tabular-nums mt-0.5">
            {currencySymbol}{mask(taxReport.annualGrossIncome.toLocaleString())}
          </h3>
        </Card>

        <Card className="p-4 border border-ww-border bg-white">
          <span className="text-[10px] uppercase font-semibold text-ww-danger">Est. Tax</span>
          <h3 className="text-xl font-extrabold text-ww-danger tabular-nums mt-0.5">
            {currencySymbol}{mask(taxReport.estimatedTax.toLocaleString())}
          </h3>
          <span className="text-[10px] text-ww-text-secondary block mt-0.5">Rate: {taxReport.effectiveRate}%</span>
        </Card>
      </div>

      <Card className="p-4 border border-ww-border bg-white space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-ww-text-secondary">Standard & Custom Deductions:</span>
          <span className="font-bold text-ww-accent">{currencySymbol}{mask(taxReport.totalDeductions.toLocaleString())}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-ww-border">
          <span className="font-bold text-ww-text">Retained Net Liquidity:</span>
          <span className="font-extrabold text-ww-accent text-sm">{currencySymbol}{mask(taxReport.netAfterTaxIncome.toLocaleString())}</span>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(MobileTaxView);


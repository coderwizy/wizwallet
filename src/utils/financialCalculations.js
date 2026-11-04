// ═══════════════════════════════════════════════════════════════════
// WIZWALLET 3.0 — Centralized Financial Intelligence & Math Engine
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate total portfolio net worth across all asset classes and liabilities
 */
export function calculateNetWorth({
  wallet = { balance: 0 },
  bank = { balance: 0, assets: 0, loans: 0 },
  businesses = [],
  sectors = [],
  investments = [],
  properties = [],
  expenses = []
}) {
  const liquidWallet = Number(wallet?.balance || 0);
  const bankBalance = Number(bank?.balance || 0);
  const bankReserveAssets = Number(bank?.assets || 0);
  const bankLoans = Number(bank?.loans || 0);

  // Investments total current value
  const investmentsValue = (investments || []).reduce((acc, inv) => {
    const qty = Number(inv.quantity || 0);
    const price = Number(inv.currentPrice || inv.purchasePrice || 0);
    return acc + (qty * price);
  }, 0);

  // Real estate total current market valuation
  const realEstateValue = (properties || []).reduce((acc, prop) => {
    return acc + Number(prop.currentValuation || prop.purchasePrice || 0);
  }, 0);

  // Real estate mortgage & debt liabilities
  const realEstateDebt = (properties || []).reduce((acc, prop) => {
    return acc + Number(prop.loanBalance || 0);
  }, 0);

  // Business ventures enterprise valuation: (net monthly income * 12 * 6 PE multiple) or stated valuation
  const businessValuation = (businesses || []).reduce((acc, biz) => {
    if (biz.valuation && Number(biz.valuation) > 0) return acc + Number(biz.valuation);
    const monthlyNet = Math.max(0, (Number(biz.income || 0) - Number(biz.expense || 0)));
    return acc + (monthlyNet * 12 * 5); // 5x annual net earnings multiple
  }, 0);

  // Sector assets capital valuation
  const sectorsValuation = (sectors || []).reduce((acc, sec) => {
    const rev = Number(sec.revenue || 0);
    return acc + (rev * 8); // 8x revenue multiple
  }, 0);

  const totalAssets = liquidWallet + bankBalance + bankReserveAssets + investmentsValue + realEstateValue + businessValuation + sectorsValuation;
  const totalLiabilities = bankLoans + realEstateDebt;
  const netWorth = totalAssets - totalLiabilities;

  return {
    netWorth: Math.max(0, netWorth),
    totalAssets,
    totalLiabilities,
    breakdown: {
      liquidWallet,
      bankBalance,
      bankReserveAssets,
      investmentsValue,
      realEstateValue,
      businessValuation,
      sectorsValuation,
      bankLoans,
      realEstateDebt
    }
  };
}

/**
 * Calculate Monthly Cash Flow (Inflows, Operating Burn, Net Profit)
 */
export function calculateCashFlow({
  businesses = [],
  sectors = [],
  properties = [],
  investments = [],
  expenses = []
}) {
  // Business Monthly Cashflow
  const businessIncome = businesses.reduce((sum, b) => b.status === 'Active' ? sum + Number(b.income || 0) : sum, 0);
  const businessExpense = businesses.reduce((sum, b) => b.status === 'Active' ? sum + Number(b.expense || 0) : sum, 0);

  // Industrial Sectors Revenue
  const sectorRevenue = sectors.reduce((sum, s) => s.status === 'Active' ? sum + Number(s.revenue || 0) : sum, 0);

  // Real Estate Monthly Rental & Maintenance
  const rentalIncome = properties.reduce((sum, p) => sum + Number(p.monthlyRent || 0), 0);
  const propertyExpenses = properties.reduce((sum, p) => {
    const maint = Number(p.maintenanceMonthly || 0);
    const tax = Number(p.taxMonthly || 0);
    const loan = Number(p.mortgagePaymentMonthly || 0);
    return sum + maint + tax + loan;
  }, 0);

  // Investment Monthly Dividend Yield (~3% annual average default)
  const investmentDividends = investments.reduce((sum, inv) => {
    const val = Number(inv.quantity || 0) * Number(inv.currentPrice || inv.purchasePrice || 0);
    const yieldRate = Number(inv.dividendYield || 0.025);
    return sum + (val * yieldRate / 12);
  }, 0);

  // Personal / Operational Monthly Expenses
  const personalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const totalMonthlyIncome = businessIncome + sectorRevenue + rentalIncome + investmentDividends;
  const totalMonthlyExpense = businessExpense + propertyExpenses + personalExpenses;
  const netMonthlyCashflow = totalMonthlyIncome - totalMonthlyExpense;
  const passiveIncome = rentalIncome + investmentDividends + (sectorRevenue * 0.4);

  return {
    totalMonthlyIncome,
    totalMonthlyExpense,
    netMonthlyCashflow,
    passiveIncome,
    profitMargin: totalMonthlyIncome > 0 ? ((netMonthlyCashflow / totalMonthlyIncome) * 100).toFixed(1) : '0',
    breakdown: {
      businessIncome,
      businessExpense,
      sectorRevenue,
      rentalIncome,
      propertyExpenses,
      investmentDividends,
      personalExpenses
    }
  };
}

/**
 * Simulate Future Wealth Projections across 3 scenarios
 * @param {Object} params - Current capital, monthly contributions, growth assumptions
 */
export function generateWealthForecasts({
  currentNetWorth = 250000,
  monthlyContribution = 10000,
  annualBusinessCashflow = 120000,
  inflationRate = 0.03, // 3% inflation
  years = 10
}) {
  const scenarios = [
    {
      name: 'Conservative',
      annualGrowthRate: 0.06, // 6%
      volatility: 'Low',
      color: '#82977B',
      description: 'Capital preservation focus with bond yields, steady banking APY, and resilient value assets.'
    },
    {
      name: 'Balanced',
      annualGrowthRate: 0.11, // 11%
      volatility: 'Moderate',
      color: '#526B56',
      description: 'Balanced mix of equity index funds, diversified real estate income, and corporate scaling.'
    },
    {
      name: 'Aggressive',
      annualGrowthRate: 0.19, // 19%
      volatility: 'High',
      color: '#C18A48',
      description: 'Aggressive commercial expansion, sector technology optimization, and active venture reinvestment.'
    }
  ];

  const yearlyData = [];
  const startYear = new Date().getFullYear();

  for (let y = 0; y <= years; y++) {
    const yearLabel = String(startYear + y);
    const inflationFactor = Math.pow(1 + inflationRate, y);

    const point = {
      year: yearLabel,
      step: y,
      inflationPurchasingPowerPct: Math.round((1 / inflationFactor) * 100)
    };

    scenarios.forEach(sc => {
      let projected = currentNetWorth;
      const r = sc.annualGrowthRate;

      for (let i = 1; i <= y; i++) {
        // Compound existing net worth
        projected = projected * (1 + r);
        // Add annual new capital + business profits reinvested with half-year compounding
        const annualAddition = (monthlyContribution * 12) + (annualBusinessCashflow * 0.65);
        projected += annualAddition * (1 + r / 2);
      }

      const nominalValue = Math.round(projected);
      const realPurchasingPower = Math.round(nominalValue / inflationFactor);

      point[sc.name] = nominalValue;
      point[`${sc.name}_Real`] = realPurchasingPower;
    });

    yearlyData.push(point);
  }

  return {
    scenarios,
    timeline: yearlyData,
    finalYearData: yearlyData[yearlyData.length - 1]
  };
}

/**
 * Jurisdiction-aware Tax Estimator
 */
export const TAX_JURISDICTIONS = {
  US: {
    name: 'United States (Federal Estimate)',
    currency: 'USD',
    symbol: '$',
    brackets: [
      { max: 11600, rate: 0.10 },
      { max: 47150, rate: 0.12 },
      { max: 100525, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243725, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ],
    standardDeduction: 14600
  },
  UK: {
    name: 'United Kingdom (HMRC Bands)',
    currency: 'GBP',
    symbol: '£',
    brackets: [
      { max: 12570, rate: 0.00 },
      { max: 50270, rate: 0.20 },
      { max: 125140, rate: 0.40 },
      { max: Infinity, rate: 0.45 }
    ],
    standardDeduction: 12570
  },
  IN: {
    name: 'India (New Tax Regime)',
    currency: 'INR',
    symbol: '₹',
    brackets: [
      { max: 300000, rate: 0.00 },
      { max: 700000, rate: 0.05 },
      { max: 1000000, rate: 0.10 },
      { max: 1200000, rate: 0.15 },
      { max: 1500000, rate: 0.20 },
      { max: Infinity, rate: 0.30 }
    ],
    standardDeduction: 75000
  },
  UAE: {
    name: 'UAE / Dubai (Zero Personal Income Tax)',
    currency: 'AED',
    symbol: 'AED ',
    brackets: [
      { max: Infinity, rate: 0.00 }
    ],
    standardDeduction: 0
  },
  GLOBAL_FLAT: {
    name: 'Global Flat Rate (15% Sovereign)',
    currency: 'USD',
    symbol: '$',
    brackets: [
      { max: Infinity, rate: 0.15 }
    ],
    standardDeduction: 20000
  }
};

/**
 * Calculate estimated tax liability for a given jurisdiction and income
 */
export function estimateTaxLiability({
  jurisdictionKey = 'US',
  annualGrossIncome = 250000,
  customDeductions = 15000
}) {
  const regime = TAX_JURISDICTIONS[jurisdictionKey] || TAX_JURISDICTIONS.US;
  const totalDeductions = (regime.standardDeduction || 0) + Number(customDeductions || 0);
  const taxableIncome = Math.max(0, annualGrossIncome - totalDeductions);

  let remaining = taxableIncome;
  let totalTax = 0;
  let prevMax = 0;

  for (const bracket of regime.brackets) {
    if (remaining <= 0) break;
    const bracketSpan = bracket.max - prevMax;
    const amountInBracket = Math.min(remaining, bracketSpan);
    totalTax += amountInBracket * bracket.rate;
    remaining -= amountInBracket;
    prevMax = bracket.max;
  }

  const effectiveRate = annualGrossIncome > 0 ? ((totalTax / annualGrossIncome) * 100).toFixed(1) : '0';

  return {
    jurisdiction: regime.name,
    annualGrossIncome,
    totalDeductions,
    taxableIncome,
    estimatedTax: Math.round(totalTax),
    effectiveRate: Number(effectiveRate),
    netAfterTaxIncome: Math.round(annualGrossIncome - totalTax)
  };
}

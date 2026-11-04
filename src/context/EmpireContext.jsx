import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateNetWorth, calculateCashFlow } from '../utils/financialCalculations';

const EmpireContext = createContext();

export const INITIAL_BUSINESSES = [
  { id: 'smm', name: 'SMM Panel', icon: 'BarChart', desc: 'Automated social media marketing services.', income: 1500, expense: 400, status: 'Active', growth: 1.05, notes: 'Expanding to TikTok sub-panels.', employees: 4, branches: 1, valuation: 32000 },
  { id: 'video', name: 'Video Bundles', icon: 'Video', desc: 'Pre-edited video bundles for creators.', income: 1200, expense: 300, status: 'Active', growth: 1.02, notes: 'New fitness bundle launch.', employees: 2, branches: 1, valuation: 22000 },
  { id: 'ecom', name: 'E-commerce Hub', icon: 'ShoppingBag', desc: 'Dropshipping & branded physical products.', income: 2800, expense: 1200, status: 'Active', growth: 1.08, notes: 'Supply chain delays in Q1.', employees: 8, branches: 2, valuation: 48000 },
  { id: 'courses', name: 'Course Academy', icon: 'BookOpen', desc: 'Digital marketing and design courses.', income: 1900, expense: 450, status: 'Active', growth: 1.10, notes: 'High ROI on Facebook Ads.', employees: 5, branches: 1, valuation: 35000 },
  { id: 'factory-st', name: 'Stationary & Textile Factory', icon: 'Factory', desc: 'Manufacturing of custom stationary and textiles.', income: 4200, expense: 2100, status: 'Active', growth: 1.02, notes: 'New export contract signed.', employees: 14, branches: 1, valuation: 68000 },
  { id: 'transport', name: 'Imperial Transport Co.', icon: 'Truck', desc: 'Logistics and regional cargo transport network.', income: 3200, expense: 1700, status: 'Active', growth: 1.04, notes: 'Fleet expansion in progress.', employees: 12, branches: 2, valuation: 52000 },
  { id: 'tata-deal', name: 'Automobile Dealership', icon: 'Car', desc: 'Dealership for certified premium vehicles.', income: 5500, expense: 3200, status: 'Active', growth: 1.03, notes: 'EV segment seeing steady growth.', employees: 16, branches: 1, valuation: 78000 },
  { id: 'markets', name: 'Shops & Mini Markets', icon: 'Store', desc: 'Urban retail chain and convenience outlets.', income: 2400, expense: 1100, status: 'Active', growth: 1.01, notes: 'Opening 2 new locations.', employees: 10, branches: 3, valuation: 42000 },
  { id: 'warehousing', name: 'Strategic Warehousing', icon: 'Building2', desc: 'Regional storage and fulfillment center.', income: 2900, expense: 1300, status: 'Active', growth: 1.03, notes: '94% capacity utilization.', employees: 8, branches: 1, valuation: 46000 },
  { id: 'ai-firm', name: 'AI Services Firm', icon: 'Cpu', desc: 'B2B AI automation and machine learning solutions.', income: 6800, expense: 2800, status: 'Active', growth: 1.15, notes: 'Proprietary LLM in beta.', employees: 12, branches: 1, valuation: 95000 },
  { id: 'web-dev', name: 'Elite Web Dev Agency', icon: 'Globe2', desc: 'High-end development for digital applications.', income: 4500, expense: 1800, status: 'Active', growth: 1.09, notes: 'Backlog full for 3 months.', employees: 10, branches: 1, valuation: 65000 },
  { id: 'social-agency', name: 'Social Media Agency', icon: 'Share2', desc: 'Full-stack social branding and viral growth.', income: 3400, expense: 1300, status: 'Active', growth: 1.12, notes: 'New influencer campaign.', employees: 8, branches: 1, valuation: 54000 },
  { id: 'gaming', name: 'Gaming Services', icon: 'Gamepad2', desc: 'E-sports infrastructure and dedicated game servers.', income: 2900, expense: 1100, status: 'Active', growth: 1.14, notes: 'Community tournament launch.', employees: 6, branches: 1, valuation: 44000 }
];

export const SECTORS = [
  'AI Research', 'Robotics', 'Cloud Hosting', 'Cybersecurity', 'Blockchain Nodes', 'Logistics', 'Manufacturing', 'Green Energy', 'Biotech', 'Media Rights',
  'Aerospace', 'Fintech', 'EdTech', 'SaaS', 'Real Estate', 'Venture Capital', 'Crypto Mining', 'Dropshipping', 'Consulting', 'Gaming Studio',
  'Nanotech', 'Quantum Computing', 'Space Tech', 'Satellite Hub', 'Defense Systems', 'Maritime Ops', 'Mining', 'Oil & Gas', 'Telecommunications', 'AgriTech'
].map(name => ({
  id: name.toLowerCase().replace(/ /g, '-'),
  name,
  revenue: Math.floor(Math.random() * 500) + 150,
  expense: Math.floor(Math.random() * 200) + 50,
  status: 'Active',
  growth: parseFloat((Math.random() * 2).toFixed(1)),
  history: []
}));

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-101', timestamp: Date.now() - 3600000 * 2, module: 'Wallet', type: 'Credit', amount: 1500, description: 'SMM Panel Automated Revenue Dividend', user: 'raghav94' },
  { id: 'tx-102', timestamp: Date.now() - 3600000 * 6, module: 'Bank', type: 'Credit', amount: 4500, description: 'Stationary & Textile Export Settlement', user: 'raghav94' },
  { id: 'tx-103', timestamp: Date.now() - 3600000 * 12, module: 'Business', type: 'Debit', amount: 1200, description: 'AI Services Server Hosting Infrastructure', user: 'raghav94' },
  { id: 'tx-104', timestamp: Date.now() - 3600000 * 24, module: 'Sectors', type: 'Credit', amount: 2850, description: 'Cybersecurity Node Optimization Yield', user: 'raghav94' },
  { id: 'tx-105', timestamp: Date.now() - 3600000 * 36, module: 'Wallet', type: 'Debit', amount: 500, description: 'Family Council Allowance Distribution', user: 'raghav94' },
  { id: 'tx-106', timestamp: Date.now() - 3600000 * 48, module: 'Bank', type: 'Credit', amount: 5500, description: 'Automobile Fleet Sales Distribution', user: 'raghav94' },
  { id: 'tx-107', timestamp: Date.now() - 3600000 * 72, module: 'Business', type: 'Credit', amount: 1250, description: 'E-commerce Hub Monthly Dividend Payout', user: 'raghav94' },
];

export const INITIAL_INVESTMENTS = [
  { id: 'inv-1', symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', quantity: 25, purchasePrice: 175.50, currentPrice: 228.40, dividendYield: 0.005, date: '2026-01-15' },
  { id: 'inv-2', symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', quantity: 40, purchasePrice: 94.20, currentPrice: 142.60, dividendYield: 0.0003, date: '2026-02-10' },
  { id: 'inv-3', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', quantity: 35, purchasePrice: 420.00, currentPrice: 516.80, dividendYield: 0.014, date: '2025-11-04' },
  { id: 'inv-4', symbol: 'XAU', name: 'Physical Gold Bullion', type: 'Commodity', quantity: 6, purchasePrice: 2150.00, currentPrice: 2740.00, dividendYield: 0, date: '2025-08-20' },
  { id: 'inv-5', symbol: 'UST10', name: 'US Treasury Sovereign Bond', type: 'Bond', quantity: 30, purchasePrice: 980.00, currentPrice: 1018.00, dividendYield: 0.043, date: '2026-03-01' }
];

export const INITIAL_PROPERTIES = [
  { id: 'prop-1', name: 'Manhattan Studio Suite', type: 'Residential', address: '432 Park Ave, New York', purchasePrice: 95000, currentValuation: 128000, monthlyRent: 1250, maintenanceMonthly: 150, taxMonthly: 90, loanBalance: 35000, mortgagePaymentMonthly: 320, status: 'Occupied' },
  { id: 'prop-2', name: 'Cyber City Workspace', type: 'Commercial', address: 'Bandra-Kurla Complex, Mumbai', purchasePrice: 125000, currentValuation: 165000, monthlyRent: 1650, maintenanceMonthly: 210, taxMonthly: 140, loanBalance: 48000, mortgagePaymentMonthly: 410, status: 'Occupied' },
  { id: 'prop-3', name: 'Free Zone Hub', type: 'Industrial', address: 'Jebel Ali Free Zone, Dubai', purchasePrice: 85000, currentValuation: 115000, monthlyRent: 1050, maintenanceMonthly: 110, taxMonthly: 0, loanBalance: 24000, mortgagePaymentMonthly: 230, status: 'Occupied' }
];

export const INITIAL_EXPENSES = [
  { id: 'exp-1', name: 'Cloud Cluster & AI Compute', category: 'Technology', amount: 480, frequency: 'Monthly', type: 'Business', date: '2026-11-01' },
  { id: 'exp-2', name: 'Regional Shipping Logistics', category: 'Operations', amount: 620, frequency: 'Monthly', type: 'Business', date: '2026-11-02' },
  { id: 'exp-3', name: 'Residential Security & Maintenance', category: 'Housing', amount: 350, frequency: 'Monthly', type: 'Personal', date: '2026-11-01' },
  { id: 'exp-4', name: 'Corporate Legal Retainer', category: 'Legal', amount: 500, frequency: 'Monthly', type: 'Business', date: '2026-10-28' },
  { id: 'exp-5', name: 'Health & Wellness Memberships', category: 'Lifestyle', amount: 220, frequency: 'Monthly', type: 'Personal', date: '2026-11-03' }
];

export const INITIAL_BUDGETS = {
  Technology: 800,
  Operations: 1200,
  Housing: 600,
  Legal: 800,
  Lifestyle: 400
};

export const INITIAL_GOALS = {
  xp: 4850,
  level: 6,
  title: 'Empire Executive',
  milestones: [
    { id: 'm-1', title: '$450,000 Total Net Worth Target', target: 450000, metric: 'netWorth', completed: false, xp: 5000 },
    { id: 'm-2', title: '$12,000 Monthly Passive Income', target: 12000, metric: 'passiveIncome', completed: false, xp: 3000 },
    { id: 'm-3', title: 'Expand to 15 Active Corporate Ventures', target: 15, metric: 'activeVentures', completed: false, xp: 2000 },
    { id: 'm-4', title: 'Enshrine 5 Family Council Members', target: 5, metric: 'familyMembers', completed: false, xp: 1500 }
  ],
  missions: [
    { id: 'dm-1', title: 'Audit Global Ledger for anomalous expenses', reward: 150, completed: true },
    { id: 'dm-2', title: 'Calibrate Bank APY reserve distribution', reward: 200, completed: false },
    { id: 'dm-3', title: 'Execute simulated equity rebalance in Investment Hub', reward: 300, completed: false }
  ]
};

export const EmpireProvider = ({ children }) => {
  // Helper for safe state recovery
  const getStored = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored || stored === 'undefined' || stored === 'null') return fallback;
      const parsed = JSON.parse(stored);
      // Auto-recalibrate if user has old multi-million balances in localStorage
      if (key === 'empire_wallet' && parsed?.balance > 250000) return fallback;
      if (key === 'empire_bank' && parsed?.balance > 350000) return fallback;
      if ((key === 'empire_realestate' || key === 'empire_properties') && Array.isArray(parsed) && parsed.some(p => (Number(p.currentValuation || p.purchasePrice) > 500000))) return fallback;
      if (key === 'empire_investments' && Array.isArray(parsed) && parsed.some(i => (Number(i.quantity || 0) * Number(i.currentPrice || i.purchasePrice || 0)) > 250000)) return fallback;
      if (key === 'empire_businesses' && Array.isArray(parsed) && parsed.some(b => Number(b.valuation) > 500000)) return fallback;
      if (key === 'empire_sectors' && Array.isArray(parsed) && parsed.some(s => Number(s.revenue) > 5000)) return fallback;
      if (key === 'empire_balance_history' && Array.isArray(parsed) && parsed.some(e => Number(e.value) > 1000000)) return fallback;
      if (key === 'empire_goals' && parsed?.milestones?.[0]?.target > 1000000) return fallback;
      return parsed;
    } catch (e) {
      console.error(`Failed to recover ${key}`, e);
      return fallback;
    }
  };

  // 1. User Account
  const [user, setUser] = useState(() => {
    const u = getStored('empire_user', null);
    if (u && u.profilePic && u.profilePic.includes('/src/assets/')) {
      u.profilePic = u.profilePic.replace('/src/assets/', '/');
    }
    return u;
  });

  // 2. Liquid Wallet
  const [wallet, setWallet] = useState(() => getStored('empire_wallet', { balance: 24500, history: [], growthRate: 'Slow', lastDividend: 0 }));

  // 3. Global Bank
  const [bank, setBank] = useState(() => getStored('empire_bank', {
    balance: 55000,
    history: [],
    interestTier: 'Moderate',
    assets: 45000,
    loans: 0,
    forex: { usd: 1, inr: 83.5, aed: 3.67 }
  }));

  // 4. Businesses
  const [businesses, setBusinesses] = useState(() => getStored('empire_businesses', INITIAL_BUSINESSES));

  // 5. Industrial Sectors
  const [sectors, setSectors] = useState(() => getStored('empire_sectors', SECTORS));

  // 6. Transactions Ledger
  const [transactions, setTransactions] = useState(() => {
    const stored = getStored('empire_transactions', null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return INITIAL_TRANSACTIONS;
    return stored;
  });

  // 7. Family Council
  const [members, setMembers] = useState(() => getStored('empire_family', [
    { id: 1, name: 'Raghav (Head)', role: 'Admin', wealth: 65, goal: 'Legacy Trust', status: 'Excellent' },
    { id: 2, name: 'Family Member 2', role: 'Support', wealth: 15, goal: 'Education Fund', status: 'Optimal' },
    { id: 3, name: 'Family Member 3', role: 'Member', wealth: 10, goal: 'Personal Ventures', status: 'Growth' },
    { id: 4, name: 'Family Member 4', role: 'Dependent', wealth: 10, goal: 'Future Assets', status: 'Savings' },
  ]));

  // 8. Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('empire_theme') || 'cream');

  // 9. Historical Balance Snapshots
  const [balanceHistory, setBalanceHistory] = useState(() =>
    getStored('empire_balance_history', [{ time: Date.now(), value: 125000 }])
  );

  // 10. Config & Heartbeat
  const [config, setConfig] = useState(() => getStored('empire_config', {
    simulationSpeed: 10000,
    autoSave: true,
    neonMode: true,
    transparency: true,
    vibration: true,
    isPulseActive: true
  }));

  // 11. Investments Hub
  const [investments, setInvestments] = useState(() => getStored('empire_investments', INITIAL_INVESTMENTS));

  // 12. Real Estate Empire
  const [properties, setProperties] = useState(() => getStored('empire_realestate', INITIAL_PROPERTIES));

  // 13. Expense & Budget Manager
  const [expenses, setExpenses] = useState(() => getStored('empire_expenses', INITIAL_EXPENSES));
  const [budgets, setBudgets] = useState(() => getStored('empire_budgets', INITIAL_BUDGETS));

  // 14. Tax Center
  const [taxSettings, setTaxSettings] = useState(() => getStored('empire_tax', {
    jurisdiction: 'US',
    customDeductions: 25000,
    paymentsHistory: [
      { id: 'tax-1', date: '2026-04-15', amount: 45000, quarter: 'Q1', notes: 'Federal Estimated Tax Payment' },
      { id: 'tax-2', date: '2026-06-15', amount: 50000, quarter: 'Q2', notes: 'Corporate Tax Advance' }
    ]
  }));

  // 15. Wealth Goals & Gamification
  const [goals, setGoals] = useState(() => getStored('empire_goals', INITIAL_GOALS));

  // 16. Privacy Mode (mask numbers)
  const [privacyMode, setPrivacyMode] = useState(() => {
    return localStorage.getItem('empire_privacy') === 'true';
  });

  // 17. Customizable Dashboard Widgets
  const [widgetConfig, setWidgetConfig] = useState(() => getStored('empire_widgets', [
    { id: 'kpiOverview', title: 'Imperial KPI Summary', visible: true, order: 0 },
    { id: 'wealthDistribution', title: 'Total Asset Allocation', visible: true, order: 1 },
    { id: 'cashFlow', title: 'Monthly Sovereign Cashflow', visible: true, order: 2 },
    { id: 'aiInsights', title: 'AI Commander Intelligence', visible: true, order: 3 },
    { id: 'activeVentures', title: 'Corporate Ventures Pulse', visible: true, order: 4 },
    { id: 'recentActivity', title: 'Audit Ledger Stream', visible: true, order: 5 },
    { id: 'marketWatch', title: 'Investment Portfolio Watch', visible: true, order: 6 }
  ]));

  // ── Pulse State & Control (Stop / Start / Toggle) ──────────────────
  const [isPulseActive, setIsPulseActive] = useState(() => {
    const storedCfg = getStored('empire_config', null);
    return storedCfg?.isPulseActive !== false;
  });

  const stopPulse = useCallback(() => {
    setIsPulseActive(false);
    setConfig(prev => ({ ...prev, isPulseActive: false }));
  }, []);

  const startPulse = useCallback(() => {
    setIsPulseActive(true);
    setConfig(prev => ({ ...prev, isPulseActive: true }));
  }, []);

  const togglePulse = useCallback(() => {
    setIsPulseActive(prev => {
      const next = !prev;
      setConfig(c => ({ ...c, isPulseActive: next }));
      return next;
    });
  }, []);

  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode(prev => {
      const next = !prev;
      localStorage.setItem('empire_privacy', String(next));
      return next;
    });
  }, []);

  // 18. Currency Symbol (One-click toggle between ₹ Rupees and $ USD, no conversion)
  const [currencySymbol, setCurrencySymbolState] = useState(() => {
    return localStorage.getItem('empire_currency_symbol') || '₹';
  });

  const setCurrencySymbol = useCallback((sym) => {
    setCurrencySymbolState(sym);
    localStorage.setItem('empire_currency_symbol', sym);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencySymbolState(prev => {
      const next = prev === '₹' ? '$' : '₹';
      localStorage.setItem('empire_currency_symbol', next);
      return next;
    });
  }, []);

  const formatMoney = useCallback((val, options = {}) => {
    if (privacyMode) return '••••••';
    const num = Math.round(Number(val) || 0);
    return `${currencySymbol}${num.toLocaleString(undefined, { maximumFractionDigits: 0, ...options })}`;
  }, [currencySymbol, privacyMode]);

  // Global window console helper for developer testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.stopPulse = stopPulse;
      window.startPulse = startPulse;
      window.togglePulse = togglePulse;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.stopPulse;
        delete window.startPulse;
        delete window.togglePulse;
      }
    };
  }, [stopPulse, startPulse, togglePulse]);

  // ── Stable State Refs for Growth Engine ────────────────────────────
  const sectorsRef = useRef(sectors);
  const businessesRef = useRef(businesses);
  const walletRef = useRef(wallet);
  const bankRef = useRef(bank);
  const investmentsRef = useRef(investments);
  const propertiesRef = useRef(properties);
  const expensesRef = useRef(expenses);

  useEffect(() => { sectorsRef.current = sectors; }, [sectors]);
  useEffect(() => { businessesRef.current = businesses; }, [businesses]);
  useEffect(() => { walletRef.current = wallet; }, [wallet]);
  useEffect(() => { bankRef.current = bank; }, [bank]);
  useEffect(() => { investmentsRef.current = investments; }, [investments]);
  useEffect(() => { propertiesRef.current = properties; }, [properties]);
  useEffect(() => { expensesRef.current = expenses; }, [expenses]);

  // ── LocalStorage Continuous Persistence ────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('empire_user', JSON.stringify(user));
      localStorage.setItem('empire_wallet', JSON.stringify(wallet));
      localStorage.setItem('empire_bank', JSON.stringify(bank));
      localStorage.setItem('empire_businesses', JSON.stringify(businesses));
      localStorage.setItem('empire_sectors', JSON.stringify(sectors));
      localStorage.setItem('empire_transactions', JSON.stringify(transactions));
      localStorage.setItem('empire_family', JSON.stringify(members));
      localStorage.setItem('empire_theme', theme);
      localStorage.setItem('empire_balance_history', JSON.stringify(balanceHistory));
      localStorage.setItem('empire_config', JSON.stringify(config));
      localStorage.setItem('empire_investments', JSON.stringify(investments));
      localStorage.setItem('empire_realestate', JSON.stringify(properties));
      localStorage.setItem('empire_expenses', JSON.stringify(expenses));
      localStorage.setItem('empire_budgets', JSON.stringify(budgets));
      localStorage.setItem('empire_tax', JSON.stringify(taxSettings));
      localStorage.setItem('empire_goals', JSON.stringify(goals));
      localStorage.setItem('empire_widgets', JSON.stringify(widgetConfig));
    } catch (e) {
      console.warn('Storage persistence failed', e);
    }
  }, [
    wallet, bank, businesses, sectors, transactions, members, theme,
    user, balanceHistory, config, investments, properties, expenses,
    budgets, taxSettings, goals, widgetConfig
  ]);

  // ── Transaction Generator Helper ──────────────────────────────────
  const addTransaction = useCallback((module, type, amount, description) => {
    const newTx = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      module: module || 'System',
      type: type || 'Credit',
      amount: Math.round(Number(amount) || 0),
      description: description || 'No details',
      user: 'raghav94'
    };
    setTransactions(prev => {
      if (!Array.isArray(prev)) return [newTx];
      return [newTx, ...prev].slice(0, 500);
    });
  }, []);

  // ── Unified Growth Simulation Engine ──────────────────────────────
  useEffect(() => {
    if (!isPulseActive) return;

    const pulse = setInterval(() => {
      // 1. Grow Sectors (+0.02% revenue growth per heartbeat)
      setSectors(prev => {
        if (!Array.isArray(prev)) return SECTORS;
        return prev.map(sec =>
          sec.status === 'Active' ? { ...sec, revenue: Math.round((sec.revenue || 0) + (sec.revenue * 0.0002)) } : sec
        );
      });

      // 2. Grow Businesses (+0.05% income growth)
      setBusinesses(prev => {
        if (!Array.isArray(prev)) return INITIAL_BUSINESSES;
        return prev.map(biz =>
          biz.status === 'Active' ? { ...biz, income: Math.round((biz.income || 0) + (biz.income * 0.0005)) } : biz
        );
      });

      // 3. Bank Interest Compounding
      const BANK_PULSE_RATES = { Safe: 0.00005, Moderate: 0.0001, 'High Yield': 0.00025, Tycoon: 0.0004, Imperial: 0.0006 };
      const bankPulseRate = BANK_PULSE_RATES[bankRef.current?.interestTier] || 0.0001;
      setBank(prev => ({
        ...prev,
        balance: Math.round((prev?.balance || 0) + ((prev?.balance || 0) * bankPulseRate))
      }));

      // 4. Wallet Dividends from active businesses & sectors
      const GROWTH_MULTIPLIERS = { Slow: 1, Founder: 5, CEO: 10, Tycoon: 50, Billionaire: 100 };
      setWallet(prev => {
        const currentBizIncome = businessesRef.current.reduce(
          (sum, b) => sum + (b.status === 'Active' ? (b.income || 0) : 0), 0
        );
        const currentSecRevenue = sectorsRef.current.reduce(
          (sum, s) => sum + (s.status === 'Active' ? (s.revenue || 0) : 0), 0
        );
        const mult = GROWTH_MULTIPLIERS[prev?.growthRate] || 1;
        const baseDividend = Math.floor((currentBizIncome + currentSecRevenue) * 0.001 * mult);
        const finalDividend = baseDividend > 0 ? baseDividend : 10 * mult;
        return {
          ...prev,
          balance: (prev?.balance || 0) + finalDividend,
          lastDividend: finalDividend,
        };
      });

      // 5. Investment Market Micro-Fluctuations (realistic noise ±0.04%)
      setInvestments(prev => {
        if (!Array.isArray(prev)) return INITIAL_INVESTMENTS;
        return prev.map(inv => {
          const delta = (Math.random() * 0.0008 - 0.0004); // -0.04% to +0.04%
          const newPrice = Math.max(1, Number((inv.currentPrice * (1 + delta)).toFixed(2)));
          return { ...inv, currentPrice: newPrice };
        });
      });

      // 6. Balance History Snapshot for Analytics Chart
      setBalanceHistory(prev => {
        const netWorthData = calculateNetWorth({
          wallet: walletRef.current,
          bank: bankRef.current,
          businesses: businessesRef.current,
          sectors: sectorsRef.current,
          investments: investmentsRef.current,
          properties: propertiesRef.current,
          expenses: expensesRef.current
        });
        const newEntry = {
          time: Date.now(),
          value: Math.round(netWorthData.netWorth)
        };
        const updated = [...prev, newEntry];
        return updated.slice(-30);
      });

    }, config.simulationSpeed);

    return () => clearInterval(pulse);
  }, [config.simulationSpeed, isPulseActive]);

  // Random Dividend Events
  useEffect(() => {
    if (!isPulseActive) return;

    const eventInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        addTransaction('Imperial Business', 'Credit', 1000, 'Global Asset Dividends');
      }
    }, 15000);
    return () => clearInterval(eventInterval);
  }, [addTransaction, isPulseActive]);

  // ── Authentication & Session Management ───────────────────────────
  const login = (username, password) => {
    if (!username || !password) return false;
    const cleanUser = typeof username === 'string' ? username.trim() : '';
    if (!cleanUser) return false;

    const storedUser = getStored('empire_user', null);
    const isStoredMatch = storedUser && storedUser.username === cleanUser && storedUser.password === password;
    const isDefaultMatch = cleanUser === 'raghav94' && password === '098123456';
    const isValidKey = typeof password === 'string' && password.length >= 6;

    if (isDefaultMatch || isStoredMatch || isValidKey) {
      setUser({
        username: cleanUser,
        role: storedUser?.role || 'CEO',
        profilePic: storedUser?.profilePic || '/1701611631194.jpg',
        lastLogin: new Date().toISOString(),
        password: password
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('empire_user');
  };

  const wipeAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const changePassword = useCallback((newPassword) => {
    setUser(prev => prev ? { ...prev, password: newPassword } : prev);
  }, []);

  // ── Business Actions ──────────────────────────────────────────────
  const addBusiness = useCallback((biz) => {
    setBusinesses(prev => {
      if (!Array.isArray(prev)) return [biz];
      return [...prev, biz];
    });
    addTransaction('Strategic Hub', 'Debit', 50000, `Launch of ${biz.name} Venture`);
  }, [addTransaction]);

  const removeBusiness = useCallback((id) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateBusiness = useCallback((id, updates) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  // ── Transfer Funds (Wallet <-> Bank) ──────────────────────────────
  const transferFunds = useCallback((from, to, amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Invalid amount' };
    if (from === 'wallet') {
      if ((walletRef.current?.balance || 0) < amt) return { success: false, error: 'Insufficient wallet funds' };
      setWallet(prev => ({ ...prev, balance: prev.balance - amt }));
      setBank(prev => ({ ...prev, balance: prev.balance + amt }));
      addTransaction('Transfer', 'Debit', amt, 'Wallet → Bank Transfer');
    } else {
      if ((bankRef.current?.balance || 0) < amt) return { success: false, error: 'Insufficient bank funds' };
      setBank(prev => ({ ...prev, balance: prev.balance - amt }));
      setWallet(prev => ({ ...prev, balance: prev.balance + amt }));
      addTransaction('Transfer', 'Credit', amt, 'Bank → Wallet Transfer');
    }
    return { success: true };
  }, [addTransaction]);

  // ── Family Governance Actions ─────────────────────────────────────
  const addFamilyMember = useCallback((member) => {
    setMembers(prev => [...prev, member]);
    addTransaction('Family Empire', 'Credit', 0, `Added ${member.name} to Family Council`);
  }, [addTransaction]);

  const updateFamilyMember = useCallback((id, updates) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  // ── Investment Actions ────────────────────────────────────────────
  const addInvestment = useCallback((inv) => {
    const totalCost = (Number(inv.quantity) || 0) * (Number(inv.purchasePrice) || 0);
    setInvestments(prev => [...prev, { ...inv, id: inv.id || `inv-${Date.now()}` }]);
    if (totalCost > 0) {
      setWallet(prev => ({ ...prev, balance: Math.max(0, prev.balance - totalCost) }));
      addTransaction('Investments', 'Debit', totalCost, `Purchased ${inv.quantity} units of ${inv.symbol}`);
    }
  }, [addTransaction]);

  const updateInvestment = useCallback((id, updates) => {
    setInvestments(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const removeInvestment = useCallback((id) => {
    const target = investmentsRef.current.find(i => i.id === id);
    if (target) {
      const proceeds = (Number(target.quantity) || 0) * (Number(target.currentPrice) || 0);
      setWallet(prev => ({ ...prev, balance: prev.balance + proceeds }));
      addTransaction('Investments', 'Credit', proceeds, `Liquidated position: ${target.symbol}`);
    }
    setInvestments(prev => prev.filter(i => i.id !== id));
  }, [addTransaction]);

  // ── Real Estate Actions ───────────────────────────────────────────
  const addProperty = useCallback((prop) => {
    setProperties(prev => [...prev, { ...prop, id: prop.id || `prop-${Date.now()}` }]);
    const downPayment = (Number(prop.purchasePrice) || 0) - (Number(prop.loanBalance) || 0);
    if (downPayment > 0) {
      setBank(prev => ({ ...prev, balance: Math.max(0, prev.balance - downPayment) }));
      addTransaction('Real Estate', 'Debit', downPayment, `Acquisition Equity: ${prop.name}`);
    }
  }, [addTransaction]);

  const updateProperty = useCallback((id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeProperty = useCallback((id) => {
    const target = propertiesRef.current.find(p => p.id === id);
    if (target) {
      const netEquity = Math.max(0, (Number(target.currentValuation) || 0) - (Number(target.loanBalance) || 0));
      setBank(prev => ({ ...prev, balance: prev.balance + netEquity }));
      addTransaction('Real Estate', 'Credit', netEquity, `Disposed property equity: ${target.name}`);
    }
    setProperties(prev => prev.filter(p => p.id !== id));
  }, [addTransaction]);

  // ── Expense & Budget Actions ──────────────────────────────────────
  const addExpense = useCallback((exp) => {
    setExpenses(prev => [...prev, { ...exp, id: exp.id || `exp-${Date.now()}` }]);
    addTransaction('Expenses', 'Debit', Number(exp.amount) || 0, `${exp.name} (${exp.category})`);
  }, [addTransaction]);

  const removeExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateBudget = useCallback((category, limit) => {
    setBudgets(prev => ({ ...prev, [category]: Number(limit) || 0 }));
  }, []);

  // ── Tax Actions ───────────────────────────────────────────────────
  const updateTaxSettings = useCallback((updates) => {
    setTaxSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const logTaxPayment = useCallback((payment) => {
    const paymentRecord = {
      id: `tax-pay-${Date.now()}`,
      date: payment.date || new Date().toISOString().split('T')[0],
      amount: Number(payment.amount) || 0,
      quarter: payment.quarter || 'Annual',
      notes: payment.notes || 'Tax Remittance'
    };
    setTaxSettings(prev => ({
      ...prev,
      paymentsHistory: [paymentRecord, ...(prev.paymentsHistory || [])]
    }));
    setBank(prev => ({ ...prev, balance: Math.max(0, prev.balance - paymentRecord.amount) }));
    addTransaction('Tax Center', 'Debit', paymentRecord.amount, `Tax Payment: ${paymentRecord.quarter}`);
  }, [addTransaction]);

  // ── Gamification Actions ──────────────────────────────────────────
  const addXP = useCallback((amount) => {
    setGoals(prev => {
      const newXp = (prev.xp || 0) + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, []);

  const completeMission = useCallback((missionId) => {
    setGoals(prev => {
      const m = prev.missions?.find(x => x.id === missionId);
      if (!m || m.completed) return prev;
      const updatedMissions = prev.missions.map(x => x.id === missionId ? { ...x, completed: true } : x);
      const earnedXP = m.reward || 100;
      const newXp = (prev.xp || 0) + earnedXP;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { ...prev, missions: updatedMissions, xp: newXp, level: newLevel };
    });
  }, []);

  // ── Computed Portfolio Metrics ────────────────────────────────────
  const portfolioNetWorth = useMemo(() => {
    return calculateNetWorth({
      wallet,
      bank,
      businesses,
      sectors,
      investments,
      properties,
      expenses
    });
  }, [wallet, bank, businesses, sectors, investments, properties, expenses]);

  const cashFlowMetrics = useMemo(() => {
    return calculateCashFlow({
      businesses,
      sectors,
      properties,
      investments,
      expenses
    });
  }, [businesses, sectors, properties, investments, expenses]);

  const value = useMemo(() => ({
    // Auth & Core
    user, login, logout, wipeAllData, changePassword,
    // Liquid & Banking
    wallet, setWallet,
    bank, setBank, transferFunds,
    // Businesses & Sectors
    businesses, setBusinesses, addBusiness, removeBusiness, updateBusiness,
    sectors, setSectors,
    // Ledger & Family
    transactions, addTransaction,
    members, setMembers, addFamilyMember, updateFamilyMember,
    // Investments & Real Estate
    investments, setInvestments, addInvestment, updateInvestment, removeInvestment,
    properties, setProperties, addProperty, updateProperty, removeProperty,
    // Expenses & Budgets
    expenses, setExpenses, addExpense, removeExpense, budgets, updateBudget,
    // Tax & Gamification
    taxSettings, updateTaxSettings, logTaxPayment,
    goals, addXP, completeMission,
    // Engine Control & Privacy
    isPulseActive, stopPulse, startPulse, togglePulse,
    privacyMode, togglePrivacyMode,
    widgetConfig, setWidgetConfig,
    theme, setTheme,
    balanceHistory,
    config, setConfig,
    // Computed Real-Time Intelligence
    portfolioNetWorth,
    cashFlowMetrics,
    // Currency Controls
    currencySymbol,
    setCurrencySymbol,
    toggleCurrency,
    formatMoney
  }), [
    user, wallet, bank, businesses, sectors, transactions, members,
    theme, balanceHistory, addTransaction, addBusiness, removeBusiness,
    updateBusiness, changePassword, addFamilyMember, updateFamilyMember,
    transferFunds, config, isPulseActive, stopPulse, startPulse, togglePulse,
    investments, addInvestment, updateInvestment, removeInvestment,
    properties, addProperty, updateProperty, removeProperty,
    expenses, addExpense, removeExpense, budgets, updateBudget,
    taxSettings, updateTaxSettings, logTaxPayment,
    goals, addXP, completeMission, privacyMode, togglePrivacyMode,
    widgetConfig, portfolioNetWorth, cashFlowMetrics,
    currencySymbol, setCurrencySymbol, toggleCurrency, formatMoney
  ]);

  return <EmpireContext.Provider value={value}>{children}</EmpireContext.Provider>;
};

export const useEmpire = () => useContext(EmpireContext);

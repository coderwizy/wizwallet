import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

const EmpireContext = createContext();

const INITIAL_BUSINESSES = [
  { id: 'smm', name: 'SMM Panel', icon: 'BarChart', desc: 'Automated social media marketing services.', income: 5000, expense: 1200, status: 'Active', growth: 1.05, notes: 'Expanding to TikTok sub-panels.' },
  { id: 'video', name: 'Video Bundles', icon: 'Video', desc: 'Pre-edited video bundles for creators.', income: 3200, expense: 800, status: 'Active', growth: 1.02, notes: 'New fitness bundle launch.' },
  { id: 'ecom', name: 'E-commerce Hub', icon: 'ShoppingBag', desc: 'Dropshipping & branded physical products.', income: 12500, expense: 7000, status: 'Active', growth: 1.08, notes: 'Supply chain delays in Q1.' },
  { id: 'courses', name: 'Course Academy', icon: 'BookOpen', desc: 'Digital marketing and design courses.', income: 8400, expense: 1500, status: 'Active', growth: 1.10, notes: 'High ROI on Facebook Ads.' },
  { id: 'factory-st', name: 'Stationary & Textile Factory', icon: 'Factory', desc: 'Large scale manufacturing of high-end stationary and textiles.', income: 45000, expense: 22000, status: 'Active', growth: 1.02, notes: 'New export contract signed.' },
  { id: 'transport', name: 'Imperial Transport Co.', icon: 'Truck', desc: 'Logistics and heavy-duty shipping network.', income: 28000, expense: 18000, status: 'Active', growth: 1.04, notes: 'Fleet expansion in progress.' },
  { id: 'tata-deal', name: 'Tata Automobile Dealership', icon: 'Car', desc: 'Flagship dealership for Tata premium vehicles.', income: 65000, expense: 45000, status: 'Active', growth: 1.03, notes: 'EV segment seeing 40% growth.' },
  { id: 'markets', name: 'Shops & Mini Markets', icon: 'Store', desc: 'Urban retail chain and convenience stores.', income: 15000, expense: 9000, status: 'Active', growth: 1.01, notes: 'Opening 5 new locations.' },
  { id: 'warehousing', name: 'Strategic Warehousing', icon: 'Building2', desc: 'Industrial storage and fulfillment centers.', income: 34000, expense: 14000, status: 'Active', growth: 1.03, notes: '98% capacity utilization.' },
  { id: 'ai-firm', name: 'AI Services Firm', icon: 'Cpu', desc: 'B2B AI automation and machine learning solutions.', income: 92000, expense: 40000, status: 'Active', growth: 1.15, notes: 'Proprietary LLM in beta.' },
  { id: 'web-dev', name: 'Elite Web Dev Agency', icon: 'Globe2', desc: 'High-end development for enterprise systems.', income: 55000, expense: 20000, status: 'Active', growth: 1.09, notes: 'Backlog full for 6 months.' },
  { id: 'social-agency', name: 'Social Media Agency', icon: 'Share2', desc: 'Full-stack social branding and viral growth.', income: 42000, expense: 15000, status: 'Active', growth: 1.12, notes: 'New influencer pod created.' },
  { id: 'gaming', name: 'Gaming Services', icon: 'Gamepad2', desc: 'E-sports infrastructure and server hosting.', income: 38000, expense: 12000, status: 'Active', growth: 1.14, notes: 'Global tournament sponsorship.' }
];

const SECTORS = [
  'AI Research', 'Robotics', 'Cloud Hosting', 'Cybersecurity', 'Blockchain Nodes', 'Logistics', 'Manufacturing', 'Green Energy', 'Biotech', 'Media Rights',
  'Aerospace', 'Fintech', 'EdTech', 'SaaS', 'Real Estate', 'Venture Capital', 'Crypto Mining', 'Dropshipping', 'Consulting', 'Gaming Studio',
  'Nanotech', 'Quantum Computing', 'Space Tech', 'Satellite Hub', 'Defense Systems', 'Maritime Ops', 'Mining', 'Oil & Gas', 'Telecommunications', 'AgriTech'
].map(name => ({
  id: name.toLowerCase().replace(/ /g, '-'),
  name,
  revenue: Math.floor(Math.random() * 50000) + 10000,
  expense: Math.floor(Math.random() * 20000) + 5000,
  status: 'Active',
  growth: parseFloat((Math.random() * 2).toFixed(1)),
  history: []
}));

const INITIAL_TRANSACTIONS = [
  { id: 'tx-101', timestamp: Date.now() - 3600000 * 2, module: 'Wallet', type: 'Credit', amount: 15000, description: 'SMM Panel Automated Revenue Dividend', user: 'raghav94' },
  { id: 'tx-102', timestamp: Date.now() - 3600000 * 6, module: 'Bank', type: 'Credit', amount: 45000, description: 'Stationary & Textile Export Contract Settlement', user: 'raghav94' },
  { id: 'tx-103', timestamp: Date.now() - 3600000 * 12, module: 'Business', type: 'Debit', amount: 12000, description: 'AI Services Server Hosting Infrastructure', user: 'raghav94' },
  { id: 'tx-104', timestamp: Date.now() - 3600000 * 24, module: 'Sectors', type: 'Credit', amount: 28500, description: 'Cybersecurity Node Optimization Yield', user: 'raghav94' },
  { id: 'tx-105', timestamp: Date.now() - 3600000 * 36, module: 'Wallet', type: 'Debit', amount: 5000, description: 'Family Council Allowance Distribution', user: 'raghav94' },
  { id: 'tx-106', timestamp: Date.now() - 3600000 * 48, module: 'Bank', type: 'Credit', amount: 65000, description: 'Tata Automobile Fleet Sales Distribution', user: 'raghav94' },
  { id: 'tx-107', timestamp: Date.now() - 3600000 * 72, module: 'Business', type: 'Credit', amount: 12500, description: 'E-commerce Hub Q1 Dividend Payout', user: 'raghav94' },
];

export const EmpireProvider = ({ children }) => {
  // Helper for safe state recovery
  const getStored = (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored || stored === 'undefined' || stored === 'null') return fallback;
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Failed to recover ${key}`, e);
      return fallback;
    }
  };

  const [user, setUser] = useState(() => {
    const u = getStored('empire_user', null);
    if (u && u.profilePic && u.profilePic.includes('/src/assets/')) {
      u.profilePic = u.profilePic.replace('/src/assets/', '/');
    }
    return u;
  });
  const [wallet, setWallet] = useState(() => getStored('empire_wallet', { balance: 25000, history: [], growthRate: 'Slow', lastDividend: 0 }));
  const [bank, setBank] = useState(() => getStored('empire_bank', {
    balance: 100000,
    history: [],
    interestTier: 'Moderate',
    assets: 450000,
    loans: 0,
    forex: { usd: 1, inr: 83.5, aed: 3.67 }
  }));
  const [businesses, setBusinesses] = useState(() => getStored('empire_businesses', INITIAL_BUSINESSES));
  const [sectors, setSectors] = useState(() => getStored('empire_sectors', SECTORS));
  const [transactions, setTransactions] = useState(() => {
    const stored = getStored('empire_transactions', null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return INITIAL_TRANSACTIONS;
    return stored;
  });
  const [members, setMembers] = useState(() => getStored('empire_family', [
    { id: 1, name: 'Raghav (Head)', role: 'Admin', wealth: 65, goal: 'Legacy Trust', status: 'Excellent' },
    { id: 2, name: 'Family Member 2', role: 'Support', wealth: 15, goal: 'Education Fund', status: 'Optimal' },
    { id: 3, name: 'Family Member 3', role: 'Member', wealth: 10, goal: 'Personal Ventures', status: 'Growth' },
    { id: 4, name: 'Family Member 4', role: 'Dependent', wealth: 10, goal: 'Future Assets', status: 'Savings' },
  ]));
  const [theme, setTheme] = useState(() => localStorage.getItem('empire_theme') || 'dark');

  // Historical balance snapshots for charting (last 30 entries)
  const [balanceHistory, setBalanceHistory] = useState(() =>
    getStored('empire_balance_history', [{ time: Date.now(), value: 125000 }])
  );

  const [config, setConfig] = useState(() => getStored('empire_config', {
    simulationSpeed: 10000,
    autoSave: true,
    neonMode: true,
    transparency: true,
    vibration: true,
    isPulseActive: true
  }));

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

  // Expose on global window object for developer / console access
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

  // ── Refs to stable state for the growth engine ──────────────────
  const sectorsRef = useRef(sectors);
  const businessesRef = useRef(businesses);
  const walletRef = useRef(wallet);
  const bankRef = useRef(bank);

  useEffect(() => { sectorsRef.current = sectors; }, [sectors]);
  useEffect(() => { businessesRef.current = businesses; }, [businesses]);
  useEffect(() => { walletRef.current = wallet; }, [wallet]);
  useEffect(() => { bankRef.current = bank; }, [bank]);

  // ── Persistence ──────────────────────────────────────────────────
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
    } catch (e) {
      console.warn('Storage persistence failed', e);
    }
  }, [wallet, bank, businesses, sectors, transactions, members, theme, user, balanceHistory, config]);

  // ── Unified Growth Engine — stable interval (re-creates if simulationSpeed changes or pulse toggles) ──
  useEffect(() => {
    if (!isPulseActive) return;

    const pulse = setInterval(() => {
      // 1. Grow Sectors
      setSectors(prev => {
        if (!Array.isArray(prev)) return SECTORS;
        return prev.map(sec =>
          sec.status === 'Active' ? { ...sec, revenue: (sec.revenue || 0) + (sec.revenue * 0.0002) } : sec
        );
      });

      // 2. Grow Businesses
      setBusinesses(prev => {
        if (!Array.isArray(prev)) return INITIAL_BUSINESSES;
        return prev.map(biz =>
          biz.status === 'Active' ? { ...biz, income: (biz.income || 0) + (biz.income * 0.0005) } : biz
        );
      });

      // 3. Bank Interest — tier-aware rate (matches the displayed APY proportionally)
      const BANK_PULSE_RATES = { Safe: 0.00005, Moderate: 0.0001, 'High Yield': 0.00025, Tycoon: 0.0004, Imperial: 0.0006 };
      const bankPulseRate = BANK_PULSE_RATES[bankRef.current?.interestTier] || 0.0001;
      setBank(prev => ({
        ...prev,
        balance: (prev?.balance || 0) + ((prev?.balance || 0) * bankPulseRate)
      }));

      // 4. Wallet Dividends — growth-rate multiplier applied via ref (Bug #1 fix)
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

      // 5. Snapshot balance for historical chart
      setBalanceHistory(prev => {
        const newEntry = {
          time: Date.now(),
          value: (walletRef.current?.balance || 0) + (bankRef.current?.balance || 0)
        };
        const updated = [...prev, newEntry];
        return updated.slice(-30);
      });

    }, config.simulationSpeed);

    return () => clearInterval(pulse);
  }, [config.simulationSpeed, isPulseActive]); 

  const addTransaction = useCallback((module, type, amount, description) => {
    const newTx = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      module: module || 'System',
      type: type || 'Credit',
      amount: amount || 0,
      description: description || 'No details',
      user: 'Raghav94'
    };
    setTransactions(prev => {
      if (!Array.isArray(prev)) return [newTx];
      return [newTx, ...prev].slice(0, 500);
    });
  }, []);

  // Events (paused when pulse is stopped)
  useEffect(() => {
    if (!isPulseActive) return;

    const eventInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        addTransaction('Imperial Business', 'Credit', 1000, 'Global Asset Dividends');
      }
    }, 15000);
    return () => clearInterval(eventInterval);
  }, [addTransaction, isPulseActive]);

  const login = (username, password) => {
    if (!username || !password) return false;
    const cleanUser = typeof username === 'string' ? username.trim() : '';
    if (!cleanUser) return false;

    // Check if matches default credentials, stored account, or any valid master key (>= 6 characters)
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

  // ── FIXED: standardized logout — only clears session, not data ──
  const logout = () => {
    setUser(null);
    localStorage.removeItem('empire_user');
  };

  // ── Full data wipe — used by Settings "Destroy Data" only ───────
  const wipeAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ── Change password ──────────────────────────────────────────────
  const changePassword = useCallback((newPassword) => {
    setUser(prev => prev ? { ...prev, password: newPassword } : prev);
  }, []);

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

  const addFamilyMember = useCallback((member) => {
    setMembers(prev => [...prev, member]);
    addTransaction('Family Empire', 'Credit', 0, `Added ${member.name} to Family Council`);
  }, [addTransaction]);

  const updateFamilyMember = useCallback((id, updates) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const value = useMemo(() => ({
    user, login, logout, wipeAllData, changePassword,
    wallet, setWallet,
    bank, setBank,
    businesses, setBusinesses, addBusiness, removeBusiness,
    sectors, setSectors,
    transactions, addTransaction,
    members, setMembers, addFamilyMember, updateFamilyMember,
    theme, setTheme,
    balanceHistory,
    config, setConfig,
    transferFunds,
    isPulseActive,
    stopPulse,
    startPulse,
    togglePulse,
  }), [
    user, wallet, bank, businesses, sectors, transactions, 
    members, theme, balanceHistory, addTransaction, addBusiness, 
    removeBusiness, changePassword, addFamilyMember, updateFamilyMember, 
    transferFunds, config, isPulseActive, stopPulse, startPulse, togglePulse
  ]);

  return <EmpireContext.Provider value={value}>{children}</EmpireContext.Provider>;
};

export const useEmpire = () => useContext(EmpireContext);

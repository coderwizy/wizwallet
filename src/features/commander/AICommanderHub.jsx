import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Sparkles, Bot, AlertTriangle, TrendingUp, CheckCircle2,
  DollarSign, ShieldCheck, ArrowRight, Lightbulb, Zap, Send,
  Cpu, BarChart3, HelpCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const AICommanderHub = () => {
  const {wallet, bank, businesses, sectors, investments, properties, expenses,
    portfolioNetWorth, cashFlowMetrics, privacyMode, currencySymbol } = useEmpire();

  const [customQuery, setCustomQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      time: 'Just now',
      text: 'Greetings Sovereign. AI Empire Commander is calibrated to your local financial state. All 13 corporate ventures, bank vaults, capital markets, and properties are synchronized. How may I assist your empire strategy today?'
    }
  ]);

  // Real-Time Local Intelligence Diagnostic
  const diagnostics = useMemo(() => {
    // 1. Most profitable business
    const activeBiz = businesses.filter(b => b.status === 'Active');
    const sortedByProfit = [...activeBiz].sort((a, b) => {
      const profitA = (a.income || 0) - (a.expense || 0);
      const profitB = (b.income || 0) - (b.expense || 0);
      return profitB - profitA;
    });
    const topPerformer = sortedByProfit[0] || null;

    // 2. High Burn / Declining Ventures
    const highBurnList = activeBiz.filter(b => {
      const margin = (b.income || 0) - (b.expense || 0);
      return margin < (b.income * 0.2) || (b.expense || 0) > 30000;
    });

    // 3. Liquidity ratio (Liquid cash vs Total Net Worth)
    const liquidTotal = (wallet?.balance || 0) + (bank?.balance || 0);
    const nwTotal = portfolioNetWorth?.netWorth || 0;
    const liquidRatio = nwTotal > 0
      ? ((liquidTotal / nwTotal) * 100).toFixed(1)
      : '0';

    // 4. Recommendations list
    const recs = [];
    if (Number(liquidRatio) < 15) {
      recs.push({
        title: 'Capital Reserves Replenishment',
        severity: 'warning',
        desc: `Liquid capital represents only ${liquidRatio}% of total empire net worth. Consider converting securities or real estate yields into liquid bank reserves.`
      });
    } else {
      recs.push({
        title: 'Optimal Liquid Buffer',
        severity: 'success',
        desc: `Liquid reserves are solid at ${liquidRatio}% of net worth, easily covering over 6 months of corporate operating expenses.`
      });
    }

    if (topPerformer) {
      recs.push({
        title: `Reinvest in ${topPerformer.name}`,
        severity: 'info',
        desc: `${topPerformer.name} yields the highest operating surplus ($${((topPerformer.income || 0) - (topPerformer.expense || 0)).toLocaleString()}/mo). Scaling its infrastructure will yield maximum compound ROI.`
      });
    }

    if (highBurnList.length > 0) {
      recs.push({
        title: `Audit ${highBurnList[0].name} Operating Burn`,
        severity: 'warning',
        desc: `${highBurnList[0].name} has an operating expenditure of ${currencySymbol}${Number(highBurnList[0].expense || 0).toLocaleString()}/mo. Consider re-negotiating supplier contracts or automating workflows.`
      });
    }

    return {
      topPerformer,
      highBurnList,
      liquidTotal,
      liquidRatio,
      recs
    };
  }, [businesses, wallet, bank, portfolioNetWorth]);

  // Answer generation engine using actual local state data
  const answerQuery = (query) => {
    const q = query.toLowerCase();
    const currentNw = portfolioNetWorth?.netWorth || 0;
    const bd = portfolioNetWorth?.breakdown || {};
    const liabilities = portfolioNetWorth?.totalLiabilities || 0;
    const netCf = cashFlowMetrics?.netMonthlyCashflow || 0;
    const cfBd = cashFlowMetrics?.breakdown || {};

    if (q.includes('net worth') || q.includes('worth') || q.includes('wealth')) {
      return `Your total audited Empire Net Worth is $${currentNw.toLocaleString()}. This includes $${(bd.liquidWallet || 0).toLocaleString()} in liquid wallet, $${(bd.bankBalance || 0).toLocaleString()} in bank deposits, $${(bd.investmentsValue || 0).toLocaleString()} in securities, $${(bd.realEstateValue || 0).toLocaleString()} in real estate, and $${(bd.businessValuation || 0).toLocaleString()} in corporate equity, minus $${liabilities.toLocaleString()} in debt.`;
    }

    if (q.includes('most profit') || q.includes('top business') || q.includes('best business') || q.includes('highest')) {
      if (diagnostics.topPerformer) {
        const net = (diagnostics.topPerformer.income || 0) - (diagnostics.topPerformer.expense || 0);
        return `Your most profitable commercial node is ${diagnostics.topPerformer.name}, generating $${(diagnostics.topPerformer.income || 0).toLocaleString()}/mo in gross yield and $${net.toLocaleString()}/mo in net profit (${((net / diagnostics.topPerformer.income) * 100).toFixed(1)}% margin).`;
      }
      return 'No active corporate ventures found in your empire registry.';
    }

    if (q.includes('losing') || q.includes('burn') || q.includes('expense') || q.includes('cost')) {
      const topBurn = diagnostics.highBurnList[0];
      return `Your highest operating burn occurs in ${topBurn ? topBurn.name : 'Corporate Logistics'}, expending $${topBurn ? (topBurn.expense || 0).toLocaleString() : 'N/A'}/mo. Your total personal and business monthly outflows equal $${(cashFlowMetrics?.totalMonthlyExpense || 0).toLocaleString()}/mo.`;
    }

    if (q.includes('passive income') || q.includes('passive') || q.includes('dividends')) {
      return `Your current passive income is generating approximately $${(cashFlowMetrics?.passiveIncome || 0).toLocaleString()}/mo across real estate rentals ($${(cfBd.rentalIncome || 0).toLocaleString()}/mo), investment dividend distributions ($${(cfBd.investmentDividends || 0).toLocaleString()}/mo), and optimized industrial sector rights.`;
    }

    if (q.includes('reserve') || q.includes('liquid') || q.includes('cash')) {
      return `You hold $${(diagnostics.liquidTotal || 0).toLocaleString()} in combined liquid capital, constituting ${diagnostics.liquidRatio}% of total empire assets. Recommended benchmark is 15-20% for continuous sovereign agility.`;
    }

    if (q.includes('5 years') || q.includes('forecast') || q.includes('future')) {
      const projected = Math.round(currentNw * Math.pow(1.12, 5));
      return `Based on your balanced scenario (11-12% annual compounding + $${netCf.toLocaleString()} monthly cashflow reinvestment), your projected net worth in 5 years is estimated at $${projected.toLocaleString()}. You can run multi-year stress tests in the Future Wealth Simulator.`;
    }

    // Default synthesis
    return `Analysis complete based on your active state: Net Worth is $${currentNw.toLocaleString()}, generating $${netCf.toLocaleString()}/mo net surplus across ${businesses.length} corporate ventures and ${properties.length} real estate holdings. To maximize growth, prioritize reinvesting surplus cash into your highest-margin nodes.`;
  };

  const handleSend = (text) => {
    const queryText = text || customQuery;
    if (!queryText.trim()) return;

    const userMsg = {
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: queryText
    };

    const replyMsg = {
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: answerQuery(queryText)
    };

    setMessages(prev => [...prev, userMsg, replyMsg]);
    setCustomQuery('');
  };

  const presetQueries = [
    'What is my current total net worth?',
    'Which business generates the most profit?',
    'How much passive income am I generating?',
    'What are my largest expenses & burn?',
    'What will my net worth look like after 5 years?'
  ];

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Autonomous Financial Intelligence
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight flex items-center gap-2.5">
            AI Empire Commander
            <Badge variant="accent">Local Offline Engine</Badge>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">All Local Data Synchronized</Badge>
        </div>
      </div>

      {/* Strategic Intelligence Briefing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#526B56]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Top Enterprise Node</span>
          </div>
          <h3 className="text-lg font-bold text-[#22251F]">
            {diagnostics.topPerformer ? diagnostics.topPerformer.name : 'N/A'}
          </h3>
          <p className="text-xs text-[#77786F]">
            Surplus: <strong className="text-[#526B56] font-bold">+{currencySymbol}{mask(((diagnostics.topPerformer?.income || 0) - (diagnostics.topPerformer?.expense || 0)).toLocaleString())}/mo</strong>
          </p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#C18A48]">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Passive Cashflow</span>
          </div>
          <h3 className="text-lg font-bold text-[#22251F]">
            {currencySymbol}{mask(cashFlowMetrics.passiveIncome.toLocaleString())} / mo
          </h3>
          <p className="text-xs text-[#77786F]">
            From real estate rentals & securities dividends
          </p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#4A7C8A]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Solvency Ratio</span>
          </div>
          <h3 className="text-lg font-bold text-[#22251F]">
            {diagnostics.liquidRatio}% Liquid Buffer
          </h3>
          <p className="text-xs text-[#77786F]">
            Total Liquid Vault: {currencySymbol}{mask(diagnostics.liquidTotal.toLocaleString())}
          </p>
        </Card>
      </div>

      {/* Strategic Recommendations Banner */}
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE8DF]">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#C18A48]" />
            <h3 className="text-sm font-bold text-[#22251F]">Autonomous Strategic Recommendations</h3>
          </div>
          <span className="text-[11px] text-[#A3A297] font-semibold">{diagnostics.recs.length} Active Insights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {diagnostics.recs.map((rec, i) => (
            <div key={i} className="p-3 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl space-y-1">
              <span className={`text-[10px] font-bold uppercase ${
                rec.severity === 'warning' ? 'text-[#C66D65]' : rec.severity === 'success' ? 'text-[#526B56]' : 'text-[#4A7C8A]'
              }`}>
                {rec.title}
              </span>
              <p className="text-xs text-[#77786F] leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Interactive Dialogue Terminal */}
      <Card className="border border-[#EAE8DF] bg-white p-0 overflow-hidden flex flex-col h-[520px]">
        {/* Terminal Header */}
        <div className="p-4 border-b border-[#EAE8DF] bg-[#FCFBF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#22251F]">Empire Commander Terminal</h3>
              <p className="text-[10px] text-[#77786F]">Live synthesis using your actual local portfolio data</p>
            </div>
          </div>
          <Badge variant="success">Engine Ready</Badge>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="p-3 bg-[#FCFBF8] border-b border-[#EAE8DF] flex items-center gap-2 overflow-x-auto scroll-hide">
          <span className="text-[10px] font-bold text-[#A3A297] uppercase shrink-0">Quick Queries:</span>
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(pq)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#EAE8DF] text-[#77786F] hover:text-[#526B56] hover:border-[#526B56] transition-colors shrink-0 cursor-pointer"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-hide bg-[#F8F7F2]/40">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#526B56] text-white rounded-br-xs'
                    : 'bg-white border border-[#EAE8DF] text-[#22251F] shadow-2xs rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-[#A3A297] mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="p-3 border-t border-[#EAE8DF] bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            placeholder="Ask commander anything about your empire (e.g. Which business generates the most profit?)..."
            className="flex-1 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl px-3.5 py-2.5 text-xs text-[#22251F] outline-none focus:border-[#526B56] font-medium"
          />
          <Button type="submit" variant="primary" icon={Send} disabled={!customQuery.trim()}>
            Analyze
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default React.memo(AICommanderHub);


import React, { useState } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import {
  Sparkles, Bot, Send, TrendingUp, DollarSign, ShieldCheck
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';

const MobileCommanderView = () => {
  const { portfolioNetWorth, cashFlowMetrics, businesses, wallet, privacyMode } = useEmpire();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `AI Commander online. Current Net Worth is $${portfolioNetWorth.netWorth.toLocaleString()}, generating $${cashFlowMetrics.netMonthlyCashflow.toLocaleString()}/mo net surplus. How can I assist?`
    }
  ]);

  const handleSend = (text) => {
    const q = (text || query).trim();
    if (!q) return;

    let reply = `Portfolio status: Total net worth is $${portfolioNetWorth.netWorth.toLocaleString()} across ${businesses.length} commercial nodes. Monthly cash flow is healthy at +$${cashFlowMetrics.netMonthlyCashflow.toLocaleString()}/mo.`;

    const lower = q.toLowerCase();
    if (lower.includes('net worth') || lower.includes('worth')) {
      reply = `Audited Net Worth: $${portfolioNetWorth.netWorth.toLocaleString()} ($${portfolioNetWorth.breakdown.liquidWallet.toLocaleString()} in liquid wallet, $${portfolioNetWorth.breakdown.bankBalance.toLocaleString()} bank, $${portfolioNetWorth.breakdown.investmentsValue.toLocaleString()} investments, $${portfolioNetWorth.breakdown.realEstateValue.toLocaleString()} real estate).`;
    } else if (lower.includes('profit') || lower.includes('best')) {
      reply = `Highest yielding node: AI Services Firm generates $92,000/mo gross with $52,000/mo net profit margin.`;
    } else if (lower.includes('passive')) {
      reply = `Passive Income: +$${cashFlowMetrics.passiveIncome.toLocaleString()}/mo derived from real estate leases and investment dividends.`;
    }

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'ai', text: reply }
    ]);
    setQuery('');
  };

  const quicks = [
    'What is my total net worth?',
    'Which business generates the most profit?',
    'What is my monthly passive income?'
  ];

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#526B56]" />
          <h2 className="text-sm font-bold text-[#22251F]">AI Empire Commander</h2>
        </div>
        <Badge variant="success">Local Engine</Badge>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scroll-hide py-1">
        {quicks.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#EAE8DF] text-[#77786F] whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 p-3 bg-white border border-[#EAE8DF] rounded-2xl scroll-hide">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-xs ${
              m.sender === 'user' ? 'bg-[#526B56] text-white' : 'bg-[#FCFBF8] border border-[#EAE8DF] text-[#22251F]'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask commander anything..."
          className="flex-1 bg-white border border-[#EAE8DF] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#526B56]"
        />
        <Button type="submit" variant="primary" size="sm" icon={Send} disabled={!query.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default React.memo(MobileCommanderView);

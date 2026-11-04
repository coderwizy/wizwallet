import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import {
  Receipt, Plus, Trash2, Edit3, DollarSign, AlertCircle,
  CheckCircle2, PieChart as PieIcon, ArrowDownRight, Tag,
  Briefcase, User, Calendar, Sliders
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const CATEGORY_COLORS = {
  Technology: '#526B56',
  Operations: '#4A7C8A',
  Housing: '#C18A48',
  Legal: '#7C5ABF',
  Lifestyle: '#C66D65',
  Other: '#82977B'
};

const ExpenseHub = () => {
  const {
    expenses, addExpense, removeExpense, budgets, updateBudget, privacyMode
  } = useEmpire();

  const [scope, setScope] = useState('All'); // 'All', 'Business', 'Personal'
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Technology',
    amount: '1200',
    frequency: 'Monthly',
    type: 'Business'
  });

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (scope === 'All') return true;
      return e.type === scope;
    });
  }, [expenses, scope]);

  // Total Monthly Burn
  const totalBurn = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filteredExpenses]);

  // Category Aggregates
  const categoryStats = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(e.amount || 0);
    });

    return Object.entries(budgets || {}).map(([cat, budgetLimit]) => {
      const spent = map[cat] || 0;
      const pct = budgetLimit > 0 ? Math.round((spent / budgetLimit) * 100) : 0;
      const isOver = spent > budgetLimit;
      return {
        category: cat,
        spent,
        budgetLimit,
        percentage: pct,
        isOver,
        color: CATEGORY_COLORS[cat] || '#526B56'
      };
    });
  }, [expenses, budgets]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addExpense({
      name: form.name.trim(),
      category: form.category,
      amount: parseFloat(form.amount) || 0,
      frequency: form.frequency,
      type: form.type,
      date: new Date().toISOString().split('T')[0]
    });

    setForm({
      name: '',
      category: 'Technology',
      amount: '1200',
      frequency: 'Monthly',
      type: 'Business'
    });
    setIsAddOpen(false);
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
            Cash Burn & Budget Governance
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
            Expense & Budget Manager
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Sliders} onClick={() => setIsBudgetOpen(true)}>
            Calibrate Budgets
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
            Record Expense
          </Button>
        </div>
      </div>

      {/* Scope Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EAE8DF] rounded-xl w-fit">
        {['All', 'Business', 'Personal'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setScope(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              scope === tab
                ? 'bg-[#526B56] text-white shadow-2xs'
                : 'text-[#77786F] hover:text-[#22251F] hover:bg-[#F8F7F2]'
            }`}
          >
            {tab} Outflows
          </button>
        ))}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">
            {scope} Monthly Outflows
          </span>
          <h3 className="text-3xl font-extrabold text-[#C66D65] tabular-nums mt-1">
            ${mask(totalBurn.toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Across {filteredExpenses.length} recurring records</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">
            Total Allocated Budget
          </span>
          <h3 className="text-3xl font-extrabold text-[#22251F] tabular-nums mt-1">
            ${mask(Object.values(budgets).reduce((a, b) => a + b, 0).toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Monthly threshold ceiling</p>
        </Card>

        <Card className="p-5 border border-[#EAE8DF] bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">
            Annual Run-Rate Burn
          </span>
          <h3 className="text-3xl font-extrabold text-[#C18A48] tabular-nums mt-1">
            ${mask((totalBurn * 12).toLocaleString())}
          </h3>
          <p className="text-[11px] text-[#77786F] mt-1">Projected annual operational cost</p>
        </Card>
      </div>

      {/* Budget Utilization Progress Section */}
      <Card className="p-6 border border-[#EAE8DF] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#22251F]">Category Budget Utilization</h3>
            <p className="text-xs text-[#77786F]">Real-time tracking of expenses against monthly thresholds</p>
          </div>
          <Badge variant="accent">5 Categories Calibrated</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {categoryStats.map(stat => (
            <div key={stat.category} className="p-3.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="font-bold text-[#22251F]">{stat.category}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold tabular-nums ${stat.isOver ? 'text-[#C66D65]' : 'text-[#22251F]'}`}>
                    ${mask(stat.spent.toLocaleString())}
                  </span>
                  <span className="text-[#A3A297] text-[10px]"> / ${mask(stat.budgetLimit.toLocaleString())}</span>
                </div>
              </div>

              <div className="w-full h-2 bg-[#F1EFE7] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stat.isOver ? 'bg-[#C66D65]' : 'bg-[#526B56]'}`}
                  style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className={stat.isOver ? 'text-[#C66D65] font-bold' : 'text-[#77786F]'}>
                  {stat.isOver ? `Over budget by $${mask((stat.spent - stat.budgetLimit).toLocaleString())}` : 'Within target'}
                </span>
                <span className="font-semibold text-[#A3A297]">{stat.percentage}% utilized</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Expenses Records Table */}
      <Card className="overflow-hidden border border-[#EAE8DF] bg-white p-0">
        <div className="p-4 border-b border-[#EAE8DF] flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#22251F]">Recurring Expenses & Invoices ({filteredExpenses.length})</h3>
          <Badge variant="default">{scope} Scope</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCFBF8] border-b border-[#EAE8DF] text-[10px] font-semibold text-[#A3A297] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Expense Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3 text-right">Monthly Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8DF]">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-[#FCFBF8] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#22251F]">
                    {exp.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1EFE7] text-[#77786F]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={exp.type === 'Business' ? 'primary' : 'default'}>{exp.type}</Badge>
                  </td>
                  <td className="py-3 px-3 text-[#77786F]">
                    {exp.frequency || 'Monthly'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#C66D65] tabular-nums">
                    -${mask(Number(exp.amount || 0).toLocaleString())}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeExpense(exp.id)}
                      className="p-1 rounded text-[#A3A297] hover:text-[#C66D65] hover:bg-[#FCEEED] cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Expense Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record New Expense"
        subtitle="Track recurring burn or one-time operational invoice"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Expense Description / Vendor"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. AWS Cloud Infrastructure"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Technology">Technology & Infrastructure</option>
                <option value="Operations">Operations & Logistics</option>
                <option value="Housing">Housing & Real Estate</option>
                <option value="Legal">Legal & Governance</option>
                <option value="Lifestyle">Lifestyle & Health</option>
                <option value="Other">Other Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Classification</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Business">Business Venture Outflow</option>
                <option value="Personal">Personal / Estate Outflow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount ($)"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
            />
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1.5">Billing Cadence</label>
              <select
                value={form.frequency}
                onChange={e => setForm({ ...form, frequency: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none focus:border-[#526B56]"
              >
                <option value="Monthly">Monthly Recurring</option>
                <option value="Annual">Annual Subscription</option>
                <option value="One-Time">One-Time Capital Burn</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Record Expense
          </Button>
        </form>
      </Modal>

      {/* Calibrate Budgets Modal */}
      <Modal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        title="Calibrate Monthly Budgets"
        subtitle="Set ceiling limits for each operational expenditure domain"
      >
        <div className="space-y-3">
          {Object.entries(budgets).map(([cat, val]) => (
            <div key={cat} className="flex items-center justify-between gap-4 p-2.5 bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl">
              <span className="text-xs font-bold text-[#22251F]">{cat}</span>
              <div className="flex items-center gap-1.5 w-36">
                <span className="text-xs text-[#A3A297]">$</span>
                <input
                  type="number"
                  value={val}
                  onChange={e => updateBudget(cat, e.target.value)}
                  className="w-full text-xs font-bold text-[#22251F] bg-white border border-[#EAE8DF] rounded-lg px-2 py-1 outline-none focus:border-[#526B56]"
                />
              </div>
            </div>
          ))}
          <Button variant="primary" className="w-full py-2.5 mt-2" onClick={() => setIsBudgetOpen(false)}>
            Save Budget Limits
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(ExpenseHub);


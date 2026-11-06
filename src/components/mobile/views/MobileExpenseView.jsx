import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import {
  Receipt, Plus, Trash2, Sliders, Tag
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Input from '../../ui/Input';
import MobileActionSheet from '../MobileActionSheet';

const MobileExpenseView = () => {
  const { expenses, addExpense, removeExpense, budgets, privacyMode } = useEmpire();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [scope, setScope] = useState('All');

  const [form, setForm] = useState({
    name: '',
    category: 'Technology',
    amount: '1200',
    type: 'Business'
  });

  const filtered = useMemo(() => {
    return expenses.filter(e => scope === 'All' || e.type === scope);
  }, [expenses, scope]);

  const totalBurn = useMemo(() => {
    return filtered.reduce((s, e) => s + Number(e.amount || 0), 0);
  }, [filtered]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    addExpense({
      name: form.name.trim(),
      category: form.category,
      amount: parseFloat(form.amount) || 0,
      frequency: 'Monthly',
      type: form.type,
      date: new Date().toISOString().split('T')[0]
    });

    setForm({ name: '', category: 'Technology', amount: '1200', type: 'Business' });
    setShowAddSheet(false);
  };

  const mask = (val) => privacyMode ? '••••••' : val;

  return (
    <div className="space-y-4 pb-8">
      <Card className="p-5 border border-[#EAE8DF] bg-white space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A297]">Monthly Outflows</p>
            <h2 className="text-3xl font-extrabold text-[#C66D65] tabular-nums mt-0.5">
              {currencySymbol}{mask(totalBurn.toLocaleString())}
            </h2>
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowAddSheet(true)}>
            Record
          </Button>
        </div>

        <div className="flex items-center gap-1 pt-2 border-t border-[#EAE8DF]">
          {['All', 'Business', 'Personal'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                scope === s ? 'bg-[#526B56] text-white' : 'bg-[#FCFBF8] text-[#77786F] border border-[#EAE8DF]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3A297] px-1">
          Expenditure Records ({filtered.length})
        </h3>
        {filtered.map(exp => (
          <Card key={exp.id} className="p-3.5 border border-[#EAE8DF] bg-white flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#22251F]">{exp.name}</h4>
              <p className="text-[10px] text-[#77786F] mt-0.5">{exp.category} · {exp.type}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-[#C66D65] tabular-nums">
                -{currencySymbol}{mask(Number(exp.amount || 0).toLocaleString())}
              </span>
              <button
                type="button"
                onClick={() => removeExpense(exp.id)}
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
        title="Record Expense Outflow"
        subtitle="Log recurring or operating expenditure"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3.5">
          <Input
            label="Description / Vendor"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Server Hosting"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-[#77786F] block mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#FCFBF8] border border-[#EAE8DF] rounded-xl p-2.5 text-xs text-[#22251F] font-semibold outline-none"
              >
                <option value="Technology">Technology</option>
                <option value="Operations">Operations</option>
                <option value="Housing">Housing</option>
                <option value="Legal">Legal</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <Input
              label="Amount ($)"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Record Outflow
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileExpenseView);


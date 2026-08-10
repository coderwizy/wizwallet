import React, { useState } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { motion } from 'framer-motion';
import { Palette, Zap, Shield, Lock, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';

const MobileSettingsView = () => {
  const { theme, setTheme, logout, wipeAllData, changePassword, config, setConfig } = useEmpire();

  // Password sheet
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [pinForm, setPinForm] = useState({ newPin: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Reset sheet
  const [showResetSheet, setShowResetSheet] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPinError('');
    if (pinForm.newPin.length < 6) { setPinError('Password must be at least 6 characters.'); return; }
    if (pinForm.newPin !== pinForm.confirm) { setPinError('Passwords do not match.'); return; }
    changePassword(pinForm.newPin);
    setPinSuccess(true);
    setPinForm({ newPin: '', confirm: '' });
    setTimeout(() => { setPinSuccess(false); setShowPasswordSheet(false); }, 1500);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Appearance Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#E5DFD1]">
          <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-200">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#1C1917] uppercase">Appearance Engine</h3>
            <p className="text-[9px] text-[#78716C]">Interface Display & Theme Modes</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xs font-black text-[#1C1917] uppercase">Primary Theme</p>
            <p className="text-[9px] text-[#78716C]">{theme === 'dark' ? 'Imperial Dark' : 'Deep Cream Light'}</p>
          </div>
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-[#0284C7]' : 'bg-[#D6CDB8]'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'ml-6' : 'ml-0'}`} />
          </button>
        </div>
      </div>

      {/* Pulse Engine Speed */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#E5DFD1]">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#1C1917] uppercase">Simulation Pulse Speed</h3>
            <p className="text-[9px] text-[#78716C]">Heartbeat Frequency</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-xs font-black text-[#1C1917] uppercase">
            {config?.simulationSpeed ? `${config.simulationSpeed / 1000}s Pulse` : '10s Pulse'}
          </span>
          <button
            onClick={() => {
              const speeds = [5000, 10000, 30000, 60000];
              const curIdx = speeds.indexOf(config?.simulationSpeed || 10000);
              updateConfig('simulationSpeed', speeds[(curIdx + 1) % speeds.length]);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] border border-[#E2DAC8] text-[10px] font-black text-[#0284C7] uppercase cursor-pointer"
          >
            Calibrate
          </button>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD1] shadow-xs space-y-3">
        <h3 className="text-xs font-black text-[#1C1917] uppercase pb-2 border-b border-[#E5DFD1]">Security & Governance</h3>

        <button
          onClick={() => setShowPasswordSheet(true)}
          className="w-full flex items-center justify-between p-3.5 bg-[#F9F7F1] rounded-2xl border border-[#E8E2D5] text-xs font-black text-[#1C1917] uppercase cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0284C7]" />
            Change Password
          </span>
          <span>→</span>
        </button>

        <button
          onClick={() => setShowResetSheet(true)}
          className="w-full flex items-center justify-between p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-black text-rose-700 uppercase cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            Reset Application Data
          </span>
          <span>→</span>
        </button>
      </div>

      {/* CHANGE PASSWORD SHEET */}
      <MobileActionSheet
        isOpen={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title="Security Password"
        subtitle="Update Operator Credentials"
      >
        {pinSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Password updated successfully.
          </div>
        )}
        {pinError && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {pinError}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">New Password</label>
            <input
              type="password"
              required
              value={pinForm.newPin}
              onChange={e => setPinForm({ ...pinForm, newPin: e.target.value })}
              placeholder="At least 6 characters..."
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-[#57534E] tracking-wider block mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={pinForm.confirm}
              onChange={e => setPinForm({ ...pinForm, confirm: e.target.value })}
              placeholder="Re-enter password..."
              className="w-full bg-white border border-[#E5DFD1] rounded-xl p-3 text-sm font-bold text-[#1C1917] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0284C7] text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md mt-2"
          >
            Update Password
          </button>
        </form>
      </MobileActionSheet>

      {/* RESET DATA SHEET */}
      <MobileActionSheet
        isOpen={showResetSheet}
        onClose={() => setShowResetSheet(false)}
        title="Reset Application Data"
        subtitle="Irreversible Action"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold">
            Warning: This action will permanently clear all saved balances, custom ventures, transaction logs, and settings from local storage.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetSheet(false)}
              className="flex-1 py-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E2DAC8] text-[#1C1917] font-black uppercase text-xs tracking-wider cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={wipeAllData}
              className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white font-black uppercase text-xs tracking-wider cursor-pointer shadow-md"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileSettingsView);

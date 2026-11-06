import React, { useState, useRef } from 'react';
import { useEmpire } from '../../../context/EmpireContext';
import { Zap, Shield, Lock, Trash2, CheckCircle2, AlertCircle, Database, LogOut, Download, Upload, Eye, EyeOff } from 'lucide-react';
import MobileActionSheet from '../MobileActionSheet';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import ConfirmationDialog from '../../ui/ConfirmationDialog';
import { downloadEmpireBackupFile, restoreEmpireBackupFile } from '../../../utils/exportImport';

const MobileSettingsView = () => {
  const {
    logout, wipeAllData, changePassword,
    config, setConfig, user,
    isPulseActive, togglePulse,
    privacyMode, togglePrivacyMode, currencySymbol, setCurrencySymbol, toggleCurrency,
    periodicReloadEnabled, togglePeriodicReload, periodicReloadSeconds, setPeriodicReloadSeconds
  } = useEmpire();

  // Password sheet
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [pinForm, setPinForm] = useState({ newPin: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Backup & Restore
  const [backupMsg, setBackupMsg] = useState('');
  const fileInputRef = useRef(null);

  // Reset dialog
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleDownload = async () => {
    try {
      setBackupMsg('Exporting backup...');
      await downloadEmpireBackupFile();
      setBackupMsg('Backup downloaded successfully!');
      setTimeout(() => setBackupMsg(''), 3000);
    } catch (e) {
      setBackupMsg('Backup failed: ' + e.message);
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBackupMsg('Restoring backup...');
      const text = await file.text();
      const res = await restoreEmpireBackupFile(text);
      if (res.success) {
        setBackupMsg('Restored! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setBackupMsg('Restore failed: ' + res.error);
      }
    } catch (err) {
      setBackupMsg('File read error: ' + err.message);
    }
  };

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

  const speedSeconds = (config?.simulationSpeed || 10000) / 1000;

  return (
    <div className="space-y-4 pb-8">
      {/* Factory Reset Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={wipeAllData}
        title="Factory Reset Data?"
        description="Permanently erase all balances, custom ventures, transactions, and settings from local storage."
        confirmText="Reset All Data"
        variant="danger"
      />

      {/* ── Pulse Engine Speed ── */}
      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-ww-border">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border transition-colors ${
              isPulseActive
                ? 'bg-ww-green-bg text-ww-accent border-ww-accent/20'
                : 'bg-ww-bg-alt text-ww-text-secondary border-ww-border-strong'
            }`}>
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-ww-text">Simulation Heartbeat</h3>
              <p className="text-[10px] text-ww-text-secondary">{isPulseActive ? 'Compounding Active' : 'Simulation Stopped'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePulse}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              isPulseActive
                ? 'bg-ww-elevated border-ww-border text-ww-danger hover:bg-ww-danger-bg'
                : 'bg-ww-accent border-ww-accent text-white hover:bg-ww-accent-hover'
            }`}
          >
            {isPulseActive ? 'Stop Pulse' : 'Start Pulse'}
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-bold text-ww-text">
            {speedSeconds}s Heartbeat Interval
          </span>
          <div className="flex gap-1 bg-ww-elevated p-1 rounded-xl border border-ww-border">
            {[5, 10, 30, 60].map(s => {
              const ms = s * 1000;
              const isSelected = config?.simulationSpeed === ms;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateConfig('simulationSpeed', ms)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                    isSelected ? 'bg-ww-accent text-white shadow-2xs' : 'text-ww-text-secondary hover:bg-ww-bg-alt'
                  }`}
                >
                  {s}s
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Data Persistence ── */}
      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-ww-border">
          <div className="p-2 rounded-xl bg-ww-green-bg text-ww-accent border border-ww-accent/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ww-text">Data & Synchronization</h3>
            <p className="text-[10px] text-ww-text-secondary">LocalStorage Auto-Save</p>
          </div>
        </div>

        {/* ── Currency Symbol Switch ── */}
        <div className="py-2 border-b border-ww-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-bold text-ww-text">Currency Symbol</p>
              <p className="text-[10px] text-ww-text-secondary">Instant 1-click switch (no math)</p>
            </div>
            <button
              type="button"
              onClick={toggleCurrency}
              className="px-2 py-0.5 text-[10px] font-bold rounded bg-ww-accent text-white cursor-pointer"
            >
              Toggle ({currencySymbol === '₹' ? '₹ to $' : '$ to ₹'})
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { sym: '₹', label: 'Rupees (₹ INR)' },
              { sym: '$', label: 'Dollar ($ USD)' }
            ].map(c => (
              <button
                key={c.sym}
                type="button"
                onClick={() => setCurrencySymbol(c.sym)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                  currencySymbol === c.sym
                    ? 'bg-ww-accent text-white border-ww-accent'
                    : 'bg-ww-elevated text-ww-text border-ww-border'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        
        {/* Periodic Auto-Reload Preference */}
        <div className="py-2.5 border-b border-ww-border space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-ww-text">Periodic Auto-Reload</p>
              <p className="text-[10px] text-ww-text-secondary">Refreshes on current tab (never resets page)</p>
            </div>
            <button
              type="button"
              onClick={togglePeriodicReload}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                periodicReloadEnabled ? 'bg-ww-accent' : 'bg-ww-border-strong'
              }`}
              aria-label="Toggle Auto-Reload"
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-2xs transition-transform ${
                periodicReloadEnabled ? 'translate-x-4.5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          {periodicReloadEnabled && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { sec: 30, label: '30s' },
                { sec: 60, label: '60s' },
                { sec: 120, label: '2m' }
              ].map(opt => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => setPeriodicReloadSeconds(opt.sec)}
                  className={`py-1 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                    periodicReloadSeconds === opt.sec
                      ? 'bg-ww-accent text-white border-ww-accent'
                      : 'bg-ww-elevated text-ww-text border-ww-border'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-ww-text">Privacy Mode (Mask Figures)</p>
            <p className="text-[10px] text-ww-text-secondary">Hide balances with dots</p>
          </div>
          <button
            type="button"
            onClick={togglePrivacyMode}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
              privacyMode ? 'bg-ww-accent' : 'bg-ww-border-strong'
            }`}
            aria-label="Toggle Privacy Mode"
          >
            <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-2xs transition-transform ${
              privacyMode ? 'translate-x-4.5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-xs font-bold text-ww-text">Auto-Save to LocalStorage</p>
            <p className="text-[10px] text-ww-text-secondary">Preserves changes continuously</p>
          </div>
          <button
            type="button"
            onClick={() => updateConfig('autoSave', !config?.autoSave)}
            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
              config?.autoSave ? 'bg-ww-accent' : 'bg-ww-border-strong'
            }`}
            aria-label="Toggle Auto-Save"
          >
            <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-2xs transition-transform ${
              config?.autoSave ? 'translate-x-4.5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </Card>

      {/* ── Backup & Restore ── */}
      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-ww-border">
          <div className="p-2 rounded-xl bg-ww-green-bg text-ww-accent border border-ww-accent/20">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ww-text">Backup & Portability</h3>
            <p className="text-[10px] text-ww-text-secondary">Local-first JSON export/restore</p>
          </div>
        </div>

        {backupMsg && (
          <div className="p-2.5 rounded-xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent text-[11px] font-semibold">
            {backupMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownload}
            className="w-full justify-center text-xs"
          >
            Export JSON
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestore}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-center text-xs"
          >
            Restore JSON
          </Button>
        </div>
      </Card>

      {/* ── Security & Account ── */}
      <Card className="p-4 border border-ww-border bg-white space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-ww-border">
          <div className="p-2 rounded-xl bg-ww-green-bg text-ww-accent border border-ww-accent/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ww-text">Security & Credentials</h3>
            <p className="text-[10px] text-ww-text-secondary">Role: {user?.role || 'CEO'} · {user?.username || 'raghav94'}</p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            variant="outline"
            size="md"
            icon={Lock}
            className="w-full justify-center"
            onClick={() => setShowPasswordSheet(true)}
          >
            Change Master Key
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={LogOut}
            className="w-full justify-center"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="p-4 border border-ww-danger/30 bg-ww-elevated space-y-2.5">
        <h3 className="text-xs font-bold text-ww-danger">Danger Zone</h3>
        <p className="text-[10px] text-ww-text-secondary">Purge all balances, ventures, and ledger entries.</p>
        <Button
          variant="danger"
          size="md"
          icon={Trash2}
          className="w-full justify-center"
          onClick={() => setShowResetDialog(true)}
        >
          Reset All Application Data
        </Button>
      </Card>

      {/* ── BOTTOM SHEET: CHANGE PASSWORD ── */}
      <MobileActionSheet
        isOpen={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title="Update Master Key"
        subtitle="Calibrate Terminal Access Password"
      >
        {pinSuccess && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-ww-green-bg border border-ww-success/30 rounded-xl text-ww-success text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Master key updated successfully.</span>
          </div>
        )}
        {pinError && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-ww-danger-bg border border-ww-danger/30 rounded-xl text-ww-danger text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="New Master Key"
            type="password"
            required
            value={pinForm.newPin}
            onChange={e => setPinForm({ ...pinForm, newPin: e.target.value })}
            placeholder="At least 6 characters..."
          />
          <Input
            label="Confirm Master Key"
            type="password"
            required
            value={pinForm.confirm}
            onChange={e => setPinForm({ ...pinForm, confirm: e.target.value })}
            placeholder="Re-enter master key..."
          />
          <Button type="submit" variant="primary" className="w-full py-3 mt-2">
            Save New Master Key
          </Button>
        </form>
      </MobileActionSheet>
    </div>
  );
};

export default React.memo(MobileSettingsView);

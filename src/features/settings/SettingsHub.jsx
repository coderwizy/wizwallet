import React, { useState, useMemo, useRef } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, Palette, Lock, CheckCircle2, AlertCircle,
  Trash2, Sliders, Database, KeyRound, RefreshCw, Smartphone,
  Play, Pause, Download, Upload, FileSpreadsheet, Eye, EyeOff
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { downloadEmpireBackupFile, restoreEmpireBackupFile, exportToCSV } from '../../utils/exportImport';

const SettingsHub = () => {
  const {
    theme, setTheme, logout, wipeAllData, changePassword,
    config, setConfig, user,
    isPulseActive, stopPulse, startPulse, togglePulse,
    privacyMode, togglePrivacyMode, transactions, currencySymbol, setCurrencySymbol, toggleCurrency,
    periodicReloadEnabled, togglePeriodicReload, periodicReloadSeconds, setPeriodicReloadSeconds
  } = useEmpire();

  // Password change state
  const [showPinChange, setShowPinChange] = useState(false);
  const [pinForm, setPinForm] = useState({ current: '', newPin: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Backup & restore state
  const [backupStatus, setBackupStatus] = useState({ message: '', error: false });
  const fileInputRef = useRef(null);

  // Wipe data confirmation modal
  const [showWipeModal, setShowWipeModal] = useState(false);

  const handleDownloadBackup = async () => {
    try {
      setBackupStatus({ message: 'Generating full backup payload...', error: false });
      await downloadEmpireBackupFile();
      setBackupStatus({ message: 'Empire backup downloaded successfully.', error: false });
      setTimeout(() => setBackupStatus({ message: '', error: false }), 4000);
    } catch (err) {
      setBackupStatus({ message: 'Failed to generate backup: ' + err.message, error: true });
    }
  };

  const handleFileRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBackupStatus({ message: 'Reading and validating backup file...', error: false });
      const text = await file.text();
      const res = await restoreEmpireBackupFile(text);
      if (res.success) {
        setBackupStatus({ message: 'Backup restored! Reloading application...', error: false });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setBackupStatus({ message: res.error || 'Failed to restore backup.', error: true });
      }
    } catch (err) {
      setBackupStatus({ message: 'Error parsing file: ' + err.message, error: true });
    }
  };

  const handleExportTransactionsCSV = () => {
    if (!transactions || !transactions.length) {
      setBackupStatus({ message: 'No transactions found to export.', error: true });
      return;
    }
    const headers = {
      date: 'Date & Time',
      type: 'Transaction Type',
      title: 'Description',
      amount: 'Amount ($)',
      category: 'Category',
      reference: 'Reference ID'
    };
    exportToCSV(`wizwallet-ledger-${new Date().toISOString().split('T')[0]}`, transactions, headers);
    setBackupStatus({ message: 'Transactions exported to CSV successfully.', error: false });
    setTimeout(() => setBackupStatus({ message: '', error: false }), 4000);
  };

  const handlePinChange = (e) => {
    e.preventDefault();
    setPinError('');
    if (pinForm.newPin.length < 6) {
      setPinError('New master key must be at least 6 characters.');
      return;
    }
    if (pinForm.newPin !== pinForm.confirm) {
      setPinError('Passwords do not match.');
      return;
    }
    changePassword(pinForm.newPin);
    setPinSuccess(true);
    setPinForm({ current: '', newPin: '', confirm: '' });
    setTimeout(() => {
      setPinSuccess(false);
      setShowPinChange(false);
    }, 1800);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const speedSeconds = (config?.simulationSpeed || 10000) / 1000;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Wipe Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        onConfirm={wipeAllData}
        title="Factory Reset All Application Data?"
        description="This will irreversibly erase all local storage data, including your calibrated wallet balance, bank reserves, 13 commercial ventures, family trust allocations, and historical transactions. The app will reload to default factory state."
        confirmText="Confirm Factory Reset"
        variant="danger"
      />

      {/* ── Page Header ── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ww-text-muted mb-1">
          System Control & Engine Calibration
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-ww-text tracking-tight">
          Control Engine
        </h2>
      </div>

      <div className="space-y-5">
        {/* ── SECTION 1: SIMULATION HEARTBEAT ENGINE ── */}
        <Card className="overflow-hidden p-0 border border-ww-border bg-white">
          <div className="p-5 border-b border-ww-border bg-ww-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                isPulseActive
                  ? 'bg-ww-green-bg border-ww-accent/20 text-ww-accent'
                  : 'bg-ww-bg-alt border-ww-border-strong text-ww-text-secondary'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ww-text">Growth Simulation Engine</h3>
                <p className="text-[11px] text-ww-text-secondary">Unified heartbeat for compounding, dividends, and sector growth</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isPulseActive ? 'success' : 'default'}>
                {isPulseActive ? `Heartbeat Active (${speedSeconds}s)` : 'Heartbeat Stopped'}
              </Badge>
              <Button
                variant={isPulseActive ? 'outline' : 'primary'}
                size="sm"
                icon={isPulseActive ? Pause : Play}
                onClick={togglePulse}
              >
                {isPulseActive ? 'Stop Pulse' : 'Resume Pulse'}
              </Button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">Simulation Pulse Frequency</p>
                <p className="text-[11px] text-ww-text-secondary mt-0.5">Controls how often bank interest and wallet dividends compound</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-ww-border">
                {[5, 10, 30, 60].map(s => {
                  const ms = s * 1000;
                  const isSelected = config?.simulationSpeed === ms;
                  return (
                    <button
                      key={s}
                      onClick={() => updateConfig('simulationSpeed', ms)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-ww-accent text-white shadow-2xs'
                          : 'text-ww-text-secondary hover:text-ww-text hover:bg-ww-bg'
                      }`}
                    >
                      {s}s
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-ww-elevated rounded-xl border border-ww-border flex justify-between items-center">
                <span className="text-ww-text-secondary">Compounding Method:</span>
                <span className="font-bold text-ww-accent">Real-time Proportional</span>
              </div>
              <div className="p-3 bg-ww-elevated rounded-xl border border-ww-border flex justify-between items-center">
                <span className="text-ww-text-secondary">Balance Snapshots:</span>
                <span className="font-bold text-ww-text">Rolling 30 Entries</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── SECTION 2: DATA & PERSISTENCE ── */}
        <Card className="overflow-hidden p-0 border border-ww-border bg-white">
          <div className="p-5 border-b border-ww-border bg-ww-elevated flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ww-text">Data Storage & Synchronization</h3>
              <p className="text-[11px] text-ww-text-secondary">Client-side persistence and device preferences</p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">LocalStorage Auto-Save</p>
                <p className="text-[11px] text-ww-text-secondary">Persists balances, ventures, and settings automatically</p>
              </div>
              <button
                onClick={() => updateConfig('autoSave', !config?.autoSave)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  config?.autoSave ? 'bg-ww-accent' : 'bg-ww-border-strong'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                  config?.autoSave ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* ── Active Currency Symbol ── */}
            <div className="p-3.5 bg-ww-elevated rounded-xl border border-ww-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ww-text">Active Currency Symbol</p>
                  <p className="text-[11px] text-ww-text-secondary">Instant 1-click toggle without math conversion</p>
                </div>
                <button
                  type="button"
                  onClick={toggleCurrency}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-ww-accent text-white hover:bg-ww-accent-hover transition-colors cursor-pointer"
                >
                  Quick Toggle ({currencySymbol === '₹' ? '₹ to $' : '$ to ₹'})
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { sym: '₹', label: 'Rupees (₹ INR)' },
                  { sym: '$', label: 'Dollar ($ USD)' },
                  { sym: '€', label: 'Euro (€ EUR)' },
                  { sym: '£', label: 'Pound (£ GBP)' },
                  { sym: 'AED ', label: 'Dirham (AED)' }
                ].map(c => (
                  <button
                    key={c.sym}
                    type="button"
                    onClick={() => setCurrencySymbol(c.sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      currencySymbol === c.sym
                        ? 'bg-ww-accent text-white border-ww-accent shadow-2xs'
                        : 'bg-white text-ww-text border-ww-border hover:border-ww-accent'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            
            {/* Periodic Auto-Reload Engine */}
            <div className="p-3.5 bg-ww-elevated rounded-xl border border-ww-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ww-text">Periodic Auto-Reload</p>
                  <p className="text-[11px] text-ww-text-secondary">Auto-refreshes data while strictly keeping your active hub/page (never throws to homepage)</p>
                </div>
                <button
                  type="button"
                  onClick={togglePeriodicReload}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    periodicReloadEnabled ? 'bg-ww-accent' : 'bg-ww-border-strong'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                    periodicReloadEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              {periodicReloadEnabled && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-ww-border">
                  <span className="text-[11px] font-semibold text-ww-text-secondary">Reload Interval:</span>
                  {[
                    { sec: 30, label: '30s' },
                    { sec: 60, label: '60s (Recommended)' },
                    { sec: 120, label: '2 mins' },
                    { sec: 300, label: '5 mins' }
                  ].map(opt => (
                    <button
                      key={opt.sec}
                      type="button"
                      onClick={() => setPeriodicReloadSeconds(opt.sec)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        periodicReloadSeconds === opt.sec
                          ? 'bg-ww-accent text-white border-ww-accent shadow-2xs'
                          : 'bg-white text-ww-text border-ww-border hover:border-ww-accent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">Privacy Mode (Mask Balances)</p>
                <p className="text-[11px] text-ww-text-secondary">Hide financial metrics with dots (••••••) for shoulder surfing protection</p>
              </div>
              <button
                onClick={togglePrivacyMode}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  privacyMode ? 'bg-ww-accent' : 'bg-ww-border-strong'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                  privacyMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">Haptic & Motion Feedback</p>
                <p className="text-[11px] text-ww-text-secondary">Subtle feedback on financial transactions</p>
              </div>
              <button
                onClick={() => updateConfig('vibration', !config?.vibration)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  config?.vibration ? 'bg-ww-accent' : 'bg-ww-border-strong'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                  config?.vibration ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </Card>

        {/* ── SECTION 2.5: BACKUP, EXPORT & RESTORE ── */}
        <Card className="overflow-hidden p-0 border border-ww-border bg-white">
          <div className="p-5 border-b border-ww-border bg-ww-elevated flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ww-text">Backup & Data Portability</h3>
                <p className="text-[11px] text-ww-text-secondary">Full local JSON snapshots and ledger CSV downloads</p>
              </div>
            </div>
            <Badge variant="success">Local-First Engine</Badge>
          </div>

          <div className="p-5 space-y-4">
            {backupStatus.message && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                backupStatus.error
                  ? 'bg-ww-danger-bg border-ww-danger/30 text-ww-danger'
                  : 'bg-ww-green-bg border-ww-success/30 text-ww-success'
              }`}>
                {backupStatus.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{backupStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Full JSON Export */}
              <div className="p-4 bg-ww-elevated rounded-xl border border-ww-border flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-ww-text">Full Empire Backup</h4>
                  <p className="text-[11px] text-ww-text-secondary mt-0.5">Exports all 16 domains + IndexedDB Vault files into single JSON</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  onClick={handleDownloadBackup}
                  className="w-full text-xs"
                >
                  Download JSON
                </Button>
              </div>

              {/* Restore JSON Backup */}
              <div className="p-4 bg-ww-elevated rounded-xl border border-ww-border flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-ww-text">Restore from Backup</h4>
                  <p className="text-[11px] text-ww-text-secondary mt-0.5">Restore all local state and encrypted vault documents</p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileRestore}
                    accept=".json"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Upload}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-xs"
                  >
                    Select Backup File
                  </Button>
                </div>
              </div>

              {/* Export CSV */}
              <div className="p-4 bg-ww-elevated rounded-xl border border-ww-border flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-ww-text">Export Ledger (CSV)</h4>
                  <p className="text-[11px] text-ww-text-secondary mt-0.5">Download full audit history with dates and balances for Excel</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={FileSpreadsheet}
                  onClick={handleExportTransactionsCSV}
                  className="w-full text-xs"
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── SECTION 3: SECURITY & ACCESS ── */}
        <Card className="overflow-hidden p-0 border border-ww-border bg-white">
          <div className="p-5 border-b border-ww-border bg-ww-elevated flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ww-text">Security & Credentials</h3>
                <p className="text-[11px] text-ww-text-secondary">Workstation security and access key governance</p>
              </div>
            </div>
            <Badge variant="accent">Protected Session</Badge>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">Master Key / Password</p>
                <p className="text-[11px] text-ww-text-secondary">Update the terminal unlock password</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Lock}
                onClick={() => setShowPinChange(true)}
              >
                Change Master Key
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-ww-elevated rounded-xl border border-ww-border">
              <div>
                <p className="text-xs font-bold text-ww-text">Current User Identifier</p>
                <p className="text-[11px] text-ww-text-secondary">Role: {user?.role || 'CEO'} · Account: {user?.username || 'raghav94'}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
              >
                Sign Out Workstation
              </Button>
            </div>
          </div>
        </Card>

        {/* ── SECTION 4: DESTRUCTIVE FACTORY RESET ── */}
        <Card className="p-5 border border-ww-danger/30 bg-ww-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-ww-danger">Danger Zone · Factory Reset</h3>
              <p className="text-xs text-ww-text-secondary mt-0.5">
                Permanently purge all custom entities, transaction history, and wallet calibrations.
              </p>
            </div>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setShowWipeModal(true)}
            >
              Reset Application Data
            </Button>
          </div>
        </Card>
      </div>

      {/* ── CHANGE PASSWORD MODAL ── */}
      <Modal
        isOpen={showPinChange}
        onClose={() => setShowPinChange(false)}
        title="Update Master Security Key"
        subtitle="Calibrate access key for terminal login"
      >
        {pinSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-ww-green-bg border border-ww-success/30 rounded-xl text-ww-success text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Master security key updated successfully.</span>
          </div>
        )}
        {pinError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-ww-danger-bg border border-ww-danger/30 rounded-xl text-ww-danger text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handlePinChange} className="space-y-4">
          <Input
            label="New Master Key"
            type="password"
            required
            value={pinForm.newPin}
            onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
            placeholder="At least 6 characters..."
          />
          <Input
            label="Confirm New Master Key"
            type="password"
            required
            value={pinForm.confirm}
            onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value })}
            placeholder="Re-enter new key..."
          />
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2">
            Save New Master Key
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default React.memo(SettingsHub);

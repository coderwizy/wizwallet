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
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3A297] mb-1">
          System Control & Engine Calibration
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#22251F] tracking-tight">
          Control Engine
        </h2>
      </div>

      <div className="space-y-5">
        {/* ── SECTION 1: SIMULATION HEARTBEAT ENGINE ── */}
        <Card className="overflow-hidden p-0 border border-[#EAE8DF] bg-white">
          <div className="p-5 border-b border-[#EAE8DF] bg-[#FCFBF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                isPulseActive
                  ? 'bg-[#EDF2E9] border-[#D5DFD1] text-[#526B56]'
                  : 'bg-[#F1EFE7] border-[#D5D2C8] text-[#77786F]'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#22251F]">Growth Simulation Engine</h3>
                <p className="text-[11px] text-[#77786F]">Unified heartbeat for compounding, dividends, and sector growth</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">Simulation Pulse Frequency</p>
                <p className="text-[11px] text-[#77786F] mt-0.5">Controls how often bank interest and wallet dividends compound</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EAE8DF]">
                {[5, 10, 30, 60].map(s => {
                  const ms = s * 1000;
                  const isSelected = config?.simulationSpeed === ms;
                  return (
                    <button
                      key={s}
                      onClick={() => updateConfig('simulationSpeed', ms)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#526B56] text-white shadow-2xs'
                          : 'text-[#77786F] hover:text-[#22251F] hover:bg-[#F8F7F2]'
                      }`}
                    >
                      {s}s
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex justify-between items-center">
                <span className="text-[#77786F]">Compounding Method:</span>
                <span className="font-bold text-[#526B56]">Real-time Proportional</span>
              </div>
              <div className="p-3 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex justify-between items-center">
                <span className="text-[#77786F]">Balance Snapshots:</span>
                <span className="font-bold text-[#22251F]">Rolling 30 Entries</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── SECTION 2: DATA & PERSISTENCE ── */}
        <Card className="overflow-hidden p-0 border border-[#EAE8DF] bg-white">
          <div className="p-5 border-b border-[#EAE8DF] bg-[#FCFBF8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#22251F]">Data Storage & Synchronization</h3>
              <p className="text-[11px] text-[#77786F]">Client-side persistence and device preferences</p>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">LocalStorage Auto-Save</p>
                <p className="text-[11px] text-[#77786F]">Persists balances, ventures, and settings automatically</p>
              </div>
              <button
                onClick={() => updateConfig('autoSave', !config?.autoSave)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  config?.autoSave ? 'bg-[#526B56]' : 'bg-[#D5D2C8]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                  config?.autoSave ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* ── Active Currency Symbol ── */}
            <div className="p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#22251F]">Active Currency Symbol</p>
                  <p className="text-[11px] text-[#77786F]">Instant 1-click toggle without math conversion</p>
                </div>
                <button
                  type="button"
                  onClick={toggleCurrency}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#526B56] text-white hover:bg-[#435746] transition-colors cursor-pointer"
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
                        ? 'bg-[#526B56] text-white border-[#526B56] shadow-2xs'
                        : 'bg-white text-[#22251F] border-[#EAE8DF] hover:border-[#526B56]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            
            {/* Periodic Auto-Reload Engine */}
            <div className="p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#22251F]">Periodic Auto-Reload</p>
                  <p className="text-[11px] text-[#77786F]">Auto-refreshes data while strictly keeping your active hub/page (never throws to homepage)</p>
                </div>
                <button
                  type="button"
                  onClick={togglePeriodicReload}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    periodicReloadEnabled ? 'bg-[#526B56]' : 'bg-[#D5D2C8]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                    periodicReloadEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              {periodicReloadEnabled && (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EAE8DF]">
                  <span className="text-[11px] font-semibold text-[#77786F]">Reload Interval:</span>
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
                          ? 'bg-[#526B56] text-white border-[#526B56] shadow-2xs'
                          : 'bg-white text-[#22251F] border-[#EAE8DF] hover:border-[#526B56]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">Privacy Mode (Mask Balances)</p>
                <p className="text-[11px] text-[#77786F]">Hide financial metrics with dots (••••••) for shoulder surfing protection</p>
              </div>
              <button
                onClick={togglePrivacyMode}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  privacyMode ? 'bg-[#526B56]' : 'bg-[#D5D2C8]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform ${
                  privacyMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">Haptic & Motion Feedback</p>
                <p className="text-[11px] text-[#77786F]">Subtle feedback on financial transactions</p>
              </div>
              <button
                onClick={() => updateConfig('vibration', !config?.vibration)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  config?.vibration ? 'bg-[#526B56]' : 'bg-[#D5D2C8]'
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
        <Card className="overflow-hidden p-0 border border-[#EAE8DF] bg-white">
          <div className="p-5 border-b border-[#EAE8DF] bg-[#FCFBF8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#22251F]">Backup & Data Portability</h3>
                <p className="text-[11px] text-[#77786F]">Full local JSON snapshots and ledger CSV downloads</p>
              </div>
            </div>
            <Badge variant="success">Local-First Engine</Badge>
          </div>

          <div className="p-5 space-y-4">
            {backupStatus.message && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                backupStatus.error
                  ? 'bg-[#FCEEED] border-[#E8C5C3] text-[#C66D65]'
                  : 'bg-[#EDF2E9] border-[#C8D9CA] text-[#66866A]'
              }`}>
                {backupStatus.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{backupStatus.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Full JSON Export */}
              <div className="p-4 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#22251F]">Full Empire Backup</h4>
                  <p className="text-[11px] text-[#77786F] mt-0.5">Exports all 16 domains + IndexedDB Vault files into single JSON</p>
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
              <div className="p-4 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#22251F]">Restore from Backup</h4>
                  <p className="text-[11px] text-[#77786F] mt-0.5">Restore all local state and encrypted vault documents</p>
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
              <div className="p-4 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF] flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#22251F]">Export Ledger (CSV)</h4>
                  <p className="text-[11px] text-[#77786F] mt-0.5">Download full audit history with dates and balances for Excel</p>
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
        <Card className="overflow-hidden p-0 border border-[#EAE8DF] bg-white">
          <div className="p-5 border-b border-[#EAE8DF] bg-[#FCFBF8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EDF2E9] border border-[#D5DFD1] text-[#526B56] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#22251F]">Security & Credentials</h3>
                <p className="text-[11px] text-[#77786F]">Workstation security and access key governance</p>
              </div>
            </div>
            <Badge variant="accent">Protected Session</Badge>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">Master Key / Password</p>
                <p className="text-[11px] text-[#77786F]">Update the terminal unlock password</p>
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FCFBF8] rounded-xl border border-[#EAE8DF]">
              <div>
                <p className="text-xs font-bold text-[#22251F]">Current User Identifier</p>
                <p className="text-[11px] text-[#77786F]">Role: {user?.role || 'CEO'} · Account: {user?.username || 'raghav94'}</p>
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
        <Card className="p-5 border border-[#E8C5C3] bg-[#FCFBF8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#C66D65]">Danger Zone · Factory Reset</h3>
              <p className="text-xs text-[#77786F] mt-0.5">
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
          <div className="flex items-center gap-2 mb-4 p-3 bg-[#EDF2E9] border border-[#C8D9CA] rounded-xl text-[#66866A] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Master security key updated successfully.</span>
          </div>
        )}
        {pinError && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-[#FCEEED] border border-[#E8C5C3] rounded-xl text-[#C66D65] text-xs font-semibold">
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

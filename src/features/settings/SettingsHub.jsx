import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, Palette, Lock, CheckCircle2, AlertCircle,
  Trash2, Sliders, Database, KeyRound, RefreshCw, Smartphone,
  Play, Pause
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const SettingsHub = () => {
  const {
    theme, setTheme, logout, wipeAllData, changePassword,
    config, setConfig, user,
    isPulseActive, stopPulse, startPulse, togglePulse
  } = useEmpire();

  // Password change state
  const [showPinChange, setShowPinChange] = useState(false);
  const [pinForm, setPinForm] = useState({ current: '', newPin: '', confirm: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Wipe data confirmation modal
  const [showWipeModal, setShowWipeModal] = useState(false);

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

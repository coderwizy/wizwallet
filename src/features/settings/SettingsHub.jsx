import React, { useState, useMemo } from 'react';
import { useEmpire } from '../../context/EmpireContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, Palette, Lock, CheckCircle, AlertCircle, Trash2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const SettingsHub = () => {
  const { theme, setTheme, logout, wipeAllData, changePassword, config, setConfig } = useEmpire();

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
    if (pinForm.newPin.length < 6) { setPinError('New password must be at least 6 characters.'); return; }
    if (pinForm.newPin !== pinForm.confirm) { setPinError('Passwords do not match.'); return; }
    changePassword(pinForm.newPin);
    setPinSuccess(true);
    setPinForm({ current: '', newPin: '', confirm: '' });
    setTimeout(() => { setPinSuccess(false); setShowPinChange(false); }, 2000);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const sections = useMemo(() => [
    {
      title: 'Appearance Engine',
      description: 'Interface aesthetics and global UI display modes.',
      icon: Palette,
      items: [
        {
          label: 'Primary Theme',
          type: 'Toggle',
          value: theme === 'dark' ? 'Imperial Dark' : 'Fusion Light',
          status: theme === 'dark',
          onClick: () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
        },
        {
          label: 'Neon Mode',
          type: 'Toggle',
          value: config?.neonMode ? 'Active' : 'Disabled',
          status: config?.neonMode,
          onClick: () => updateConfig('neonMode', !config.neonMode)
        },
        {
          label: 'Transparency Effect',
          type: 'Toggle',
          value: config?.transparency ? 'Glassmorphism v4' : 'Solid Mode',
          status: config?.transparency,
          onClick: () => updateConfig('transparency', !config.transparency)
        }
      ]
    },
    {
      title: 'Growth Engine Optimizers',
      description: 'Calibrate the auto-growth pulse frequency of all hubs.',
      icon: Zap,
      items: [
        { 
          label: 'Simulation Pulse Speed', 
          type: 'Select', 
          value: config?.simulationSpeed ? `${config.simulationSpeed / 1000}s Heartbeat` : '10s Heartbeat', 
          status: true, 
          onClick: () => {
            const speeds = [5000, 10000, 30000, 60000];
            const curIdx = speeds.indexOf(config.simulationSpeed);
            updateConfig('simulationSpeed', speeds[(curIdx + 1) % speeds.length]);
          } 
        },
        { label: 'Compound Frequency', type: 'Select', value: 'Real-time', status: true, onClick: null },
        { label: 'Interest Recalculation', type: 'Select', value: 'Per Pulse', status: true, onClick: null }
      ]
    },
    {
      title: 'Data & Security',
      description: 'Backup, recovery, and data persistence controls.',
      icon: Shield,
      items: [
        { 
          label: 'Auto-Save Persistence', 
          type: 'Toggle', 
          value: config?.autoSave ? 'LocalStorage Sync' : 'Manual Only', 
          status: config?.autoSave, 
          onClick: () => updateConfig('autoSave', !config.autoSave) 
        },
        { 
          label: 'Vibration Feedback', 
          type: 'Toggle', 
          value: config?.vibration ? 'Active' : 'Disabled', 
          status: config?.vibration, 
          onClick: () => updateConfig('vibration', !config.vibration) 
        }
      ]
    }
  ], [theme, config, setTheme]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70 mb-1">System Calibration</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">Control Engine</h2>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <Card key={idx} className="overflow-hidden p-0">
            <div className="p-6 border-b border-white/10 flex gap-4 items-center">
              <div className="p-3 rounded-xl bg-white/5 text-neon-blue border border-white/10">
                <section.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">{section.title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{section.description}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 rounded-xl transition-all group">
                  <span className="text-sm font-black uppercase tracking-tight text-slate-200">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.value}</span>
                    {item.type === 'Toggle' ? (
                      <button
                        onClick={item.onClick || undefined}
                        disabled={!item.onClick}
                        className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${
                          item.status ? 'bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'bg-slate-800'
                        } ${!item.onClick ? 'opacity-40 cursor-default' : ''}`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-all ${item.status ? 'ml-6 bg-slate-950' : 'ml-0 bg-slate-500'}`} />
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={!item.onClick}
                        onClick={item.onClick || undefined}
                      >
                        Calibrate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Security & Data Actions Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Security & Data Governance</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              icon={Lock}
              className="flex-1 justify-center py-3"
              onClick={() => setShowPinChange(true)}
            >
              Change Security Password
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              className="flex-1 justify-center py-3"
              onClick={() => setShowWipeModal(true)}
            >
              Reset All Application Data
            </Button>
          </div>
        </Card>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={showPinChange}
        onClose={() => setShowPinChange(false)}
        title="Security Password Calibration"
        subtitle="Update Access Credentials"
      >
        {pinSuccess && (
          <div className="flex items-center gap-3 mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
            <CheckCircle className="w-4 h-4 shrink-0" />Password updated successfully.
          </div>
        )}
        {pinError && (
          <div className="flex items-center gap-3 mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />{pinError}
          </div>
        )}

        <form onSubmit={handlePinChange} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            required
            value={pinForm.newPin}
            onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
            placeholder="At least 6 characters..."
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            value={pinForm.confirm}
            onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value })}
            placeholder="Re-enter password..."
          />
          <Button type="submit" variant="primary" className="w-full py-3.5 text-sm mt-2">
            Update Password
          </Button>
        </form>
      </Modal>

      {/* RESET DATA MODAL */}
      <Modal
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        title="Reset All Application Data"
        subtitle="Irreversible Data Action"
      >
        <div className="space-y-5">
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            Warning: This action will clear all saved balances, custom ventures, transaction histories, and settings from local storage.
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowWipeModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={wipeAllData}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(SettingsHub);

// ═══════════════════════════════════════════════════════════════════
// WIZWALLET 3.0 — Comprehensive Backup, Restore, and CSV Engine
// ═══════════════════════════════════════════════════════════════════

import { exportVaultBackup, restoreVaultBackup } from './indexedDB';

const STORAGE_KEYS = [
  'empire_user',
  'empire_wallet',
  'empire_bank',
  'empire_businesses',
  'empire_sectors',
  'empire_transactions',
  'empire_family',
  'empire_balance_history',
  'empire_config',
  'empire_investments',
  'empire_realestate',
  'empire_expenses',
  'empire_budgets',
  'empire_tax',
  'empire_goals',
  'empire_widgets',
  'empire_privacy'
];

/**
 * Generate a complete standalone backup JSON file of the user's entire empire
 */
export async function createFullEmpireBackup() {
  const localData = {};
  STORAGE_KEYS.forEach(key => {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) {
        localData[key] = JSON.parse(val);
      }
    } catch (e) {
      localData[key] = localStorage.getItem(key);
    }
  });

  const vaultData = await exportVaultBackup();

  const backupPayload = {
    schemaVersion: '3.0',
    appName: 'WizWallet 3.0',
    exportDate: new Date().toISOString(),
    localStorage: localData,
    documentVault: vaultData
  };

  return backupPayload;
}

/**
 * Trigger immediate download of backup JSON file in browser
 */
export async function downloadEmpireBackupFile() {
  const payload = await createFullEmpireBackup();
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `wizwallet-3.0-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Validate and restore backup payload
 */
export async function restoreEmpireBackupFile(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid backup file format.');
    }

    if (!data.localStorage || typeof data.localStorage !== 'object') {
      throw new Error('Backup file does not contain valid localStorage data.');
    }

    // Restore localStorage keys safely
    Object.entries(data.localStorage).forEach(([key, value]) => {
      if (key && value !== undefined) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    // Restore Document Vault IndexedDB records if present
    if (data.documentVault?.documents) {
      await restoreVaultBackup(data.documentVault.documents);
    }

    return { success: true, message: 'All local data and vault files restored successfully.' };
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return { success: false, error: err.message || 'Corrupted or unreadable backup file.' };
  }
}

/**
 * Export tabular data as CSV and trigger browser download
 */
export function exportToCSV(filename, rows, headers) {
  if (!rows || !rows.length) return false;

  const headerKeys = Object.keys(headers);
  const headerLabels = Object.values(headers);

  const csvContent = [
    headerLabels.map(l => `"${l}"`).join(','),
    ...rows.map(row =>
      headerKeys
        .map(key => {
          let val = row[key];
          if (val === null || val === undefined) val = '';
          const cleanStr = String(val).replace(/"/g, '""');
          return `"${cleanStr}"`;
        })
        .join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

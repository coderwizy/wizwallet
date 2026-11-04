// ═══════════════════════════════════════════════════════════════════
// WIZWALLET 3.0 — Native IndexedDB Storage Engine (Document Vault & Heavy Data)
// ═══════════════════════════════════════════════════════════════════

const DB_NAME = 'wizwallet_vault_db';
const DB_VERSION = 1;
const STORE_DOCS = 'documents';
const STORE_LOGS = 'simulation_logs';

/**
 * Open or upgrade the WizWallet IndexedDB database
 */
export function openVaultDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Store 1: Document Vault
      if (!db.objectStoreNames.contains(STORE_DOCS)) {
        const docStore = db.createObjectStore(STORE_DOCS, { keyPath: 'id' });
        docStore.createIndex('category', 'category', { unique: false });
        docStore.createIndex('createdAt', 'createdAt', { unique: false });
        docStore.createIndex('tags', 'tags', { multiEntry: true });
      }

      // Store 2: Detailed Simulation & Audit Logs
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        const logStore = db.createObjectStore(STORE_LOGS, { keyPath: 'id', autoIncrement: true });
        logStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save a document record into the vault
 * @param {Object} doc - { id, name, category, size, mimeType, dataUrl, notes, tags, createdAt }
 */
export async function saveVaultDocument(doc) {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCS, 'readwrite');
    const store = tx.objectStore(STORE_DOCS);
    const item = {
      ...doc,
      id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve all documents from the vault
 */
export async function getAllVaultDocuments() {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DOCS, 'readonly');
      const store = tx.objectStore(STORE_DOCS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to read vault documents:', err);
    return [];
  }
}

/**
 * Delete a document by its ID
 */
export async function deleteVaultDocument(id) {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCS, 'readwrite');
    const store = tx.objectStore(STORE_DOCS);
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Export all IndexedDB data for local backup
 */
export async function exportVaultBackup() {
  try {
    const docs = await getAllVaultDocuments();
    return {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      documents: docs
    };
  } catch (e) {
    console.error('Vault export failed:', e);
    return { version: DB_VERSION, documents: [] };
  }
}

/**
 * Restore IndexedDB documents from backup
 */
export async function restoreVaultBackup(backupDocs = []) {
  if (!Array.isArray(backupDocs) || backupDocs.length === 0) return true;
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCS, 'readwrite');
    const store = tx.objectStore(STORE_DOCS);
    backupDocs.forEach(doc => store.put(doc));
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Clear entire document vault (used by factory reset)
 */
export async function clearVaultDatabase() {
  try {
    const db = await openVaultDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_DOCS, STORE_LOGS], 'readwrite');
      tx.objectStore(STORE_DOCS).clear();
      tx.objectStore(STORE_LOGS).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Vault clear ignored:', err);
    return false;
  }
}


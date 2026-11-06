import React, { useState, useEffect, useMemo } from 'react';
import {
  openVaultDB, saveVaultDocument, getAllVaultDocuments, deleteVaultDocument
} from '../../utils/indexedDB';
import {
  FileText, Upload, Trash2, Eye, Search, Filter, ShieldCheck,
  FolderLock, Tag, Calendar, Download, HardDrive, CheckCircle2,
  FileCheck, AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const CATEGORIES = ['All', 'Invoices', 'Receipts', 'Property', 'Tax', 'Statements', 'Corporate'];

const DocumentVaultHub = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Invoices',
    notes: '',
    file: null,
    fileName: '',
    fileSize: 0,
    fileType: '',
    dataUrl: ''
  });

  // Load documents from IndexedDB
  const refreshDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getAllVaultDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.error('Failed to load vault docs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadForm(prev => ({
        ...prev,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        dataUrl: reader.result,
        name: prev.name || file.name.replace(/\.[^/.]+$/, '')
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim() || !uploadForm.dataUrl) return;

    try {
      await saveVaultDocument({
        name: uploadForm.name.trim(),
        category: uploadForm.category,
        notes: uploadForm.notes,
        fileName: uploadForm.fileName || 'document.dat',
        size: uploadForm.fileSize || 1024,
        mimeType: uploadForm.fileType || 'application/octet-stream',
        dataUrl: uploadForm.dataUrl
      });

      setUploadForm({
        name: '',
        category: 'Invoices',
        notes: '',
        file: null,
        fileName: '',
        fileSize: 0,
        fileType: '',
        dataUrl: ''
      });

      setIsUploadOpen(false);
      await refreshDocuments();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmDoc) return;
    try {
      await deleteVaultDocument(deleteConfirmDoc.id);
      setDeleteConfirmDoc(null);
      await refreshDocuments();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchCat = categoryFilter === 'All' || d.category === categoryFilter;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                          (d.notes || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documents, categoryFilter, search]);

  const totalVaultBytes = useMemo(() => {
    return documents.reduce((acc, d) => acc + (d.size || 0), 0);
  }, [documents]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 pb-12">
      <ConfirmationDialog
        isOpen={!!deleteConfirmDoc}
        onClose={() => setDeleteConfirmDoc(null)}
        onConfirm={confirmDelete}
        title={`Permanently Purge Document: ${deleteConfirmDoc?.name}?`}
        description="This will erase the encrypted document record from your local IndexedDB vault."
        confirmText="Purge Document"
        variant="danger"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ww-text-muted mb-1">
            Local-First Encrypted Financial Archive
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-ww-text tracking-tight flex items-center gap-2">
            Document Vault
            <Badge variant="accent">IndexedDB Powered</Badge>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" icon={Upload} onClick={() => setIsUploadOpen(true)}>
            Store Document
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-ww-border bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Enshrined Documents</span>
          <h3 className="text-3xl font-extrabold text-ww-text tabular-nums mt-1">
            {documents.length}
          </h3>
          <p className="text-[11px] text-ww-text-secondary mt-1">Stored safely on device storage</p>
        </Card>

        <Card className="p-5 border border-ww-border bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Vault Storage Footprint</span>
          <h3 className="text-3xl font-extrabold text-ww-accent tabular-nums mt-1">
            {formatSize(totalVaultBytes)}
          </h3>
          <p className="text-[11px] text-ww-text-secondary mt-1">No server bandwidth utilized</p>
        </Card>

        <Card className="p-5 border border-ww-border bg-white">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ww-text-muted">Data Privacy Architecture</span>
          <h3 className="text-2xl font-extrabold text-ww-teal mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-ww-accent" />
            100% Local-First
          </h3>
          <p className="text-[11px] text-ww-text-secondary mt-1">Zero cloud dependencies</p>
        </Card>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scroll-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-ww-accent text-white shadow-2xs'
                  : 'bg-white border border-ww-border text-ww-text-secondary hover:text-ww-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ww-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-ww-border rounded-lg outline-none focus:border-ww-accent w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ww-text-muted">
            <FolderLock className="w-12 h-12 mx-auto text-ww-border-strong mb-3" />
            <p className="font-semibold text-sm">No documents found</p>
            <p className="text-xs mt-1">Click "Store Document" above to archive receipts, deeds, or tax filings.</p>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <Card key={doc.id} className="p-4 border border-ww-border bg-white space-y-3 hover:border-ww-border-strong transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-ww-green-bg border border-ww-accent/20 text-ww-accent flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ww-text truncate">{doc.name}</h4>
                      <p className="text-[10px] text-ww-text-secondary truncate mt-0.5">{doc.fileName || 'Archive'}</p>
                    </div>
                  </div>
                  <Badge variant="accent">{doc.category}</Badge>
                </div>

                {doc.notes && (
                  <p className="text-[11px] text-ww-text-secondary mt-2 line-clamp-2 bg-ww-elevated p-2 rounded-lg border border-ww-border">
                    {doc.notes}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between text-[10px] text-ww-text-muted pt-2 border-t border-ww-border">
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  <span>{formatSize(doc.size || 0)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-1">
                {doc.dataUrl && (
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg text-ww-accent hover:bg-ww-green-bg cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteConfirmDoc(doc)}
                  className="p-1.5 rounded-lg text-ww-text-muted hover:text-ww-danger hover:bg-ww-danger-bg cursor-pointer"
                  title="Purge"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Store Document into Vault"
        subtitle="Saved directly into your browser's IndexedDB file store"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <Input
            label="Document Title"
            required
            value={uploadForm.name}
            onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })}
            placeholder="e.g. Q3 Commercial Fleet Lease Agreement"
          />

          <div>
            <label className="text-xs font-bold text-ww-text-secondary block mb-1.5">Category</label>
            <select
              value={uploadForm.category}
              onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
              className="w-full bg-ww-elevated border border-ww-border rounded-xl p-2.5 text-xs text-ww-text font-semibold outline-none focus:border-ww-accent"
            >
              <option value="Invoices">Commercial Invoice</option>
              <option value="Receipts">Operating Receipt</option>
              <option value="Property">Property Deed / Lease</option>
              <option value="Tax">Tax Remittance & Returns</option>
              <option value="Statements">Banking & Treasury Statement</option>
              <option value="Corporate">Corporate Charter / Legal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-ww-text-secondary block mb-1.5">Select File (Image / PDF / Doc)</label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full text-xs text-ww-text-secondary file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-ww-green-bg file:text-ww-accent hover:file:bg-ww-accent-subtle cursor-pointer"
            />
            {uploadForm.fileName && (
              <p className="text-[10px] text-ww-accent font-semibold mt-1">
                Selected: {uploadForm.fileName} ({formatSize(uploadForm.fileSize)})
              </p>
            )}
          </div>

          <Input
            label="Notes / Metadata"
            value={uploadForm.notes}
            onChange={e => setUploadForm({ ...uploadForm, notes: e.target.value })}
            placeholder="Key clauses, audit notes, dates..."
          />

          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" disabled={!uploadForm.dataUrl}>
            Save into Vault
          </Button>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewDoc(null)}
          title={`Vault Preview: ${previewDoc.name}`}
          subtitle={`${previewDoc.category} · ${formatSize(previewDoc.size)}`}
        >
          <div className="space-y-4">
            <div className="max-h-96 overflow-auto border border-ww-border rounded-xl p-2 bg-ww-elevated flex items-center justify-center">
              {previewDoc.mimeType?.startsWith('image/') ? (
                <img src={previewDoc.dataUrl} alt={previewDoc.name} className="max-h-80 object-contain rounded-lg" />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-12 h-12 text-ww-accent mx-auto" />
                  <p className="text-xs font-bold text-ww-text">{previewDoc.fileName}</p>
                  <p className="text-[11px] text-ww-text-secondary">Binary Document stored in local vault.</p>
                  <a
                    href={previewDoc.dataUrl}
                    download={previewDoc.fileName || 'vault-document'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ww-accent text-white text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download File
                  </a>
                </div>
              )}
            </div>
            {previewDoc.notes && (
              <p className="text-xs text-ww-text-secondary p-3 bg-ww-elevated rounded-xl border border-ww-border">
                <strong>Notes:</strong> {previewDoc.notes}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default React.memo(DocumentVaultHub);


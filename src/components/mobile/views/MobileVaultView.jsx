import React, { useState, useEffect } from 'react';
import { getAllVaultDocuments } from '../../../utils/indexedDB';
import { FileText, FolderLock, ShieldCheck } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

const MobileVaultView = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getAllVaultDocuments().then(docs => setDocuments(docs || []));
  }, []);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-[#22251F]">Document Vault</h2>
        <Badge variant="accent">IndexedDB</Badge>
      </div>

      <Card className="p-4 border border-[#EAE8DF] bg-white flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#A3A297]">Enshrined Archives</span>
          <h3 className="text-2xl font-extrabold text-[#22251F] mt-0.5">{documents.length} Files</h3>
        </div>
        <div className="p-2.5 rounded-xl bg-[#EDF2E9] text-[#526B56]">
          <FolderLock className="w-5 h-5" />
        </div>
      </Card>

      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-center text-xs text-[#A3A297] py-12">No documents stored in local vault.</p>
        ) : (
          documents.map(d => (
            <Card key={d.id} className="p-3 border border-[#EAE8DF] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#526B56] shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#22251F] truncate">{d.name}</h4>
                  <p className="text-[10px] text-[#77786F] truncate">{d.category} · {d.fileName}</p>
                </div>
              </div>
              <Badge variant="default">{d.category}</Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileVaultView);


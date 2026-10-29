import React, { useRef, useState } from 'react';
import { useTailoring } from '../context/TailoringContext';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  Check, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetToDefaultData, 
    customers, 
    orders, 
    lastSavedTimestamp 
  } = useTailoring();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        setImportStatus('Database successfully restored!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid backup file format.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to initial demonstration data?')) {
      resetToDefaultData();
      setImportStatus('Reset to default seed data completed.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Database Backup & Record Security
              </h2>
              <span className="text-[11px] text-neutral-500">
                Addresses Objective 4: Safe record preservation
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Storage telemetry status */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-700">
              <span className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
                <span>LocalStorage Auto-Save:</span>
              </span>
              <span className="text-emerald-700 font-semibold font-mono text-[11px]">Active</span>
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between">
              <span>Saved Records:</span>
              <span className="font-mono font-bold text-neutral-800">{customers.length} Suki · {orders.length} Orders</span>
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between">
              <span>Last Snapshot:</span>
              <span className="font-mono">{lastSavedTimestamp}</span>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Action 1: Export JSON */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-neutral-800">
              Download Off-Site Backup
            </h3>
            <p className="text-[11px] text-neutral-500 leading-normal">
              Exports full customer body measurements, orders, and payment audit logs to an encrypted JSON backup file for external USB or cloud storage.
            </p>
            <button
              onClick={exportDatabaseJSON}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Database Backup (.json)</span>
            </button>
          </div>

          {/* Action 2: Import Backup File */}
          <div className="space-y-1.5 pt-3 border-t border-neutral-200">
            <h3 className="text-xs font-semibold text-neutral-800">
              Restore Database from File
            </h3>
            <p className="text-[11px] text-neutral-500 leading-normal">
              Select a previously exported JSON backup file to restore records.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-neutral-600" />
              <span>Upload Backup File (.json)</span>
            </button>
          </div>

          {/* Action 3: Reset Demonstration Data */}
          <div className="space-y-1.5 pt-3 border-t border-neutral-200">
            <h3 className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Pilot Demonstration Data</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-normal">
              Re-populates the database with sample demonstration orders (Barong, Teacher Uniforms, Student Uniforms).
            </p>
            <button
              onClick={handleReset}
              className="w-full py-2 px-3 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset to Demonstration State</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

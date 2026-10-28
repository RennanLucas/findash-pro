import React, { useRef, useState } from 'react';
import { X, Download, Upload, Database, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { ACCOUNT_INFO } from '../data/initialData';

export function BackupRestoreModal({ isOpen, onClose, transactions, target, onRestore, onReset }) {
  const fileInputRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Export JSON Backup
  const handleDownloadJSON = () => {
    const backupData = {
      app: "FinDash Pro",
      version: "2.5.0",
      exportedAt: new Date().toISOString(),
      account: ACCOUNT_INFO,
      monthlyTarget: target,
      totalCount: transactions.length,
      transactions: transactions
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `findash_pro_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('Backup baixado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Restore JSON Backup
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json.transactions)) {
          onRestore(json.transactions, json.monthlyTarget || target);
          setSuccessMsg(`Restaurado com sucesso! ${json.transactions.length} movimentações carregadas.`);
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        } else if (Array.isArray(json)) {
          onRestore(json, target);
          setSuccessMsg(`Restaurado com sucesso! ${json.length} movimentações carregadas.`);
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        } else {
          setErrorMsg('Formato de arquivo JSON inválido.');
        }
      } catch (err) {
        setErrorMsg('Erro ao ler arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Backup & Gestão de Dados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Segurança, portabilidade e sincronização local
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Account Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Conta vinculada:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{ACCOUNT_INFO.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>ID da Conta:</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">{ACCOUNT_INFO.accountId.slice(0, 18)}...</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Total de movimentações:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{transactions.length} registros</span>
            </div>
          </div>

          {/* Action 1: Download JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Exportar Backup Completo (JSON)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Baixe um arquivo seguro com todas as suas vendas e custos.</p>
              </div>
              <button
                onClick={handleDownloadJSON}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Action 2: Upload JSON */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Restaurar de Arquivo JSON</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Suba um arquivo de backup previamente exportado.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 transition-all shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Action 3: Reset to FinDash PDF Data */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">Restaurar Dados Originais do PDF</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Recarrega os 44 registros originais exportados do FinDash.</p>
              </div>
              <button
                onClick={() => {
                  onReset();
                  setSuccessMsg('Dados originais do PDF restaurados com sucesso!');
                  setTimeout(() => {
                    setSuccessMsg('');
                    onClose();
                  }, 1200);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

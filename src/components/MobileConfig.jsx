import React, { useState } from 'react';
import { 
  Target, 
  Download, 
  Database, 
  RotateCcw, 
  Sun, 
  Moon, 
  Smartphone, 
  FileSpreadsheet,
  Image
} from 'lucide-react';
import { ACCOUNT_INFO } from '../data/initialData';
import { formatBRL, exportToCSV } from '../utils/formatters';
import { BrandLogo } from './BrandLogo';

export function MobileConfig({ 
  target, 
  onUpdateTarget, 
  transactions, 
  darkMode, 
  setDarkMode, 
  onOpenBackup, 
  onOpenInstall, 
  onResetData 
}) {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(target.toString());

  const handleSaveTarget = (e) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget(val);
      setIsEditingTarget(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, `FinDash_${ACCOUNT_INFO.name.replace(' ', '_')}.csv`);
  };

  return (
    <div className="space-y-4">
      
      {/* Account Card with Brand Logo */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Conta Vinculada
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BrandLogo size={42} />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {ACCOUNT_INFO.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ACCOUNT_INFO.email}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            PRO
          </span>
        </div>
      </div>

      {/* Target Setting */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Meta Mensal de Lucro
              </h4>
              <p className="text-[11px] text-slate-400">
                Objetivo mensal de rentabilidade
              </p>
            </div>
          </div>

          {!isEditingTarget && (
            <button
              onClick={() => {
                setTargetInput(target.toString());
                setIsEditingTarget(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {formatBRL(target)}
            </button>
          )}
        </div>

        {isEditingTarget && (
          <form onSubmit={handleSaveTarget} className="flex items-center space-x-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
              <input
                type="number"
                step="100"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTarget(false)}
              className="p-2 text-xs text-slate-400"
            >
              ✕
            </button>
          </form>
        )}
      </div>

      {/* Action Options List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm text-xs">
        
        {/* Install / Download App */}
        <button
          onClick={onOpenInstall}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Instalar no Celular</p>
              <p className="text-[11px] text-slate-400">QR Code e link direto para smartphone</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Abrir</span>
        </button>

        {/* Download Official Logo */}
        <a
          href="./logo.svg"
          download="FinDash-Logo.svg"
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Baixar Logo Oficial (SVG)</p>
              <p className="text-[11px] text-slate-400">Emblema em vetor de alta resolução</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-400" />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Aparência do App</p>
              <p className="text-[11px] text-slate-400">Alternar entre modo escuro e claro</p>
            </div>
          </div>
          <span className="text-slate-400 font-bold">{darkMode ? 'Escuro' : 'Claro'}</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={handleExportCSV}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Exportar Planilha (CSV)</p>
              <p className="text-[11px] text-slate-400">Compatível com Excel e Google Planilhas</p>
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-400" />
        </button>

        {/* Backup & Restore */}
        <button
          onClick={onOpenBackup}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Backup e Restauração</p>
              <p className="text-[11px] text-slate-400">Salvar ou recuperar cópia de segurança JSON</p>
            </div>
          </div>
          <Database className="w-4 h-4 text-slate-400" />
        </button>

        {/* Reset to PDF Data */}
        <button
          onClick={onResetData}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Restaurar Dados Originais do PDF</p>
              <p className="text-[11px] text-rose-400/80">Recarregar os 44 registros originais</p>
            </div>
          </div>
          <RotateCcw className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}

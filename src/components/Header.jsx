import React, { useState } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  Printer, 
  Database, 
  Sun, 
  Moon, 
  RotateCcw,
  FileSpreadsheet,
  Smartphone
} from 'lucide-react';
import { ACCOUNT_INFO } from '../data/initialData';
import { exportToCSV } from '../utils/formatters';

export function Header({ 
  transactions, 
  onNewTransaction, 
  onOpenBackupModal, 
  onOpenInstallModal,
  onResetData, 
  darkMode, 
  setDarkMode,
  currentPeriod,
  setCurrentPeriod,
  availableMonths
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(transactions, `FinDash_Movimentacoes_${ACCOUNT_INFO.name.replace(' ', '_')}.csv`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-200 border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Fin<span className="text-emerald-500">Dash</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Gestão Financeira & Vendas · {ACCOUNT_INFO.name}
              </p>
            </div>
          </div>

          {/* Quick Filter Bar by Period */}
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setCurrentPeriod('ALL')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                currentPeriod === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todo o Histórico
            </button>
            {availableMonths.map((m) => {
              const isCurrentMonth = m.key === '2026-10';
              return (
                <button
                  key={m.key}
                  onClick={() => setCurrentPeriod(m.key)}
                  className={`px-3 py-1.5 font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                    currentPeriod === m.key
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{m.label}</span>
                  {isCurrentMonth && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Atual
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Install Mobile / PWA */}
            <button
              onClick={onOpenInstallModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 transition-all shadow-sm"
              title="Baixar ou Instalar no Celular"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Baixar App</span>
              <span className="sm:hidden">App</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/70 transition-colors"
              title="Exportar para Excel/CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>CSV</span>
            </button>

            {/* Print/PDF */}
            <button
              onClick={handlePrint}
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/70 transition-colors"
              title="Imprimir / Salvar como Relatório PDF"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Relatório</span>
            </button>

            {/* Backup / Data Management */}
            <button
              onClick={onOpenBackupModal}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Backup, Restaurar e Dados"
            >
              <Database className="w-5 h-5" />
            </button>

            {/* Reset to Original Data */}
            <button
              onClick={() => setShowConfirmReset(true)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Restaurar dados originais do PDF"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* New Transaction Button */}
            <button
              onClick={onNewTransaction}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Nova Movimentação</span>
              <span className="sm:hidden">Nova</span>
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation Modal for Resetting to PDF */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Restaurar dados originais do PDF?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Isso recarregará as 44 movimentações originais exportadas do FinDash de <span className="font-semibold text-slate-800 dark:text-slate-200">{ACCOUNT_INFO.email}</span>. Quaisquer alterações manuais não salvas em backup serão substituídas.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-colors"
              >
                Sim, Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

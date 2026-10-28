import React from 'react';
import { LayoutDashboard, ListOrdered, BarChart3, Plus, Settings } from 'lucide-react';

export function MobileBottomNav({ activeTab, setActiveTab, onNewTransaction }) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between shadow-lg no-print">
      
      {/* Home / Início */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'dashboard'
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Início</span>
      </button>

      {/* Transactions / Extrato */}
      <button
        onClick={() => setActiveTab('transactions')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'transactions'
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <ListOrdered className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Vendas</span>
      </button>

      {/* Center Action Button (Add): Sleek Matte Black / White */}
      <div className="flex-1 flex justify-center -mt-5">
        <button
          onClick={onNewTransaction}
          className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform border border-slate-800 dark:border-slate-200"
          title="Nova Movimentação"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Charts / Resumo */}
      <button
        onClick={() => setActiveTab('categories')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'categories'
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <BarChart3 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Resumo</span>
      </button>

      {/* Settings / Config */}
      <button
        onClick={() => setActiveTab('monthly')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'monthly'
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
      >
        <Settings className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Ajustes</span>
      </button>

    </nav>
  );
}

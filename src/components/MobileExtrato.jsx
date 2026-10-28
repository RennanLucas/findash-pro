import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { MobileTransactionCard } from './MobileTransactionCard';
import { formatBRL } from '../utils/formatters';

export function MobileExtrato({ 
  transactions, 
  onSelectTx, 
  selectedMonth,
  setSelectedMonth,
  availableMonths 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'Receita' | 'Despesa'

  // Transactions filtered by selected month (for base counts)
  const monthTransactions = useMemo(() => {
    if (selectedMonth === 'ALL') return transactions;
    return transactions.filter(t => t.date?.slice(0, 7) === selectedMonth);
  }, [transactions, selectedMonth]);

  const countAll = monthTransactions.length;
  const countVendas = useMemo(() => monthTransactions.filter(t => t.type === 'Receita').length, [monthTransactions]);
  const countGastos = useMemo(() => monthTransactions.filter(t => t.type === 'Despesa').length, [monthTransactions]);

  // Filtered transactions by search query + type filter + month
  const filtered = useMemo(() => {
    return monthTransactions.filter(t => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = !search || 
        t.description?.toLowerCase().includes(search) || 
        t.category?.toLowerCase().includes(search) ||
        t.paymentMethod?.toLowerCase().includes(search) ||
        t.date?.includes(search) ||
        t.amount?.toString().includes(search) ||
        (t.notes && t.notes.toLowerCase().includes(search));

      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;

      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [monthTransactions, searchTerm, typeFilter]);

  // Totals of filtered list
  const totals = useMemo(() => {
    let rev = 0;
    let cost = 0;
    let exp = 0;
    filtered.forEach(t => {
      if (t.type === 'Receita') {
        rev += Number(t.amount) || 0;
        cost += Number(t.cost) || 0;
      } else {
        exp += Number(t.amount) || 0;
      }
    });
    return { rev, cost, exp, profit: rev - cost - exp, count: filtered.length };
  }, [filtered]);

  return (
    <div className="space-y-3.5">
      
      {/* Minimal Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar produto, categoria, valor ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Month Horizontal Pills (Neutral Style) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedMonth('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            selectedMonth === 'ALL'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Todos os Meses
        </button>
        {availableMonths.map(m => {
          const isSelected = selectedMonth === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Clean Type Selector: Dynamic Counts */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-medium">
        <button
          onClick={() => setTypeFilter('ALL')}
          className={`py-1.5 rounded-lg transition-all ${
            typeFilter === 'ALL'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Todas ({countAll})
        </button>
        <button
          onClick={() => setTypeFilter('Receita')}
          className={`py-1.5 rounded-lg transition-all ${
            typeFilter === 'Receita'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Vendas ({countVendas})
        </button>
        <button
          onClick={() => setTypeFilter('Despesa')}
          className={`py-1.5 rounded-lg transition-all ${
            typeFilter === 'Despesa'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Gastos ({countGastos})
        </button>
      </div>

      {/* Filter Stats Sub-bar */}
      <div className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          <b className="text-slate-900 dark:text-white">{totals.count}</b> itens encontrados
        </span>
        <div className="text-right">
          <span className="text-slate-400 text-[10px] mr-1.5">Lucro:</span>
          <span className={`font-bold ${totals.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatBRL(totals.profit)}
          </span>
        </div>
      </div>

      {/* Transactions Feed */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nenhum registro encontrado</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Altere os filtros acima para visualizar outras movimentações.</p>
          </div>
        ) : (
          filtered.map(tx => (
            <MobileTransactionCard
              key={tx.id}
              tx={tx}
              onClick={onSelectTx}
            />
          ))
        )}
      </div>

    </div>
  );
}

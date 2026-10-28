import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { formatBRL, formatPercent, getMonthName } from '../utils/formatters';

export function MobileResumo({ monthlyData, categoriesData, darkMode }) {
  const [tab, setTab] = useState('monthly'); // 'monthly' | 'vendas' | 'gastos'

  const textColor = darkMode ? '#94a3b8' : '#64748b';

  const sortedMonths = Object.keys(monthlyData).sort();

  const evolutionChartData = sortedMonths.map(m => {
    const row = monthlyData[m];
    const [y, month] = m.split('-');
    return {
      monthKey: m,
      label: `${month}/${y.slice(2)}`,
      Lucro: row.lucroLiquido,
      Receitas: row.receitas
    };
  });

  // Vendas / Produtos
  const salesCategories = Object.keys(categoriesData)
    .filter(cat => (categoriesData[cat].receitas > 0 || categoriesData[cat].lucroLiquido > 0))
    .map(cat => ({
      name: cat,
      lucro: categoriesData[cat].lucroLiquido,
      receitas: categoriesData[cat].receitas,
      custos: categoriesData[cat].custos,
      vendas: categoriesData[cat].vendas
    }))
    .sort((a, b) => b.lucro - a.lucro);

  const totalSalesProfit = salesCategories.reduce((acc, c) => acc + (c.lucro > 0 ? c.lucro : 0), 0);

  // Gastos / Despesas
  const expenseCategories = Object.keys(categoriesData)
    .filter(cat => (categoriesData[cat].despesas > 0))
    .map(cat => ({
      name: cat,
      despesas: categoriesData[cat].despesas,
      movimentacoes: categoriesData[cat].movimentacoes
    }))
    .sort((a, b) => b.despesas - a.despesas);

  const totalExpenses = expenseCategories.reduce((acc, c) => acc + c.despesas, 0);

  return (
    <div className="space-y-3.5">
      
      {/* 3-Tab Minimal Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setTab('monthly')}
          className={`py-1.5 rounded-lg transition-all ${
            tab === 'monthly'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Meses
        </button>
        <button
          onClick={() => setTab('vendas')}
          className={`py-1.5 rounded-lg transition-all ${
            tab === 'vendas'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Vendas
        </button>
        <button
          onClick={() => setTab('gastos')}
          className={`py-1.5 rounded-lg transition-all ${
            tab === 'gastos'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-500'
          }`}
        >
          Gastos
        </button>
      </div>

      {/* Tab 1: Evolução dos Meses */}
      {tab === 'monthly' && (
        <div className="space-y-3.5">
          {/* Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Lucro Líquido Real (Mês a Mês)
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolutionChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="label" stroke={textColor} fontSize={11} tickLine={false} />
                  <YAxis stroke={textColor} fontSize={10} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip 
                    formatter={(val) => [formatBRL(val), 'Lucro Líquido']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="Lucro" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clean Cards for each month */}
          <div className="space-y-2">
            {sortedMonths.map(m => {
              const row = monthlyData[m];
              const isOct = m === '2026-10';
              return (
                <div key={m} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <span>{getMonthName(m)}</span>
                      {isOct && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Atual
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-emerald-500">
                      +{formatBRL(row.lucroLiquido)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Rec: {formatBRL(row.receitas)}</span>
                    <span>Custos: {formatBRL(row.custos)}</span>
                    <span>{row.vendas} vendas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Nichos de Venda */}
      {tab === 'vendas' && (
        <div className="space-y-2">
          {salesCategories.map((cat, idx) => {
            const share = totalSalesProfit > 0 ? (cat.lucro / totalSalesProfit) * 100 : 0;
            return (
              <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 dark:text-white">{cat.name}</span>
                  <span className="text-emerald-500 font-bold">+{formatBRL(cat.lucro)}</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-slate-400 dark:bg-slate-500" 
                    style={{ width: `${Math.max(share, 2)}%` }} 
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Rec: {formatBRL(cat.receitas)} ({cat.vendas} itens)</span>
                  <span>{formatPercent(share)} do lucro total</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Gastos e Despesas */}
      {tab === 'gastos' && (
        <div className="space-y-2">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total de Gastos Acumulados</span>
            <span className="font-black text-rose-500 text-sm">-{formatBRL(totalExpenses)}</span>
          </div>

          {expenseCategories.map((cat, idx) => {
            const share = totalExpenses > 0 ? (cat.despesas / totalExpenses) * 100 : 0;
            return (
              <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 dark:text-white">{cat.name}</span>
                  <span className="text-rose-500 font-bold">-{formatBRL(cat.despesas)}</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-rose-400/80" 
                    style={{ width: `${Math.max(share, 2)}%` }} 
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{cat.movimentacoes} lançamento(s)</span>
                  <span>{formatPercent(share)} das despesas</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

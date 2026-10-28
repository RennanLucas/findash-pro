import React from 'react';
import { CalendarRange } from 'lucide-react';
import { formatBRL, formatPercent, getMonthName } from '../utils/formatters';

export function MonthlyComparisonTable({ monthlyData }) {
  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort();

  // Calculate totals across all months
  const total = sortedMonths.reduce(
    (acc, m) => {
      const cur = monthlyData[m];
      acc.receitas += cur.receitas;
      acc.custos += cur.custos;
      acc.despesas += cur.despesas;
      acc.lucroBruto += cur.lucroBruto;
      acc.lucroLiquido += cur.lucroLiquido;
      acc.saldo += cur.saldo;
      acc.vendas += cur.vendas;
      acc.movimentacoes += cur.movimentacoes;
      return acc;
    },
    {
      receitas: 0,
      custos: 0,
      despesas: 0,
      lucroBruto: 0,
      lucroLiquido: 0,
      saldo: 0,
      vendas: 0,
      movimentacoes: 0
    }
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <CalendarRange className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Comparação Mensal Consolidada (DRE)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evolução mês a mês das receitas, custos de aquisição, despesas e margem líquida
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Período</th>
              <th className="py-3.5 px-4 text-right">Receitas</th>
              <th className="py-3.5 px-4 text-right">Custos</th>
              <th className="py-3.5 px-4 text-right">Despesas</th>
              <th className="py-3.5 px-4 text-right">Lucro Bruto</th>
              <th className="py-3.5 px-4 text-right">Lucro Líquido</th>
              <th className="py-3.5 px-4 text-right">Saldo</th>
              <th className="py-3.5 px-4 text-center">Vendas</th>
              <th className="py-3.5 px-4 text-center">Movimentações</th>
              <th className="py-3.5 px-4 text-right">Margem Líq.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 font-medium">
            {sortedMonths.map((m) => {
              const row = monthlyData[m];
              const netMargin = row.receitas > 0 ? (row.lucroLiquido / row.receitas) * 100 : 0;
              return (
                <tr key={m} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs">
                      {m}
                    </span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400 font-normal">
                      ({getMonthName(m)})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                    {formatBRL(row.receitas)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {formatBRL(row.custos)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-500 whitespace-nowrap">
                    {formatBRL(row.despesas)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">
                    {formatBRL(row.lucroBruto)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {formatBRL(row.lucroLiquido)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {formatBRL(row.saldo)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.vendas}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {row.movimentacoes}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {formatPercent(netMargin)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100/80 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
              <td className="py-4 px-4 uppercase tracking-wider text-[11px]">
                Total Consolidado
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">
                {formatBRL(total.receitas)}
              </td>
              <td className="py-4 px-4 text-right text-amber-600 dark:text-amber-400">
                {formatBRL(total.custos)}
              </td>
              <td className="py-4 px-4 text-right text-rose-500">
                {formatBRL(total.despesas)}
              </td>
              <td className="py-4 px-4 text-right text-blue-600 dark:text-blue-400">
                {formatBRL(total.lucroBruto)}
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400 text-sm">
                {formatBRL(total.lucroLiquido)}
              </td>
              <td className="py-4 px-4 text-right text-slate-800 dark:text-slate-200">
                {formatBRL(total.saldo)}
              </td>
              <td className="py-4 px-4 text-center">
                {total.vendas}
              </td>
              <td className="py-4 px-4 text-center">
                {total.movimentacoes}
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">
                {formatPercent(total.receitas > 0 ? (total.lucroLiquido / total.receitas) * 100 : 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

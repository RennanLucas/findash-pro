import React from 'react';
import { Layers } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { formatBRL, formatPercent } from '../utils/formatters';

export function CategoriesComparisonTable({ categoriesData }) {
  const categoryNames = Object.keys(categoriesData).sort((a, b) => {
    // Sort by net profit descending
    return categoriesData[b].lucroLiquido - categoriesData[a].lucroLiquido;
  });

  const totals = categoryNames.reduce(
    (acc, cat) => {
      const c = categoriesData[cat];
      acc.receitas += c.receitas;
      acc.custos += c.custos;
      acc.despesas += c.despesas;
      acc.lucroBruto += c.lucroBruto;
      acc.lucroLiquido += c.lucroLiquido;
      acc.saldo += c.saldo;
      acc.vendas += c.vendas;
      acc.movimentacoes += c.movimentacoes;
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
          <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Demonstrativo por Categoria & Centro de Custos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desempenho detalhado de cada categoria de vendas e despesas
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Categoria</th>
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
            {categoryNames.map((cat) => {
              const row = categoriesData[cat];
              const config = CATEGORIES_CONFIG[cat] || { bg: "bg-slate-100 text-slate-700", color: "#64748b" };
              const netMargin = row.receitas > 0 ? (row.lucroLiquido / row.receitas) * 100 : null;
              const isProfitPositive = row.lucroLiquido > 0;
              const isProfitNegative = row.lucroLiquido < 0;

              return (
                <tr key={cat} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.bg}`}>
                      <span>{cat}</span>
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
                  <td className="py-3.5 px-4 text-right text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap">
                    {formatBRL(row.lucroBruto)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-extrabold">
                    <span className={isProfitPositive ? 'text-emerald-600 dark:text-emerald-400' : isProfitNegative ? 'text-rose-500' : 'text-slate-500'}>
                      {formatBRL(row.lucroLiquido)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium whitespace-nowrap">
                    <span className={row.saldo >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-500'}>
                      {formatBRL(row.saldo)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {row.vendas}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {row.movimentacoes}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {netMargin !== null ? (
                      <span className={`font-bold ${netMargin > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        {formatPercent(netMargin)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100/80 dark:bg-slate-800 border-t-2 border-slate-300 dark:border-slate-700 font-extrabold text-slate-900 dark:text-white">
              <td className="py-4 px-4 uppercase tracking-wider text-[11px]">
                Total Geral
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">
                {formatBRL(totals.receitas)}
              </td>
              <td className="py-4 px-4 text-right text-amber-600 dark:text-amber-400">
                {formatBRL(totals.custos)}
              </td>
              <td className="py-4 px-4 text-right text-rose-500">
                {formatBRL(totals.despesas)}
              </td>
              <td className="py-4 px-4 text-right text-blue-600 dark:text-blue-400">
                {formatBRL(totals.lucroBruto)}
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400 text-sm">
                {formatBRL(totals.lucroLiquido)}
              </td>
              <td className="py-4 px-4 text-right text-slate-800 dark:text-slate-200">
                {formatBRL(totals.saldo)}
              </td>
              <td className="py-4 px-4 text-center">
                {totals.vendas}
              </td>
              <td className="py-4 px-4 text-center">
                {totals.movimentacoes}
              </td>
              <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">
                {formatPercent(totals.receitas > 0 ? (totals.lucroLiquido / totals.receitas) * 100 : 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

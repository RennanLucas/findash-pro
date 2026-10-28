import React, { useMemo } from 'react';
import { ACCOUNT_INFO } from '../data/initialData';
import { formatBRL, formatPercent, getMonthName } from '../utils/formatters';

export function PrintReportView({ metrics, monthlyData, categoriesData, target }) {
  const sortedMonths = useMemo(() => Object.keys(monthlyData).sort(), [monthlyData]);
  const emissionDate = useMemo(() => new Date().toLocaleString('pt-BR'), []);

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            FinDash Pro — Relatório Financeiro Executivo
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Gestão Contábil, Margem de Lucro e Centro de Custos
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <p><b>Titular:</b> {ACCOUNT_INFO.name}</p>
          <p><b>E-mail:</b> {ACCOUNT_INFO.email}</p>
          <p><b>ID:</b> {ACCOUNT_INFO.accountId}</p>
          <p><b>Emissão:</b> {emissionDate}</p>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-3 gap-4 border border-slate-300 rounded-xl p-4 bg-slate-50">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Recebido (Vendas)</span>
          <span className="text-xl font-black text-slate-900">{formatBRL(metrics.totalReceitas)}</span>
          <span className="text-[11px] text-slate-600 block">{metrics.countVendas} vendas computadas</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Custo dos Produtos (CMV)</span>
          <span className="text-xl font-black text-slate-900">{formatBRL(metrics.totalCustos)}</span>
          <span className="text-[11px] text-slate-600 block">{formatPercent(metrics.totalReceitas > 0 ? (metrics.totalCustos / metrics.totalReceitas) * 100 : 0)} da receita</span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Lucro Bruto das Vendas</span>
          <span className="text-xl font-black text-slate-900">{formatBRL(metrics.lucroBruto)}</span>
          <span className="text-[11px] text-slate-600 block">Margem Bruta: {formatPercent(metrics.margemBruta)}</span>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Despesas Fixas & Pessoais</span>
          <span className="text-xl font-black text-slate-900">{formatBRL(metrics.totalDespesas)}</span>
          <span className="text-[11px] text-slate-600 block">Apenas {formatPercent(metrics.totalReceitas > 0 ? (metrics.totalDespesas / metrics.totalReceitas) * 100 : 0)} da receita</span>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Lucro Líquido Real</span>
          <span className="text-xl font-black text-emerald-700">{formatBRL(metrics.lucroLiquido)}</span>
          <span className="text-[11px] text-emerald-700 font-semibold block">Margem Líquida: {formatPercent(metrics.margemLiquida)}</span>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Meta Mensal Estipulada</span>
          <span className="text-xl font-black text-slate-900">{formatBRL(target)}</span>
          <span className="text-[11px] font-bold text-emerald-700 block">
            {formatPercent(target > 0 ? (metrics.lucroLiquido / target) * 100 : 0)} atingido
          </span>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          Comparação Mensal (DRE)
        </h3>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th className="p-2">Período</th>
              <th className="p-2 text-right">Receitas</th>
              <th className="p-2 text-right">Custos</th>
              <th className="p-2 text-right">Despesas</th>
              <th className="p-2 text-right">Lucro Bruto</th>
              <th className="p-2 text-right">Lucro Líquido</th>
              <th className="p-2 text-right">Saldo</th>
              <th className="p-2 text-center">Vendas</th>
              <th className="p-2 text-right">Margem Líq.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedMonths.map(m => {
              const row = monthlyData[m];
              const margin = row.receitas > 0 ? (row.lucroLiquido / row.receitas) * 100 : 0;
              return (
                <tr key={m}>
                  <td className="p-2 font-bold">{m} ({getMonthName(m)})</td>
                  <td className="p-2 text-right">{formatBRL(row.receitas)}</td>
                  <td className="p-2 text-right">{formatBRL(row.custos)}</td>
                  <td className="p-2 text-right">{formatBRL(row.despesas)}</td>
                  <td className="p-2 text-right">{formatBRL(row.lucroBruto)}</td>
                  <td className="p-2 text-right font-bold text-emerald-700">{formatBRL(row.lucroLiquido)}</td>
                  <td className="p-2 text-right">{formatBRL(row.saldo)}</td>
                  <td className="p-2 text-center">{row.vendas}</td>
                  <td className="p-2 text-right">{formatPercent(margin)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Categories Summary */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          Desempenho por Categoria
        </h3>
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold border-b border-slate-300">
            <tr>
              <th className="p-2">Categoria</th>
              <th className="p-2 text-right">Receitas</th>
              <th className="p-2 text-right">Custos</th>
              <th className="p-2 text-right">Despesas</th>
              <th className="p-2 text-right">Lucro Líquido</th>
              <th className="p-2 text-center">Vendas</th>
              <th className="p-2 text-right">Margem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {Object.keys(categoriesData).sort((a,b) => categoriesData[b].lucroLiquido - categoriesData[a].lucroLiquido).map(cat => {
              const row = categoriesData[cat];
              const margin = row.receitas > 0 ? (row.lucroLiquido / row.receitas) * 100 : 0;
              return (
                <tr key={cat}>
                  <td className="p-2 font-bold">{cat}</td>
                  <td className="p-2 text-right">{formatBRL(row.receitas)}</td>
                  <td className="p-2 text-right">{formatBRL(row.custos)}</td>
                  <td className="p-2 text-right">{formatBRL(row.despesas)}</td>
                  <td className="p-2 text-right font-bold">{formatBRL(row.lucroLiquido)}</td>
                  <td className="p-2 text-center">{row.vendas}</td>
                  <td className="p-2 text-right">{row.receitas > 0 ? formatPercent(margin) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-300 flex justify-between text-[10px] text-slate-500">
        <span>FinDash Pro — Sistema de Gestão Financeira Inteligente</span>
        <span>Página 1 de 1</span>
      </div>

    </div>
  );
}

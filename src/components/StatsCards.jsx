import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowDownRight, 
  Wallet, 
  ShoppingBag, 
  Layers, 
  Percent,
  Receipt,
  PieChart
} from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

export function StatsCards({ metrics, periodLabel }) {
  const cards = [
    {
      title: "Faturamento Bruto",
      value: formatBRL(metrics.totalReceitas),
      subtitle: `${metrics.countVendas} vendas registradas`,
      icon: DollarSign,
      color: "emerald",
      bgLight: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      bgDark: "dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40",
      pill: "Total Recebido"
    },
    {
      title: "Custo dos Produtos (CMV)",
      value: formatBRL(metrics.totalCustos),
      subtitle: `${formatPercent(metrics.totalReceitas > 0 ? (metrics.totalCustos / metrics.totalReceitas) * 100 : 0)} do faturamento`,
      icon: ShoppingBag,
      color: "amber",
      bgLight: "bg-amber-50 text-amber-600 border-amber-200/60",
      bgDark: "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40",
      pill: "Aquisição de Estoque"
    },
    {
      title: "Lucro Bruto das Vendas",
      value: formatBRL(metrics.lucroBruto),
      subtitle: `Margem bruta de ${formatPercent(metrics.margemBruta)}`,
      icon: TrendingUp,
      color: "blue",
      bgLight: "bg-blue-50 text-blue-600 border-blue-200/60",
      bgDark: "dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40",
      pill: "Receitas - Custos"
    },
    {
      title: "Despesas Operacionais",
      value: formatBRL(metrics.totalDespesas),
      subtitle: `${formatPercent(metrics.totalReceitas > 0 ? (metrics.totalDespesas / metrics.totalReceitas) * 100 : 0)} do faturamento`,
      icon: ArrowDownRight,
      color: "rose",
      bgLight: "bg-rose-50 text-rose-600 border-rose-200/60",
      bgDark: "dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40",
      pill: "Lazer, Saúde & Fixas"
    },
    {
      title: "Lucro Líquido Real",
      value: formatBRL(metrics.lucroLiquido),
      subtitle: `Margem líquida de ${formatPercent(metrics.margemLiquida)}`,
      icon: Wallet,
      color: "teal",
      bgLight: "bg-teal-50 text-teal-600 border-teal-200/60",
      bgDark: "dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800/40",
      pill: "Lucro Bruto - Despesas",
      featured: true
    },
    {
      title: "Saldo em Caixa Acumulado",
      value: formatBRL(metrics.saldoAcumulado),
      subtitle: "Receitas - Despesas diretas",
      icon: Layers,
      color: "indigo",
      bgLight: "bg-indigo-50 text-indigo-600 border-indigo-200/60",
      bgDark: "dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/40",
      pill: "Fluxo Caixa"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg ${
                card.featured
                  ? 'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/40 dark:border-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.bgLight} ${card.bgDark}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                <span>{card.pill}</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {periodLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 rounded-xl px-4 py-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Ticket Médio de Venda</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {formatBRL(metrics.ticketMedio)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 rounded-xl px-4 py-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Lucro Médio por Item</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatBRL(metrics.lucroMedioPorVenda)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 rounded-xl px-4 py-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Retorno sobre Vendas (ROS)</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {formatPercent(metrics.margemLiquida)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 rounded-xl px-4 py-3 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total de Registros</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {metrics.countMovimentacoes} movimentações
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

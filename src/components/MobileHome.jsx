import React, { useMemo } from 'react';
import { 
  Wallet, 
  Target, 
  Plus, 
  Minus, 
  ChevronRight, 
  Smartphone, 
  Laptop, 
  Gamepad2,
  Package
} from 'lucide-react';
import { formatBRL, formatPercent, getMonthName } from '../utils/formatters';
import { MobileTransactionCard } from './MobileTransactionCard';

export function MobileHome({ 
  metrics, 
  transactions, 
  target, 
  currentPeriod, 
  setCurrentPeriod,
  availableMonths = [],
  onOpenNewTx, 
  onSelectTx, 
  onGoToExtrato
}) {
  const recentTransactions = transactions.slice(0, 5);

  const isOct = currentPeriod === '2026-10';
  const isAll = currentPeriod === 'ALL';
  const displayProfit = metrics.lucroLiquido;
  const percentage = target > 0 ? (displayProfit / target) * 100 : 0;
  const clampedProgress = Math.min(Math.max(percentage, 0), 100);
  const difference = displayProfit - target;
  const isGoalReached = displayProfit >= target;

  // Dynamically compute Top 3 Niches for current period
  const topNichos = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === 'Receita') {
        const cat = t.category || 'Outros';
        const profit = (Number(t.amount) || 0) - (Number(t.cost) || 0);
        map[cat] = (map[cat] || 0) + profit;
      }
    });

    const sorted = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return sorted.map(([name, profit]) => {
      let icon = Package;
      if (name === 'Celulares') icon = Smartphone;
      else if (name === 'Notebooks') icon = Laptop;
      else if (name === 'Videogames') icon = Gamepad2;
      return { name, profit, icon };
    });
  }, [transactions]);

  const periodLabel = isAll ? 'Geral Acumulado' : getMonthName(currentPeriod);

  return (
    <div className="space-y-4">
      
      {/* Sleek Matte Balance Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        
        {/* Top bar with period switcher */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 shrink-0">
            <Wallet className="w-3.5 h-3.5" />
            <span>Saldo em Caixa</span>
          </span>

          <div className="flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
            <button
              onClick={() => setCurrentPeriod('2026-10')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isOct 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Outubro (Atual)
            </button>
            <button
              onClick={() => setCurrentPeriod('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isAll 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Total
            </button>
          </div>
        </div>

        {/* Big Balance Number */}
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatBRL(metrics.saldoAcumulado)}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Faturamento: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatBRL(metrics.totalReceitas)}</span> ({metrics.countVendas} vendas)
          </p>
        </div>

        {/* Profit Split Sub-bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">
              Lucro Líquido ({periodLabel})
            </span>
            <span className="text-lg font-bold text-emerald-500">
              +{formatBRL(displayProfit)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">
              Margem Líquida
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {formatPercent(metrics.margemLiquida)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Minimalist & Clean */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-1">
          <button
            onClick={() => onOpenNewTx('Receita')}
            className="py-3 px-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nova Venda</span>
          </button>

          <button
            onClick={() => onOpenNewTx('Despesa')}
            className="py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
          >
            <Minus className="w-4 h-4" />
            <span>Novo Gasto</span>
          </button>
        </div>

      </div>

      {/* Goal Card: Clean, Monochrome */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Meta Mensal: {formatBRL(target)}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {formatPercent(percentage)}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>{formatBRL(displayProfit)} realizados ({isAll ? 'total' : getMonthName(currentPeriod)})</span>
          <span>
            {isGoalReached 
              ? `Superávit: +${formatBRL(difference)}`
              : `Faltam: ${formatBRL(Math.abs(difference))}`
            }
          </span>
        </div>
      </div>

      {/* Category Nichos: Dynamically calculated */}
      {topNichos.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Top Nichos ({periodLabel})
          </span>

          <div className="grid grid-cols-3 gap-2">
            {topNichos.map((nicho, idx) => {
              const IconComp = nicho.icon;
              return (
                <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-center space-y-0.5">
                  <IconComp className="w-4 h-4 mx-auto text-slate-500 dark:text-slate-400" />
                  <p className="text-[11px] text-slate-400 font-medium truncate">{nicho.name}</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatBRL(nicho.profit)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Feed */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Últimas Movimentações ({periodLabel})
          </span>
          <button
            onClick={onGoToExtrato}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-0.5"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map(tx => (
            <MobileTransactionCard
              key={tx.id}
              tx={tx}
              onClick={onSelectTx}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

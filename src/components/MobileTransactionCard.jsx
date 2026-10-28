import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Gamepad2, 
  Speaker, 
  ShoppingBag, 
  Briefcase, 
  Layers, 
  Smile, 
  HeartPulse, 
  GraduationCap, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { formatBRL, formatDateBR } from '../utils/formatters';

const CATEGORY_ICONS = {
  Celulares: Smartphone,
  Notebooks: Laptop,
  Videogames: Gamepad2,
  Eletrodomésticos: Speaker,
  Vendas: ShoppingBag,
  Freelance: Briefcase,
  Outros: Layers,
  Lazer: Smile,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Investimentos: TrendingUp
};

export function MobileTransactionCard({ tx, onClick }) {
  const isRevenue = tx.type === 'Receita';
  const Icon = CATEGORY_ICONS[tx.category] || Layers;

  return (
    <div
      onClick={() => onClick(tx)}
      className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
    >
      {/* Left: Neutral Icon & Description */}
      <div className="flex items-center space-x-3 min-w-0 pr-2">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50">
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {tx.description}
          </p>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
            <span>{formatDateBR(tx.date)}</span>
            <span>·</span>
            <span className="truncate">{tx.category}</span>
            {tx.paymentMethod && (
              <>
                <span>·</span>
                <span className="truncate">{tx.paymentMethod}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Amounts */}
      <div className="text-right shrink-0 flex items-center space-x-1.5">
        <div>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 block">
            {isRevenue ? '+' : '-'}{formatBRL(tx.amount)}
          </span>

          {isRevenue && tx.profit !== undefined && (
            <span className="text-[10px] font-semibold text-emerald-500 block">
              +{formatBRL(tx.profit)}
            </span>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
      </div>
    </div>
  );
}

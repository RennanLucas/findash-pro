import React, { useState } from 'react';
import { Target, AlertCircle, Edit3, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

export function GoalProgress({ 
  target, 
  onUpdateTarget, 
  currentNetProfit, 
  periodLabel, 
  currentPeriod,
  onSelectPeriod,
  octoberNetProfit,
  accumulatedNetProfit
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(target);

  const percentage = target > 0 ? (currentNetProfit / target) * 100 : 0;
  const clampedProgress = Math.min(Math.max(percentage, 0), 100);
  const isGoalReached = currentNetProfit >= target;
  const difference = currentNetProfit - target;

  const handleSave = (e) => {
    e.preventDefault();
    const val = parseFloat(newTarget);
    if (!isNaN(val) && val > 0) {
      onUpdateTarget(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-25 ${
        isGoalReached ? 'bg-emerald-500' : 'bg-amber-500'
      }`} />

      {/* Quick context pills header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </span>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Termômetro da Meta Mensal de Lucro Líquido</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Oficial FinDash
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Acompanhamento contábil exato de rentabilidade em relação à sua meta de {formatBRL(target)}/mês
            </p>
          </div>
        </div>

        {/* Quick Month Switcher within Goal Card */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => onSelectPeriod('2026-10')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              currentPeriod === '2026-10'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mês Atual (Outubro: {formatBRL(octoberNetProfit)})</span>
          </button>
          <button
            onClick={() => onSelectPeriod('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentPeriod === 'ALL'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Todo o Histórico ({formatBRL(accumulatedNetProfit)})</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Info: Current Profit vs Goal */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-baseline space-x-4">
            <div>
              <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">
                Lucro Líquido no Período ({periodLabel})
              </span>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isGoalReached ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {formatBRL(currentNetProfit)}
                </span>
              </div>
            </div>

            <span className="text-2xl font-light text-slate-600">/</span>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Meta Mensal
                </span>
                {!isEditing && (
                  <button 
                    onClick={() => {
                      setNewTarget(target);
                      setIsEditing(true);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Editar valor da meta"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSave} className="flex items-center space-x-2 mt-1">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">R$</span>
                    <input
                      type="number"
                      step="100"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      className="w-28 pl-8 pr-2 py-1 bg-slate-800 text-white rounded-lg border border-slate-700 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                  >
                    Salvar
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-slate-300">
                  {formatBRL(target)}
                </span>
              )}
            </div>
          </div>

          {/* Explanation badge */}
          {currentPeriod === '2026-10' ? (
            <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              💡 <b>Outubro de 2026:</b> Seu faturamento foi de <b>R$ 18.080,00</b> com custo de mercadorias de <b>R$ 15.360,00</b> e despesas de <b>R$ 409,00</b>, gerando lucro líquido de <b>{formatBRL(currentNetProfit)}</b>. Faltam <b>{formatBRL(Math.abs(difference))}</b> para atingir a meta mensal de {formatBRL(target)}.
            </p>
          ) : currentPeriod === 'ALL' ? (
            <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              💡 <b>Acumulado Geral (4 Meses):</b> O lucro líquido total somado de Julho a Outubro é de <b>{formatBRL(currentNetProfit)}</b>. Comparado à meta mensal única de {formatBRL(target)}, você ultrapassou com <b>{formatPercent(percentage)}</b>.
            </p>
          ) : (
            <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              💡 <b>{periodLabel}:</b> Lucro líquido de <b>{formatBRL(currentNetProfit)}</b> representando <b>{formatPercent(percentage)}</b> da meta mensal estipulada.
            </p>
          )}
        </div>

        {/* Right Gauge / Progress Bar */}
        <div className="lg:col-span-6 space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center space-x-1.5">
              {isGoalReached ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  <span className="text-emerald-400">Meta Conquistada ({formatPercent(percentage)})</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 inline" />
                  <span className="text-amber-400">Em andamento: faltam {formatBRL(Math.abs(difference))}</span>
                </>
              )}
            </span>
            <span className={`font-black text-sm ${isGoalReached ? 'text-emerald-400' : 'text-amber-400'}`}>
              {formatPercent(percentage)}
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 border border-slate-700/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isGoalReached
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <span>R$ 0,00</span>
            {isGoalReached ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 inline" />
                <span>Superávit de +{formatBRL(difference)}</span>
              </span>
            ) : (
              <span className="text-slate-400 font-medium">
                Restam {formatPercent(100 - percentage)} do objetivo
              </span>
            )}
            <span className="font-bold text-slate-200">{formatBRL(target)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

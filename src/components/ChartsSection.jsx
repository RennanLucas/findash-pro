import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart
} from 'recharts';
import { formatBRL, formatPercent } from '../utils/formatters';
import { BarChart3, PieChart as PieChartIcon, CreditCard, Layers } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 z-50">
        <p className="font-bold text-slate-200 border-b border-slate-700/80 pb-1 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-300">{entry.name}:</span>
            </span>
            <span className="font-semibold text-white">{formatBRL(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-1">{data.name}</p>
        <p className="text-emerald-400 font-semibold">{formatBRL(data.value)}</p>
      </div>
    );
  }
  return null;
};

export function ChartsSection({ transactions, monthlyData, categoriesData, darkMode }) {
  const [chartTab, setChartTab] = useState('evolution'); // 'evolution' | 'categories' | 'expenses' | 'payments'

  // Colors for charts
  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  // 1. Monthly Evolution Data
  const evolutionChartData = Object.keys(monthlyData).sort().map(monthKey => {
    const d = monthlyData[monthKey];
    const [y, m] = monthKey.split('-');
    const label = `${m}/${y.slice(2)}`;
    return {
      monthKey,
      label,
      Receitas: d.receitas,
      Custos: d.custos,
      LucroLiquido: d.lucroLiquido,
      Despesas: d.despesas
    };
  });

  // 2. Profit by Category (Positive profit)
  const profitByCategory = Object.keys(categoriesData)
    .filter(cat => categoriesData[cat].lucroLiquido > 0)
    .map(cat => ({
      name: cat,
      lucro: categoriesData[cat].lucroLiquido,
      receitas: categoriesData[cat].receitas,
      margem: categoriesData[cat].receitas > 0 
        ? (categoriesData[cat].lucroLiquido / categoriesData[cat].receitas) * 100 
        : 0
    }))
    .sort((a, b) => b.lucro - a.lucro);

  // 3. Expenses by Category
  const expenseCategories = Object.keys(categoriesData)
    .filter(cat => categoriesData[cat].despesas > 0)
    .map(cat => ({
      name: cat,
      value: categoriesData[cat].despesas
    }))
    .sort((a, b) => b.value - a.value);

  const EXPENSE_COLORS = ['#f97316', '#ef4444', '#64748b', '#6366f1', '#14b8a6', '#8b5cf6'];

  // 4. Payment Methods Distribution
  const paymentMethods = {};
  transactions.forEach(t => {
    if (t.type === 'Receita') {
      const pm = t.paymentMethod || 'Outros';
      paymentMethods[pm] = (paymentMethods[pm] || 0) + (Number(t.amount) || 0);
    }
  });

  const paymentData = Object.keys(paymentMethods).map(pm => ({
    name: pm,
    value: paymentMethods[pm]
  })).sort((a, b) => b.value - a.value);

  const PAYMENT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Inteligência Visual & Indicadores
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Análises profundas de faturamento, margens, centro de custos e meios de pagamento
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setChartTab('evolution')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              chartTab === 'evolution'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Evolução Mensal</span>
          </button>
          
          <button
            onClick={() => setChartTab('categories')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              chartTab === 'categories'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lucro por Categoria</span>
          </button>

          <button
            onClick={() => setChartTab('expenses')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              chartTab === 'expenses'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Despesas</span>
          </button>

          <button
            onClick={() => setChartTab('payments')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              chartTab === 'payments'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Formas de Pagamento</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-6">
        {chartTab === 'evolution' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Comparativo de Receita Bruta, Custos Operacionais e Lucro Líquido Real</span>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span>Receitas</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                  <span>Custos</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-3 h-1 bg-cyan-400 inline-block" />
                  <span>Lucro Líquido</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={evolutionChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                  <XAxis dataKey="label" stroke={textColor} fontSize={12} tickLine={false} />
                  <YAxis 
                    stroke={textColor} 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Receitas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={45} name="Receitas" />
                  <Bar dataKey="Custos" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={45} name="Custos" />
                  <Line 
                    type="monotone" 
                    dataKey="LucroLiquido" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    dot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8 }} 
                    name="Lucro Líquido" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {chartTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitByCategory} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                  <XAxis type="number" stroke={textColor} fontSize={11} tickFormatter={(v) => `R$${v}`} />
                  <YAxis type="category" dataKey="name" stroke={textColor} fontSize={12} tickLine={false} width={80} />
                  <Tooltip 
                    formatter={(val, name, item) => [
                      `${formatBRL(val)} (Margem: ${formatPercent(item.payload.margem)})`, 
                      'Lucro Líquido'
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="lucro" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={30}>
                    {profitByCategory.map((entry, index) => {
                      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* List breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Ranking de Lucratividade por Nicho
              </h4>
              <div className="space-y-2">
                {profitByCategory.map((cat, idx) => {
                  const totalProfit = profitByCategory.reduce((acc, c) => acc + c.lucro, 0);
                  const share = totalProfit > 0 ? (cat.lucro / totalProfit) * 100 : 0;
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Faturamento: {formatBRL(cat.receitas)} · Margem: {formatPercent(cat.margem)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatBRL(cat.lucro)}</p>
                        <p className="text-[10px] text-slate-400">{formatPercent(share)} do lucro total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {chartTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-72 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[11px] text-slate-400 font-medium block">Total Despesas</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatBRL(expenseCategories.reduce((acc, e) => acc + e.value, 0))}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Composição de Custos e Gastos Pessoais/Fixos
              </h4>
              {expenseCategories.map((exp, idx) => {
                const totalExp = expenseCategories.reduce((acc, e) => acc + e.value, 0);
                const share = totalExp > 0 ? (exp.value / totalExp) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: EXPENSE_COLORS[idx % EXPENSE_COLORS.length] }} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{exp.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-500 dark:text-rose-400 mr-2">{formatBRL(exp.value)}</span>
                      <span className="text-[10px] text-slate-400">({formatPercent(share)})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {chartTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="h-72 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[11px] text-slate-400 font-medium block">Total Recebido</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatBRL(paymentData.reduce((acc, p) => acc + p.value, 0))}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Volume Financeiro por Modalidade de Recebimento
              </h4>
              {paymentData.map((pm, idx) => {
                const total = paymentData.reduce((acc, p) => acc + p.value, 0);
                const share = total > 0 ? (pm.value / total) * 100 : 0;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PAYMENT_COLORS[idx % PAYMENT_COLORS.length] }} />
                        <span className="text-slate-800 dark:text-slate-200">{pm.name}</span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400">{formatBRL(pm.value)}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${share}%`, backgroundColor: PAYMENT_COLORS[idx % PAYMENT_COLORS.length] }} 
                      />
                    </div>
                    <div className="text-right text-[10px] text-slate-400">
                      Representa {formatPercent(share)} das entradas
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

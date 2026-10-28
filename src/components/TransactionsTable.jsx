import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  Plus, 
  FileText,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar
} from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { formatBRL, formatDateBR, formatPercent } from '../utils/formatters';

export function TransactionsTable({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  onNewTransaction,
  selectedMonth,
  setSelectedMonth,
  availableMonths
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'Receita' | 'Despesa'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [sortField, setSortField] = useState('date'); // 'date' | 'amount' | 'profit'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Categories list from transactions
  const allCategories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category).filter(Boolean));
    return Array.from(set).sort();
  }, [transactions]);

  // Payment methods list
  const allPayments = useMemo(() => {
    const set = new Set(transactions.map(t => t.paymentMethod).filter(Boolean));
    return Array.from(set).sort();
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        !searchTerm ||
        item.description?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search) ||
        item.paymentMethod?.toLowerCase().includes(search) ||
        item.notes?.toLowerCase().includes(search) ||
        item.id?.toLowerCase().includes(search);

      // Type
      const matchesType = selectedType === 'ALL' || item.type === selectedType;

      // Category
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      // Payment
      const matchesPayment = selectedPayment === 'ALL' || item.paymentMethod === selectedPayment;

      // Month
      const itemMonth = item.date?.slice(0, 7);
      const matchesMonth = selectedMonth === 'ALL' || itemMonth === selectedMonth;

      return matchesSearch && matchesType && matchesCategory && matchesPayment && matchesMonth;
    }).sort((a, b) => {
      let valA, valB;
      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else if (sortField === 'profit') {
        valA = a.profit || 0;
        valB = b.profit || 0;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [transactions, searchTerm, selectedType, selectedCategory, selectedPayment, selectedMonth, sortField, sortOrder]);

  // Summary of filtered items
  const filteredSummary = useMemo(() => {
    let rev = 0;
    let cost = 0;
    let exp = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'Receita') {
        rev += Number(t.amount) || 0;
        cost += Number(t.cost) || 0;
      } else {
        exp += Number(t.amount) || 0;
      }
    });
    const profit = rev - cost - exp;
    return { rev, cost, exp, profit, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Livro de Movimentações & Vendas
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Registro contábil minucioso de todas as transações, custos e lucros
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onNewTransaction}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Registro</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar item, categoria, pix..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="ALL">Todos os Tipos (Receitas & Despesas)</option>
              <option value="Receita">Apenas Receitas / Vendas</option>
              <option value="Despesa">Apenas Despesas</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="ALL">Todos os Meses</option>
              {availableMonths.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              value={selectedPayment}
              onChange={(e) => {
                setSelectedPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="ALL">Todas Formas de Pgto</option>
              {allPayments.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Dynamic Filter Summary Pill Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            <span>Filtro ativo: <b>{filteredSummary.count}</b> movimentações encontradas</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              Receitas: <span className="text-emerald-600 dark:text-emerald-400">{formatBRL(filteredSummary.rev)}</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Custos: <span className="text-amber-600 dark:text-amber-400">{formatBRL(filteredSummary.cost)}</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Despesas: <span className="text-rose-600 dark:text-rose-400">{formatBRL(filteredSummary.exp)}</span>
            </span>
            <span className="text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              Lucro Líq. Filtrado: <span className={filteredSummary.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}>{formatBRL(filteredSummary.profit)}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => toggleSort('date')}>
                <div className="flex items-center space-x-1">
                  <span>Data</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Tipo & Categoria</th>
              <th className="py-3.5 px-4">Descrição do Item</th>
              <th className="py-3.5 px-4">Pagamento</th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => toggleSort('amount')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Valor Bruto</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Custo Aquisição</th>
              <th className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => toggleSort('profit')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Lucro Real</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Nenhuma movimentação encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => {
                const isRevenue = tx.type === 'Receita';
                const catConfig = CATEGORIES_CONFIG[tx.category] || { bg: "bg-slate-100 text-slate-700", color: "#64748b" };
                const margin = (isRevenue && tx.amount > 0 && tx.profit) ? (tx.profit / tx.amount) * 100 : null;

                return (
                  <tr 
                    key={tx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateBR(tx.date)}</span>
                      </div>
                    </td>

                    {/* Type & Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          isRevenue 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}>
                          {tx.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catConfig.bg}`}>
                          {tx.category}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                      <div className="truncate" title={tx.description}>
                        {tx.description}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] font-normal text-slate-400 truncate">
                          Obs: {tx.notes}
                        </div>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {tx.paymentMethod ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                          <CreditCard className="w-3 h-3 text-slate-400" />
                          <span>{tx.paymentMethod}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatBRL(tx.amount)}
                    </td>

                    {/* Cost */}
                    <td className="py-3.5 px-4 text-right text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {tx.cost > 0 ? formatBRL(tx.cost) : '—'}
                    </td>

                    {/* Profit */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isRevenue ? (
                        <div className="flex flex-col items-end">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatBRL(tx.profit)}
                          </span>
                          {margin !== null && margin > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-500/80">
                              {formatPercent(margin)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-rose-500 font-semibold">
                          -{formatBRL(tx.amount)}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="Editar movimentação"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Excluir movimentação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Mostrando</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 border-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>por página (Total: {filteredTransactions.length})</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Confirmar exclusão?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-5">
              Esta ação removerá a movimentação do seu histórico contábil.
            </p>
            <div className="flex items-center justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteTransaction(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

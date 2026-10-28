import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/initialData';
import { formatBRL, formatPercent } from '../utils/formatters';

const getTodayDate = () => new Date().toISOString().split('T')[0];

export function TransactionModal({ isOpen, onClose, onSave, editingTransaction }) {
  const [type, setType] = useState('Receita');
  const [category, setCategory] = useState('Celulares');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDate);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'Receita');
      setCategory(editingTransaction.category || 'Celulares');
      setDescription(editingTransaction.description || '');
      setDate(editingTransaction.date ? editingTransaction.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingTransaction.paymentMethod || 'Pix');
      setAmount(editingTransaction.amount ? editingTransaction.amount.toString() : '');
      setCost(editingTransaction.cost !== undefined && editingTransaction.cost !== null ? editingTransaction.cost.toString() : '');
      setNotes(editingTransaction.notes || '');
    } else {
      setType('Receita');
      setCategory('Celulares');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Pix');
      setAmount('');
      setCost('');
      setNotes('');
    }
    setError('');
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const numCost = type === 'Receita' ? (parseFloat(cost) || 0) : 0;
  const calculatedProfit = type === 'Receita' ? (numAmount - numCost) : -numAmount;
  const calculatedMargin = (type === 'Receita' && numAmount > 0) ? (calculatedProfit / numAmount) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Por favor, informe a descrição da movimentação.');
      return;
    }
    if (numAmount <= 0) {
      setError('Por favor, informe um valor válido maior que zero.');
      return;
    }

    const payload = {
      id: editingTransaction ? editingTransaction.id : crypto.randomUUID(),
      date,
      type,
      category,
      description: description.trim(),
      paymentMethod: type === 'Receita' ? paymentMethod : (paymentMethod || 'Pix'),
      amount: numAmount,
      cost: numCost,
      profit: type === 'Receita' ? calculatedProfit : 0,
      notes: notes.trim(),
      createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  const categoriesList = Object.keys(CATEGORIES_CONFIG);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTransaction ? 'Editar Movimentação' : 'Nova Movimentação'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preencha os dados da transação com cálculo automático de margem
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setType('Receita');
                if (['Lazer', 'Saúde', 'Educação', 'Investimentos'].includes(category)) {
                  setCategory('Celulares');
                }
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === 'Receita'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Receita / Venda
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Despesa');
                setCost('0');
                if (['Celulares', 'Notebooks', 'Videogames', 'Eletrodomésticos'].includes(category)) {
                  setCategory('Lazer');
                }
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === 'Despesa'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Despesa
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição do Item / Transação *
            </label>
            <input
              type="text"
              placeholder={type === 'Receita' ? 'Ex: iPhone 15 Pro Max 256GB' : 'Ex: Academia / Assinatura Claude'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              >
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Boleto">Boleto</option>
                <option value="Transferência">Transferência</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data da Movimentação *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              required
            />
          </div>

          {/* Amount & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'Receita' ? 'Valor da Venda (R$) *' : 'Valor da Despesa (R$) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {type === 'Receita' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custo de Aquisição (CMV R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center text-xs text-slate-400 italic pt-6">
                Despesas não possuem custo de revenda direto.
              </div>
            )}
          </div>

          {/* Real-time Profit Preview Card */}
          {type === 'Receita' && numAmount > 0 && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Lucro Líquido Previsto nesta Venda
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatBRL(calculatedProfit)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Margem de Lucro
                </span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {formatPercent(calculatedMargin)}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Adicionais (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Cliente pagou via Pix à vista, garantia 3 meses..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar Movimentação</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

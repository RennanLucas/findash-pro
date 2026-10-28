import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertCircle } from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/formatters';

const getTodayDate = () => new Date().toISOString().split('T')[0];

export function MobileTransactionSheet({ isOpen, onClose, onSave, onDelete, editingTransaction, initialType = 'Receita' }) {
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState('Celulares');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDate);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [amount, setAmount] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'Receita');
      setCategory(editingTransaction.category || 'Celulares');
      setDescription(editingTransaction.description || '');
      setDate(editingTransaction.date ? editingTransaction.date.split('T')[0] : getTodayDate());
      setPaymentMethod(editingTransaction.paymentMethod || 'Pix');
      setAmount(editingTransaction.amount ? editingTransaction.amount.toString() : '');
      setCost(editingTransaction.cost !== undefined && editingTransaction.cost !== null ? editingTransaction.cost.toString() : '');
      setNotes(editingTransaction.notes || '');
      setIsCustomCategory(false);
      setCustomCategoryText('');
    } else {
      setType(initialType);
      setCategory(initialType === 'Receita' ? 'Celulares' : 'Lazer');
      setDescription('');
      setDate(getTodayDate());
      setPaymentMethod('Pix');
      setAmount('');
      setCost('');
      setNotes('');
      setIsCustomCategory(false);
      setCustomCategoryText('');
    }
    setError('');
  }, [editingTransaction, isOpen, initialType]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const numCost = type === 'Receita' ? (parseFloat(cost) || 0) : 0;
  const calculatedProfit = type === 'Receita' ? (numAmount - numCost) : -numAmount;
  const calculatedMargin = (type === 'Receita' && numAmount > 0) ? (calculatedProfit / numAmount) * 100 : 0;

  const quickCategories = type === 'Receita' 
    ? [
        'Celulares', 
        'Notebooks', 
        'Videogames', 
        'Eletrodomésticos', 
        'Smartwatches', 
        'Acessórios', 
        'Vendas', 
        'Freelance'
      ]
    : [
        'Lazer', 
        'Saúde', 
        'Vestuário', 
        'Cuidados Pessoais', 
        'Alimentação', 
        'Transporte', 
        'Assinaturas & IA', 
        'Educação', 
        'Investimentos', 
        'Contas & Moradia', 
        'Frete & Envio', 
        'Taxas & Bancos', 
        'Outros'
      ];

  const quickPayments = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'];

  const finalCategory = isCustomCategory && customCategoryText.trim() 
    ? customCategoryText.trim() 
    : category;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Informe a descrição do item.');
      return;
    }
    if (numAmount <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    const payload = {
      id: editingTransaction ? editingTransaction.id : crypto.randomUUID(),
      date,
      type,
      category: finalCategory,
      description: description.trim(),
      paymentMethod,
      amount: numAmount,
      cost: numCost,
      profit: type === 'Receita' ? calculatedProfit : 0,
      notes: notes.trim(),
      createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10 animate-in slide-in-from-bottom-8 duration-200">
        
        {/* Mobile Pull Handle bar */}
        <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {editingTransaction ? 'Editar Registro' : type === 'Receita' ? 'Nova Venda' : 'Nova Despesa'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Preencha os dados abaixo
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 pb-6">
          
          {error && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 text-xs flex items-center space-x-2 border border-slate-200 dark:border-slate-700">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Toggle Type: Minimalist */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('Receita');
                setCategory('Celulares');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'Receita'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Venda (Receita)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('Despesa');
                setCost('0');
                setCategory('Lazer');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'Despesa'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Gasto (Despesa)
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {type === 'Receita' ? 'Produto Vendido *' : 'Descrição do Gasto *'}
            </label>
            <input
              type="text"
              placeholder={type === 'Receita' ? 'Ex: iPhone 15 256GB' : 'Ex: Academia'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
              required
            />
          </div>

          {/* Values (Amount & Cost) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'Receita' ? 'Valor Venda (R$) *' : 'Valor Pago (R$) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                  required
                />
              </div>
            </div>

            {type === 'Receita' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custo (CMV R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0,00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center text-[10px] text-slate-400 px-1">
                Despesa direta
              </div>
            )}
          </div>

          {/* Minimal Profit Preview (Only numbers, no bright banners) */}
          {type === 'Receita' && numAmount > 0 && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Lucro desta venda</span>
                <span className="text-sm font-bold text-emerald-500">
                  +{formatBRL(calculatedProfit)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Margem</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {formatPercent(calculatedMargin)}
                </span>
              </div>
            </div>
          )}

          {/* Category Chips & Custom Category Option */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Categoria ({type === 'Receita' ? 'Produto / Venda' : 'Tipo de Gasto'})
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(!isCustomCategory);
                  if (!isCustomCategory) setCustomCategoryText('');
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {isCustomCategory ? 'Voltar à lista' : '+ Digitar outra'}
              </button>
            </div>

            {isCustomCategory ? (
              <div className="pt-0.5">
                <input
                  type="text"
                  placeholder="Ex: PlayStation 4, Capas & Películas, Combustível..."
                  value={customCategoryText}
                  onChange={(e) => setCustomCategoryText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 font-semibold"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-0.5 pt-0.5">
                {quickCategories.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Chips */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Forma de Pagamento
            </label>
            <div className="flex flex-wrap gap-1">
              {quickPayments.map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPaymentMethod(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    paymentMethod === p
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions: Sleek Dark / White Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            {editingTransaction && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingTransaction.id);
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 border border-slate-200 dark:border-slate-700 active:scale-95"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingTransaction ? 'Salvar Alterações' : 'Confirmar Lançamento'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

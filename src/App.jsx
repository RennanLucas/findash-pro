import React, { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_TRANSACTIONS, 
  ACCOUNT_INFO 
} from './data/initialData';
import { 
  calculateMetrics, 
  getMonthName 
} from './utils/formatters';
import { MobileHome } from './components/MobileHome';
import { MobileExtrato } from './components/MobileExtrato';
import { MobileResumo } from './components/MobileResumo';
import { MobileConfig } from './components/MobileConfig';
import { MobileTransactionSheet } from './components/MobileTransactionSheet';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallModal } from './components/InstallModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { PrintReportView } from './components/PrintReportView';
import { BrandLogo } from './components/BrandLogo';

import { 
  Smartphone, 
  Sun, 
  Moon, 
  CheckCircle
} from 'lucide-react';

export default function App() {
  // Theme state (Dark mode default for sleek fintech look)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('findash_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Monthly Target
  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem('findash_monthly_target');
    return saved !== null ? parseFloat(saved) : ACCOUNT_INFO.monthlyTarget;
  });

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('findash_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved transactions", e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Period filter - Defaults to current month (Outubro/2026)
  const [currentPeriod, setCurrentPeriod] = useState('2026-10');

  // Navigation tab for mobile ('dashboard' | 'transactions' | 'categories' | 'monthly')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals & Sheets
  const [isTxSheetOpen, setIsTxSheetOpen] = useState(false);
  const [txSheetType, setTxSheetType] = useState('Receita');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Listen for native install prompt (PWA)
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('Aplicativo instalado no seu dispositivo!');
      }
      setInstallPrompt(null);
    }
  };

  // Persist Dark Mode
  useEffect(() => {
    localStorage.setItem('findash_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist Transactions & Target
  useEffect(() => {
    localStorage.setItem('findash_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('findash_monthly_target', target.toString());
  }, [target]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Available months
  const availableMonths = useMemo(() => {
    const map = new Map();
    transactions.forEach(t => {
      const monthKey = t.date?.slice(0, 7);
      if (monthKey && !map.has(monthKey)) {
        map.set(monthKey, {
          key: monthKey,
          label: getMonthName(monthKey)
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [transactions]);

  // Monthly Data
  const monthlyData = useMemo(() => {
    const result = {};
    transactions.forEach(tx => {
      const monthKey = tx.date ? tx.date.slice(0, 7) : 'Outros';
      if (!result[monthKey]) {
        result[monthKey] = {
          receitas: 0,
          custos: 0,
          despesas: 0,
          lucroBruto: 0,
          lucroLiquido: 0,
          saldo: 0,
          vendas: 0,
          movimentacoes: 0
        };
      }

      const val = Number(tx.amount) || 0;
      const cost = Number(tx.cost) || 0;
      result[monthKey].movimentacoes += 1;

      if (tx.type === 'Receita') {
        result[monthKey].receitas += val;
        result[monthKey].custos += cost;
        result[monthKey].vendas += 1;
      } else {
        result[monthKey].despesas += val;
      }
    });

    Object.keys(result).forEach(k => {
      const row = result[k];
      row.lucroBruto = row.receitas - row.custos;
      row.lucroLiquido = row.lucroBruto - row.despesas;
      row.saldo = row.receitas - row.despesas;
    });

    return result;
  }, [transactions]);

  // Categories Data
  const categoriesData = useMemo(() => {
    const result = {};
    transactions.forEach(tx => {
      const cat = tx.category || 'Outros';
      if (!result[cat]) {
        result[cat] = {
          receitas: 0,
          custos: 0,
          despesas: 0,
          lucroBruto: 0,
          lucroLiquido: 0,
          saldo: 0,
          vendas: 0,
          movimentacoes: 0
        };
      }

      const val = Number(tx.amount) || 0;
      const cost = Number(tx.cost) || 0;
      result[cat].movimentacoes += 1;

      if (tx.type === 'Receita') {
        result[cat].receitas += val;
        result[cat].custos += cost;
        result[cat].vendas += 1;
      } else {
        result[cat].despesas += val;
      }
    });

    Object.keys(result).forEach(k => {
      const row = result[k];
      row.lucroBruto = row.receitas - row.custos;
      row.lucroLiquido = row.lucroBruto - row.despesas;
      row.saldo = row.receitas - row.despesas;
    });

    return result;
  }, [transactions]);

  // Period transactions
  const periodTransactions = useMemo(() => {
    if (currentPeriod === 'ALL') return transactions;
    return transactions.filter(t => t.date?.slice(0, 7) === currentPeriod);
  }, [transactions, currentPeriod]);

  // KPIs
  const metrics = useMemo(() => {
    return calculateMetrics(periodTransactions);
  }, [periodTransactions]);

  const overallMetrics = useMemo(() => {
    return calculateMetrics(transactions);
  }, [transactions]);

  const octoberProfit = useMemo(() => {
    return monthlyData['2026-10'] ? monthlyData['2026-10'].lucroLiquido : 2311.00;
  }, [monthlyData]);

  // Handlers
  const handleSaveTransaction = (savedTx) => {
    setTransactions(prev => {
      const exists = prev.some(t => t.id === savedTx.id);
      if (exists) {
        return prev.map(t => t.id === savedTx.id ? savedTx : t);
      } else {
        return [savedTx, ...prev];
      }
    });
    showToast(editingTransaction ? 'Registro atualizado!' : 'Nova venda registrada!');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Registro excluído.');
  };

  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setTarget(ACCOUNT_INFO.monthlyTarget);
    setCurrentPeriod('2026-10');
    showToast('Dados restaurados para o PDF FinDash!');
  };

  const handleRestoreBackup = (newTxList, newTarget) => {
    setTransactions(newTxList);
    if (newTarget) setTarget(newTarget);
    showToast('Backup carregado com sucesso!');
  };

  const openNewTx = (type = 'Receita') => {
    setEditingTransaction(null);
    setTxSheetType(type);
    setIsTxSheetOpen(true);
  };

  const openEditTx = (tx) => {
    setEditingTransaction(tx);
    setTxSheetType(tx.type);
    setIsTxSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl animate-in fade-in slide-in-from-top-4 duration-150">
          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Frame Container: Perfectly centered and proportioned like a phone app */}
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-slate-950 sm:shadow-2xl sm:border-x border-slate-200 dark:border-slate-800 flex flex-col relative pb-24">
        
        {/* Sleek Mobile Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <BrandLogo size={34} />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                  FinDash
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Olá, Rennan 👋
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold active:scale-95 transition-transform"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Alternar tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 flex-1 space-y-4 no-print">
          
          {/* Tab 1: Home Dashboard */}
          {activeTab === 'dashboard' && (
            <MobileHome
              metrics={metrics}
              transactions={periodTransactions}
              target={target}
              currentPeriod={currentPeriod}
              setCurrentPeriod={setCurrentPeriod}
              availableMonths={availableMonths}
              onOpenNewTx={openNewTx}
              onSelectTx={openEditTx}
              onGoToExtrato={() => setActiveTab('transactions')}
              octoberProfit={octoberProfit}
              accumulatedProfit={overallMetrics.lucroLiquido}
            />
          )}

          {/* Tab 2: Transactions Feed (Extrato) */}
          {activeTab === 'transactions' && (
            <MobileExtrato
              transactions={transactions}
              onSelectTx={openEditTx}
              onNewTransaction={openNewTx}
              selectedMonth={currentPeriod}
              setSelectedMonth={setCurrentPeriod}
              availableMonths={availableMonths}
            />
          )}

          {/* Tab 3: Resumo Visual & Categorias */}
          {activeTab === 'categories' && (
            <MobileResumo
              monthlyData={monthlyData}
              categoriesData={categoriesData}
              darkMode={darkMode}
            />
          )}

          {/* Tab 4: Configurações & Meses */}
          {activeTab === 'monthly' && (
            <MobileConfig
              target={target}
              onUpdateTarget={setTarget}
              transactions={transactions}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onOpenBackup={() => setIsBackupModalOpen(true)}
              onOpenInstall={() => setIsInstallModalOpen(true)}
              onResetData={handleResetData}
            />
          )}

        </main>

        {/* Mobile Native-Style Fixed Bottom Nav Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewTransaction={() => openNewTx('Receita')}
        />

        {/* Mobile Bottom Sheet for Adding/Editing Transactions */}
        <MobileTransactionSheet
          isOpen={isTxSheetOpen}
          onClose={() => {
            setIsTxSheetOpen(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          onDelete={handleDeleteTransaction}
          editingTransaction={editingTransaction}
          initialType={txSheetType}
        />

        {/* Install / Download QR Modal */}
        <InstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          installPrompt={installPrompt}
          onTriggerInstall={triggerInstall}
        />

        {/* Backup Modal */}
        <BackupRestoreModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          transactions={transactions}
          target={target}
          onRestore={handleRestoreBackup}
          onReset={handleResetData}
        />

        {/* Printable View */}
        <PrintReportView
          metrics={overallMetrics}
          monthlyData={monthlyData}
          categoriesData={categoriesData}
          target={target}
        />

      </div>

    </div>
  );
}

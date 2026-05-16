import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Header, StatusStrip, type TabId } from './components/Header';
import { ActionModal, type ModalState } from './components/Modal';
import { Dashboard } from './components/Dashboard';
import { Cards } from './components/Cards';
import { Config } from './components/Config';
import { Colophon } from './components/Colophon';
import type {
  AppState, IncomeRow, FixedExpense, AccountBalances,
  CreditCard, CreditCardCharge, Category, CardStats,
} from './types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', nombre: 'Servicios',    color: '#1F5BD4' },
  { id: '2', nombre: 'Bancos',       color: '#1E6B43' },
  { id: '3', nombre: 'Salud',        color: '#C41E3A' },
  { id: '4', nombre: 'Impuestos',    color: '#D4AF37' },
  { id: '5', nombre: 'Supermercado', color: '#9333EA' },
  { id: '6', nombre: 'Varios',       color: '#94A3B8' },
];

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const INITIAL_STATE: AppState = {
  exchangeRate: '1250',
  prevMonthBalance: '',
  balances: {
    cash: '', galicia: '', mercadoPago: '', mercadoPagoReserve: '', astroPay: '', lemon: '',
  },
  incomeRows: Array.from({ length: 7 }, () => ({
    id: uid(), description: '', ars: '', usd: '', isConfirmed: false, category: 'Ingreso',
  })),
  fixedExpenses: [
    { id: uid(), description: '', dueDay: '', category: 'Servicios', toPay: '', paid: '', isFullyPaid: false },
  ],
  creditCards: [
    { id: uid(), name: 'Visa Galicia',  expenses: [] },
    { id: uid(), name: 'Master BBVA',   expenses: [] },
    { id: uid(), name: 'Amex Directa',  expenses: [] },
    { id: uid(), name: 'Naranja X',     expenses: [] },
  ],
  categories: DEFAULT_CATEGORIES,
};

const STORAGE_KEY = 'financeflow_v3';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.creditCards && parsed.creditCards.length >= 4 && parsed.balances) {
        if (!parsed.categories) parsed.categories = DEFAULT_CATEGORIES;
        return parsed;
      }
    }
  } catch (_) {}
  return INITIAL_STATE;
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const fileRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState<ModalState>({ show: false, title: '', message: '', type: 'alert' });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  /* — Income — */
  const handleIncomeChange = (id: string, field: keyof IncomeRow, value: string) => {
    setState(prev => ({
      ...prev,
      incomeRows: prev.incomeRows.map(row => {
        if (row.id !== id) return row;
        const rate = parseFloat(prev.exchangeRate) || 0;
        const next = { ...row, [field]: value } as IncomeRow;
        if (field === 'ars' && rate > 0) next.usd = value ? (parseFloat(value) / rate).toFixed(2) : '';
        else if (field === 'usd' && rate > 0) next.ars = value ? (parseFloat(value) * rate).toFixed(0) : '';
        return next;
      })
    }));
  };
  const toggleIncomeConfirm = (id: string) => setState(p => ({
    ...p, incomeRows: p.incomeRows.map(r => r.id === id ? { ...r, isConfirmed: !r.isConfirmed } : r)
  }));
  const removeIncomeRow = (id: string) => setState(p => ({ ...p, incomeRows: p.incomeRows.filter(r => r.id !== id) }));
  const addIncomeRow = () => setState(p => ({
    ...p, incomeRows: [...p.incomeRows, { id: uid(), description: '', ars: '', usd: '', isConfirmed: false, category: 'Ingreso' }]
  }));

  /* — Fixed expenses — */
  const handleFixedChange = (id: string, field: keyof FixedExpense, value: string | boolean) => {
    setState(p => ({
      ...p,
      fixedExpenses: p.fixedExpenses.map(f => {
        if (f.id !== id) return f;
        const n = { ...f, [field]: value } as FixedExpense;
        if (field === 'paid') {
          n.isFullyPaid = parseFloat(value as string) >= parseFloat(f.toPay) && parseFloat(f.toPay) > 0;
        }
        return n;
      })
    }));
  };
  const toggleFixedPaid = (id: string) => setState(p => ({
    ...p,
    fixedExpenses: p.fixedExpenses.map(f =>
      f.id === id ? { ...f, isFullyPaid: !f.isFullyPaid, paid: !f.isFullyPaid ? f.toPay : '' } : f
    )
  }));
  const removeFixed = (id: string) => setState(p => ({ ...p, fixedExpenses: p.fixedExpenses.filter(f => f.id !== id) }));
  const addFixed = () => setState(p => ({
    ...p, fixedExpenses: [...p.fixedExpenses, { id: uid(), description: '', dueDay: '', category: 'Servicios', toPay: '', paid: '', isFullyPaid: false }]
  }));

  /* — Balances — */
  const handleBalanceChange = (key: keyof AccountBalances, v: string) => {
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setState(p => ({ ...p, balances: { ...p.balances, [key]: v } }));
    }
  };
  const setPrevMonth = (v: string) => setState(p => ({ ...p, prevMonthBalance: v }));
  const setRate = (v: string) => setState(p => ({ ...p, exchangeRate: v }));

  /* — Cards — */
  const updateCardName = (cardId: string, name: string) => setState(p => ({
    ...p, creditCards: p.creditCards.map(c => c.id === cardId ? { ...c, name } : c)
  }));
  const addCardExpense = (cardId: string) => setState(p => ({
    ...p,
    creditCards: p.creditCards.map(c => c.id === cardId ? {
      ...c,
      expenses: [...c.expenses, { id: uid(), description: '', date: '', category: 'Compras', currentInstallment: '1', totalInstallments: '1', amount: '', isConfirmed: false }]
    } : c)
  }));
  const updateCardExpense = (cardId: string, expId: string, field: keyof CreditCardCharge, value: string | boolean) => setState(p => ({
    ...p,
    creditCards: p.creditCards.map(c => c.id === cardId ? {
      ...c, expenses: c.expenses.map(e => e.id === expId ? { ...e, [field]: value } as CreditCardCharge : e)
    } : c)
  }));
  const removeCardExpense = (cardId: string, expId: string) => setState(p => ({
    ...p,
    creditCards: p.creditCards.map(c => c.id === cardId ? { ...c, expenses: c.expenses.filter(e => e.id !== expId) } : c)
  }));

  /* — Categories — */
  const handleAddCategory = (nombre: string, color: string) => setState(p => ({
    ...p, categories: [...p.categories, { id: uid(), nombre, color }]
  }));
  const handleDeleteCategory = (id: string) => setState(p => {
    const target = p.categories.find(c => c.id === id);
    if (!target) return p;
    return {
      ...p,
      categories: p.categories.filter(c => c.id !== id),
      fixedExpenses: p.fixedExpenses.map(e => e.category === target.nombre ? { ...e, category: 'Varios' } : e),
      creditCards: p.creditCards.map(c => ({
        ...c, expenses: c.expenses.map(e => e.category === target.nombre ? { ...e, category: 'Varios' } : e)
      }))
    };
  });

  /* — Derived — */
  const toCollect = useMemo(() =>
    state.incomeRows.filter(r => !r.isConfirmed && parseFloat(r.ars) > 0)
      .reduce((a, r) => a + (parseFloat(r.ars) || 0), 0),
    [state.incomeRows]
  );
  const subtotalBalances = useMemo(() => {
    const sum = Object.values(state.balances).reduce((a, v) => a + (parseFloat(v) || 0), 0);
    return sum + toCollect;
  }, [state.balances, toCollect]);
  const cardStats = useMemo<CardStats>(() => {
    let currentTotal = 0, forecastTotal = 0, confirmedTotal = 0, pendingTotal = 0;
    state.creditCards.forEach(card => card.expenses.forEach(exp => {
      const amt = parseFloat(exp.amount) || 0;
      const current = parseInt(exp.currentInstallment) || 0;
      const total = parseInt(exp.totalInstallments) || 0;
      currentTotal += amt;
      if (current < total) forecastTotal += amt;
      if (exp.isConfirmed) confirmedTotal += amt; else pendingTotal += amt;
    }));
    return { currentTotal, forecastTotal, confirmedTotal, pendingTotal };
  }, [state.creditCards]);
  const totals = useMemo(() => {
    const toPay = state.fixedExpenses.reduce((a, e) => a + (parseFloat(e.toPay) || 0), 0);
    const paid  = state.fixedExpenses.reduce((a, e) => a + (parseFloat(e.paid)  || 0), 0);
    return { paid: paid + cardStats.confirmedTotal, pending: (toPay - paid) + cardStats.pendingTotal };
  }, [state.fixedExpenses, cardStats]);
  const expenseCounts = useMemo<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    state.fixedExpenses.forEach(e => { m[e.category] = (m[e.category] || 0) + 1; });
    state.creditCards.forEach(c => c.expenses.forEach(e => { m[e.category] = (m[e.category] || 0) + 1; }));
    return m;
  }, [state.fixedExpenses, state.creditCards]);

  /* — Backups & period switch — */
  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `financeflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };
  const downloadCSV = () => {
    let csv = '\uFEFF--- INGRESOS ---\nDescripción;ARS;USD;Confirmado\n';
    state.incomeRows.forEach(r => { if (r.description || r.ars) csv += `${r.description || '-'};${r.ars || 0};${r.usd || 0};${r.isConfirmed ? 'SÍ' : 'NO'}\n`; });
    csv += '\n--- GASTOS FIJOS ---\nDescripción;Día;Categoría;A pagar;Pagado;Estado\n';
    state.fixedExpenses.forEach(e => { if (e.description || e.toPay) csv += `${e.description || '-'};${e.dueDay};${e.category};${e.toPay};${e.paid};${e.isFullyPaid ? 'SALDADO' : 'PENDIENTE'}\n`; });
    csv += '\n--- TARJETAS ---\n';
    state.creditCards.forEach(c => {
      csv += `${c.name.toUpperCase()}\nConcepto;Cuota;De;ARS;Confirmado\n`;
      c.expenses.forEach(e => { csv += `${e.description || '-'};${e.currentInstallment};${e.totalInstallments};${e.amount};${e.isConfirmed ? 'SÍ' : 'NO'}\n`; });
      csv += '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `FinanceFlow_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleImportClick = () => setModal({
    show: true, type: 'confirm', title: 'Importar resguardo',
    message: 'Sobrescribirá todos los datos actuales de forma permanente. ¿Continuar?',
    onConfirm: () => fileRef.current?.click()
  });
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        if (parsed.incomeRows && parsed.balances && parsed.creditCards) {
          setState(parsed);
          setActiveTab('dashboard');
        } else throw new Error('Formato JSON inválido.');
      } else throw new Error('Sólo se admiten archivos .json.');
    } catch (err) {
      setModal({ show: true, type: 'alert', title: 'Error de importación', message: err instanceof Error ? err.message : 'Archivo corrupto.' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleMonthChange = () => setModal({
    show: true, type: 'confirm', title: 'Cambio de mes',
    message: 'Se generará un resguardo automático y se reiniciarán los movimientos para el nuevo período.',
    onConfirm: () => {
      downloadBackup();
      setState(p => ({
        ...p,
        prevMonthBalance: subtotalBalances.toString(),
        incomeRows: p.incomeRows.map(r => ({ ...r, isConfirmed: false })),
        fixedExpenses: p.fixedExpenses.map(r => ({ ...r, isFullyPaid: false, paid: '' })),
        creditCards: p.creditCards.map(card => ({
          ...card,
          expenses: card.expenses
            .map(exp => ({ ...exp, currentInstallment: (parseInt(exp.currentInstallment) + 1).toString(), isConfirmed: false }))
            .filter(exp => parseInt(exp.currentInstallment) <= parseInt(exp.totalInstallments))
        }))
      }));
    }
  });

  const period = (() => {
    const p = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    return p.charAt(0).toUpperCase() + p.slice(1);
  })();

  return (
    <div className="app">
      <Header
        activeTab={activeTab} onTab={setActiveTab}
        exchangeRate={state.exchangeRate} onRate={setRate}
        onImport={handleImportClick}
        onExportJSON={downloadBackup}
        onExportCSV={downloadCSV}
        onMonthChange={handleMonthChange}
      />
      <input ref={fileRef} type="file" accept=".json,.csv" onChange={handleFile} style={{ display: 'none' }} />

      <StatusStrip
        rate={state.exchangeRate}
        toCollect={toCollect}
        paid={totals.paid}
        pending={totals.pending}
        period={period}
      />

      <main className="main">
        <div className="shell">
          {activeTab === 'dashboard' && (
            <Dashboard
              rows={state.incomeRows}
              categories={state.categories}
              onChange={handleIncomeChange}
              onToggle={toggleIncomeConfirm}
              onRemove={removeIncomeRow}
              onAdd={addIncomeRow}
              fixed={{
                rows: state.fixedExpenses,
                categories: state.categories,
                onChange: handleFixedChange,
                onTogglePaid: toggleFixedPaid,
                onRemove: removeFixed,
                onAdd: addFixed,
              }}
              treasury={{
                balances: state.balances,
                prevMonthBalance: state.prevMonthBalance,
                toCollect,
                onBalance: handleBalanceChange,
                onPrev: setPrevMonth,
              }}
              period={period}
              subtotalBalances={subtotalBalances}
              totals={totals}
            />
          )}
          {activeTab === 'cards' && (
            <Cards
              creditCards={state.creditCards}
              categories={state.categories}
              cardStats={cardStats}
              updateCardName={updateCardName}
              addCardExpense={addCardExpense}
              updateCardExpense={updateCardExpense}
              removeCardExpense={removeCardExpense}
            />
          )}
          {activeTab === 'config' && (
            <Config
              categories={state.categories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
              expenseCounts={expenseCounts}
            />
          )}
        </div>
      </main>

      <Colophon />

      <ActionModal
        show={modal.show} title={modal.title} message={modal.message} type={modal.type}
        onClose={() => setModal(m => ({ ...m, show: false }))}
        onConfirm={() => { setModal(m => ({ ...m, show: false })); modal.onConfirm?.(); }}
      />
    </div>
  );
}

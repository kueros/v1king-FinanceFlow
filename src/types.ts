export interface IncomeRow {
  id: string;
  description: string;
  ars: string;
  usd: string;
  isConfirmed: boolean;
  category?: string;
}

export interface AccountBalances {
  cash: string;
  galicia: string;
  mercadoPago: string;
  mercadoPagoReserve: string;
  astroPay: string;
  lemon: string;
}

export interface FixedExpense {
  id: string;
  description: string;
  dueDay: string;
  category: string;
  toPay: string;
  paid: string;
  isFullyPaid: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  color: string;
}

export interface AppState {
  incomeRows: IncomeRow[];
  balances: AccountBalances;
  prevMonthBalance: string;
  fixedExpenses: FixedExpense[];
  exchangeRate: string;
  categories: Category[];
  cardPayment: string;
}

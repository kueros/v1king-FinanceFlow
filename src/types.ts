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

export interface CreditCardCharge {
  id: string;
  description: string;
  date: string;
  category: string;
  currentInstallment: string;
  totalInstallments: string;
  amount: string;
  isConfirmed: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  expenses: CreditCardCharge[];
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
  creditCards: CreditCard[];
  exchangeRate: string;
  categories: Category[];
}

export interface CardStats {
  currentTotal: number;
  forecastTotal: number;
  confirmedTotal: number;
  pendingTotal: number;
}


export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  establishment: string;
  type?: 'expense' | 'income' | 'transfer';
  recurrence?: 'none' | 'monthly' | 'yearly';
  adjustmentRate?: number; // Porcentagem de reajuste futuro
}

export interface Project {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
}

export interface SimulationResult {
  type: 'SAC' | 'PRICE' | 'INVESTMENT' | 'CONSORCIO';
  totalInterest: number;
  totalPaid: number;
  finalValue?: number;
  monthlyPayments?: number[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPro: boolean;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDTO {
  email: string;
  password?: string;
  isPro?: boolean;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  cpf?: string;
  isPro: boolean;
  googleProvider?: boolean;
}

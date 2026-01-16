export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Entertainment"
  | "Other"
  | string;

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO
  category: ExpenseCategory;
}

// DTO para crear/editar 
export interface ExpenseInput {
  description: string;
  amount: number;
  date?: string;
  category: ExpenseCategory;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

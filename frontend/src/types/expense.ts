export interface Expense {
  id: string;

  concept: string;

  category: string | null;

  amount: string;

  spent_at: string;

  payment_method: string | null;

  notes: string | null;

  created_at: string;

  updated_at: string;
}

export interface CreateExpensePayload {
  concept: string;

  category?: string | null;

  amount: number;

  spent_on: string;

  payment_method?: string | null;

  notes?: string | null;
}

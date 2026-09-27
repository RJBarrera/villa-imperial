export interface ExpenseListItem {
  id: string;
  concept: string;
  amount: string | number;
  category?: string | null;
  spent_at: string;
  payment_method?: string | null;
  notes?: string | null;
}

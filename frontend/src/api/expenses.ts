import { http } from "./http";

import type { CreateExpensePayload, Expense } from "../types/expense";

interface ExpenseFilters {
  date_from?: string;

  date_to?: string;

  search?: string;
}

export async function getExpenses(
  filters: ExpenseFilters = {},
): Promise<Expense[]> {
  const response = await http.get<Expense[]>("/expenses", {
    params: filters,
  });

  return response.data;
}

export async function createExpense(
  payload: CreateExpensePayload,
): Promise<Expense> {
  const response = await http.post<Expense>("/expenses", payload);

  return response.data;
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { getExpenses } from "../../../api/expenses";
import type { ExpenseListItem } from "./expenses.types";

export function useExpensesPage() {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [dialogOpen, setDialogOpen] = useState(false);

  const dateFrom = useMemo(
    () =>
      dayjs(`${selectedMonth}-01`)
        .startOf("month")
        .format("YYYY-MM-DD"),
    [selectedMonth],
  );

  const dateTo = useMemo(
    () =>
      dayjs(`${selectedMonth}-01`)
        .endOf("month")
        .format("YYYY-MM-DD"),
    [selectedMonth],
  );

  const {
    data: expenses = [],
    isLoading,
    isError,
  } = useQuery<ExpenseListItem[]>({
    queryKey: ["expenses", selectedMonth],
    queryFn: () =>
      getExpenses({
        date_from: dateFrom,
        date_to: dateTo,
      }),
  });

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses],
  );

  const handleExpenseCreated = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["expenses"],
    });
  };

  return {
    selectedMonth,
    dialogOpen,
    expenses,
    total,
    isLoading,
    isError,
    setSelectedMonth,
    setDialogOpen,
    handleExpenseCreated,
  };
}

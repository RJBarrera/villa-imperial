import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getDashboardSummary } from "../../../api/dashboard";
import type { DashboardSummary } from "./dashboard.types";

export function useDashboardPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const {
    data,
    isLoading,
    isError,
  } = useQuery<DashboardSummary>({
    queryKey: ["dashboard", selectedMonth],
    queryFn: () => getDashboardSummary(selectedMonth),
  });

  return {
    data,
    isLoading,
    isError,
    selectedMonth,
    setSelectedMonth,
    goToBookings: () => navigate("/admin/reservaciones"),
    goToCalendar: () => navigate("/admin/calendario"),
    goToPayments: () => navigate("/admin/pagos"),
    goToExpenses: () => navigate("/admin/gastos"),
  };
}

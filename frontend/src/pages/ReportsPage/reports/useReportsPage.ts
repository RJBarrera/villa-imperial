import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { getReportSummary } from "../../../api/reports";
import type { ReportSummary } from "./reports.types";
import {
  buildEventData,
  buildExpenseCategoryData,
  buildMonthlyData,
  buildPackageData,
  buildReportYears,
  formatCurrency,
} from "./reports.utils";

export function useReportsPage() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    data,
    isLoading,
    isError,
  } = useQuery<ReportSummary>({
    queryKey: ["reports", selectedYear],
    queryFn: () => getReportSummary(selectedYear),
  });

  const years = useMemo(
    () => buildReportYears(currentYear),
    [currentYear],
  );

  const monthlyData = useMemo(
    () => buildMonthlyData(data),
    [data],
  );

  const packageData = useMemo(
    () => buildPackageData(data),
    [data],
  );

  const expenseCategoryData = useMemo(
    () => buildExpenseCategoryData(data),
    [data],
  );

  const eventData = useMemo(
    () => buildEventData(data),
    [data],
  );

  return {
    data,
    isLoading,
    isError,
    selectedYear,
    years,
    monthlyData,
    packageData,
    expenseCategoryData,
    eventData,
    setSelectedYear,
    formatCurrency,
  };
}

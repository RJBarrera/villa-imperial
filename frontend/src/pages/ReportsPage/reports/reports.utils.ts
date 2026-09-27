import type {
  EventTypeChartItem,
  ExpenseCategoryChartItem,
  MonthlyChartItem,
  RankingChartItem,
  ReportSummary,
} from "./reports.types";

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function buildReportYears(currentYear: number) {
  return Array.from(
    { length: 6 },
    (_, index) => currentYear - 4 + index,
  ).reverse();
}

export function buildMonthlyData(
  data?: ReportSummary,
): MonthlyChartItem[] {
  return (
    data?.monthly.map((item) => ({
      month: item.label,
      income: Number(item.income),
      expenses: Number(item.expenses),
      profit: Number(item.profit),
      bookings: item.bookings,
    })) ?? []
  );
}

export function buildPackageData(
  data?: ReportSummary,
): RankingChartItem[] {
  return (
    data?.packages.map((item) => ({
      name: item.name,
      bookings: item.bookings,
      value: Number(item.booked_value),
    })) ?? []
  );
}

export function buildExpenseCategoryData(
  data?: ReportSummary,
): ExpenseCategoryChartItem[] {
  return (
    data?.expense_categories.map((item) => ({
      name: item.name,
      total: Number(item.total),
      count: item.count,
    })) ?? []
  );
}

export function buildEventData(
  data?: ReportSummary,
): EventTypeChartItem[] {
  return (
    data?.event_types.map((item) => ({
      name: item.name,
      bookings: item.bookings,
    })) ?? []
  );
}

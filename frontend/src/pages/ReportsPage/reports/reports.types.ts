export interface MonthlyReportItem {
  label: string;
  income: string | number;
  expenses: string | number;
  profit: string | number;
  bookings: number;
}

export interface PackageReportItem {
  name: string;
  bookings: number;
  booked_value: string | number;
}

export interface ExpenseCategoryReportItem {
  name: string;
  total: string | number;
  count: number;
}

export interface EventTypeReportItem {
  name: string;
  bookings: number;
}

export interface BookingStatusReportItem {
  status: string;
  count: number;
}

export interface ReportSummary {
  income_total: string | number;
  expenses_total: string | number;
  profit_total: string | number;
  pending_balance: string | number;
  bookings_total: number;
  booked_value_total: string | number;
  average_booking_value: string | number;
  monthly: MonthlyReportItem[];
  packages: PackageReportItem[];
  expense_categories: ExpenseCategoryReportItem[];
  event_types: EventTypeReportItem[];
  statuses: BookingStatusReportItem[];
}

export interface MonthlyChartItem {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  bookings: number;
}

export interface RankingChartItem {
  name: string;
  bookings: number;
  value: number;
}

export interface ExpenseCategoryChartItem {
  name: string;
  total: number;
  count: number;
}

export interface EventTypeChartItem {
  name: string;
  bookings: number;
}

export interface RankingDisplayItem {
  position: number;
  title: string;
  subtitle: string;
  value: string;
}

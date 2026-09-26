export interface MonthlyReportItem {
  month: number;

  label: string;

  income: string;

  expenses: string;

  profit: string;

  bookings: number;
}

export interface CategoryReportItem {
  name: string;

  total: string;

  count: number;
}

export interface PackageReportItem {
  name: string;

  bookings: number;

  booked_value: string;
}

export interface EventTypeReportItem {
  name: string;

  bookings: number;
}

export interface StatusReportItem {
  status: string;

  count: number;
}

export interface ReportSummary {
  year: number;

  income_total: string;

  expenses_total: string;

  profit_total: string;

  bookings_total: number;

  booked_value_total: string;

  average_booking_value: string;

  pending_balance: string;

  monthly: MonthlyReportItem[];

  expense_categories: CategoryReportItem[];

  packages: PackageReportItem[];

  event_types: EventTypeReportItem[];

  statuses: StatusReportItem[];
}

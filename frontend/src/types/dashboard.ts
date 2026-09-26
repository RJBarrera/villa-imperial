import type { BookingStatus } from "./booking";

export interface DashboardBooking {
  id: string;

  folio: string;

  event_type: string;

  client_name: string;

  package_name: string;

  starts_at: string;

  ends_at: string;

  status: BookingStatus;

  balance: string;
}

export interface DashboardSummary {
  month: string;

  bookings_count: number;

  income_received: string;

  expenses_total: string;

  profit: string;

  pending_balance: string;

  active_clients: number;

  occupied_days: number;

  days_in_month: number;

  occupancy_rate: number;

  upcoming_bookings: DashboardBooking[];
}

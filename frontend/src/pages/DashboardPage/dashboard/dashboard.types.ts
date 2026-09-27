import type { BookingStatus } from "../../../types/booking";

export interface DashboardUpcomingBooking {
  id: string;
  event_type: string;
  starts_at: string;
  status: BookingStatus;
  client_name: string;
  package_name: string;
  balance: string | number;
}

export interface DashboardSummary {
  bookings_count: number;
  occupied_days: number;
  income_received: string | number;
  expenses_total: string | number;
  profit: string | number;
  occupancy_rate: number;
  days_in_month: number;
  pending_balance: string | number;
  active_clients: number;
  upcoming_bookings: DashboardUpcomingBooking[];
}

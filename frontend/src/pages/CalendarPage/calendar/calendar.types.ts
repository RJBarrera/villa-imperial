import type { BookingStatus } from "../../../types/booking";

export interface CalendarBooking {
  id: string;
  starts_at: string;
  event_type: string;
  status: BookingStatus;
}

export interface BookingStatusStyle {
  label: string;
  className: string;
}

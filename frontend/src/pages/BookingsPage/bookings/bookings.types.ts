import type { BookingStatus } from "../../../types/booking";

export interface BookingListItem {
  id: string;
  folio: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  guest_count?: number | null;
  package_name_snapshot: string;
  final_price: string | number;
  total_paid: string | number;
  balance: string | number;
  status: BookingStatus;
  client: {
    full_name: string;
  };
}

export interface BookingStatusView {
  label: string;
  className: string;
}

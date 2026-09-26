export type BookingStatus =
  | "pendiente"
  | "apartado"
  | "confirmado"
  | "liquidado"
  | "concluido"
  | "cancelado"
  | "bloqueado";

export type PaymentMethod = "efectivo" | "transferencia" | "tarjeta" | "otro";

export interface BookingClient {
  id: string;

  full_name: string;

  phone: string;

  email: string | null;
}

export interface BookingPackage {
  id: string;

  code: string;

  name: string;

  base_price: string;

  duration_hours: number;
}

export interface BookingPayment {
  id: string;

  amount: string;

  payment_type: "anticipo" | "abono" | "liquidacion" | "reembolso";

  payment_method: PaymentMethod;

  paid_at: string;

  reference: string | null;

  notes: string | null;
}

export interface Booking {
  id: string;

  folio: string;

  starts_at: string;

  ends_at: string;

  event_type: string;

  guest_count: number | null;

  package_name_snapshot: string;

  agreed_price: string;

  discount: string;

  final_price: string;

  total_paid: string;

  balance: string;

  status: BookingStatus;

  notes: string | null;

  cancellation_reason: string | null;

  cancelled_at: string | null;

  client: BookingClient;

  rental_package: BookingPackage;

  payments: BookingPayment[];

  created_at: string;

  updated_at: string;
}

export interface CreateBookingPayload {
  client_id: string;

  package_id: string;

  event_date: string;

  start_time: string;

  event_type: string;

  guest_count?: number | null;

  discount?: number;

  initial_payment_amount?: number;

  initial_payment_method?: PaymentMethod | null;

  payment_reference?: string | null;

  notes?: string | null;
}

export interface UpdateBookingPayload {
  client_id?: string;

  package_id?: string;

  event_date?: string;

  start_time?: string;

  event_type?: string;

  guest_count?: number | null;

  discount?: number;

  notes?: string | null;
}

export interface AddPaymentPayload {
  amount: number;

  payment_method: PaymentMethod;

  reference?: string | null;

  notes?: string | null;
}

export interface AvailabilityResponse {
  available: boolean;

  starts_at: string;

  ends_at: string;

  conflicting_booking: Booking | null;
}

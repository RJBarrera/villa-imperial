import type { PaymentMethod } from "./booking";

export type PaymentType = "anticipo" | "abono" | "liquidacion" | "reembolso";

export interface PaymentMovement {
  id: string;

  amount: string;

  payment_type: PaymentType;

  payment_method: PaymentMethod;

  paid_at: string;

  reference: string | null;

  notes: string | null;

  booking: {
    id: string;

    folio: string;

    event_type: string;
  };

  client: {
    id: string;

    full_name: string;

    phone: string;
  };
}

import type { PaymentType } from "../../../types/payment";

export interface PaymentListItem {
  id: string;
  amount: string | number;
  payment_type: PaymentType;
  paid_at: string;
  payment_method: string;
  reference?: string | null;
  client: {
    full_name: string;
  };
  booking: {
    event_type: string;
    folio: string;
  };
}

export interface PaymentTypeView {
  label: string;
  className: string;
}

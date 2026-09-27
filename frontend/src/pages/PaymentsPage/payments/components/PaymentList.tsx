import type { PaymentListItem as PaymentItem } from "../payments.types";
import PaymentListItem from "./PaymentListItem";

interface PaymentListProps {
  payments: PaymentItem[];
}

export default function PaymentList({ payments }: PaymentListProps) {
  return (
    <div className="payments-list">
      {payments.map((payment) => (
        <PaymentListItem key={payment.id} payment={payment} />
      ))}
    </div>
  );
}

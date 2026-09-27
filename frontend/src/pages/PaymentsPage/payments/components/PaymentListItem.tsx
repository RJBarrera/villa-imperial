import { Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { PaymentListItem as PaymentItem } from "../payments.types";
import {
  formatCurrency,
  getPaymentTypeView,
} from "../payments.utils";

dayjs.locale("es");

interface PaymentListItemProps {
  payment: PaymentItem;
}

export default function PaymentListItem({
  payment,
}: PaymentListItemProps) {
  const typeView = getPaymentTypeView(payment.payment_type);
  const isRefund = payment.payment_type === "reembolso";

  return (
    <article className="payment-item">
      <div className="payment-item__content">
        <div className="payment-item__title-row">
          <Typography className="payment-item__client">
            {payment.client.full_name}
          </Typography>

          <Chip
            label={typeView.label}
            size="small"
            className={typeView.className}
          />
        </div>

        <Typography className="payment-item__booking">
          {payment.booking.event_type} · {payment.booking.folio}
        </Typography>

        <Typography className="payment-item__meta">
          {dayjs(payment.paid_at).format("DD MMM YYYY · h:mm A")}
          {" · "}
          {payment.payment_method}
          {payment.reference ? ` · ${payment.reference}` : ""}
        </Typography>
      </div>

      <Typography
        className={
          isRefund
            ? "payment-item__amount payment-item__amount--refund"
            : "payment-item__amount payment-item__amount--income"
        }
      >
        {isRefund ? "-" : "+"}
        {formatCurrency(payment.amount)}
      </Typography>
    </article>
  );
}

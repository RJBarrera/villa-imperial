import type { PaymentType } from "../../../types/payment";
import type { PaymentListItem, PaymentTypeView } from "./payments.types";

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function getPaymentTypeView(type: PaymentType): PaymentTypeView {
  switch (type) {
    case "anticipo":
      return {
        label: "Anticipo",
        className: "payment-type payment-type--deposit",
      };
    case "abono":
      return {
        label: "Abono",
        className: "payment-type payment-type--installment",
      };
    case "liquidacion":
      return {
        label: "Liquidación",
        className: "payment-type payment-type--settlement",
      };
    case "reembolso":
      return {
        label: "Reembolso",
        className: "payment-type payment-type--refund",
      };
  }
}

export function calculatePaymentSummary(payments: PaymentListItem[]) {
  return payments.reduce(
    (summary, payment) => {
      const amount = Number(payment.amount);

      if (payment.payment_type === "reembolso") {
        summary.totalReceived -= amount;
        return summary;
      }

      summary.totalReceived += amount;

      if (payment.payment_type === "anticipo") {
        summary.deposits += amount;
      }

      if (payment.payment_type === "abono") {
        summary.installments += amount;
      }

      if (payment.payment_type === "liquidacion") {
        summary.settlements += amount;
      }

      return summary;
    },
    {
      totalReceived: 0,
      deposits: 0,
      installments: 0,
      settlements: 0,
    },
  );
}

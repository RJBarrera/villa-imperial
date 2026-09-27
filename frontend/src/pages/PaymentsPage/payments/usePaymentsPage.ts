import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPayments } from "../../../api/payments";
import type { PaymentListItem } from "./payments.types";
import { calculatePaymentSummary } from "./payments.utils";

export function usePaymentsPage() {
  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery<PaymentListItem[]>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  });

  const summary = useMemo(
    () => calculatePaymentSummary(payments),
    [payments],
  );

  return {
    payments,
    isLoading,
    isError,
    ...summary,
  };
}

import { http } from "./http";

import type { PaymentMovement } from "../types/payment";

interface PaymentFilters {
  date_from?: string;

  date_to?: string;
}

export async function getPayments(
  filters: PaymentFilters = {},
): Promise<PaymentMovement[]> {
  const response = await http.get<PaymentMovement[]>("/payments", {
    params: filters,
  });

  return response.data;
}

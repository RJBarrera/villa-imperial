import { http } from "./http";

import type { DashboardSummary } from "../types/dashboard";

export async function getDashboardSummary(
  month: string,
): Promise<DashboardSummary> {
  const response = await http.get<DashboardSummary>("/dashboard/summary", {
    params: {
      month,
    },
  });

  return response.data;
}

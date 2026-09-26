import { http } from "./http";

import type { ReportSummary } from "../types/report";

export async function getReportSummary(year: number): Promise<ReportSummary> {
  const response = await http.get<ReportSummary>("/reports/summary", {
    params: {
      year,
    },
  });

  return response.data;
}

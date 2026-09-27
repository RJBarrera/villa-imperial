import { Typography } from "@mui/material";
import type { ReportSummary } from "../reports.types";
import { formatCurrency } from "../reports.utils";

interface ReportsMiniStatsProps {
  data: ReportSummary;
}

export default function ReportsMiniStats({
  data,
}: ReportsMiniStatsProps) {
  const stats = [
    {
      label: "Reservaciones",
      value: data.bookings_total.toString(),
    },
    {
      label: "Valor reservado",
      value: formatCurrency(data.booked_value_total),
    },
    {
      label: "Ticket promedio",
      value: formatCurrency(data.average_booking_value),
    },
  ];

  return (
    <section className="reports-mini-stats">
      {stats.map((stat) => (
        <article key={stat.label} className="reports-mini-stat">
          <Typography className="reports-mini-stat__label">
            {stat.label}
          </Typography>
          <Typography className="reports-mini-stat__value">
            {stat.value}
          </Typography>
        </article>
      ))}
    </section>
  );
}

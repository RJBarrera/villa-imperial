import { Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { REPORT_CHART_COLORS } from "../reports.constants";
import type { MonthlyChartItem } from "../reports.types";

interface MonthlyBookingsChartProps {
  data: MonthlyChartItem[];
}

export default function MonthlyBookingsChart({
  data,
}: MonthlyBookingsChartProps) {
  return (
    <article className="reports-panel">
      <Typography className="reports-panel__title">
        Reservaciones
      </Typography>
      <Typography className="reports-panel__subtitle">
        Eventos reservados por mes.
      </Typography>

      <div className="reports-chart reports-chart--large">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" fontSize={10} />
            <YAxis allowDecimals={false} fontSize={10} />
            <Tooltip />
            <Bar
              dataKey="bookings"
              name="Reservaciones"
              fill={REPORT_CHART_COLORS.bookings}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

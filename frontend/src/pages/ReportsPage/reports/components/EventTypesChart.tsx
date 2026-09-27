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
import type { EventTypeChartItem } from "../reports.types";
import EmptyReportMessage from "./EmptyReportMessage";

interface EventTypesChartProps {
  data: EventTypeChartItem[];
}

export default function EventTypesChart({
  data,
}: EventTypesChartProps) {
  const chartHeight = Math.max(240, data.length * 55);

  return (
    <article className="reports-panel">
      <Typography className="reports-panel__title">
        Tipos de evento
      </Typography>
      <Typography className="reports-panel__subtitle">
        Eventos que más se realizan.
      </Typography>

      {data.length === 0 ? (
        <EmptyReportMessage />
      ) : (
        <div
          className="reports-chart reports-chart--events"
          style={{ height: chartHeight }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                left: 20,
                right: 20,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                fontSize={10}
              />
              <Tooltip />
              <Bar
                dataKey="bookings"
                name="Reservaciones"
                fill={REPORT_CHART_COLORS.events}
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

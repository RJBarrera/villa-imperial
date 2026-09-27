import { Typography } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { REPORT_CHART_COLORS } from "../reports.constants";
import type { MonthlyChartItem } from "../reports.types";
import {
  formatCompactCurrency,
  formatCurrency,
} from "../reports.utils";

interface FinancialChartProps {
  data: MonthlyChartItem[];
}

export default function FinancialChart({
  data,
}: FinancialChartProps) {
  return (
    <article className="reports-panel reports-panel--financial">
      <Typography className="reports-panel__title">
        Comportamiento financiero
      </Typography>
      <Typography className="reports-panel__subtitle">
        Ingresos, gastos y utilidad por mes.
      </Typography>

      <div className="reports-chart reports-chart--large">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" fontSize={11} />
            <YAxis fontSize={10} tickFormatter={formatCompactCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Ingresos"
              stroke={REPORT_CHART_COLORS.income}
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Gastos"
              stroke={REPORT_CHART_COLORS.expenses}
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Utilidad"
              stroke={REPORT_CHART_COLORS.profit}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

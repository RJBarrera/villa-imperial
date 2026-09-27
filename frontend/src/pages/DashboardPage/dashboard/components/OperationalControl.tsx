import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { LinearProgress, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { DashboardSummary } from "../dashboard.types";
import { formatCurrency } from "../dashboard.utils";

interface OperationalControlProps {
  data: DashboardSummary;
}

export default function OperationalControl({
  data,
}: OperationalControlProps) {
  return (
    <section className="dashboard-panel dashboard-panel--operations">
      <Typography className="dashboard-panel__title">
        Control operativo
      </Typography>
      <Typography className="dashboard-panel__subtitle">
        Estado general del negocio.
      </Typography>

      <div className="operations-occupancy">
        <Typography className="operations-occupancy__value">
          {data.occupancy_rate}%
        </Typography>
        <Typography className="operations-occupancy__label">
          Ocupación del mes
        </Typography>

        <LinearProgress
          variant="determinate"
          value={Math.min(data.occupancy_rate, 100)}
          className="operations-occupancy__progress"
        />

        <Typography className="operations-occupancy__days">
          {data.occupied_days} de {data.days_in_month} días
        </Typography>
      </div>

      <div className="operations-summary">
        <SummaryRow
          icon={<AccountBalanceWalletOutlined />}
          label="Saldo por cobrar"
          value={formatCurrency(data.pending_balance)}
        />
        <SummaryRow
          icon={<GroupsOutlined />}
          label="Clientes activos"
          value={data.active_clients.toString()}
        />
        <SummaryRow
          icon={<ReceiptLongOutlined />}
          label="Gastos del mes"
          value={formatCurrency(data.expenses_total)}
        />
      </div>
    </section>
  );
}

interface SummaryRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  return (
    <div className="summary-row">
      <div className="summary-row__icon">{icon}</div>

      <div className="summary-row__content">
        <Typography className="summary-row__label">
          {label}
        </Typography>
        <Typography className="summary-row__value">
          {value}
        </Typography>
      </div>
    </div>
  );
}

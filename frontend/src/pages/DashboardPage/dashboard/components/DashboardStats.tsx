import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import StatCard from "../../../../components/common/StatCard";
import type { DashboardSummary } from "../dashboard.types";
import { formatCurrency } from "../dashboard.utils";

interface DashboardStatsProps {
  data: DashboardSummary;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <section className="dashboard-stats">
      <StatCard
        title="Reservaciones del mes"
        value={data.bookings_count.toString()}
        subtitle={`${data.occupied_days} días ocupados`}
        icon={<EventAvailableOutlined />}
        iconBackground="#E8F1FF"
        iconColor="#377DFF"
      />

      <StatCard
        title="Ingresos recibidos"
        value={formatCurrency(data.income_received)}
        subtitle="Pagos recibidos en el mes"
        icon={<PaidOutlined />}
        iconBackground="#E9F8F1"
        iconColor="#17875D"
      />

      <StatCard
        title="Gastos del mes"
        value={formatCurrency(data.expenses_total)}
        subtitle="Egresos registrados"
        icon={<ReceiptLongOutlined />}
        iconBackground="#FDECEC"
        iconColor="#D64545"
      />

      <StatCard
        title="Utilidad del mes"
        value={formatCurrency(data.profit)}
        subtitle="Ingresos menos gastos"
        icon={<AccountBalanceWalletOutlined />}
        iconBackground="#F2ECFF"
        iconColor="#8155C7"
      />
    </section>
  );
}

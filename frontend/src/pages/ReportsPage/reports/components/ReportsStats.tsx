import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
import StatCard from "../../../../components/common/StatCard";
import type { ReportSummary } from "../reports.types";
import { formatCurrency } from "../reports.utils";

interface ReportsStatsProps {
  data: ReportSummary;
  selectedYear: number;
}

export default function ReportsStats({
  data,
  selectedYear,
}: ReportsStatsProps) {
  return (
    <section className="reports-stats">
      <StatCard
        title="Ingresos"
        value={formatCurrency(data.income_total)}
        subtitle={`Recibidos durante ${selectedYear}`}
        icon={<PaidOutlined />}
        iconBackground="#E9F8F1"
        iconColor="#17875D"
      />

      <StatCard
        title="Gastos"
        value={formatCurrency(data.expenses_total)}
        subtitle="Egresos registrados"
        icon={<ReceiptLongOutlined />}
        iconBackground="#FDECEC"
        iconColor="#D64545"
      />

      <StatCard
        title="Utilidad"
        value={formatCurrency(data.profit_total)}
        subtitle="Ingresos menos gastos"
        icon={<SavingsOutlined />}
        iconBackground="#E8F1FF"
        iconColor="#377DFF"
      />

      <StatCard
        title="Por cobrar"
        value={formatCurrency(data.pending_balance)}
        subtitle="Saldo de reservaciones"
        icon={<AccountBalanceWalletOutlined />}
        iconBackground="#FFF5E7"
        iconColor="#E69B32"
      />
    </section>
  );
}

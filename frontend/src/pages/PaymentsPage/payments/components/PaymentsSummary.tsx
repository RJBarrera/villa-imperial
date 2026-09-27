import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import StatCard from "../../../../components/common/StatCard";
import { formatCurrency } from "../payments.utils";

interface PaymentsSummaryProps {
  totalReceived: number;
  deposits: number;
  installments: number;
  settlements: number;
  movements: number;
}

export default function PaymentsSummary({
  totalReceived,
  deposits,
  installments,
  settlements,
  movements,
}: PaymentsSummaryProps) {
  return (
    <section className="payments-summary">
      <StatCard
        title="Total recibido"
        value={formatCurrency(totalReceived)}
        subtitle={`${movements} movimientos`}
        icon={<PaidOutlined />}
        iconBackground="#E9F8F1"
        iconColor="#17875D"
      />

      <StatCard
        title="Anticipos"
        value={formatCurrency(deposits)}
        subtitle="Pagos iniciales"
        icon={<AccountBalanceWalletOutlined />}
        iconBackground="#FFF5E7"
        iconColor="#E69B32"
      />

      <StatCard
        title="Abonos"
        value={formatCurrency(installments)}
        subtitle="Pagos parciales"
        icon={<AttachMoneyOutlined />}
        iconBackground="#E8F1FF"
        iconColor="#377DFF"
      />

      <StatCard
        title="Liquidaciones"
        value={formatCurrency(settlements)}
        subtitle="Pagos finales"
        icon={<ReceiptLongOutlined />}
        iconBackground="#F2ECFF"
        iconColor="#8155C7"
      />
    </section>
  );
}

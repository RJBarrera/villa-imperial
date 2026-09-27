import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { Typography } from "@mui/material";
import { formatCurrency } from "../expenses.utils";

interface ExpensesSummaryProps {
  total: number;
  movements: number;
}

export default function ExpensesSummary({
  total,
  movements,
}: ExpensesSummaryProps) {
  return (
    <section className="expenses-summary">
      <SummaryCard
        label="Gastos del mes"
        value={formatCurrency(total)}
        icon={<AccountBalanceWalletOutlined />}
        iconClassName="expenses-summary__icon--expense"
      />

      <SummaryCard
        label="Movimientos"
        value={movements.toString()}
        icon={<ReceiptLongOutlined />}
        iconClassName="expenses-summary__icon--movements"
      />
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
}

function SummaryCard({
  label,
  value,
  icon,
  iconClassName,
}: SummaryCardProps) {
  return (
    <article className="expenses-summary__card">
      <div>
        <Typography className="expenses-summary__label">
          {label}
        </Typography>
        <Typography className="expenses-summary__value">
          {value}
        </Typography>
      </div>

      <div className={`expenses-summary__icon ${iconClassName}`}>
        {icon}
      </div>
    </article>
  );
}

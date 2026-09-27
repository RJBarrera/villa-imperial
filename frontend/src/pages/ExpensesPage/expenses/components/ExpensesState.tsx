import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { CircularProgress, Typography } from "@mui/material";

interface ExpensesStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export default function ExpensesState({
  isLoading,
  isError,
  isEmpty,
}: ExpensesStateProps) {
  if (isLoading) {
    return (
      <div className="expenses-state expenses-state--loading">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="expenses-state expenses-state--error">
        <Typography className="expenses-state__error">
          No fue posible consultar los gastos.
        </Typography>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="expenses-state expenses-state--empty">
        <ReceiptLongOutlined className="expenses-state__icon" />
        <Typography className="expenses-state__title">
          Sin gastos registrados
        </Typography>
        <Typography className="expenses-state__description">
          Los gastos del mes aparecerán aquí.
        </Typography>
      </div>
    );
  }

  return null;
}

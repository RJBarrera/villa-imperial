import PaidOutlined from "@mui/icons-material/PaidOutlined";
import { CircularProgress, Typography } from "@mui/material";

interface PaymentsStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export default function PaymentsState({
  isLoading,
  isError,
  isEmpty,
}: PaymentsStateProps) {
  if (isLoading) {
    return (
      <div className="payments-state payments-state--loading">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="payments-state payments-state--error">
        <Typography className="payments-state__error">
          No fue posible consultar los pagos.
        </Typography>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="payments-state payments-state--empty">
        <PaidOutlined className="payments-state__icon" />
        <Typography className="payments-state__title">
          Sin movimientos
        </Typography>
        <Typography className="payments-state__description">
          Los pagos de las reservaciones aparecerán aquí.
        </Typography>
      </div>
    );
  }

  return null;
}

import { Typography } from "@mui/material";

export default function PaymentsHeader() {
  return (
    <header className="payments-header">
      <Typography component="h1" className="payments-header__title">
        Pagos
      </Typography>
      <Typography className="payments-header__subtitle">
        Consulta anticipos, abonos y liquidaciones de Villa Imperial.
      </Typography>
    </header>
  );
}

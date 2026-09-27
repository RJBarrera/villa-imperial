import { CircularProgress, Typography } from "@mui/material";

interface ReportsStateProps {
  isLoading: boolean;
  isError: boolean;
}

export default function ReportsState({
  isLoading,
  isError,
}: ReportsStateProps) {
  if (isLoading) {
    return (
      <section className="reports-state reports-state--loading">
        <CircularProgress />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="reports-state reports-state--error">
        <Typography className="reports-state__error">
          No fue posible cargar los reportes.
        </Typography>
      </section>
    );
  }

  return null;
}

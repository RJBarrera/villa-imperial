import { CircularProgress, Typography } from "@mui/material";

interface DashboardStateProps {
  isLoading: boolean;
  isError: boolean;
}

export default function DashboardState({
  isLoading,
  isError,
}: DashboardStateProps) {
  if (isLoading) {
    return (
      <section className="dashboard-state dashboard-state--loading">
        <CircularProgress />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="dashboard-state dashboard-state--error">
        <Typography className="dashboard-state__error-title">
          No fue posible cargar el Dashboard.
        </Typography>
        <Typography className="dashboard-state__description">
          Verifica que FastAPI y PostgreSQL estén disponibles.
        </Typography>
      </section>
    );
  }

  return null;
}

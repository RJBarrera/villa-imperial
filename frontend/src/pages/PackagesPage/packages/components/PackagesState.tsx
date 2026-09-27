import { CircularProgress, Typography } from "@mui/material";

interface PackagesStateProps {
  isLoading: boolean;
  isError: boolean;
}

export default function PackagesState({
  isLoading,
  isError,
}: PackagesStateProps) {
  if (isLoading) {
    return (
      <section className="packages-state packages-state--loading">
        <CircularProgress />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="packages-state packages-state--error">
        <Typography className="packages-state__error-title">
          No fue posible consultar los paquetes.
        </Typography>
        <Typography className="packages-state__description">
          Verifica que el backend se encuentre ejecutándose.
        </Typography>
      </section>
    );
  }

  return null;
}

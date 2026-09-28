import {
  CircularProgress,
  Typography,
} from "@mui/material";

interface PackagesStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
}

export default function PackagesState({
  isLoading,
  isError,
  isEmpty = false,
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

  if (isEmpty) {
    return (
      <section className="packages-state packages-state--empty">
        <Typography className="packages-state__empty-title">
          No hay paquetes registrados.
        </Typography>

        <Typography className="packages-state__description">
          Utiliza “Nuevo paquete” para crear el primero.
        </Typography>
      </section>
    );
  }

  return null;
}

import { Alert, CircularProgress } from "@mui/material";

interface SettingsStateProps {
  isLoading: boolean;
  isError: boolean;
}

export default function SettingsState({
  isLoading,
  isError,
}: SettingsStateProps) {
  if (isLoading) {
    return (
      <section className="settings-state settings-state--loading">
        <CircularProgress />
      </section>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        No fue posible consultar la configuración.
      </Alert>
    );
  }

  return null;
}

import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import { CircularProgress, Typography } from "@mui/material";

interface ClientsStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export default function ClientsState({
  isLoading,
  isError,
  isEmpty,
}: ClientsStateProps) {
  if (isLoading) {
    return (
      <div className="clients-state clients-state--loading">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="clients-state clients-state--error">
        <Typography className="clients-state__error">
          No fue posible cargar los clientes.
        </Typography>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="clients-state clients-state--empty">
        <GroupsOutlined className="clients-state__icon" />
        <Typography className="clients-state__title">
          No hay clientes
        </Typography>
        <Typography className="clients-state__description">
          Registra tu primer cliente para comenzar.
        </Typography>
      </div>
    );
  }

  return null;
}

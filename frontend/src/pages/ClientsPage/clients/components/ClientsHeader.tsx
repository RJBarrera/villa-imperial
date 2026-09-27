import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Typography } from "@mui/material";

interface ClientsHeaderProps {
  onCreate: () => void;
}

export default function ClientsHeader({ onCreate }: ClientsHeaderProps) {
  return (
    <header className="clients-header">
      <div className="clients-header__content">
        <Typography component="h1" className="clients-header__title">
          Clientes
        </Typography>
        <Typography className="clients-header__subtitle">
          Consulta y administra los clientes de Villa Imperial.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        onClick={onCreate}
        className="clients-header__button"
      >
        Nuevo cliente
      </Button>
    </header>
  );
}

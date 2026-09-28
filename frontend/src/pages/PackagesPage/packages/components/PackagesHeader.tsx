import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Typography } from "@mui/material";

interface PackagesHeaderProps {
  onCreate: () => void;
}

export default function PackagesHeader({
  onCreate,
}: PackagesHeaderProps) {
  return (
    <header className="packages-header">
      <div className="packages-header__content">
        <Typography component="h1" className="packages-header__title">
          Paquetes
        </Typography>

        <Typography className="packages-header__subtitle">
          Administra precios, promociones, duración y servicios incluidos.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        className="packages-header__button"
        onClick={onCreate}
      >
        Nuevo paquete
      </Button>
    </header>
  );
}

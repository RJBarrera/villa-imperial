import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Typography } from "@mui/material";

export default function PackagesHeader() {
  return (
    <header className="packages-header">
      <div className="packages-header__content">
        <Typography component="h1" className="packages-header__title">
          Paquetes
        </Typography>
        <Typography className="packages-header__subtitle">
          Administra precios, duración y servicios incluidos en cada renta.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        className="packages-header__button"
      >
        Nuevo paquete
      </Button>
    </header>
  );
}

import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Typography } from "@mui/material";

interface BookingsHeaderProps {
  onCreate: () => void;
}

export default function BookingsHeader({ onCreate }: BookingsHeaderProps) {
  return (
    <header className="bookings-header">
      <div className="bookings-header__content">
        <Typography component="h1" className="bookings-header__title">
          Reservaciones
        </Typography>
        <Typography className="bookings-header__subtitle">
          Administra los eventos programados de Villa Imperial.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        onClick={onCreate}
        className="bookings-header__button"
      >
        Nueva reservación
      </Button>
    </header>
  );
}

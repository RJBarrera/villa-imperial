import AddOutlined from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import { Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";

interface BookingsStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onCreate: () => void;
}

export default function BookingsState({
  isLoading,
  isError,
  isEmpty,
  onCreate,
}: BookingsStateProps) {
  if (isLoading) {
    return (
      <Card className="bookings-state-card">
        <CardContent className="bookings-state bookings-state--loading">
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bookings-state-card">
        <CardContent className="bookings-state bookings-state--error">
          <Typography className="bookings-state__error-title">
            No fue posible cargar las reservaciones.
          </Typography>
          <Typography className="bookings-state__description">
            Verifica que el backend se encuentre ejecutándose.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="bookings-state-card">
        <CardContent className="bookings-state bookings-state--empty">
          <CalendarMonthOutlined className="bookings-state__icon" />
          <Typography className="bookings-state__title">
            No hay reservaciones
          </Typography>
          <Typography className="bookings-state__description">
            Registra tu primera reservación para comenzar.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={onCreate}
            className="bookings-state__button"
          >
            Crear reservación
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}

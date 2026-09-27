import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Typography } from "@mui/material";

interface CalendarHeaderProps {
  onCreateToday: () => void;
}

export default function CalendarHeader({ onCreateToday }: CalendarHeaderProps) {
  return (
    <header className="calendar-header">
      <div>
        <Typography component="h1" className="calendar-header__title">
          Calendario
        </Typography>
        <Typography className="calendar-header__subtitle">
          Consulta disponibilidad y eventos programados.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddOutlined />}
        onClick={onCreateToday}
        className="calendar-header__button"
      >
        Nueva reservación
      </Button>
    </header>
  );
}

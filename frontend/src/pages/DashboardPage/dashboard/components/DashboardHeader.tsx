import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, TextField, Typography } from "@mui/material";

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  onCreateBooking: () => void;
}

export default function DashboardHeader({
  selectedMonth,
  onMonthChange,
  onCreateBooking,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__content">
        <Typography component="h1" className="dashboard-header__title">
          Panel principal
        </Typography>
        <Typography className="dashboard-header__subtitle">
          Resumen financiero y operativo de Villa Imperial.
        </Typography>
      </div>

      <div className="dashboard-header__actions">
        <TextField
          type="month"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="dashboard-header__month"
        />

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={onCreateBooking}
          className="dashboard-header__button"
        >
          Nueva reservación
        </Button>
      </div>
    </header>
  );
}

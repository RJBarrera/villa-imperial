import { MenuItem, TextField, Typography } from "@mui/material";

interface ReportsHeaderProps {
  selectedYear: number;
  years: number[];
  onYearChange: (year: number) => void;
}

export default function ReportsHeader({
  selectedYear,
  years,
  onYearChange,
}: ReportsHeaderProps) {
  return (
    <header className="reports-header">
      <div className="reports-header__content">
        <Typography component="h1" className="reports-header__title">
          Reportes
        </Typography>
        <Typography className="reports-header__subtitle">
          Analiza ingresos, gastos, rentabilidad y comportamiento de las reservaciones.
        </Typography>
      </div>

      <TextField
        select
        label="Año"
        value={selectedYear}
        onChange={(event) => onYearChange(Number(event.target.value))}
        className="reports-header__year"
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
    </header>
  );
}

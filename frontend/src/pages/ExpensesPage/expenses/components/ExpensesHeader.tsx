import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, TextField, Typography } from "@mui/material";

interface ExpensesHeaderProps {
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  onCreate: () => void;
}

export default function ExpensesHeader({
  selectedMonth,
  onMonthChange,
  onCreate,
}: ExpensesHeaderProps) {
  return (
    <header className="expenses-header">
      <div className="expenses-header__content">
        <Typography component="h1" className="expenses-header__title">
          Gastos
        </Typography>
        <Typography className="expenses-header__subtitle">
          Registra y controla los egresos de Villa Imperial.
        </Typography>
      </div>

      <div className="expenses-header__actions">
        <TextField
          type="month"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="expenses-header__month"
        />

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={onCreate}
          className="expenses-header__button"
        >
          Registrar gasto
        </Button>
      </div>
    </header>
  );
}

import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

interface BookingsSearchProps {
  search: string;
  date: string;
  total: number;
  matched: number;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClear: () => void;
}

export default function BookingsSearch({
  search,
  date,
  total,
  matched,
  onSearchChange,
  onDateChange,
  onClear,
}: BookingsSearchProps) {
  const hasFilters = Boolean(search.trim() || date);
  const formattedDate = date
    ? date.split("-").reverse().join("/")
    : "Seleccionar fecha";

  return (
    <section className="bookings-search" aria-label="Buscar reservaciones">
      <div className="bookings-search__fields">
        <TextField
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cliente, evento, fecha, folio, paquete o estado..."
          aria-label="Buscar reservaciones"
          size="small"
          fullWidth
          className="bookings-search__input"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <CloseOutlined fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />

        <div className="bookings-search__date-field">
          <label
            htmlFor="bookings-search-date"
            className="bookings-search__date-label"
          >
            Fecha exacta
          </label>

          <div className="bookings-search__date-control">
            <TextField
              id="bookings-search-date"
              label="Fecha exacta"
              type="date"
              size="small"
              value={date}
              onChange={(event) => onDateChange(event.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { "aria-label": "Filtrar por fecha exacta" },
              }}
              className="bookings-search__date"
            />

            <div className="bookings-search__date-display" aria-hidden="true">
              <span>{formattedDate}</span>
              <CalendarMonthOutlined fontSize="small" />
            </div>
          </div>
        </div>
      </div>

      <div className="bookings-search__footer">
        <Typography
          component="p"
          className="bookings-search__count"
          aria-live="polite"
        >
          {hasFilters
            ? `${matched} de ${total} reservaciones`
            : `${total} ${total === 1 ? "reservación" : "reservaciones"}`}
        </Typography>

        {hasFilters && (
          <button
            type="button"
            className="bookings-search__clear"
            onClick={onClear}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}

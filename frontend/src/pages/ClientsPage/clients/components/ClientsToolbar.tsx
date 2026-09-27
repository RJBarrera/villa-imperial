import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { InputAdornment, TextField, Typography } from "@mui/material";

interface ClientsToolbarProps {
  search: string;
  total: number;
  onSearchChange: (value: string) => void;
}

export default function ClientsToolbar({
  search,
  total,
  onSearchChange,
}: ClientsToolbarProps) {
  return (
    <div className="clients-toolbar">
      <TextField
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre, teléfono o correo..."
        className="clients-toolbar__search"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Typography className="clients-toolbar__count">
        {total} {total === 1 ? "cliente" : "clientes"}
      </Typography>
    </div>
  );
}

import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { Typography } from "@mui/material";

export default function SettingsHeader() {
  return (
    <header className="settings-header">
      <div className="settings-header__icon">
        <SettingsOutlined />
      </div>

      <div>
        <Typography component="h1" className="settings-header__title">
          Configuración
        </Typography>
        <Typography className="settings-header__subtitle">
          Información general de Villa Imperial.
        </Typography>
      </div>
    </header>
  );
}

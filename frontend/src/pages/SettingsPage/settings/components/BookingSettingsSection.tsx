import { MenuItem, TextField, Typography } from "@mui/material";
import { TIMEZONE_OPTIONS } from "../settings.constants";
import type {
  SettingsFormField,
  SettingsFormState,
} from "../settings.types";

interface BookingSettingsSectionProps {
  form: SettingsFormState;
  onChange: (field: SettingsFormField, value: string) => void;
}

export default function BookingSettingsSection({
  form,
  onChange,
}: BookingSettingsSectionProps) {
  return (
    <section className="settings-section">
      <Typography className="settings-section__title">
        Reservaciones
      </Typography>

      <div className="settings-grid">
        <TextField
          select
          label="Zona horaria"
          value={form.timezone}
          onChange={(event) =>
            onChange("timezone", event.target.value)
          }
        >
          {TIMEZONE_OPTIONS.map((timezone) => (
            <MenuItem
              key={timezone.value}
              value={timezone.value}
            >
              {timezone.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Anticipo mínimo"
          type="number"
          value={form.minimum_deposit}
          onChange={(event) =>
            onChange("minimum_deposit", event.target.value)
          }
        />
      </div>
    </section>
  );
}

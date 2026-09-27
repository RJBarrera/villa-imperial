import { TextField, Typography } from "@mui/material";
import type {
  SettingsFormField,
  SettingsFormState,
} from "../settings.types";

interface BusinessSettingsSectionProps {
  form: SettingsFormState;
  onChange: (field: SettingsFormField, value: string) => void;
}

export default function BusinessSettingsSection({
  form,
  onChange,
}: BusinessSettingsSectionProps) {
  return (
    <section className="settings-section">
      <Typography className="settings-section__title">
        Información del negocio
      </Typography>

      <div className="settings-grid">
        <TextField
          label="Nombre del negocio"
          value={form.business_name}
          onChange={(event) =>
            onChange("business_name", event.target.value)
          }
          required
        />

        <TextField
          label="Teléfono"
          value={form.phone}
          onChange={(event) =>
            onChange("phone", event.target.value)
          }
        />

        <TextField
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(event) =>
            onChange("whatsapp", event.target.value)
          }
        />

        <TextField
          label="Correo"
          type="email"
          value={form.email}
          onChange={(event) =>
            onChange("email", event.target.value)
          }
        />

        <TextField
          label="Dirección"
          value={form.address}
          onChange={(event) =>
            onChange("address", event.target.value)
          }
          className="settings-grid__full"
        />

        <TextField
          label="Ciudad"
          value={form.city}
          onChange={(event) =>
            onChange("city", event.target.value)
          }
        />

        <TextField
          label="Estado"
          value={form.state}
          onChange={(event) =>
            onChange("state", event.target.value)
          }
        />
      </div>
    </section>
  );
}

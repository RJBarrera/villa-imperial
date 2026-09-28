import { TextField, Typography } from "@mui/material";
import type {
  SettingsFormField,
  SettingsFormState,
} from "../settings.types";

interface ReceiptSettingsSectionProps {
  form: SettingsFormState;
  onChange: (field: SettingsFormField, value: string) => void;
}

export default function ReceiptSettingsSection({
  form,
  onChange,
}: ReceiptSettingsSectionProps) {
  return (
    <section className="settings-section">
      <Typography className="settings-section__title">
        Comprobantes
      </Typography>

      <div className="settings-receipt-fields">
        {/* <TextField
          label="URL del logo"
          value={form.logo_url}
          onChange={(event) =>
            onChange("logo_url", event.target.value)
          }
          fullWidth
        /> */}

        <TextField
          label="Texto al pie del comprobante"
          value={form.receipt_footer}
          onChange={(event) =>
            onChange("receipt_footer", event.target.value)
          }
          multiline
          minRows={3}
          fullWidth
        />
      </div>
    </section>
  );
}

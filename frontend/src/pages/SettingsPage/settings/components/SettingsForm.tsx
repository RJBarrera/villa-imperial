import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { Alert, Button } from "@mui/material";
import type {
  SettingsFormField,
  SettingsFormState,
} from "../settings.types";
import BusinessSettingsSection from "./BusinessSettingsSection";
import BookingSettingsSection from "./BookingSettingsSection";
import ReceiptSettingsSection from "./ReceiptSettingsSection";

interface SettingsFormProps {
  form: SettingsFormState;
  isSaving: boolean;
  isSuccess: boolean;
  isSaveError: boolean;
  canSave: boolean;
  onChange: (field: SettingsFormField, value: string) => void;
  onSave: () => void;
}

export default function SettingsForm({
  form,
  isSaving,
  isSuccess,
  isSaveError,
  canSave,
  onChange,
  onSave,
}: SettingsFormProps) {
  return (
    <section className="settings-card">
      <div className="settings-form">
        {isSuccess && (
          <Alert severity="success">
            Configuración actualizada correctamente.
          </Alert>
        )}

        {isSaveError && (
          <Alert severity="error">
            No fue posible guardar la configuración.
          </Alert>
        )}

        <BusinessSettingsSection
          form={form}
          onChange={onChange}
        />

        <BookingSettingsSection
          form={form}
          onChange={onChange}
        />

        <ReceiptSettingsSection
          form={form}
          onChange={onChange}
        />

        <div className="settings-form__actions">
          <Button
            variant="contained"
            startIcon={<SaveOutlined />}
            onClick={onSave}
            disabled={isSaving || !canSave}
          >
            {isSaving
              ? "Guardando..."
              : "Guardar configuración"}
          </Button>
        </div>
      </div>
    </section>
  );
}

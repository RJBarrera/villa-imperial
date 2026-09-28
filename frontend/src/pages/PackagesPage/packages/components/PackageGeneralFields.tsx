import {
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type {
  PackageFormMode,
  PackageFormState,
} from "../packages.types";

interface PackageGeneralFieldsProps {
  mode: PackageFormMode;
  state: PackageFormState;
  onChange: <K extends keyof PackageFormState>(
    field: K,
    value: PackageFormState[K],
  ) => void;
}

export default function PackageGeneralFields({
  mode,
  state,
  onChange,
}: PackageGeneralFieldsProps) {
  return (
    <section className="package-form-section">
      <div className="package-form-section__heading">
        <Typography className="package-form-section__title">
          Información general
        </Typography>
        <Typography className="package-form-section__description">
          Datos principales utilizados para identificar y mostrar el paquete.
        </Typography>
      </div>

      <div className="package-form-grid package-form-grid--general">
        <TextField
          fullWidth
          label="Código"
          value={state.code}
          onChange={(event) => onChange("code", event.target.value)}
          placeholder="PKG-004"
        />

        <TextField
          fullWidth
          label="Nombre"
          value={state.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Nombre del paquete"
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Descripción"
          value={state.description}
          onChange={(event) =>
            onChange("description", event.target.value)
          }
          className="package-form-grid__full"
        />

        <TextField
          fullWidth
          label="Precio base"
          type="number"
          value={state.base_price}
          onChange={(event) =>
            onChange("base_price", event.target.value)
          }
          slotProps={{
            htmlInput: {
              min: 0,
              step: "0.01",
            },
          }}
        />

        <TextField
          fullWidth
          label="Duración"
          type="number"
          value={state.duration_hours}
          onChange={(event) =>
            onChange("duration_hours", event.target.value)
          }
          helperText="Horas de renta"
          slotProps={{
            htmlInput: {
              min: 1,
              max: 24,
            },
          }}
        />

        {mode === "edit" && (
          <div className="package-form-grid__full">
            <FormControlLabel
              control={
                <Switch
                  checked={state.is_active}
                  onChange={(event) =>
                    onChange("is_active", event.target.checked)
                  }
                />
              }
              label="Paquete activo"
            />
          </div>
        )}
      </div>
    </section>
  );
}

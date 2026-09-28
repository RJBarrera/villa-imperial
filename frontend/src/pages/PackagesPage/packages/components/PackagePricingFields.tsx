import {
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { PACKAGE_DAYS } from "../packages.constants";

interface PackagePricingFieldsProps {
  enabled: boolean;
  dayPrices: Record<number, string>;
  onEnabledChange: (enabled: boolean) => void;
  onPriceChange: (dayOfWeek: number, value: string) => void;
}

export default function PackagePricingFields({
  enabled,
  dayPrices,
  onEnabledChange,
  onPriceChange,
}: PackagePricingFieldsProps) {
  return (
    <section className="package-form-section">
      <div className="package-form-section__heading package-form-section__heading--inline">
        <div>
          <Typography className="package-form-section__title">
            Precios según el día
          </Typography>
          <Typography className="package-form-section__description">
            Los días sin precio específico utilizarán el precio base.
          </Typography>
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(event) =>
                onEnabledChange(event.target.checked)
              }
            />
          }
          label="Configurar"
        />
      </div>

      {enabled && (
        <div className="package-form-grid package-form-grid--days">
          {PACKAGE_DAYS.map((day) => (
            <TextField
              key={day.value}
              fullWidth
              label={day.label}
              type="number"
              value={dayPrices[day.value] ?? ""}
              onChange={(event) =>
                onPriceChange(day.value, event.target.value)
              }
              placeholder="Usar precio base"
              slotProps={{
                htmlInput: {
                min: 0,
                step: "0.01",
                },
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

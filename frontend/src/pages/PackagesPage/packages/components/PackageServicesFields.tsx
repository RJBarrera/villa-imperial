import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import type { PackageService } from "../packages.types";

interface PackageServicesFieldsProps {
  services: PackageService[];
  selectedIds: string[];
  isLoading: boolean;
  isError: boolean;
  onChange: (serviceIds: string[]) => void;
}

export default function PackageServicesFields({
  services,
  selectedIds,
  isLoading,
  isError,
  onChange,
}: PackageServicesFieldsProps) {
  function toggleService(serviceId: string, checked: boolean) {
    if (checked) {
      onChange([...selectedIds, serviceId]);
      return;
    }

    onChange(selectedIds.filter((id) => id !== serviceId));
  }

  return (
    <section className="package-form-section">
      <div className="package-form-section__heading">
        <Typography className="package-form-section__title">
          Servicios incluidos
        </Typography>
        <Typography className="package-form-section__description">
          Selecciona lo que incluye la renta de este paquete.
        </Typography>
      </div>

      {isLoading && (
        <Typography className="package-form-section__muted">
          Consultando servicios...
        </Typography>
      )}

      {isError && (
        <Typography className="package-form-section__error">
          No fue posible consultar los servicios.
        </Typography>
      )}

      {!isLoading && !isError && (
        <FormGroup className="package-services-grid">
          {services.map((service) => (
            <FormControlLabel
              key={service.id}
              control={
                <Checkbox
                  checked={selectedIds.includes(service.id)}
                  onChange={(event) =>
                    toggleService(service.id, event.target.checked)
                  }
                />
              }
              label={service.name}
            />
          ))}
        </FormGroup>
      )}
    </section>
  );
}

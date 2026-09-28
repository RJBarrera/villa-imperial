import { useEffect, useState } from "react";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import type {
  PackageFormMode,
  PackageFormState,
  PackageFormSubmitData,
  PackageService,
  RentalPackageListItem,
} from "../packages.types";
import {
  buildPackageSubmitData,
  createEmptyPackageFormState,
  createPackageFormState,
  validatePackageForm,
} from "../packages.utils";
import PackageGeneralFields from "./PackageGeneralFields";
import PackagePricingFields from "./PackagePricingFields";
import PackagePromotionFields from "./PackagePromotionFields";
import PackageServicesFields from "./PackageServicesFields";

interface PackageFormDialogProps {
  open: boolean;
  mode: PackageFormMode;
  rentalPackage: RentalPackageListItem | null;
  services: PackageService[];
  servicesLoading: boolean;
  servicesError: boolean;
  isSaving: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (data: PackageFormSubmitData) => Promise<void>;
}

export default function PackageFormDialog({
  open,
  mode,
  rentalPackage,
  services,
  servicesLoading,
  servicesError,
  isSaving,
  serverError,
  onClose,
  onSubmit,
}: PackageFormDialogProps) {
  const [state, setState] = useState<PackageFormState>(
    createEmptyPackageFormState,
  );
  const [validationError, setValidationError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValidationError(null);

    if (mode === "edit" && rentalPackage) {
      setState(createPackageFormState(rentalPackage));
      return;
    }

    setState(createEmptyPackageFormState());
  }, [open, mode, rentalPackage]);

  function changeField<K extends keyof PackageFormState>(
    field: K,
    value: PackageFormState[K],
  ) {
    setState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function changeDayPrice(dayOfWeek: number, value: string) {
    setState((current) => ({
      ...current,
      day_prices: {
        ...current.day_prices,
        [dayOfWeek]: value,
      },
    }));
  }

  async function handleSubmit() {
    const error = validatePackageForm(state);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    await onSubmit(buildPackageSubmitData(state));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle className="package-form-dialog__title">
        <div>
          <Typography
            component="h2"
            className="package-form-dialog__heading"
          >
            {mode === "create"
              ? "Nuevo paquete"
              : "Editar paquete"}
          </Typography>

          <Typography className="package-form-dialog__subtitle">
            Configura información, precios, servicios y promociones.
          </Typography>
        </div>

        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          disabled={isSaving}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="package-form-dialog__content">
        {(validationError || serverError) && (
          <Alert severity="error">
            {validationError ?? serverError}
          </Alert>
        )}

        <PackageGeneralFields
          mode={mode}
          state={state}
          onChange={changeField}
        />

        <PackageServicesFields
          services={services}
          selectedIds={state.service_ids}
          isLoading={servicesLoading}
          isError={servicesError}
          onChange={(serviceIds) =>
            changeField("service_ids", serviceIds)
          }
        />

        <PackagePricingFields
          enabled={state.use_day_prices}
          dayPrices={state.day_prices}
          onEnabledChange={(enabled) =>
            changeField("use_day_prices", enabled)
          }
          onPriceChange={changeDayPrice}
        />

        <PackagePromotionFields
          promotions={state.promotions}
          onChange={(promotions) =>
            changeField("promotions", promotions)
          }
        />
      </DialogContent>

      <DialogActions className="package-form-dialog__actions">
        <Button
          onClick={onClose}
          disabled={isSaving}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSaving || servicesLoading}
        >
          {isSaving
            ? "Guardando..."
            : mode === "create"
              ? "Crear paquete"
              : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

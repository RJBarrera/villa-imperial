import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getClients } from "../../api/clients";
import {
  checkAvailability,
  createBooking,
  getPackagePrice,
} from "../../api/bookings";
import { getPackages } from "../../api/packages";
import type { PaymentMethod } from "../../types/booking";

interface ReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  initialDate?: string;
}

interface FormState {
  client_id: string;
  package_id: string;
  event_date: string;
  start_time: string;
  event_type: string;
  guest_count: string;
  discount: string;
  initial_payment_amount: string;
  initial_payment_method: PaymentMethod | "";
  payment_reference: string;
  notes: string;
}

const createInitialForm = (initialDate?: string): FormState => ({
  client_id: "",
  package_id: "",
  event_date: initialDate ?? dayjs().format("YYYY-MM-DD"),
  start_time: "16:00",
  event_type: "",
  guest_count: "",
  discount: "0",
  initial_payment_amount: "0",
  initial_payment_method: "",
  payment_reference: "",
  notes: "",
});

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}


const WEEKDAY_LABELS = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

export default function ReservationDialog({
  open,
  onClose,
  onCreated,
  initialDate,
}: ReservationDialogProps) {
  const [form, setForm] = useState<FormState>(createInitialForm(initialDate));

  const [availabilityMessage, setAvailabilityMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setForm(createInitialForm(initialDate));
      setAvailabilityMessage(null);
    }
  }, [open, initialDate]);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "booking-selector"],
    queryFn: () => getClients(),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === form.package_id),
    [packages, form.package_id],
  );

  const {
    data: packagePrice,
    isLoading: packagePriceLoading,
    isError: packagePriceError,
  } = useQuery({
    queryKey: [
      "package-price",
      form.package_id,
      form.event_date,
    ],
    queryFn: () =>
      getPackagePrice(
        form.package_id,
        form.event_date,
      ),
    enabled: Boolean(
      open &&
        form.package_id &&
        form.event_date,
    ),
  });

  const agreedPrice = Number(
    packagePrice?.effective_price ??
      selectedPackage?.base_price ??
      0,
  );

  const discount = Number(form.discount || 0);

  const finalPrice = Math.max(
    agreedPrice - discount,
    0,
  );

  const packagePriceDescription = useMemo(() => {
    if (!packagePrice) {
      return null;
    }

    if (packagePrice.source === "promotion") {
      return packagePrice.promotion_name
        ? `Promoción: ${packagePrice.promotion_name}`
        : "Promoción vigente";
    }

    if (packagePrice.source === "day") {
      return `Precio correspondiente al ${
        WEEKDAY_LABELS[packagePrice.day_of_week] ?? "día seleccionado"
      }`;
    }

    return "Precio base";
  }, [packagePrice]);

  const mutation = useMutation({
    mutationFn: createBooking,

    onSuccess: () => {
      onCreated();
      onClose();
    },
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (
      field === "package_id" ||
      field === "event_date" ||
      field === "start_time"
    ) {
      setAvailabilityMessage(null);
    }
  };

  const handleAvailability = async () => {
    if (!form.package_id || !form.event_date || !form.start_time) {
      return;
    }

    try {
      const result = await checkAvailability(
        form.package_id,
        form.event_date,
        form.start_time,
      );

      if (result.available) {
        setAvailabilityMessage({
          type: "success",
          text: "El horario está disponible.",
        });
      } else {
        const conflict = result.conflicting_booking;

        setAvailabilityMessage({
          type: "error",
          text: conflict
            ? `Horario ocupado por ${conflict.folio}.`
            : "El horario no está disponible.",
        });
      }
    } catch {
      setAvailabilityMessage({
        type: "error",
        text: "No fue posible validar la disponibilidad.",
      });
    }
  };

  const handleSubmit = () => {
    if (
      !form.client_id ||
      !form.package_id ||
      !form.event_date ||
      !form.start_time ||
      !form.event_type.trim()
    ) {
      return;
    }

    mutation.mutate({
      client_id: form.client_id,
      package_id: form.package_id,
      event_date: form.event_date,
      start_time: form.start_time,
      event_type: form.event_type.trim(),
      guest_count: form.guest_count ? Number(form.guest_count) : null,
      discount: Number(form.discount || 0),
      initial_payment_amount: Number(form.initial_payment_amount || 0),
      initial_payment_method: form.initial_payment_method || null,
      payment_reference: form.payment_reference.trim() || null,
      notes: form.notes.trim() || null,
    });
  };

  const apiError = mutation.error as {
    response?: {
      data?: {
        detail?:
          | string
          | {
              message?: string;
              folio?: string;
            };
      };
    };
  } | null;

  const getErrorMessage = () => {
    const detail = apiError?.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (detail && typeof detail === "object" && detail.message) {
      return detail.folio
        ? `${detail.message} ${detail.folio}`
        : detail.message;
    }

    return "No fue posible guardar " + "la reservación.";
  };

  return (
    <Dialog
      open={open}
      onClose={mutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Nueva reservación
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 1 }}>
          {mutation.isError && (
            <Alert severity="error">{getErrorMessage()}</Alert>
          )}

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Cliente y evento
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              select
              label="Cliente"
              value={form.client_id}
              onChange={(event) =>
                handleChange("client_id", event.target.value)
              }
              required
              fullWidth
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.full_name} — {client.phone}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Tipo de evento"
              placeholder="Ej. XV años, cumpleaños, boda..."
              value={form.event_type}
              onChange={(event) =>
                handleChange("event_type", event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="Cantidad de personas"
              type="number"
              value={form.guest_count}
              onChange={(event) =>
                handleChange("guest_count", event.target.value)
              }
              fullWidth
            />
          </Box>
          <Divider />
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Fecha y paquete
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },

              gap: 2,
            }}
          >
            <TextField
              label="Fecha"
              type="date"
              value={form.event_date}
              onChange={(event) =>
                handleChange("event_date", event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />

            <TextField
              label="Hora de inicio"
              type="time"
              value={form.start_time}
              onChange={(event) =>
                handleChange("start_time", event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />

            <TextField
              select
              label="Paquete"
              value={form.package_id}
              onChange={(event) =>
                handleChange("package_id", event.target.value)
              }
              required
              fullWidth
              sx={{
                gridColumn: {
                  md: "1 / -1",
                },
              }}
            >
              {packages.map((rentalPackage) => (
                <MenuItem key={rentalPackage.id} value={rentalPackage.id}>
                  {rentalPackage.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {selectedPackage && (
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: "#F7F9FB",
                border: "1px solid #EAECF0",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                sx={{ justifyContent: "space-between" }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    {selectedPackage.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 11.5,
                      color: "text.secondary",
                    }}
                  >
                    Duración: {selectedPackage.duration_hours} horas
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                  <Typography
                    sx={{
                      fontSize: 23,
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    {packagePriceLoading
                      ? "Calculando..."
                      : formatCurrency(agreedPrice)}
                  </Typography>

                  {!packagePriceLoading && packagePriceDescription && (
                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: 10.5,
                        color:
                          packagePrice?.source === "promotion"
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {packagePriceDescription}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          {selectedPackage && packagePriceError && (
            <Alert severity="error">
              No fue posible consultar el precio para la fecha seleccionada.
            </Alert>
          )}

          <Button
            variant="outlined"
            onClick={handleAvailability}
            disabled={!form.package_id || !form.event_date || !form.start_time}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Validar disponibilidad
          </Button>

          {availabilityMessage && (
            <Alert severity={availabilityMessage.type}>
              {availabilityMessage.text}
            </Alert>
          )}

          <Divider />

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            Pago
          </Typography>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },

              gap: 2,
            }}
          >
            <TextField
              label="Descuento"
              type="number"
              value={form.discount}
              onChange={(event) => handleChange("discount", event.target.value)}
            />

            <TextField
              label="Anticipo"
              type="number"
              value={form.initial_payment_amount}
              onChange={(event) =>
                handleChange("initial_payment_amount", event.target.value)
              }
            />

            <TextField
              select
              label="Forma de pago"
              value={form.initial_payment_method}
              onChange={(event) =>
                handleChange("initial_payment_method", event.target.value)
              }
              disabled={Number(form.initial_payment_amount || 0) <= 0}
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </TextField>

            <TextField
              label="Referencia de pago"
              value={form.payment_reference}
              onChange={(event) =>
                handleChange("payment_reference", event.target.value)
              }
              disabled={Number(form.initial_payment_amount || 0) <= 0}
            />
          </Box>

          {selectedPackage && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Box
                sx={{
                  minWidth: 240,
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: "#F7F9FB",
                }}
              >
                <Stack spacing={0.8}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                      Paquete
                    </Typography>

                    <Typography sx={{ fontSize: 12 }}>
                      {packagePriceLoading
                        ? "Calculando..."
                        : formatCurrency(agreedPrice)}
                    </Typography>
                  </Stack>

                  {packagePriceDescription && !packagePriceLoading && (
                    <Typography
                      sx={{
                        mt: -0.2,
                        mb: 0.3,
                        fontSize: 10.5,
                        textAlign: "right",
                        color:
                          packagePrice?.source === "promotion"
                            ? "success.main"
                            : "text.secondary",
                      }}
                    >
                      {packagePriceDescription}
                    </Typography>
                  )}

                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                      Descuento
                    </Typography>

                    <Typography sx={{ fontSize: 12 }}>
                      -{formatCurrency(discount)}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700 }}>Total</Typography>

                    <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
                      {formatCurrency(finalPrice)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          )}

          <TextField
            label="Observaciones"
            multiline
            minRows={3}
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button color="inherit" onClick={onClose} disabled={mutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            mutation.isPending ||
            packagePriceLoading ||
            packagePriceError ||
            !form.client_id ||
            !form.package_id ||
            !form.event_date ||
            !form.start_time ||
            !form.event_type.trim()
          }
        >
          {mutation.isPending ? "Guardando..." : "Crear reservación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

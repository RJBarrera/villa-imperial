import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { getClients } from "../../api/clients";
import { checkAvailability, updateBooking } from "../../api/bookings";
import { getPackages } from "../../api/packages";
import type { Booking, UpdateBookingPayload } from "../../types/booking";

interface EditBookingDialogProps {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onUpdated: (booking: Booking) => void;
}

interface FormState {
  client_id: string;
  package_id: string;
  event_date: string;
  start_time: string;
  event_type: string;
  guest_count: string;
  discount: string;
  notes: string;
}

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function EditBookingDialog({
  open,
  booking,
  onClose,
  onUpdated,
}: EditBookingDialogProps) {
  const [form, setForm] = useState<FormState>({
    client_id: "",
    package_id: "",
    event_date: "",
    start_time: "",
    event_type: "",
    guest_count: "",
    discount: "0",
    notes: "",
  });

  const [availability, setAvailability] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      client_id: booking.client.id,
      package_id: booking.rental_package.id,
      event_date: dayjs(booking.starts_at).format("YYYY-MM-DD"),
      start_time: dayjs(booking.starts_at).format("HH:mm"),
      event_type: booking.event_type,
      guest_count: booking.guest_count?.toString() ?? "",
      discount: booking.discount,
      notes: booking.notes ?? "",
    });

    setAvailability(null);
  }, [open, booking]);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", "booking-edit"],
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

  const packagePrice = selectedPackage
    ? Number(selectedPackage.base_price)
    : Number(booking.agreed_price);

  const discount = Number(form.discount || 0);
  const newTotal = Math.max(packagePrice - discount, 0);

  const mutation = useMutation({
    mutationFn: (payload: UpdateBookingPayload) =>
      updateBooking(booking.id, payload),

    onSuccess: (result) => {
      onUpdated(result);

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
      setAvailability(null);
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
        setAvailability({
          severity: "success",
          text: "El horario está disponible.",
        });

        return;
      }

      if (result.conflicting_booking?.id === booking.id) {
        setAvailability({
          severity: "success",
          text: "El horario corresponde a esta misma reservación.",
        });

        return;
      }

      setAvailability({
        severity: "error",
        text: result.conflicting_booking
          ? `Existe conflicto con ${result.conflicting_booking.folio}.`
          : "El horario no está disponible.",
      });
    } catch {
      setAvailability({
        severity: "error",
        text: "No fue posible validar la disponibilidad.",
      });
    }
  };

  const errorDetail = (mutation.error as any)?.response?.data?.detail;
  const errorMessage =
    typeof errorDetail === "string"
      ? errorDetail
      : (errorDetail?.message ?? "No fue posible actualizar la reservación.");

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
      notes: form.notes.trim() || null,
    });
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
        Editar reservación
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 1 }}>
          {mutation.isError && <Alert severity="error">{errorMessage}</Alert>}

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: "text.secondary",
            }}
          >
            Información del evento
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
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.full_name}
                  {" — "}
                  {client.phone}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Tipo de evento"
              value={form.event_type}
              onChange={(event) =>
                handleChange("event_type", event.target.value)
              }
              required
            />

            <TextField
              label="Cantidad de personas"
              type="number"
              value={form.guest_count}
              onChange={(event) =>
                handleChange("guest_count", event.target.value)
              }
            />
          </Box>

          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: "text.secondary",
            }}
          >
            Fecha y paquete
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
              label="Hora"
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
              sx={{
                gridColumn: {
                  md: "1 / -1",
                },
              }}
            >
              {packages.map((rentalPackage) => (
                <MenuItem key={rentalPackage.id} value={rentalPackage.id}>
                  {rentalPackage.name}
                  {" — "}
                  {currency(rentalPackage.base_price)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Button
            variant="outlined"
            onClick={handleAvailability}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            Validar disponibilidad
          </Button>

          {availability && (
            <Alert severity={availability.severity}>{availability.text}</Alert>
          )}

          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.8,
              color: "text.secondary",
            }}
          >
            Precio
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
              label="Nuevo total"
              value={currency(newTotal)}
              disabled
            />
          </Box>

          <Alert severity="info">
            Ya se han pagado <strong>{currency(booking.total_paid)}</strong>. El
            nuevo total no puede quedar por debajo de ese importe.
          </Alert>

          <TextField
            label="Observaciones"
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            multiline
            minRows={3}
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
            !form.client_id ||
            !form.package_id ||
            !form.event_date ||
            !form.start_time ||
            !form.event_type.trim() ||
            newTotal < Number(booking.total_paid)
          }
        >
          {mutation.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
